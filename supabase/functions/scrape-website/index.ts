import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapeRequest {
  websiteId: string;
  url?: string;
}

interface ExtractedItem {
  title: string;
  description?: string;
  url?: string;
  price?: number;
  location?: string;
  images?: string[];
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { websiteId, url: overrideUrl }: ScrapeRequest = await req.json();
    const startTime = Date.now();

    // Get website details
    const { data: website, error: websiteError } = await supabaseClient
      .from('tracked_websites')
      .select('*')
      .eq('id', websiteId)
      .eq('user_id', user.id)
      .single();

    if (websiteError || !website) {
      return new Response(JSON.stringify({ error: 'Website not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const targetUrl = overrideUrl || website.url;
    console.log(`Scraping ${targetUrl} for user ${user.id}`);

    // Fetch the website
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SpanishPropertyBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const document = new DOMParser().parseFromString(html, 'text/html');

    if (!document) {
      throw new Error('Failed to parse HTML');
    }

    // Extract items based on category
    const items = extractItemsByCategory(document, website.category, targetUrl);
    const duration = Date.now() - startTime;

    // Get previous scrape to detect changes
    const { data: previousScrape } = await supabaseClient
      .from('website_scrape_results')
      .select('items_found')
      .eq('tracked_website_id', websiteId)
      .order('scrape_timestamp', { ascending: false })
      .limit(1)
      .single();

    const previousCount = previousScrape?.items_found || 0;
    const newItemsCount = Math.max(0, items.length - previousCount);

    // Store scrape result
    const { error: scrapeError } = await supabaseClient
      .from('website_scrape_results')
      .insert({
        tracked_website_id: websiteId,
        status: 'success',
        items_found: items.length,
        new_items: newItemsCount,
        scrape_duration_ms: duration,
        raw_data: { items: items.slice(0, 10) }, // Store first 10 for preview
      });

    if (scrapeError) {
      console.error('Error storing scrape result:', scrapeError);
    }

    // Update website status
    await supabaseClient
      .from('tracked_websites')
      .update({
        last_checked_at: new Date().toISOString(),
        last_status: 'active',
        last_error: null,
      })
      .eq('id', websiteId);

    // Create notification if new items found
    if (newItemsCount > 0) {
      await supabaseClient.from('website_notifications').insert({
        user_id: user.id,
        tracked_website_id: websiteId,
        notification_type: 'new_items',
        title: `${newItemsCount} new listings found`,
        message: `${website.name} has ${newItemsCount} new ${website.category} listings`,
        severity: 'success',
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        itemsFound: items.length,
        newItems: newItemsCount,
        duration,
        items: items.slice(0, 5), // Return first 5
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Scrape error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function extractItemsByCategory(document: any, category: string, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];

  try {
    switch (category) {
      case 'properties':
        return extractProperties(document, baseUrl);
      case 'legal':
        return extractLegalServices(document, baseUrl);
      case 'utilities':
        return extractUtilities(document, baseUrl);
      case 'movers':
        return extractMovingServices(document, baseUrl);
      case 'schools':
        return extractSchools(document, baseUrl);
      case 'healthcare':
        return extractHealthcare(document, baseUrl);
      default:
        return extractGeneric(document, baseUrl);
    }
  } catch (error) {
    console.error(`Error extracting ${category}:`, error);
    return [];
  }
}

function extractProperties(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  // Common property listing selectors
  const selectors = [
    'article.property', '.property-card', '.listing-card',
    '[data-testid="property-card"]', '.search-result-item',
    '.property-item', '.listing-item'
  ];

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    
    for (const el of elements) {
      try {
        const title = el.querySelector('h2, h3, .property-title, [data-testid="property-title"]')?.textContent?.trim();
        const priceText = el.querySelector('.price, .property-price, [data-testid="property-price"]')?.textContent?.trim();
        const location = el.querySelector('.location, .property-location, address')?.textContent?.trim();
        const description = el.querySelector('.description, p')?.textContent?.trim();
        
        const imageEl = el.querySelector('img');
        const images = imageEl ? [imageEl.getAttribute('src') || ''] : [];

        if (title) {
          items.push({
            title,
            description,
            location,
            price: extractPrice(priceText),
            images: images.filter(Boolean),
            metadata: { category: 'properties' }
          });
        }
      } catch (e) {
        console.error('Error extracting property:', e);
      }
    }
    
    if (items.length > 0) break;
  }

  return items;
}

function extractLegalServices(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  const services = document.querySelectorAll('.service, .lawyer, .legal-service, article');
  
  for (const el of services) {
    const title = el.querySelector('h2, h3, .service-title')?.textContent?.trim();
    const description = el.querySelector('p, .description')?.textContent?.trim();
    
    if (title && title.length > 10) {
      items.push({
        title,
        description,
        metadata: { category: 'legal' }
      });
    }
  }

  return items;
}

function extractUtilities(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  const services = document.querySelectorAll('.plan, .service, .package, article');
  
  for (const el of services) {
    const title = el.querySelector('h2, h3, .plan-name')?.textContent?.trim();
    const priceText = el.querySelector('.price, .plan-price')?.textContent?.trim();
    const description = el.querySelector('p, .description')?.textContent?.trim();
    
    if (title) {
      items.push({
        title,
        description,
        price: extractPrice(priceText),
        metadata: { category: 'utilities' }
      });
    }
  }

  return items;
}

function extractMovingServices(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  const services = document.querySelectorAll('.service, .package, article');
  
  for (const el of services) {
    const title = el.querySelector('h2, h3')?.textContent?.trim();
    const description = el.querySelector('p, .description')?.textContent?.trim();
    const priceText = el.querySelector('.price')?.textContent?.trim();
    
    if (title && title.length > 10) {
      items.push({
        title,
        description,
        price: extractPrice(priceText),
        metadata: { category: 'movers' }
      });
    }
  }

  return items;
}

function extractSchools(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  const schools = document.querySelectorAll('.school, article, .program');
  
  for (const el of schools) {
    const title = el.querySelector('h2, h3, .school-name')?.textContent?.trim();
    const description = el.querySelector('p, .description')?.textContent?.trim();
    const location = el.querySelector('.location, address')?.textContent?.trim();
    
    if (title && title.length > 5) {
      items.push({
        title,
        description,
        location,
        metadata: { category: 'schools' }
      });
    }
  }

  return items;
}

function extractHealthcare(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  const services = document.querySelectorAll('.doctor, .service, article, .provider');
  
  for (const el of services) {
    const title = el.querySelector('h2, h3, .name')?.textContent?.trim();
    const description = el.querySelector('p, .description, .specialization')?.textContent?.trim();
    const location = el.querySelector('.location, address')?.textContent?.trim();
    
    if (title && title.length > 5) {
      items.push({
        title,
        description,
        location,
        metadata: { category: 'healthcare' }
      });
    }
  }

  return items;
}

function extractGeneric(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  
  const articles = document.querySelectorAll('article, .card, .item');
  
  for (const el of articles) {
    const title = el.querySelector('h2, h3, h4')?.textContent?.trim();
    const description = el.querySelector('p')?.textContent?.trim();
    
    if (title && title.length > 10) {
      items.push({
        title,
        description,
        metadata: { category: 'other' }
      });
    }
  }

  return items.slice(0, 20);
}

function extractPrice(priceText?: string): number | undefined {
  if (!priceText) return undefined;
  
  const matches = priceText.match(/[\d,]+\.?\d*/);
  if (matches) {
    const cleaned = matches[0].replace(/,/g, '');
    const price = parseFloat(cleaned);
    return isNaN(price) ? undefined : price;
  }
  
  return undefined;
}
