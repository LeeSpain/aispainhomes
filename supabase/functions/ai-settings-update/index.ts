import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VALID_MODELS = [
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-5-2025-08-07',
  'gpt-5-mini-2025-08-07',
  'gpt-5-nano-2025-08-07',
];

interface SettingsUpdate {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system_prompt?: string;
  is_enabled?: boolean;
}

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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify admin role
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError || !isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const settings: SettingsUpdate = await req.json();

    console.log('Updating AI settings for user:', user.id);

    // Validate settings
    if (settings.model && !VALID_MODELS.includes(settings.model)) {
      throw new Error(`Invalid model. Must be one of: ${VALID_MODELS.join(', ')}`);
    }

    if (settings.temperature !== undefined && (settings.temperature < 0 || settings.temperature > 2)) {
      throw new Error('Temperature must be between 0 and 2');
    }

    if (settings.max_tokens !== undefined && settings.max_tokens <= 0) {
      throw new Error('Max tokens must be greater than 0');
    }

    // Update or insert settings
    const { data: existingSettings } = await supabase
      .from('ai_settings')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let result;
    if (existingSettings) {
      result = await supabase
        .from('ai_settings')
        .update(settings)
        .eq('user_id', user.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('ai_settings')
        .insert({ ...settings, user_id: user.id })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error updating settings:', result.error);
      throw new Error('Failed to update settings');
    }

    console.log('Settings updated successfully');

    return new Response(JSON.stringify({
      success: true,
      settings: result.data,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-settings-update function:', error);
    return new Response(JSON.stringify({ 
      error: 'An error occurred processing your request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
