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
    
    // Fetch relevant official resources
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const searchTerms = lastUserMessage.toLowerCase();
    
    const { data: officialResources } = await supabase
      .from('official_resources')
      .select('*')
      .eq('is_active', true)
      .or(`title.ilike.%${searchTerms}%,description.ilike.%${searchTerms}%`)
      .limit(5);
    
    // Build resources context
    let resourcesContext = '';
    if (officialResources && officialResources.length > 0) {
      resourcesContext = '\n\n=== OFFICIAL SPANISH GOVERNMENT RESOURCES ===\n';
      resourcesContext += 'You have access to these verified official resources. ALWAYS cite them when relevant:\n\n';
      officialResources.forEach((resource: any, index: number) => {
        resourcesContext += `${index + 1}. [${resource.title}](${resource.url})\n`;
        resourcesContext += `   Authority: ${resource.authority}\n`;
        resourcesContext += `   Category: ${resource.category}\n`;
        resourcesContext += `   Description: ${resource.description}\n\n`;
      });
    }

    // Build system prompt
    let systemPrompt = settings.system_prompt || 'You are a helpful AI assistant.';
    
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

    systemPrompt += `\n\nIMPORTANT: When answering questions, prioritize official resources first. Only use web_search for topics not covered by official resources.`;

    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const tools = [
      {
        type: "function",
        function: {
          name: "web_search",
          description: "Search the web for current information ONLY when official resources don't cover the topic",
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
        if (toolCall.function.name === 'web_search') {
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

    // Extract cited resource URLs
    const citedUrls: string[] = [];
    if (officialResources) {
      officialResources.forEach((resource: any) => {
        if (assistantMessage.includes(resource.url)) {
          citedUrls.push(resource.url);
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
    
    // Save citations
    if (citedUrls.length > 0 && officialResources) {
      const citations = citedUrls.map(url => {
        const resource = officialResources.find((r: any) => r.url === url);
        return resource ? {
          conversation_id: conversationId,
          user_id: user.id,
          resource_id: resource.id,
          query_context: lastUserMessage
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
