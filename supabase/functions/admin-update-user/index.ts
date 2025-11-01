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

    const { userId, email, full_name, phone, role } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Updating user: ${userId}`);

    // Update auth user (email)
    if (email) {
      const { error: emailError } = await supabase.auth.admin.updateUserById(
        userId,
        { email }
      );

      if (emailError) {
        console.error('Error updating email:', emailError);
        return new Response(JSON.stringify({ error: 'Failed to update email' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Update profile
    if (full_name || phone) {
      const updateData: any = {};
      if (full_name) updateData.full_name = full_name;
      if (phone) updateData.phone = phone;
      updateData.updated_at = new Date().toISOString();

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', userId);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        return new Response(JSON.stringify({ error: 'Failed to update profile' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Update role if provided and different
    if (role) {
      // Check current role
      const { data: currentRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (!currentRole || currentRole.role !== role) {
        // Delete old role
        await supabase.from('user_roles').delete().eq('user_id', userId);
        
        // Insert new role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });

        if (roleError) {
          console.error('Error updating role:', roleError);
          return new Response(JSON.stringify({ error: 'Failed to update role' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
    }

    console.log(`Successfully updated user: ${userId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User updated successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-update-user:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
