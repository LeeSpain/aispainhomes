import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to search and scrape properties
async function searchLiveProperties(
  location: string,
  budgetMin: number,
  budgetMax: number,
  propertyTypes: string[],
  supabase: any
): Promise<any[]> {
  console.log(`🔍 Clara searching for properties in ${location}...`);
  
  // Get top property websites from official_resources
  const { data: propertyWebsites } = await supabase
    .from('official_resources')
    .select('*')
    .eq('category', 'property_websites')
    .eq('is_active', true)
    .limit(5);

  if (!propertyWebsites || propertyWebsites.length === 0) {
    console.log('No property websites configured, using fallback');
    return [];
  }

  const allProperties: any[] = [];
  const propertyTypeStr = propertyTypes.join(' OR ');
  
  // Search each property website
  for (const website of propertyWebsites) {
    try {
      console.log(`Searching ${website.authority}...`);
      
      // Construct search query targeting specific website
      const searchQuery = `${propertyTypeStr} for sale in ${location} ${budgetMin}-${budgetMax} EUR site:${new URL(website.url).hostname}`;
      
      // Call web-search function
      const searchResponse = await supabase.functions.invoke('web-search', {
        body: { query: searchQuery, numResults: 5 }
      });

      if (searchResponse.error) {
        console.error(`Search error for ${website.authority}:`, searchResponse.error);
        continue;
      }

      const searchResults = searchResponse.data?.results || [];
      console.log(`Found ${searchResults.length} results from ${website.authority}`);

      // Extract property URLs from search results
      for (const result of searchResults) {
        const propertyUrl = result.url;
        
        // Try to scrape the property page
        try {
          // Find website ID in tracked_websites (should exist after migration)
          let websiteId = null;
          
          const { data: trackedWebsite } = await supabase
            .from('tracked_websites')
            .select('id')
            .eq('url', website.url)
            .maybeSingle();

          if (trackedWebsite?.id) {
            websiteId = trackedWebsite.id;
          } else {
            // Fallback to official_resources if not in tracked_websites
            const { data: officialResource } = await supabase
              .from('official_resources')
              .select('id')
              .eq('url', website.url)
              .eq('category', 'property_websites')
              .maybeSingle();
            
            websiteId = officialResource?.id;
          }

          if (!websiteId) {
            console.log(`Website not found in any table: ${website.url}`);
            continue;
          }

          // Scrape the property page
          const scrapeResponse = await supabase.functions.invoke('scrape-website', {
            body: { 
              websiteId: websiteId,
              url: propertyUrl
            }
          });

          if (!scrapeResponse.error && scrapeResponse.data?.sample_items) {
            const properties = scrapeResponse.data.sample_items || [];
            properties.forEach((prop: any) => {
              allProperties.push({
                ...prop,
                source_website: website.authority,
                search_query: searchQuery,
              });
            });
          }
        } catch (scrapeError) {
          console.error(`Failed to scrape ${propertyUrl}:`, scrapeError);
        }
      }
    } catch (error) {
      console.error(`Error processing ${website.authority}:`, error);
    }
  }

  console.log(`✅ Clara found ${allProperties.length} total properties from live search`);
  return allProperties;
}

