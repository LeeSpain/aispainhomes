import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AddWebsiteRequest {
  url: string;
  name: string;
  category: string;
  industry?: string;
  location?: string;
  checkFrequency?: 'hourly' | 'daily' | 'weekly';
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

    const { url, name, category, industry, location, checkFrequency }: AddWebsiteRequest = await req.json();

    // Validate URL
    try {
      new URL(url);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if website already tracked by user
    const { data: existing } = await supabaseClient
      .from('tracked_websites')
      .select('id')
      .eq('user_id', user.id)
      .eq('url', url)
      .single();

    if (existing) {
      return new Response(JSON.stringify({ error: 'Website already tracked' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Test if website is accessible
    console.log(`Testing accessibility of ${url}`);
    try {
      const testResponse = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SpanishPropertyBot/1.0)',
        },
      });

      if (!testResponse.ok && testResponse.status !== 405) { // 405 = Method Not Allowed (HEAD not supported)
        console.warn(`Website returned ${testResponse.status}, but will add anyway`);
      }
    } catch (error) {
      console.warn(`Could not test website: ${error.message}, but will add anyway`);
    }

    // Add website to tracking
    const { data: website, error: insertError } = await supabaseClient
      .from('tracked_websites')
      .insert({
        user_id: user.id,
        url,
        name,
        category,
        industry,
        location,
        check_frequency: checkFrequency || 'daily',
        is_active: true,
        last_status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting website:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to add website' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Perform initial scrape
    console.log(`Performing initial scrape for ${website.id}`);
    try {
      const scrapeResponse = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/scrape-website`,
        {
          method: 'POST',
          headers: {
            'Authorization': req.headers.get('Authorization')!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ websiteId: website.id }),
        }
      );

      if (scrapeResponse.ok) {
        const scrapeData = await scrapeResponse.json();
        console.log(`Initial scrape completed: ${scrapeData.itemsFound} items found`);
      }
    } catch (error) {
      console.error('Initial scrape failed:', error);
      // Don't fail the whole operation if initial scrape fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        website,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error adding website:', error);
    
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
