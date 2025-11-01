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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin
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

    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Prevent self-deletion
    if (userId === user.id) {
      return new Response(JSON.stringify({ error: 'Cannot delete your own account' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Starting deletion process for user: ${userId}`);

    // Delete all related data in order (most dependent to least dependent)
    // The ON DELETE CASCADE should handle most of this, but we'll be explicit
    
    // 1. Get tracked website IDs first (needed for cascading deletes)
    const { data: trackedWebsites } = await supabase
      .from('tracked_websites')
      .select('id')
      .eq('user_id', userId);
    
    const websiteIds = trackedWebsites?.map(w => w.id) || [];
    
    // 2. Delete tracked website related data if any websites exist
    if (websiteIds.length > 0) {
      await supabase.from('extracted_items').delete().in('tracked_website_id', websiteIds);
      await supabase.from('website_scrape_results').delete().in('tracked_website_id', websiteIds);
    }
    
    // 3. Delete user-specific data
    await supabase.from('ai_response_citations').delete().eq('user_id', userId);
    await supabase.from('ai_conversations').delete().eq('user_id', userId);
    await supabase.from('property_recommendations').delete().eq('user_id', userId);
    await supabase.from('service_recommendations').delete().eq('user_id', userId);
    await supabase.from('website_notifications').delete().eq('user_id', userId);
    await supabase.from('tracked_websites').delete().eq('user_id', userId);
    await supabase.from('user_questionnaire_history').delete().eq('user_id', userId);
    await supabase.from('questionnaire_responses').delete().eq('user_id', userId);
    await supabase.from('user_alerts').delete().eq('user_id', userId);
    await supabase.from('ai_usage_metrics').delete().eq('user_id', userId);
    await supabase.from('ai_client_instructions').delete().eq('user_id', userId);
    await supabase.from('ai_settings').delete().eq('user_id', userId);
    await supabase.from('rate_limits').delete().eq('user_id', userId);
    await supabase.from('payment_history').delete().eq('user_id', userId);
    await supabase.from('subscriptions').delete().eq('user_id', userId);
    await supabase.from('user_invitations').delete().eq('invited_by', userId);
    await supabase.from('user_invitations').delete().eq('used_by', userId);
    await supabase.from('user_roles').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('user_id', userId);
    
    // 12. Finally, delete the auth user (this should cascade delete any remaining foreign key references)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user from auth:', deleteError);
      return new Response(JSON.stringify({ error: 'Failed to delete user from authentication system' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Successfully deleted user: ${userId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User and all related data deleted successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-delete-user:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