// Helper to search for local services
async function searchLocalServices(
  location: string,
  servicesNeeded: any,
  hasChildren: boolean,
  supabase: any
): Promise<any[]> {
  console.log(`🔍 Clara searching for local services in ${location}...`);
  
  const serviceCategories = [];
  
  // Determine which services to search for based on questionnaire
  if (servicesNeeded.legal) serviceCategories.push('immigration lawyers');
  if (servicesNeeded.utilities) serviceCategories.push('utility setup services');
  if (servicesNeeded.moving) serviceCategories.push('international moving companies');
  if (hasChildren) serviceCategories.push('English-speaking schools');
  
  // If no specific services, default to critical ones
  if (serviceCategories.length === 0) {
    serviceCategories.push('immigration lawyers', 'utility setup services');
  }

  const allServices: any[] = [];

  for (const category of serviceCategories) {
    try {
      const searchQuery = `${category} in ${location} Spain`;
      console.log(`Searching for: ${searchQuery}`);

      const searchResponse = await supabase.functions.invoke('web-search', {
        body: { query: searchQuery, numResults: 3 }
      });

      if (searchResponse.error) {
        console.error(`Service search error for ${category}:`, searchResponse.error);
        continue;
      }

      const results = searchResponse.data?.results || [];
      
      for (const result of results) {
        // Extract business info from search result
        const businessInfo = {
          service_category: category.includes('lawyer') ? 'legal' : 
                           category.includes('utility') ? 'utilities' :
                           category.includes('moving') ? 'movers' :
                           category.includes('school') ? 'schools' : 'other',
          business_name: result.title.split('|')[0].split('-')[0].trim(),
          description: result.snippet || `${category} service in ${location}`,
          location: location,
          contact_info: {
            website: result.url,
            address: location
          },
          why_recommended: `Found through live search for ${category}`,
          source_url: result.url,
          search_query: searchQuery,
        };
        
        allServices.push(businessInfo);
      }
    } catch (error) {
      console.error(`Error searching for ${category}:`, error);
    }
  }

  console.log(`✅ Clara found ${allServices.length} local services`);
  return allServices.slice(0, 6); // Limit to 6 services
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check rate limits - Clara recommendations are expensive
    const { data: rateLimitResult } = await supabase.rpc('check_rate_limit', {
      _user_id: user.id,
      _endpoint: 'clara-curate-recommendations',
      _max_requests_per_minute: 5,
      _max_requests_per_hour: 20,
      _max_requests_per_day: 50
    });

    if (rateLimitResult && !rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: `Rate limit exceeded. Clara can only curate recommendations ${rateLimitResult.limit} times per ${rateLimitResult.limit_type}. Please try again later.`,
        limit_type: rateLimitResult.limit_type,
        limit: rateLimitResult.limit,
        current: rateLimitResult.current
      }), {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(rateLimitResult.limit),
          'X-RateLimit-Remaining': '0',
          'Retry-After': String(rateLimitResult.retry_after)
        }
      });
    }

    // Use authenticated user ID instead of request body
    const userId = user.id;

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch user's questionnaire data
    const { data: questionnaireData, error: qError } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (qError || !questionnaireData) {
      console.error('Error fetching questionnaire:', qError);
      return new Response(JSON.stringify({ error: 'No questionnaire data found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🤖 Clara starting live search for user:', userId);

    // Extract key information from questionnaire
    const location = Array.isArray(questionnaireData.location_preferences) 
      ? questionnaireData.location_preferences[0] 
      : (questionnaireData.location_preferences?.location || 'Spain');
    const budgetRange = questionnaireData.budget_range as any || {};
    const household = questionnaireData.household_details as any || {};
    const servicesNeeded = questionnaireData.services_needed as any || {};
    const propertyTypes = questionnaireData.property_types || ['apartment'];
    const hasChildren = (household.children || 0) > 0;

    const budgetMin = Number(budgetRange.min) || 100000;
    const budgetMax = Number(budgetRange.max) || 500000;

    console.log(`📍 Target: ${location}`);
    console.log(`💰 Budget: €${budgetMin} - €${budgetMax}`);
    console.log(`🏠 Property types: ${propertyTypes.join(', ')}`);

    // PHASE 1: Search for live properties
    const liveProperties = await searchLiveProperties(
      location,
      budgetMin,
      budgetMax,
      propertyTypes,
      supabase
    );

    // PHASE 2: Search for local services
    const liveServices = await searchLocalServices(
      location,
      servicesNeeded,
      hasChildren,
      supabase
    );

    // PHASE 3: Score and rank all properties (live + database)
    console.log('📊 Clara scoring properties...');
    
    // Also get existing database properties as fallback
    const { data: dbProperties } = await supabase
      .from('extracted_items')
      .select('*')
      .eq('item_type', 'property')
      .eq('is_active', true)
      .limit(20);

    // Combine live properties with database properties
    const allCandidateProperties = [...liveProperties];
    if (dbProperties && liveProperties.length < 10) {
      allCandidateProperties.push(...dbProperties);
    }

    // Score properties
    const scoredProperties = allCandidateProperties.map((property: any) => {
      let score = 0;
      const reasons: string[] = [];

      const propertyPrice = Number(property.price) || 0;

      // Budget matching (30 points)
      if (propertyPrice >= budgetMin && propertyPrice <= budgetMax) {
        score += 30;
        reasons.push('Within your budget');
      } else if (propertyPrice < budgetMin) {
        score += (propertyPrice / budgetMin) * 30;
        reasons.push('Below budget');
      } else {
        const overBudget = ((propertyPrice - budgetMax) / budgetMax) * 100;
        if (overBudget < 20) {
          score += 15;
          reasons.push('Slightly over budget but excellent value');
        }
      }

      // Location matching (25 points)
      if (property.location && property.location.toLowerCase().includes(location.toLowerCase())) {
        score += 25;
        reasons.push('In your preferred location');
      }

      // Property type matching (20 points)
      if (property.metadata?.type && propertyTypes.includes(property.metadata.type)) {
        score += 20;
        reasons.push('Matches your property type preference');
      }

      // Household size matching (15 points)
      const totalPeople = (Number(household.adults) || 0) + (Number(household.children) || 0);
      const bedroomsNeeded = Math.ceil(totalPeople / 2);
      const propertyBedrooms = Number(property.metadata?.bedrooms) || 0;
      
      if (propertyBedrooms >= bedroomsNeeded) {
        score += 15;
        reasons.push(`${propertyBedrooms} bedrooms for ${totalPeople} people`);
      }

      // Features matching (10 points)
      if (property.metadata?.features && Array.isArray(property.metadata.features)) {
        score += 10;
        reasons.push('Has desirable features');
      }

      // Bonus for live search results
      if (property.source_website) {
        score += 5;
        reasons.push('Fresh from live search');
      }

      return { property, score, reasons };
    });

    // Get top 10 properties
    const topProperties = scoredProperties
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    console.log(`📝 Saving ${topProperties.length} properties and ${liveServices.length} services`);

    // Save property recommendations with search metadata
    const propertyInserts = topProperties.map(({ property, score, reasons }: any) => ({
      user_id: userId,
      property_id: property.id || null,
      title: property.title || 'Property',
      description: property.description || '',
      location: property.location || location,
      price: Number(property.price) || 0,
      currency: property.currency || 'EUR',
      property_type: property.metadata?.type || propertyTypes[0] || 'apartment',
      bedrooms: Number(property.metadata?.bedrooms) || null,
      bathrooms: Number(property.metadata?.bathrooms) || null,
      area_sqm: Number(property.metadata?.area_sqm) || null,
      features: property.metadata?.features || [],
      images: property.images || [],
      source_url: property.url || '',
      match_score: Math.round(score),
      match_reasons: reasons,
      source_website: property.source_website || null,
      search_query: property.search_query || null,
      search_timestamp: new Date().toISOString(),
      search_method: property.source_website ? 'live_search' : 'database_match',
    }));

    const { error: propertyError } = await supabase
      .from('property_recommendations')
      .insert(propertyInserts);

    if (propertyError) {
      console.error('Error saving properties:', propertyError);
    }

    // Save service recommendations with search metadata
    const serviceInserts = liveServices.map((service: any) => ({
      user_id: userId,
      service_category: service.service_category,
      business_name: service.business_name,
      description: service.description,
      contact_info: service.contact_info || {},
      location: service.location,
      rating: service.rating || null,
      why_recommended: service.why_recommended,
      source_url: service.source_url || null,
      search_query: service.search_query || null,
      search_timestamp: new Date().toISOString(),
      search_method: 'live_search',
    }));

    const { error: serviceError } = await supabase
      .from('service_recommendations')
      .insert(serviceInserts);

    if (serviceError) {
      console.error('Error saving services:', serviceError);
    }

    console.log(`✅ Clara completed! Saved ${propertyInserts.length} properties and ${serviceInserts.length} services`);

    return new Response(
      JSON.stringify({
        success: true,
        servicesCount: serviceInserts.length,
        propertiesCount: propertyInserts.length,
        liveSearchUsed: true,
        searchTimestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error in clara-curate-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});