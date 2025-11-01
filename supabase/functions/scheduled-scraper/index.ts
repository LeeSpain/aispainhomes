import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrackedWebsite {
  id: string;
  name: string;
  url: string;
  check_frequency: string;
  last_checked_at: string | null;
  is_active: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting scheduled scraper...');

    // Get current timestamp
    const now = new Date();

    // Query websites that are active and due for checking
    // Convert check_frequency to interval: 'hourly' = 1 hour, 'daily' = 24 hours, 'weekly' = 168 hours
    const { data: websites, error: queryError } = await supabase
      .from('tracked_websites')
      .select('*')
      .eq('is_active', true);

    if (queryError) {
      console.error('Error querying tracked websites:', queryError);
      throw queryError;
    }

    if (!websites || websites.length === 0) {
      console.log('No active websites to scrape');
      return new Response(
        JSON.stringify({ 
          message: 'No active websites to scrape',
          websites_checked: 0,
          scrapes_triggered: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter websites that are due for checking based on check_frequency
    const websitesDue = websites.filter((website: TrackedWebsite) => {
      if (!website.last_checked_at) return true; // Never checked, scrape it

      const lastChecked = new Date(website.last_checked_at);
      const hoursSinceCheck = (now.getTime() - lastChecked.getTime()) / (1000 * 60 * 60);

      // Determine if website is due based on frequency
      switch (website.check_frequency) {
        case 'hourly':
          return hoursSinceCheck >= 1;
        case 'daily':
          return hoursSinceCheck >= 24;
        case 'weekly':
          return hoursSinceCheck >= 168;
        default:
          return hoursSinceCheck >= 24; // Default to daily
      }
    });

    console.log(`Found ${websitesDue.length} websites due for scraping out of ${websites.length} active websites`);

    // Trigger scrape for each due website
    const scrapeResults = [];
    
    for (const website of websitesDue) {
      try {
        console.log(`Triggering scrape for: ${website.name} (${website.url})`);
        
        // Call scrape-website function with service role
        const { data: scrapeData, error: scrapeError } = await supabase.functions.invoke(
          'scrape-website',
          {
            body: { websiteId: website.id },
          }
        );

        if (scrapeError) {
          console.error(`Error scraping ${website.name}:`, scrapeError);
          scrapeResults.push({
            website_id: website.id,
            website_name: website.name,
            status: 'error',
            error: scrapeError.message,
          });
        } else {
          console.log(`Successfully scraped ${website.name}`);
          scrapeResults.push({
            website_id: website.id,
            website_name: website.name,
            status: 'success',
            items_found: scrapeData?.items_found || 0,
            new_items: scrapeData?.new_items || 0,
          });
        }
      } catch (err) {
        console.error(`Exception scraping ${website.name}:`, err);
        scrapeResults.push({
          website_id: website.id,
          website_name: website.name,
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }

      // Small delay between scrapes to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const successCount = scrapeResults.filter(r => r.status === 'success').length;
    const errorCount = scrapeResults.filter(r => r.status === 'error').length;

    console.log(`Scheduled scraper completed: ${successCount} successful, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        message: 'Scheduled scraper completed',
        websites_checked: websites.length,
        websites_due: websitesDue.length,
        scrapes_triggered: scrapeResults.length,
        successful_scrapes: successCount,
        failed_scrapes: errorCount,
        results: scrapeResults,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in scheduled-scraper:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
