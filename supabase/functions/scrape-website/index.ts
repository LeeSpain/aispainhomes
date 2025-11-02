import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapeRequest {
  websiteId: string;
  url?: string;
}

interface ExtractedItem {
  external_id: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  location?: string;
  url?: string;
  images?: string[];
  item_type?: string;
  metadata?: Record<string, any>;
}

// Helper to generate content hash
const generateHash = (content: string): string => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  return Array.from(new Uint8Array(data))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header or use service role for cron jobs
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    // Parse request body
    const { websiteId, url }: ScrapeRequest = await req.json();

    if (!websiteId) {
      return new Response(
        JSON.stringify({ error: 'Invalid request parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate URL if provided
    if (url) {
      // Check URL length
      if (url.length > 2000) {
        return new Response(
          JSON.stringify({ error: 'Invalid request parameters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate URL format and scheme
      try {
        const parsedUrl = new URL(url);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          return new Response(
            JSON.stringify({ error: 'Invalid request parameters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Block internal/private IP addresses (SSRF protection)
        const hostname = parsedUrl.hostname.toLowerCase();
        const blockedHosts = [
          'localhost', '127.0.0.1', '0.0.0.0', '::1',
          '169.254.169.254', // AWS metadata
          '10.', '172.16.', '172.17.', '172.18.', '172.19.', 
          '172.20.', '172.21.', '172.22.', '172.23.', '172.24.',
          '172.25.', '172.26.', '172.27.', '172.28.', '172.29.',
          '172.30.', '172.31.', '192.168.'
        ];
        
        if (blockedHosts.some(blocked => hostname === blocked || hostname.startsWith(blocked))) {
          return new Response(
            JSON.stringify({ error: 'Invalid request parameters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (e) {
        return new Response(
          JSON.stringify({ error: 'Invalid request parameters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get website details from database - try tracked_websites first, then official_resources
    let website = null;
    
    const { data: trackedWebsite, error: trackedError } = await supabase
      .from('tracked_websites')
      .select('*')
      .eq('id', websiteId)
      .single();

    if (trackedWebsite) {
      website = trackedWebsite;
    } else {
      // Fallback to official_resources for system property websites
      const { data: officialResource, error: officialError } = await supabase
        .from('official_resources')
        .select('*')
        .eq('id', websiteId)
        .single();
      
      if (officialResource) {
        // Convert official_resource to tracked_website format
        website = {
          id: officialResource.id,
          url: officialResource.url,
          name: officialResource.title,
          category: officialResource.category,
          user_id: null,
          is_active: officialResource.is_active,
          metadata: officialResource.metadata || {},
        };
      }
    }

    if (!website) {
      console.error('Website not found in tracked_websites or official_resources');
      return new Response(
        JSON.stringify({ error: 'Website not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if this is an official resource
    const isOfficialResource = website.category === 'official_resources';
    
    if (isOfficialResource) {
      console.log('Processing official resource:', website.name);
      
      const targetUrl = url || website.url;
      const response = await fetch(targetUrl);
      const html = await response.text();
      
      // Extract text content
      const textContent = html
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      const contentHash = generateHash(textContent);
      
      // Check for previous snapshot
      const { data: lastSnapshot } = await supabase
        .from('resource_content_snapshots')
        .select('*')
        .eq('resource_id', websiteId)
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      const changeDetected = !lastSnapshot || lastSnapshot.content_hash !== contentHash;
      
      if (changeDetected) {
        console.log('Content change detected for official resource');
        
        // Create new snapshot
        await supabase
          .from('resource_content_snapshots')
          .insert({
            resource_id: websiteId,
            content_hash: contentHash,
            content_text: textContent.substring(0, 10000),
            change_detected: !!lastSnapshot,
            change_summary: lastSnapshot ? 'Content updated' : 'Initial snapshot'
          });
        
        // Create notification if change detected
        if (lastSnapshot && website.user_id) {
          await supabase
            .from('website_notifications')
            .insert({
              user_id: website.user_id,
              tracked_website_id: websiteId,
              title: 'Official Resource Updated',
              message: `${website.name} has been updated. Please review the latest information.`,
              severity: 'info',
              notification_type: 'content_change',
              metadata: { url: website.url }
            });
        }
      }
      
      // Update tracked website
      await supabase
        .from('tracked_websites')
        .update({
          last_checked_at: new Date().toISOString(),
          last_status: 'success'
        })
        .eq('id', websiteId);
      
      // Create scrape result
      await supabase
        .from('website_scrape_results')
        .insert({
          tracked_website_id: websiteId,
          status: 'success',
          items_found: changeDetected ? 1 : 0,
          new_items: changeDetected ? 1 : 0,
          scrape_duration_ms: Date.now() - startTime
        });
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          changeDetected,
          message: changeDetected ? 'Content updated' : 'No changes detected'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const targetUrl = url || website.url;
    console.log(`Scraping website: ${website.name} (${targetUrl})`);

    // Retry logic with exponential backoff
    let lastError: Error | null = null;
    let fetchResponse: Response | null = null;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Fetch attempt ${attempt}/${maxRetries} for ${targetUrl}`);
        
        fetchResponse = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (fetchResponse.ok) {
          break; // Success, exit retry loop
        } else if (fetchResponse.status === 403 || fetchResponse.status === 404) {
          // Don't retry on these errors
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`);
        } else if (attempt < maxRetries) {
          // Retry on other errors with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`Retrying in ${delay}ms after status ${fetchResponse.status}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          lastError = new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`);
        } else {
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`);
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown fetch error');
        if (attempt < maxRetries && !err.message.includes('403') && !err.message.includes('404')) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`Network error, retrying in ${delay}ms:`, err.message);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw lastError;
        }
      }
    }

    if (!fetchResponse || !fetchResponse.ok) {
      throw lastError || new Error('Failed to fetch website after retries');
    }

    const html = await fetchResponse.text();

    // Parse HTML
    const document = new DOMParser().parseFromString(html, 'text/html');
    if (!document) {
      throw new Error('Failed to parse HTML');
    }

    // Extract items based on category
    const extractedItems = extractItemsByCategory(document, website.category, targetUrl);
    console.log(`Extracted ${extractedItems.length} items from ${website.name}`);

    // Get previous items to detect changes
    const { data: previousItems, error: prevError } = await supabase
      .from('extracted_items')
      .select('external_id, price, metadata')
      .eq('tracked_website_id', websiteId)
      .eq('is_active', true);

    if (prevError) {
      console.error('Error fetching previous items:', prevError);
    }

    const previousItemsMap = new Map(
      (previousItems || []).map(item => [item.external_id, item])
    );

    // Analyze changes
    let newItemsCount = 0;
    let changedItemsCount = 0;
    let removedItemsCount = 0;
    const currentExternalIds = new Set<string>();

    const itemsToInsert = [];
    const notifications = [];

    for (const item of extractedItems) {
      currentExternalIds.add(item.external_id);
      const previousItem = previousItemsMap.get(item.external_id);

      if (!previousItem) {
        // New item
        newItemsCount++;
        itemsToInsert.push({
          tracked_website_id: websiteId,
          ...item,
          first_seen_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
          is_active: true,
        });

        // Create notification for new item
        if (website.user_id) {
          notifications.push({
            user_id: website.user_id,
            tracked_website_id: websiteId,
            notification_type: 'new_listing',
            title: `New listing: ${item.title}`,
            message: `Found on ${website.name}${item.price ? ` - €${item.price}` : ''}`,
            severity: 'success',
            metadata: {
              item_id: item.external_id,
              url: item.url,
              price: item.price,
            },
          });
        }
      } else {
        // Check for changes (e.g., price change)
        const priceChanged = previousItem.price !== item.price;
        
        if (priceChanged) {
          changedItemsCount++;
          
          // Update item
          await supabase
            .from('extracted_items')
            .update({
              price: item.price,
              last_seen_at: new Date().toISOString(),
              metadata: { ...previousItem.metadata, ...item.metadata },
            })
            .eq('external_id', item.external_id)
            .eq('tracked_website_id', websiteId);

          // Create notification for price change
          if (website.user_id) {
            notifications.push({
              user_id: website.user_id,
              tracked_website_id: websiteId,
              notification_type: 'price_change',
              title: `Price changed: ${item.title}`,
              message: `${previousItem.price ? `€${previousItem.price}` : 'N/A'} → €${item.price} on ${website.name}`,
              severity: 'info',
              metadata: {
                item_id: item.external_id,
                old_price: previousItem.price,
                new_price: item.price,
                url: item.url,
              },
            });
          }
        } else {
          // Just update last_seen_at
          await supabase
            .from('extracted_items')
            .update({ last_seen_at: new Date().toISOString() })
            .eq('external_id', item.external_id)
            .eq('tracked_website_id', websiteId);
        }
      }
    }

    // Mark items as removed if they're no longer found
    if (previousItems) {
      for (const prevItem of previousItems) {
        if (!currentExternalIds.has(prevItem.external_id)) {
          removedItemsCount++;
          await supabase
            .from('extracted_items')
            .update({
              is_active: false,
              status_changed_at: new Date().toISOString(),
            })
            .eq('external_id', prevItem.external_id)
            .eq('tracked_website_id', websiteId);
        }
      }
    }

    // Insert new items
    if (itemsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('extracted_items')
        .insert(itemsToInsert);

      if (insertError) {
        console.error('Error inserting items:', insertError);
      }
    }

    // Insert notifications
    if (notifications.length > 0) {
      const { error: notifError } = await supabase
        .from('website_notifications')
        .insert(notifications);

      if (notifError) {
        console.error('Error inserting notifications:', notifError);
      }
    }

    const duration = Date.now() - startTime;

    // Insert scrape result
    const { error: resultError } = await supabase
      .from('website_scrape_results')
      .insert({
        tracked_website_id: websiteId,
        status: 'success',
        items_found: extractedItems.length,
        new_items: newItemsCount,
        changed_items: changedItemsCount,
        removed_items: removedItemsCount,
        scrape_duration_ms: duration,
        raw_data: { sample: extractedItems.slice(0, 5) },
      });

    if (resultError) {
      console.error('Error saving scrape result:', resultError);
    }

    // Update website last_checked_at
    await supabase
      .from('tracked_websites')
      .update({
        last_checked_at: new Date().toISOString(),
        last_status: 'success',
        last_error: null,
      })
      .eq('id', websiteId);

    return new Response(
      JSON.stringify({
        success: true,
        website_name: website.name,
        items_found: extractedItems.length,
        new_items: newItemsCount,
        changed_items: changedItemsCount,
        removed_items: removedItemsCount,
        duration_ms: duration,
        sample_items: extractedItems.slice(0, 3),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in scrape-website:', error);
    const duration = Date.now() - startTime;
    
    // Categorize error for internal logging only
    let errorCategory = 'unknown';
    let errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (errorMessage.includes('403')) {
      errorCategory = 'blocked';
    } else if (errorMessage.includes('timeout') || errorMessage.includes('ECONNREFUSED')) {
      errorCategory = 'timeout';
    } else if (errorMessage.includes('parse') || errorMessage.includes('selector')) {
      errorCategory = 'extraction';
    } else if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      errorCategory = 'network';
    }

    // Log detailed error server-side
    console.error('Categorized error:', {
      category: errorCategory,
      message: errorMessage,
      duration,
    });

    // Save error state to database
    try {
      const { websiteId } = await req.json();
      if (websiteId) {
        await supabase
          .from('scrape_history')
          .insert({
            tracked_website_id: websiteId,
            user_id: userId,
            status: 'error',
            items_found: 0,
            new_items: 0,
            changed_items: 0,
            removed_items: 0,
            scrape_duration_ms: duration,
            error_message: `[${errorCategory}] ${errorMessage}`,
          });
      }
    } catch (dbError) {
      console.error('Error saving error state:', dbError);
    }

    return new Response(
      JSON.stringify({
        error: 'An error occurred processing your request',
        error_category: errorCategory,
        duration_ms: duration,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function extractItemsByCategory(
  document: any,
  category: string,
  baseUrl: string
): ExtractedItem[] {
  switch (category) {
    case 'properties':
      return extractProperties(document, baseUrl);
    case 'legal_services':
      return extractLegalServices(document, baseUrl);
    case 'utilities':
      return extractUtilities(document, baseUrl);
    case 'moving_services':
      return extractMovingServices(document, baseUrl);
    case 'schools':
      return extractSchools(document, baseUrl);
    case 'healthcare':
      return extractHealthcare(document, baseUrl);
    default:
      return extractGeneric(document, baseUrl);
  }
}

function extractProperties(document: any, baseUrl: string): ExtractedItem[] {
  // Check if it's a known Spanish property site
  if (baseUrl.includes('idealista.com')) {
    return extractIdealista(document, baseUrl);
  } else if (baseUrl.includes('fotocasa.es')) {
    return extractFotocasa(document, baseUrl);
  } else if (baseUrl.includes('kyero.com')) {
    return extractKyero(document, baseUrl);
  }

  // Fallback to generic property extraction
  const items: ExtractedItem[] = [];
  
  // Common property listing selectors
  const selectors = [
    'article.property',
    '.property-card',
    '.listing-item',
    'div[data-property-id]',
    '.property-item',
  ];

  let propertyElements: any[] = [];
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      propertyElements = Array.from(elements);
      break;
    }
  }

  propertyElements.forEach((element: any, index: number) => {
    const titleEl = element.querySelector('h2, h3, .property-title, .listing-title');
    const priceEl = element.querySelector('.price, .property-price, [data-price]');
    const locationEl = element.querySelector('.location, .property-location, address');
    const linkEl = element.querySelector('a[href]');
    const imageEls = element.querySelectorAll('img');

    const title = titleEl?.textContent?.trim() || `Property ${index + 1}`;
    const priceText = priceEl?.textContent?.trim();
    const location = locationEl?.textContent?.trim();
    const url = linkEl?.getAttribute('href');
    const images = Array.from(imageEls).map((img: any) => img.getAttribute('src')).filter(Boolean);

    // Generate external_id from URL or title
    const externalId = url 
      ? url.split('/').pop() || `property-${index}`
      : `${baseUrl.split('/')[2]}-${title.replace(/\s+/g, '-').toLowerCase()}-${index}`;

    items.push({
      external_id: externalId,
      title,
      price: extractPrice(priceText),
      currency: 'EUR',
      location,
      url: url ? new URL(url, baseUrl).href : undefined,
      images,
      item_type: 'property',
      metadata: {
        raw_price_text: priceText,
      },
    });
  });

  return items;
}

function extractLegalServices(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  const serviceElements = document.querySelectorAll('.service-item, .lawyer-profile, article');
  
  serviceElements.forEach((element: any, index: number) => {
    const titleEl = element.querySelector('h2, h3, .service-name');
    const descEl = element.querySelector('p, .description');
    const contactEl = element.querySelector('.contact, .email, .phone');

    items.push({
      external_id: `legal-${baseUrl.split('/')[2]}-${index}`,
      title: titleEl?.textContent?.trim() || `Legal Service ${index + 1}`,
      description: descEl?.textContent?.trim(),
      item_type: 'legal_service',
      metadata: {
        contact: contactEl?.textContent?.trim(),
      },
    });
  });

  return items;
}

function extractUtilities(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  const utilityElements = document.querySelectorAll('.utility-provider, .service-card, article');
  
  utilityElements.forEach((element: any, index: number) => {
    const titleEl = element.querySelector('h2, h3');
    const priceEl = element.querySelector('.price, .rate');

    items.push({
      external_id: `utility-${baseUrl.split('/')[2]}-${index}`,
      title: titleEl?.textContent?.trim() || `Utility ${index + 1}`,
      price: extractPrice(priceEl?.textContent?.trim()),
      currency: 'EUR',
      item_type: 'utility',
    });
  });

  return items;
}

function extractMovingServices(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  const serviceElements = document.querySelectorAll('.moving-company, .service-listing, article');
  
  serviceElements.forEach((element: any, index: number) => {
    const titleEl = element.querySelector('h2, h3');
    const priceEl = element.querySelector('.price, .quote');
    const locationEl = element.querySelector('.location, address');

    items.push({
      external_id: `moving-${baseUrl.split('/')[2]}-${index}`,
      title: titleEl?.textContent?.trim() || `Moving Service ${index + 1}`,
      price: extractPrice(priceEl?.textContent?.trim()),
      currency: 'EUR',
      location: locationEl?.textContent?.trim(),
      item_type: 'moving_service',
    });
  });

  return items;
}

function extractSchools(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  const schoolElements = document.querySelectorAll('.school-item, .education-listing, article');
  
  schoolElements.forEach((element: any, index: number) => {
    const titleEl = element.querySelector('h2, h3');
    const locationEl = element.querySelector('.location, address');
    const descEl = element.querySelector('.description, p');

    items.push({
      external_id: `school-${baseUrl.split('/')[2]}-${index}`,
      title: titleEl?.textContent?.trim() || `School ${index + 1}`,
      location: locationEl?.textContent?.trim(),
      description: descEl?.textContent?.trim(),
      item_type: 'school',
    });
  });

  return items;
}

function extractHealthcare(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  const healthElements = document.querySelectorAll('.healthcare-provider, .medical-service, article');
  
  healthElements.forEach((element: any, index: number) => {
    const titleEl = element.querySelector('h2, h3');
    const locationEl = element.querySelector('.location, address');
    const contactEl = element.querySelector('.contact, .phone');

    items.push({
      external_id: `health-${baseUrl.split('/')[2]}-${index}`,
      title: titleEl?.textContent?.trim() || `Healthcare ${index + 1}`,
      location: locationEl?.textContent?.trim(),
      item_type: 'healthcare',
      metadata: {
        contact: contactEl?.textContent?.trim(),
      },
    });
  });

  return items;
}

function extractGeneric(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  const elements = document.querySelectorAll('article, .item, .card');
  
  elements.forEach((element: any, index: number) => {
    const titleEl = element.querySelector('h1, h2, h3, h4');
    
    if (titleEl) {
      items.push({
        external_id: `item-${baseUrl.split('/')[2]}-${index}`,
        title: titleEl.textContent?.trim() || `Item ${index + 1}`,
        item_type: 'generic',
      });
    }
  });

  return items;
}

function extractPrice(priceText?: string): number | undefined {
  if (!priceText) return undefined;
  
  // Remove currency symbols and extract numbers
  const cleaned = priceText.replace(/[€$£,]/g, '').trim();
  const match = cleaned.match(/[\d.]+/);
  
  return match ? parseFloat(match[0]) : undefined;
}

// Site-specific extractors for popular Spanish property sites

function extractIdealista(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  const propertyElements = document.querySelectorAll('article.item, .item-info-container');

  propertyElements.forEach((element: any, index: number) => {
    try {
      const titleEl = element.querySelector('.item-link, a.item-link');
      const title = titleEl?.textContent?.trim() || `Property ${index + 1}`;
      const priceEl = element.querySelector('.item-price, .price-row .item-price');
      const priceText = priceEl?.textContent?.trim();
      const locationEl = element.querySelector('.item-detail-char:first-child, .item-detail');
      const location = locationEl?.textContent?.trim();
      const linkEl = element.querySelector('a.item-link');
      const relativeUrl = linkEl?.getAttribute('href');
      const url = relativeUrl ? new URL(relativeUrl, baseUrl).href : undefined;
      const imageEl = element.querySelector('img.item-multimedia, picture img');
      const imageSrc = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src');
      const externalId = relativeUrl?.split('/').filter(Boolean).pop() || `idealista-${index}`;

      items.push({
        external_id: externalId,
        title,
        price: extractPrice(priceText),
        currency: 'EUR',
        location,
        url,
        images: imageSrc ? [imageSrc] : [],
        item_type: 'property',
        metadata: { source: 'idealista', raw_price_text: priceText },
      });
    } catch (error) {
      console.error(`Error extracting Idealista property ${index}:`, error);
    }
  });

  return items;
}

function extractFotocasa(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  const propertyElements = document.querySelectorAll('.re-CardPackAdvance, .re-CardPackMinimal, .re-SearchResult');

  propertyElements.forEach((element: any, index: number) => {
    try {
      const titleEl = element.querySelector('.re-CardTitle, h3 a, .re-Card-title a');
      const title = titleEl?.textContent?.trim() || `Property ${index + 1}`;
      const priceEl = element.querySelector('.re-CardPrice, .re-Card-price');
      const priceText = priceEl?.textContent?.trim();
      const locationEl = element.querySelector('.re-CardFeaturesWithIcons-feature--location, .re-CardLocation');
      const location = locationEl?.textContent?.trim();
      const linkEl = element.querySelector('a.re-Card-link, a[href*="/inmueble/"]');
      const relativeUrl = linkEl?.getAttribute('href');
      const url = relativeUrl ? new URL(relativeUrl, baseUrl).href : undefined;
      const imageEl = element.querySelector('img.re-CardMedia-img, picture img');
      const imageSrc = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src');
      const externalId = relativeUrl?.split('/').filter(Boolean).pop()?.split('?')[0] || `fotocasa-${index}`;

      items.push({
        external_id: externalId,
        title,
        price: extractPrice(priceText),
        currency: 'EUR',
        location,
        url,
        images: imageSrc ? [imageSrc] : [],
        item_type: 'property',
        metadata: { source: 'fotocasa', raw_price_text: priceText },
      });
    } catch (error) {
      console.error(`Error extracting Fotocasa property ${index}:`, error);
    }
  });

  return items;
}

function extractKyero(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  const propertyElements = document.querySelectorAll('.listing-item, .property-card, article.property');

  propertyElements.forEach((element: any, index: number) => {
    try {
      const titleEl = element.querySelector('.listing-title, h2 a, h3 a');
      const title = titleEl?.textContent?.trim() || `Property ${index + 1}`;
      const priceEl = element.querySelector('.listing-price, .price');
      const priceText = priceEl?.textContent?.trim();
      const locationEl = element.querySelector('.listing-location, .location');
      const location = locationEl?.textContent?.trim();
      const linkEl = element.querySelector('a[href*="/property/"]');
      const relativeUrl = linkEl?.getAttribute('href');
      const url = relativeUrl ? new URL(relativeUrl, baseUrl).href : undefined;
      const imageEl = element.querySelector('img');
      const imageSrc = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src');
      const idAttr = element.getAttribute('data-property-id') || element.getAttribute('data-id');
      const externalId = idAttr || relativeUrl?.split('/').filter(Boolean).pop() || `kyero-${index}`;

      items.push({
        external_id: externalId,
        title,
        price: extractPrice(priceText),
        currency: 'EUR',
        location,
        url,
        images: imageSrc ? [imageSrc] : [],
        item_type: 'property',
        metadata: { source: 'kyero', raw_price_text: priceText },
      });
    } catch (error) {
      console.error(`Error extracting Kyero property ${index}:`, error);
    }
  });

  return items;
}

