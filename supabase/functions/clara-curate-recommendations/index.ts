import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    console.log('Processing recommendations for user:', userId);

    // Extract key information from questionnaire
    const location = Array.isArray(questionnaireData.location_preferences) 
      ? questionnaireData.location_preferences[0] 
      : 'Spain';
    const budgetRange = questionnaireData.budget_range as any || {};
    const household = questionnaireData.household_details as any || {};
    const servicesNeeded = questionnaireData.services_needed as any || {};
    const propertyTypes = questionnaireData.property_types || [];

    // Use AI to analyze needs and search for services
    const systemPrompt = `You are Clara, an AI relocation assistant for Spain. Analyze the user's questionnaire data and provide real, specific service recommendations in their target location. Use tool calling to return structured data.`;

    const userPrompt = `
User is relocating to: ${location}
Budget: €${budgetRange.min || 0} - €${budgetRange.max || 500000}
Household: ${household.adults || 1} adults, ${household.children || 0} children
Property types interested in: ${propertyTypes.join(', ')}
Services needed: ${JSON.stringify(servicesNeeded)}

Based on this information, recommend exactly 3 real, reputable local service providers in ${location}, Spain. Focus on the most critical services for their relocation (legal, utilities, or moving services). Return business name, description, contact info, location, and why you recommend them.`;

    // Call Lovable AI with tool calling for structured output
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'recommend_services',
              description: 'Return 3 real service provider recommendations',
              parameters: {
                type: 'object',
                properties: {
                  services: {
                    type: 'array',
                    minItems: 3,
                    maxItems: 3,
                    items: {
                      type: 'object',
                      properties: {
                        service_category: { type: 'string', enum: ['legal', 'utilities', 'movers', 'schools', 'healthcare'] },
                        business_name: { type: 'string' },
                        description: { type: 'string' },
                        contact_info: {
                          type: 'object',
                          properties: {
                            phone: { type: 'string' },
                            email: { type: 'string' },
                            website: { type: 'string' },
                            address: { type: 'string' }
                          }
                        },
                        location: { type: 'string' },
                        rating: { type: 'number' },
                        why_recommended: { type: 'string' },
                        source_url: { type: 'string' }
                      },
                      required: ['service_category', 'business_name', 'description', 'why_recommended', 'location']
                    }
                  }
                },
                required: ['services']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'recommend_services' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      console.error('No tool call in AI response');
      return new Response(JSON.stringify({ error: 'AI returned invalid response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const serviceRecommendations = JSON.parse(toolCall.function.arguments).services;

    // Save service recommendations to database
    const serviceInserts = serviceRecommendations.map((service: any) => ({
      user_id: userId,
      service_category: service.service_category,
      business_name: service.business_name,
      description: service.description,
      contact_info: service.contact_info || {},
      location: service.location,
      rating: service.rating || null,
      why_recommended: service.why_recommended,
      source_url: service.source_url || null,
    }));

    const { error: serviceError } = await supabase
      .from('service_recommendations')
      .insert(serviceInserts);

    if (serviceError) {
      console.error('Error saving services:', serviceError);
    }

    // Get existing scraped properties and match them
    const { data: scrapedProperties } = await supabase
      .from('extracted_items')
      .select('*')
      .eq('item_type', 'property')
      .eq('is_active', true)
      .limit(50);

    const properties = scrapedProperties || [];
    
    // Score and rank properties
    const scoredProperties = properties.map((property: any) => {
      let score = 0;
      const reasons: string[] = [];

      const propertyPrice = Number(property.price) || 0;
      const minBudget = Number(budgetRange.min) || 0;
      const maxBudget = Number(budgetRange.max) || Infinity;

      // Budget matching (30 points)
      if (propertyPrice >= minBudget && propertyPrice <= maxBudget) {
        score += 30;
        reasons.push('Within your budget');
      } else if (propertyPrice < minBudget) {
        score += (propertyPrice / minBudget) * 30;
        reasons.push('Below budget');
      } else {
        const overBudget = ((propertyPrice - maxBudget) / maxBudget) * 100;
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

      return { property, score, reasons };
    });

    // Get top 6 properties
    const topProperties = scoredProperties
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    // Save property recommendations
    const propertyInserts = topProperties.map(({ property, score, reasons }: any) => ({
      user_id: userId,
      property_id: property.id,
      title: property.title || 'Property',
      description: property.description || '',
      location: property.location || location,
      price: Number(property.price) || 0,
      currency: property.currency || 'EUR',
      property_type: property.metadata?.type || 'apartment',
      bedrooms: Number(property.metadata?.bedrooms) || null,
      bathrooms: Number(property.metadata?.bathrooms) || null,
      area_sqm: Number(property.metadata?.area_sqm) || null,
      features: property.metadata?.features || [],
      images: property.images || [],
      source_url: property.url || '',
      match_score: Math.round(score),
      match_reasons: reasons,
    }));

    const { error: propertyError } = await supabase
      .from('property_recommendations')
      .insert(propertyInserts);

    if (propertyError) {
      console.error('Error saving properties:', propertyError);
    }

    console.log(`Saved ${serviceInserts.length} services and ${propertyInserts.length} properties for user ${userId}`);

    return new Response(
      JSON.stringify({
        success: true,
        servicesCount: serviceInserts.length,
        propertiesCount: propertyInserts.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in clara-curate-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});