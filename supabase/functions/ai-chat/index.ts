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

// Token cost estimates per 1K tokens (as of 2024)
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

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { messages, sessionId }: ChatRequest = await req.json();

    console.log('Chat request from user:', user.id, 'Session:', sessionId);

    // Fetch user's AI settings
    const { data: settings, error: settingsError } = await supabase
      .from('ai_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      throw new Error('Failed to fetch AI settings');
    }

    if (!settings.is_enabled) {
      throw new Error('AI assistant is disabled for this user');
    }

    // Fetch active custom instructions
    const { data: instructions, error: instructionsError } = await supabase
      .from('ai_client_instructions')
      .select('instruction')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (instructionsError) {
      console.error('Error fetching instructions:', instructionsError);
    }

    // Build system prompt with custom instructions
    let systemPrompt = settings.system_prompt || 'You are a helpful AI assistant.';
    
    if (instructions && instructions.length > 0) {
      systemPrompt += '\n\nAdditional Instructions:\n';
      systemPrompt += instructions.map(i => `- ${i.instruction}`).join('\n');
    }

    // Prepare messages for OpenAI
    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Call OpenAI API
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Calling OpenAI with model:', settings.model);

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const responseData = await openaiResponse.json();
    const assistantMessage = responseData.choices[0].message.content;
    const tokensUsed = responseData.usage.total_tokens;
    const inputTokens = responseData.usage.prompt_tokens;
    const outputTokens = responseData.usage.completion_tokens;

    console.log('OpenAI response - Tokens used:', tokensUsed);

    // Calculate cost
    const costs = TOKEN_COSTS[settings.model as keyof typeof TOKEN_COSTS] || TOKEN_COSTS['gpt-4o-mini'];
    const estimatedCost = (inputTokens / 1000 * costs.input) + (outputTokens / 1000 * costs.output);

    // Store conversation in database
    const conversationEntries = [
      {
        user_id: user.id,
        session_id: sessionId,
        role: messages[messages.length - 1].role,
        content: messages[messages.length - 1].content,
        tokens_used: inputTokens,
        model: settings.model,
      },
      {
        user_id: user.id,
        session_id: sessionId,
        role: 'assistant',
        content: assistantMessage,
        tokens_used: outputTokens,
        model: settings.model,
      },
    ];

    const { error: conversationError } = await supabase
      .from('ai_conversations')
      .insert(conversationEntries);

    if (conversationError) {
      console.error('Error saving conversation:', conversationError);
    }

    // Update usage metrics
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existingMetrics } = await supabase
      .from('ai_usage_metrics')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .eq('model', settings.model)
      .single();

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
      tokensUsed,
      estimatedCost: estimatedCost.toFixed(4),
      model: settings.model,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
