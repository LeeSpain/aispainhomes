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

    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Error fetching auth users:', authError);
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get profiles for additional info
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, full_name, phone, created_at');

    // Get user roles
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('user_id, role');

    // Get subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('user_id, plan, status');

    // Combine data
    const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
    const rolesMap = new Map(userRoles?.map(r => [r.user_id, r.role]) || []);
    const subscriptionsMap = new Map(subscriptions?.map(s => [s.user_id, s]) || []);

    const users = authUsers.users.map(authUser => {
      const profile = profilesMap.get(authUser.id);
      const role = rolesMap.get(authUser.id) || 'user';
      const subscription = subscriptionsMap.get(authUser.id);

      return {
        id: authUser.id,
        email: authUser.email || 'N/A',
        full_name: profile?.full_name || authUser.user_metadata?.full_name || 'Unknown',
        phone: profile?.phone || authUser.phone || null,
        role: role,
        status: authUser.email_confirmed_at ? 'Active' : 'Pending',
        subscription_plan: subscription?.plan || 'free',
        subscription_status: subscription?.status || 'none',
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at,
        email_confirmed: !!authUser.email_confirmed_at
      };
    });

    return new Response(
      JSON.stringify({ users }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-get-users:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
