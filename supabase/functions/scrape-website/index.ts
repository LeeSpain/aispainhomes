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
        JSON.stringify({ error: 'websiteId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get website details from database
    const { data: website, error: websiteError } = await supabase
      .from('tracked_websites')
      .select('*')
      .eq('id', websiteId)
      .single();

    if (websiteError || !website) {
      console.error('Error fetching website:', websiteError);
      return new Response(
        JSON.stringify({ error: 'Website not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const targetUrl = url || website.url;
    console.log(`Scraping website: ${website.name} (${targetUrl})`);

    // Fetch the website HTML
    const fetchResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch website: ${fetchResponse.status} ${fetchResponse.statusText}`);
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

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
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
