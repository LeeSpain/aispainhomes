import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: Message[];
  sessionId: string;
}

const TOKEN_COSTS = {
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-5-mini-2025-08-07': { input: 0.0002, output: 0.0008 },
  'gpt-5-2025-08-07': { input: 0.01, output: 0.03 },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) throw new Error('Unauthorized');

    // Check rate limits before processing
    const { data: rateLimitResult } = await supabase.rpc('check_rate_limit', {
      _user_id: user.id,
      _endpoint: 'ai-chat',
      _max_requests_per_minute: 20,
      _max_requests_per_hour: 100,
      _max_requests_per_day: 500
    });

    if (rateLimitResult && !rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: `Rate limit exceeded. You have reached the ${rateLimitResult.limit_type}ly limit of ${rateLimitResult.limit} requests. Please try again later.`,
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

    const { messages, sessionId }: ChatRequest = await req.json();

    // Fetch AI settings
    const { data: settings } = await supabase
      .from('ai_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!settings || !settings.is_enabled) {
      throw new Error('AI assistant is disabled');
    }

    // Fetch custom instructions
    const { data: instructions } = await supabase
      .from('ai_client_instructions')
      .select('instruction')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    // Fetch tracked websites
    const { data: trackedWebsites } = await supabase
      .from('tracked_websites')
      .select('name, url, category')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(10);
    
    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    // Fetch latest questionnaire response
    const { data: questionnaireData } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    // Fetch relevant official resources with better matching
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const searchTerms = lastUserMessage.toLowerCase();
    
    // Keywords to category mapping for better resource matching
    const categoryKeywords: Record<string, string[]> = {
      immigration: ['visa', 'nie', 'residence', 'permit', 'immigration', 'foreigner', 'extranjero', 'passport'],
      property: ['property', 'buy', 'buying', 'purchase', 'house', 'apartment', 'flat', 'registro', 'deed', 'title', 'ownership', 'rental', 'rent', 'lease', 'tenant'],
      finance: ['tax', 'banking', 'bank', 'mortgage', 'social security', 'seguridad social', 'iva', 'irpf', 'hacienda', 'investment'],
      healthcare: ['health', 'doctor', 'hospital', 'medical', 'insurance', 'salud', 'seguro', 'ehic'],
      education: ['school', 'university', 'education', 'study', 'degree', 'diploma', 'homologation'],
      utilities: ['electricity', 'water', 'gas', 'internet', 'phone', 'utilities', 'luz', 'agua'],
      transport: ['car', 'driver', 'license', 'vehicle', 'registration', 'dgt', 'traffic', 'permiso', 'conducir'],
      work: ['work', 'job', 'employment', 'autonomo', 'self-employed', 'labor', 'contract', 'sepe'],
      integration: ['citizenship', 'nationality', 'culture', 'padron', 'empadronamiento', 'local'],
      lifestyle: ['consumer', 'environment', 'tourism', 'travel'],
      property_websites: ['idealista', 'fotocasa', 'kyero', 'property', 'listing', 'real estate', 'search']
    };
    
    // Determine relevant categories from user query
    const relevantCategories: string[] = [];
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => searchTerms.includes(keyword))) {
        relevantCategories.push(category);
      }
    }
    
    // Fetch official resources - prioritize government resources over property websites
    let officialResources: any[] = [];
    
    if (relevantCategories.length > 0) {
      // Fetch resources by relevant categories
      const { data: categoryResources } = await supabase
        .from('official_resources')
        .select('*')
        .eq('is_active', true)
        .in('category', relevantCategories)
        .order('trust_level', { ascending: false })
        .limit(10);
      
      officialResources = categoryResources || [];
    }
    
    // Also do text search as fallback
    const { data: searchResults } = await supabase
      .from('official_resources')
      .select('*')
      .eq('is_active', true)
      .or(`title.ilike.%${searchTerms}%,description.ilike.%${searchTerms}%,authority.ilike.%${searchTerms}%`)
      .order('trust_level', { ascending: false })
      .limit(8);
    
    // Merge results, remove duplicates, prioritize government resources
    if (searchResults && searchResults.length > 0) {
      searchResults.forEach(result => {
        if (!officialResources.find(r => r.id === result.id)) {
          officialResources.push(result);
        }
      });
    }
    
    // Sort to prioritize government resources over property websites
    officialResources.sort((a, b) => {
      if (a.category === 'property_websites' && b.category !== 'property_websites') return 1;
      if (a.category !== 'property_websites' && b.category === 'property_websites') return -1;
      return 0;
    });
    
    // Limit to top 12 most relevant
    officialResources = officialResources.slice(0, 12);
    
    // Build resources context
    let resourcesContext = '';
    if (officialResources && officialResources.length > 0) {
      // Separate government resources from property websites
      const govResources = officialResources.filter(r => r.category !== 'property_websites');
      const propertyWebsites = officialResources.filter(r => r.category === 'property_websites');
      
      if (govResources.length > 0) {
        resourcesContext += '\n\n=== OFFICIAL SPANISH GOVERNMENT RESOURCES ===\n';
        resourcesContext += 'You have access to these verified official resources. ALWAYS cite them when providing official information:\n\n';
        govResources.forEach((resource: any, index: number) => {
          resourcesContext += `${index + 1}. [${resource.title}](${resource.url})\n`;
          resourcesContext += `   Authority: ${resource.authority}\n`;
          resourcesContext += `   Category: ${resource.category} ${resource.subcategory ? `(${resource.subcategory})` : ''}\n`;
          resourcesContext += `   Description: ${resource.description}\n`;
          resourcesContext += `   Trust Level: ${resource.trust_level}\n\n`;
        });
      }
      
      if (propertyWebsites.length > 0) {
        resourcesContext += '\n=== PROPERTY WEBSITES ===\n';
        resourcesContext += 'Property listing portals available for property searches:\n\n';
        propertyWebsites.forEach((resource: any, index: number) => {
          resourcesContext += `${index + 1}. ${resource.title} - ${resource.url}\n`;
          resourcesContext += `   ${resource.description}\n\n`;
        });
      }
    }
    
    // If no specific resources found, provide general guidance
    if (officialResources.length === 0) {
      resourcesContext += '\n\n=== AVAILABLE RESOURCE CATEGORIES ===\n';
      resourcesContext += 'When users ask about these topics, search for specific resources:\n';
      resourcesContext += '- Immigration & Visas (NIE, residence permits, work authorization)\n';
      resourcesContext += '- Property & Housing (registration, rentals, taxes)\n';
      resourcesContext += '- Finance & Banking (taxes, social security, banking)\n';
      resourcesContext += '- Healthcare (public health, insurance, EHIC)\n';
      resourcesContext += '- Education (schools, universities, language courses)\n';
      resourcesContext += '- Utilities (electricity, water, telecommunications)\n';
      resourcesContext += '- Transport (driver\'s license, vehicle registration)\n';
      resourcesContext += '- Work & Employment (jobs, contracts, self-employment)\n';
      resourcesContext += '- Integration & Culture (citizenship, local registration)\n';
      resourcesContext += '- Property Websites (47 tracked property listing portals)\n';
    }

    // Build system prompt
    let systemPrompt = settings.system_prompt || 'You are a helpful AI assistant.';
    
    // Add user profile context
    if (profile) {
      systemPrompt += '\n\n=== USER PROFILE ===\n';
      systemPrompt += `Name: ${profile.full_name || 'Not specified'}\n`;
      if (profile.nationality) systemPrompt += `Nationality: ${profile.nationality}\n`;
      if (profile.current_country) systemPrompt += `Current Location: ${profile.current_country}\n`;
      if (profile.relocation_timeline) systemPrompt += `Relocation Timeline: ${profile.relocation_timeline}\n`;
      if (profile.moving_reason) systemPrompt += `Moving Reason: ${profile.moving_reason}\n`;
      systemPrompt += `Household Size: ${profile.household_size || 1}\n`;
      systemPrompt += `Pets: ${profile.has_pets ? 'Yes' : 'No'}\n`;
      if (profile.budget_min || profile.budget_max) {
        systemPrompt += `Budget: €${profile.budget_min || '?'} - €${profile.budget_max || '?'}\n`;
      }
      if (profile.preferred_locations && profile.preferred_locations.length > 0) {
        systemPrompt += `Preferred Locations: ${profile.preferred_locations.join(', ')}\n`;
      }
      if (profile.property_type_preference) {
        systemPrompt += `Property Type Preference: ${profile.property_type_preference}\n`;
      }
    }
    
    // Add questionnaire context
    if (questionnaireData) {
      systemPrompt += '\n\n=== QUESTIONNAIRE RESPONSES ===\n';
      systemPrompt += `Service Type: ${questionnaireData.service_type}\n`;
      if (questionnaireData.property_type) systemPrompt += `Property Type: ${questionnaireData.property_type}\n`;
      if (questionnaireData.property_types && questionnaireData.property_types.length > 0) {
        systemPrompt += `Property Types: ${questionnaireData.property_types.join(', ')}\n`;
      }
      if (questionnaireData.budget_range) {
        systemPrompt += `Budget: €${questionnaireData.budget_range.min || '?'} - €${questionnaireData.budget_range.max || '?'}\n`;
      }
      if (questionnaireData.location_preferences) {
        systemPrompt += `Location Preferences: ${JSON.stringify(questionnaireData.location_preferences)}\n`;
      }
      if (questionnaireData.household_details) {
        const details = questionnaireData.household_details;
        systemPrompt += `Bedrooms: ${details.bedrooms || 'Not specified'}\n`;
        systemPrompt += `Bathrooms: ${details.bathrooms || 'Not specified'}\n`;
        systemPrompt += `Min Area: ${details.minArea || 'Not specified'} m²\n`;
      }
      if (questionnaireData.amenities_required && questionnaireData.amenities_required.length > 0) {
        systemPrompt += `Required Amenities: ${questionnaireData.amenities_required.join(', ')}\n`;
      }
      if (questionnaireData.guardian_service_tier) {
        systemPrompt += `Guardian Service Tier: ${questionnaireData.guardian_service_tier}\n`;
      }
      
      // Add new JSONB fields
      if (questionnaireData.personal_info) {
        const personalInfo = questionnaireData.personal_info;
        systemPrompt += '\n=== PERSONAL INFORMATION ===\n';
        systemPrompt += `Full Name: ${personalInfo.fullName || 'Not specified'}\n`;
        systemPrompt += `Phone: ${personalInfo.phone || 'Not specified'}\n`;
        systemPrompt += `Current Country: ${personalInfo.currentCountry || 'Not specified'}\n`;
        systemPrompt += `Nationality: ${personalInfo.nationality || 'Not specified'}\n`;
        systemPrompt += `Preferred Language: ${personalInfo.preferredLanguage || 'Not specified'}\n`;
      }
      
      if (questionnaireData.relocation_timeline) {
        const timeline = questionnaireData.relocation_timeline;
        systemPrompt += '\n=== RELOCATION TIMELINE ===\n';
        systemPrompt += `Relocation Timeframe: ${timeline.relocateWhen || 'Not specified'}\n`;
        systemPrompt += `Move Type: ${timeline.moveType || 'Not specified'}\n`;
        systemPrompt += `Visited Spain: ${timeline.visitedSpain || 'Not specified'}\n`;
      }
      
      if (questionnaireData.legal_documentation) {
        const legal = questionnaireData.legal_documentation;
        systemPrompt += '\n=== LEGAL & DOCUMENTATION STATUS ===\n';
        systemPrompt += `NIE Number: ${legal.hasNIE ? 'Yes' : 'No'}\n`;
        systemPrompt += `Visa Assistance Needed: ${legal.needsVisa ? 'Yes' : 'No'}\n`;
        systemPrompt += `Spanish Bank Account: ${legal.hasBankAccount ? 'Yes' : 'No'}\n`;
        systemPrompt += `Health Insurance: ${legal.healthInsurance || 'Not specified'}\n`;
      }
      
      if (questionnaireData.lifestyle_preferences) {
        const lifestyle = questionnaireData.lifestyle_preferences;
        systemPrompt += '\n=== LIFESTYLE PREFERENCES ===\n';
        systemPrompt += `Climate Preference: ${lifestyle.climatePreference || 'Not specified'}\n`;
        systemPrompt += `Area Type: ${lifestyle.areaType || 'Not specified'}\n`;
        systemPrompt += `Community Preference: ${lifestyle.communityPreference || 'Not specified'}\n`;
        if (lifestyle.proximityPriorities && lifestyle.proximityPriorities.length > 0) {
          systemPrompt += `Proximity Priorities: ${lifestyle.proximityPriorities.join(', ')}\n`;
        }
      }
      
      if (questionnaireData.services_needed) {
        const services = questionnaireData.services_needed;
        systemPrompt += '\n=== SERVICES NEEDED ===\n';
        systemPrompt += `Legal Assistance: ${services.legalAssistance || 'Not specified'}\n`;
        systemPrompt += `Utilities Setup: ${services.utilitiesSetup || 'Not specified'}\n`;
        systemPrompt += `Moving Services: ${services.movingServices || 'Not specified'}\n`;
        systemPrompt += `Education Needs: ${services.educationNeeds || 'Not specified'}\n`;
        systemPrompt += `Healthcare Preference: ${services.healthcarePreference || 'Not specified'}\n`;
        systemPrompt += `Language Learning: ${services.languageLearning || 'Not specified'}\n`;
      }
      
      if (questionnaireData.special_requirements) {
        systemPrompt += `\nSpecial Requirements: ${questionnaireData.special_requirements}\n`;
      }
      
      if (questionnaireData.referral_source) {
        systemPrompt += `Referral Source: ${questionnaireData.referral_source}\n`;
      }
    }
    
    if (instructions && instructions.length > 0) {
      systemPrompt += '\n\nAdditional Instructions:\n';
      systemPrompt += instructions.map((i: any) => `- ${i.instruction}`).join('\n');
    }

    if (trackedWebsites && trackedWebsites.length > 0) {
      const websiteList = trackedWebsites.map((w: any) => `- ${w.name} (${w.category}): ${w.url}`).join('\n');
      systemPrompt += `\n\nUser's Tracked Websites:\n${websiteList}`;
    }
    
    systemPrompt += resourcesContext;
    
    // Add legal disclaimer guidance
    const legalKeywords = ['nie', 'visa', 'tax', 'property', 'mortgage', 'healthcare', 'work permit', 'legal'];
    const requiresDisclaimer = legalKeywords.some(keyword => searchTerms.includes(keyword));
    
    if (requiresDisclaimer) {
      systemPrompt += '\n\nIMPORTANT: This query involves legal/official matters. Include this disclaimer:\n';
      systemPrompt += '"⚖️ Legal Disclaimer: This information is for general guidance only and does not constitute legal advice. Always consult qualified professionals or official authorities."\n';
    }

    systemPrompt += '\n\n=== AI ASSISTANT GUIDELINES ===\n';
    systemPrompt += '1. ALWAYS CITE OFFICIAL SOURCES: When providing official information (visas, taxes, healthcare, etc.), cite the specific government resources provided above\n';
    systemPrompt += '2. CITATION FORMAT: Use markdown links like "[Ministry of Foreign Affairs](URL)" when citing sources\n';
    systemPrompt += '3. PRIORITIZE OFFICIAL RESOURCES: Use official government resources first, only use web_search for current news or topics not covered\n';
    systemPrompt += '4. USER CONTEXT: Use the user\'s complete profile when making recommendations\n';
    systemPrompt += '5. LEGAL STATUS: Consider their legal status (NIE, visa) when discussing property options\n';
    systemPrompt += '6. LIFESTYLE: Factor in their lifestyle preferences (climate, area type, community)\n';
    systemPrompt += '7. SERVICES: Suggest relevant services based on their stated needs\n';
    systemPrompt += '8. TIMING: Be mindful of their relocation timeline when advising on urgency\n';
    systemPrompt += '9. FAMILY: Consider family composition (children, pets) in all recommendations\n';
    systemPrompt += '10. DISCLAIMERS: Include legal disclaimer when discussing official procedures\n\n';
    systemPrompt += 'IMPORTANT: We have 80+ official resources (33 government resources + 47 property websites). Always check if an official resource covers the topic before using web search.';

    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Fetch scraped properties for context
    const { data: scrapedProperties } = await supabase
      .from('extracted_items')
      .select('id, title, description, location, price, currency, metadata, url')
      .eq('is_active', true)
      .order('first_seen_at', { ascending: false })
      .limit(50);
    
    // Add scraped properties context to system prompt
    if (scrapedProperties && scrapedProperties.length > 0) {
      systemPrompt += '\n\n=== AVAILABLE SCRAPED PROPERTIES ===\n';
      systemPrompt += `You have access to ${scrapedProperties.length} real estate listings from tracked websites.\n`;
      systemPrompt += 'Use the search_scraped_properties tool to find properties matching user criteria.\n';
      systemPrompt += 'When recommending properties, prioritize these real listings over generic suggestions.\n';
    }

    const tools = [
      {
        type: "function",
        function: {
          name: "search_scraped_properties",
          description: "Search through scraped real estate properties from tracked websites. Use this when user asks about available properties, listings, or specific property features.",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "Location to search for (e.g., Barcelona, Madrid, Costa del Sol)"
              },
              minPrice: {
                type: "number",
                description: "Minimum price filter"
              },
              maxPrice: {
                type: "number",
                description: "Maximum price filter"
              },
              propertyType: {
                type: "string",
                description: "Type of property (apartment, villa, house, etc.)"
              }
            }
          }
        }
      },
      {
        type: "function",
        function: {
          name: "web_search",
          description: "Search the web for current information ONLY when official resources don't cover the topic. Use this for: current news, recent changes, specific property listings not in database. DO NOT use for official procedures - use official resources instead",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query"
              }
            },
            required: ["query"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "search_official_resources",
          description: "Search through official Spanish government resources and property websites. Use this when users ask about: visas, NIE, taxes, healthcare, education, utilities, transport, work permits, property listings, or any official Spanish procedures",
          parameters: {
            type: "object",
            properties: {
              category: {
                type: "string",
                enum: ["immigration", "property", "finance", "healthcare", "education", "utilities", "transport", "work", "integration", "lifestyle", "property_websites"],
                description: "Category of resources to search"
              },
              query: {
                type: "string",
                description: "Keywords to search for within the category"
              }
            },
            required: ["query"]
          }
        }
      }
    ];

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) throw new Error('OpenAI API key not configured');

    let openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model,
        messages: openaiMessages,
        temperature: settings.temperature,
        max_tokens: settings.max_tokens,
        tools: tools,
        tool_choice: "auto"
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI error:', openaiResponse.status, errorText);
      throw new Error(`OpenAI error: ${openaiResponse.status}`);
    }

    let responseData = await openaiResponse.json();
    let assistantMessage = responseData.choices[0].message.content;
    const toolCalls = responseData.choices[0].message.tool_calls;

    // Handle function calls
    if (toolCalls && toolCalls.length > 0) {
      for (const toolCall of toolCalls) {
        if (toolCall.function.name === 'search_scraped_properties') {
          const args = JSON.parse(toolCall.function.arguments);
          
          let query = supabase
            .from('extracted_items')
            .select('id, title, description, location, price, currency, metadata, url, images')
            .eq('is_active', true)
            .order('first_seen_at', { ascending: false });

          if (args.location) {
            query = query.ilike('location', `%${args.location}%`);
          }
          if (args.minPrice) {
            query = query.gte('price', args.minPrice);
          }
          if (args.maxPrice) {
            query = query.lte('price', args.maxPrice);
          }
          if (args.propertyType) {
            query = query.ilike('item_type', `%${args.propertyType}%`);
          }

          const { data: properties } = await query.limit(20);

          const propertySummary = properties?.map((p: any) => ({
            title: p.title,
            location: p.location,
            price: `${p.currency || 'EUR'} ${p.price?.toLocaleString()}`,
            description: p.description?.substring(0, 200),
            url: p.url,
            bedrooms: p.metadata?.bedrooms,
            area: p.metadata?.area,
          })) || [];

          openaiMessages.push({
            role: 'assistant',
            content: null,
            tool_calls: [toolCall]
          } as any);

          openaiMessages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              count: propertySummary.length,
              properties: propertySummary,
              message: `Found ${propertySummary.length} properties matching the criteria`
            })
          } as any);
        } else if (toolCall.function.name === 'web_search') {
          const args = JSON.parse(toolCall.function.arguments);
          
          const searchResponse = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/functions/v1/web-search`,
            {
              method: 'POST',
              headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: args.query, numResults: 5 }),
            }
          );

          let searchResults: any = { results: [] };
          if (searchResponse.ok) {
            searchResults = await searchResponse.json();
          }

          openaiMessages.push({
            role: 'assistant',
            content: null,
            tool_calls: [toolCall]
          } as any);

          openaiMessages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(searchResults.results || [])
          } as any);
        } else if (toolCall.function.name === 'search_official_resources') {
          const args = JSON.parse(toolCall.function.arguments);
          
          let resourceQuery = supabase
            .from('official_resources')
            .select('*')
            .eq('is_active', true);
          
          // Filter by category if provided
          if (args.category) {
            resourceQuery = resourceQuery.eq('category', args.category);
          }
          
          // Search by query terms
          if (args.query) {
            resourceQuery = resourceQuery.or(
              `title.ilike.%${args.query}%,description.ilike.%${args.query}%,authority.ilike.%${args.query}%`
            );
          }
          
          const { data: foundResources } = await resourceQuery
            .order('trust_level', { ascending: false })
            .limit(10);
          
          const resourceSummary = foundResources?.map((r: any) => ({
            title: r.title,
            authority: r.authority,
            url: r.url,
            category: r.category,
            subcategory: r.subcategory,
            description: r.description,
            trust_level: r.trust_level
          })) || [];
          
          openaiMessages.push({
            role: 'assistant',
            content: null,
            tool_calls: [toolCall]
          } as any);
          
          openaiMessages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              count: resourceSummary.length,
              resources: resourceSummary,
              message: `Found ${resourceSummary.length} official resources. IMPORTANT: Cite these in your response using markdown links.`
            })
          } as any);
        }
      }

      // Second API call with function results
      openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: settings.model,
          messages: openaiMessages,
          temperature: settings.temperature,
          max_tokens: settings.max_tokens,
        }),
      });

      if (!openaiResponse.ok) throw new Error('OpenAI error on second call');

      responseData = await openaiResponse.json();
      assistantMessage = responseData.choices[0].message.content;
    }

    const tokensUsed = responseData.usage.total_tokens;
    const inputTokens = responseData.usage.prompt_tokens;
    const outputTokens = responseData.usage.completion_tokens;

    const costs = TOKEN_COSTS[settings.model as keyof typeof TOKEN_COSTS] || TOKEN_COSTS['gpt-4o-mini'];
    const estimatedCost = (inputTokens / 1000 * costs.input) + (outputTokens / 1000 * costs.output);

    // Extract cited resource URLs and titles
    const citedUrls: string[] = [];
    const citedResourceIds: string[] = [];
    
    if (officialResources && officialResources.length > 0) {
      officialResources.forEach((resource: any) => {
        // Check if URL is mentioned in the response
        if (assistantMessage.includes(resource.url)) {
          citedUrls.push(resource.url);
          if (!citedResourceIds.includes(resource.id)) {
            citedResourceIds.push(resource.id);
          }
        }
        // Check if resource title is mentioned
        if (assistantMessage.includes(resource.title) || 
            assistantMessage.toLowerCase().includes(resource.title.toLowerCase())) {
          if (!citedUrls.includes(resource.url)) {
            citedUrls.push(resource.url);
          }
          if (!citedResourceIds.includes(resource.id)) {
            citedResourceIds.push(resource.id);
          }
        }
        // Check if authority is mentioned
        if (assistantMessage.includes(resource.authority)) {
          if (!citedUrls.includes(resource.url)) {
            citedUrls.push(resource.url);
          }
          if (!citedResourceIds.includes(resource.id)) {
            citedResourceIds.push(resource.id);
          }
        }
      });
    }

    // Store conversation
    const conversationId = crypto.randomUUID();
    await supabase.from('ai_conversations').insert([
      {
        user_id: user.id,
        session_id: sessionId,
        role: messages[messages.length - 1].role,
        content: messages[messages.length - 1].content,
        tokens_used: inputTokens,
        model: settings.model,
      },
      {
        id: conversationId,
        user_id: user.id,
        session_id: sessionId,
        role: 'assistant',
        content: assistantMessage,
        tokens_used: outputTokens,
        model: settings.model,
        cited_resources: citedUrls
      },
    ]);
    
    // Save citations for all mentioned resources
    if (citedResourceIds.length > 0 && officialResources) {
      const citations = citedResourceIds.map(resourceId => {
        const resource = officialResources.find((r: any) => r.id === resourceId);
        return resource ? {
          conversation_id: conversationId,
          user_id: user.id,
          resource_id: resource.id,
          query_context: lastUserMessage.substring(0, 500) // Limit context length
        } : null;
      }).filter(c => c !== null);
      
      if (citations.length > 0) {
        await supabase.from('ai_response_citations').insert(citations);
      }
    }

    // Update usage metrics
    const today = new Date().toISOString().split('T')[0];
    const { data: existingMetrics } = await supabase
      .from('ai_usage_metrics')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .eq('model', settings.model)
      .maybeSingle();

    if (existingMetrics) {
      await supabase
        .from('ai_usage_metrics')
        .update({
          total_requests: existingMetrics.total_requests + 1,
          total_tokens: existingMetrics.total_tokens + tokensUsed,
          estimated_cost: existingMetrics.estimated_cost + estimatedCost,
        })
        .eq('id', existingMetrics.id);
    } else {
      await supabase
        .from('ai_usage_metrics')
        .insert({
          user_id: user.id,
          date: today,
          total_requests: 1,
          total_tokens: tokensUsed,
          estimated_cost: estimatedCost,
          model: settings.model,
        });
    }

    return new Response(JSON.stringify({
      message: assistantMessage,
      response: assistantMessage,
      tokensUsed,
      estimatedCost: estimatedCost.toFixed(4),
      model: settings.model,
      citedResources: citedUrls
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
