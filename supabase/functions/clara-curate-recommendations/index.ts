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
  
  // Get top property websites from official_resources, prioritizing supported domains
  const { data: allPropertyWebsites } = await supabase
    .from('official_resources')
    .select('*')
    .eq('category', 'property_websites')
    .eq('is_active', true);
  
  // Prioritize domains we have extractors for
  const supportedDomains = ['idealista.com', 'fotocasa.es', 'kyero.com'];
  const propertyWebsites = (allPropertyWebsites || [])
    .sort((a, b) => {
      const aSupported = supportedDomains.some(d => a.url.includes(d)) ? 0 : 1;
      const bSupported = supportedDomains.some(d => b.url.includes(d)) ? 0 : 1;
      return aSupported - bSupported;
    })
    .slice(0, 5);

  if (!propertyWebsites || propertyWebsites.length === 0) {
    console.log('No property websites configured, trying fallback to extracted_items');
  }

  const allProperties: any[] = [];
  
  // Search each property website
  for (const website of propertyWebsites) {
    try {
      console.log(`🌐 Searching ${website.authority} (${website.url})`);
      
      // Simplified search query (DuckDuckGo works better with simple queries)
      const propertyTypeStr = propertyTypes[0] || 'property'; // Use first type only
      const searchQuery = `${propertyTypeStr} for sale ${location} site:${new URL(website.url).hostname}`;
      
      console.log(`📝 Search query: "${searchQuery}"`);
      
      // Call web-search function
      const searchResponse = await supabase.functions.invoke('web-search', {
        body: { query: searchQuery, numResults: 5 }
      });
      
      console.log(`📊 Search response:`, searchResponse.error ? 'ERROR' : 'SUCCESS');

      if (searchResponse.error) {
        console.error(`Search error for ${website.authority}:`, searchResponse.error);
        continue;
      }

      const searchResults = searchResponse.data?.results || [];
      console.log(`✅ Found ${searchResults.length} search results from ${website.authority}`);

      // Extract property URLs from search results
      for (const result of searchResults) {
        const propertyUrl = result.url;
        console.log(`🔗 Processing property URL: ${propertyUrl}`);
        
        // Try to scrape the property page
        try {
          console.log(`🔧 Calling scrape-website for ${propertyUrl}...`);
          
          // Scrape the property page - let scraper handle websiteId logic
          const scrapeResponse = await supabase.functions.invoke('scrape-website', {
            body: { 
              websiteId: null, // Let scraper determine this
              url: propertyUrl
            }
          });

          if (scrapeResponse.error) {
            console.error(`❌ Scrape error for ${propertyUrl}:`, scrapeResponse.error);
            continue;
          }

          // PHASE 1 FIX: Use the full scraped data from response
          if (scrapeResponse.data?.items && scrapeResponse.data.items.length > 0) {
            const scrapedItems = scrapeResponse.data.items;
            console.log(`✅ Extracted ${scrapedItems.length} properties with FULL DATA from ${propertyUrl}`);
            
            scrapedItems.forEach((scrapedItem: any) => {
              // Validate that we have minimum required data
              const hasMinimumData = scrapedItem.price > 0 || 
                                     scrapedItem.metadata?.bedrooms > 0 ||
                                     scrapedItem.metadata?.rooms > 0;
              
              if (!hasMinimumData) {
                console.warn(`⚠️ Skipping property with incomplete data: ${scrapedItem.title}`);
                return;
              }

              // Push property with complete scraped metadata
              allProperties.push({
                title: scrapedItem.title || 'Property',
                description: scrapedItem.description || '',
                url: scrapedItem.url || propertyUrl,
                price: Number(scrapedItem.price) || 0,
                currency: scrapedItem.currency || 'EUR',
                location: scrapedItem.location || location,
                images: scrapedItem.images || [],
                metadata: {
                  type: scrapedItem.metadata?.type || scrapedItem.item_type || propertyTypes[0],
                  bedrooms: Number(scrapedItem.metadata?.bedrooms || scrapedItem.metadata?.rooms) || 0,
                  bathrooms: Number(scrapedItem.metadata?.bathrooms) || 0,
                  size_m2: Number(scrapedItem.metadata?.size_m2 || scrapedItem.metadata?.area) || 0,
                  features: scrapedItem.metadata?.features || [],
                  ...scrapedItem.metadata
                },
                source_website: website.authority,
                search_query: searchQuery,
              });
            });
          } else {
            console.log(`⚠️ No properties extracted from ${propertyUrl}`);
          }
        } catch (scrapeError) {
          console.error(`❌ Exception scraping ${propertyUrl}:`, scrapeError);
        }
      }
    } catch (error) {
      console.error(`Error processing ${website.authority}:`, error);
    }
  }

  // PHASE 1 FIX: Fallback to extracted_items if live search yielded few results
  if (allProperties.length < 5) {
    console.log(`🔄 Only ${allProperties.length} properties from live search, querying extracted_items as fallback...`);
    
    try {
      const { data: extractedProperties, error: extractError } = await supabase
        .from('extracted_items')
        .select('*')
        .eq('item_type', 'property')
        .eq('is_active', true)
        .ilike('location', `%${location}%`)
        .gte('price', budgetMin * 0.7) // Allow 30% below budget
        .lte('price', budgetMax * 1.2) // Allow 20% above budget
        .order('created_at', { ascending: false })
        .limit(15);

      if (!extractError && extractedProperties && extractedProperties.length > 0) {
        console.log(`✅ Found ${extractedProperties.length} properties from extracted_items`);
        
        extractedProperties.forEach((item: any) => {
          // Only add if has meaningful data
          const hasData = item.price > 0 || item.metadata?.bedrooms > 0;
          if (hasData) {
            allProperties.push({
              title: item.title || 'Property',
              description: item.description || '',
              url: item.url || item.external_id || '',
              price: Number(item.price) || 0,
              currency: item.currency || 'EUR',
              location: item.location || location,
              images: item.images || [],
              metadata: item.metadata || {},
              source_website: 'Database',
              search_query: null,
            });
          }
        });
      }
    } catch (fallbackError) {
      console.error('Error querying extracted_items fallback:', fallbackError);
    }
  }

  console.log(`✅ Clara found ${allProperties.length} total properties (live + fallback)`);
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

    // PHASE 2: Enhanced scoring algorithm
    const scoredProperties = allCandidateProperties.map((property: any) => {
      let score = 0;
      const reasons: string[] = [];

      const propertyPrice = Number(property.price) || 0;
      const propertyBedrooms = Number(property.metadata?.bedrooms || property.metadata?.rooms) || 0;
      const propertyBathrooms = Number(property.metadata?.bathrooms) || 0;
      const propertyArea = Number(property.metadata?.size_m2 || property.metadata?.area) || 0;
      const propertyType = property.metadata?.type || property.property_type || '';
      
      // Skip properties with no meaningful data
      if (propertyPrice === 0 && propertyBedrooms === 0) {
        console.warn(`⚠️ Skipping property with no data: ${property.title}`);
        return { property, score: 0, reasons: ['Incomplete data'] };
      }

      // 1. Budget matching (35 points) - INCREASED
      if (propertyPrice > 0) {
        if (propertyPrice >= budgetMin && propertyPrice <= budgetMax) {
          score += 35;
          reasons.push(`€${propertyPrice.toLocaleString()} is within your €${budgetMin.toLocaleString()}-€${budgetMax.toLocaleString()} budget`);
        } else if (propertyPrice < budgetMin) {
          const percentOfMin = (propertyPrice / budgetMin) * 100;
          if (percentOfMin >= 70) {
            score += 30;
            reasons.push(`€${propertyPrice.toLocaleString()} - Great value below your budget`);
          } else if (percentOfMin >= 50) {
            score += 20;
            reasons.push(`€${propertyPrice.toLocaleString()} - Well below budget`);
          } else {
            score += 10;
            reasons.push(`€${propertyPrice.toLocaleString()} - Significantly below budget`);
          }
        } else {
          const overBudget = ((propertyPrice - budgetMax) / budgetMax) * 100;
          if (overBudget <= 10) {
            score += 25;
            reasons.push(`€${propertyPrice.toLocaleString()} - Slightly over budget but excellent property`);
          } else if (overBudget <= 20) {
            score += 15;
            reasons.push(`€${propertyPrice.toLocaleString()} - Over budget but may be worth it`);
          } else {
            score += 5;
            reasons.push(`€${propertyPrice.toLocaleString()} - Above your budget range`);
          }
        }
      }

      // 2. Location matching (30 points) - INCREASED
      if (property.location) {
        const locationLower = property.location.toLowerCase();
        const targetLocationLower = location.toLowerCase();
        
        if (locationLower.includes(targetLocationLower)) {
          score += 30;
          reasons.push(`Located in ${property.location} (your preferred area)`);
        } else if (locationLower.includes('malaga') && targetLocationLower.includes('malaga')) {
          score += 20;
          reasons.push(`In the ${property.location} area of your target region`);
        } else {
          score += 5;
          reasons.push(`Located in ${property.location}`);
        }
      }

      // 3. Property type matching (20 points)
      if (propertyType) {
        const normalizedType = propertyType.toLowerCase();
        const matchesType = propertyTypes.some(type => 
          normalizedType.includes(type.toLowerCase()) || 
          type.toLowerCase().includes(normalizedType)
        );
        
        if (matchesType) {
          score += 20;
          reasons.push(`${propertyType} matches your property type preference`);
        } else {
          score += 5;
          reasons.push(`${propertyType} property type`);
        }
      }

      // 4. Bedroom matching (10 points)
      if (propertyBedrooms > 0) {
        const totalPeople = (Number(household.adults) || 0) + (Number(household.children) || 0);
        const bedroomsNeeded = Math.max(Math.ceil(totalPeople / 2), 2);
        
        if (propertyBedrooms >= bedroomsNeeded) {
          score += 10;
          reasons.push(`${propertyBedrooms} bedrooms - perfect for ${totalPeople} people`);
        } else if (propertyBedrooms === bedroomsNeeded - 1) {
          score += 6;
          reasons.push(`${propertyBedrooms} bedrooms - almost enough space`);
        } else {
          score += 3;
          reasons.push(`${propertyBedrooms} bedrooms available`);
        }
      }

      // 5. Bathroom matching (5 points) - NEW
      if (propertyBathrooms > 0) {
        const bathroomsNeeded = Math.ceil((Number(household.adults) || 0) / 2) + 1;
        if (propertyBathrooms >= bathroomsNeeded) {
          score += 5;
          reasons.push(`${propertyBathrooms} bathrooms`);
        } else {
          score += 2;
        }
      }

      // 6. Area/Size matching (5 points) - NEW
      if (propertyArea > 0) {
        const minArea = 80; // Reasonable minimum
        if (propertyArea >= minArea * 1.5) {
          score += 5;
          reasons.push(`${propertyArea}m² - very spacious property`);
        } else if (propertyArea >= minArea) {
          score += 3;
          reasons.push(`${propertyArea}m² - good size`);
        } else {
          score += 1;
        }
      }

      // 7. Features/Amenities matching (10 points)
      if (property.metadata?.features && Array.isArray(property.metadata.features) && property.metadata.features.length > 0) {
        const featureScore = Math.min(10, property.metadata.features.length * 2);
        score += featureScore;
        const featureList = property.metadata.features.slice(0, 3).join(', ');
        reasons.push(`Great features: ${featureList}`);
      }

      // 8. Data completeness bonus (5 points) - NEW
      if (propertyPrice > 0 && propertyBedrooms > 0 && propertyBathrooms > 0 && propertyArea > 0) {
        score += 5;
        reasons.push('Complete property information available');
      }

      // 9. Live search freshness bonus (5 points)
      if (property.source_website && property.source_website !== 'Database') {
        score += 5;
        reasons.push('Fresh listing from live search');
      }

      // TOTAL POSSIBLE: 130 points
      // Normalize to 100 scale
      const normalizedScore = Math.min(100, Math.round((score / 130) * 100));
      
      return { property, score: normalizedScore, reasons };
    });

    // Get top 10 properties
    const topProperties = scoredProperties
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    console.log(`📝 Saving ${topProperties.length} properties and ${liveServices.length} services`);

    // Deactivate previous recommendations so only the newest 6 are active
    await supabase
      .from('property_recommendations')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true);

    await supabase
      .from('service_recommendations')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true);

    // Save property recommendations with search metadata
    const propertyInserts = topProperties.map(({ property, score, reasons }: any) => {
      const metadata = property.metadata || {};
      const propertyUrl = property.url || '';
      
      // Extract reference number from URL (last segment before query params)
      const referenceNumber = propertyUrl 
        ? propertyUrl.split('/').filter(Boolean).pop()?.split('?')[0] || null
        : null;
      
      return {
        user_id: userId,
        property_id: property.id || null,
        title: property.title || 'Property',
        description: property.description || '',
        location: property.location || location,
        price: Number(property.price) || 0,
        currency: property.currency || 'EUR',
        property_type: metadata.type || propertyTypes[0] || 'apartment',
        bedrooms: Number(metadata.bedrooms || metadata.rooms) || null,
        bathrooms: Number(metadata.bathrooms) || null,
        area_sqm: Number(metadata.size_m2 || metadata.area) || null,
        features: metadata.features || [],
        images: property.images || [],
        source_url: propertyUrl,
        external_url: propertyUrl, // NEW: Direct link to property listing
        reference_number: referenceNumber, // NEW: Property reference/ID from URL
        listing_date: new Date().toISOString(), // NEW: When property was first listed
        last_checked: new Date().toISOString(), // NEW: When we last verified this property
        match_score: Math.round(score),
        match_reasons: reasons,
        source_website: property.source_website || null,
        search_query: property.search_query || null,
        search_timestamp: new Date().toISOString(),
        search_method: property.source_website ? 'live_search' : 'database_match',
      };
    });

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