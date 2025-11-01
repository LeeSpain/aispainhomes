import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Cancelling subscription for user:', user.id);

    // Get user's active subscription
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'trial'])
      .single();

    if (fetchError || !subscription) {
      throw new Error('No active subscription found');
    }

    // TODO: Once Stripe is configured, cancel via Stripe API
    // const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    // await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    //   cancel_at_period_end: true
    // });

    // Update subscription in database
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      throw updateError;
    }

    console.log('Subscription cancelled successfully');

    // Calculate access end date
    const accessUntil = subscription.trial_end_date 
      ? new Date(subscription.trial_end_date)
      : subscription.next_billing_date 
        ? new Date(subscription.next_billing_date)
        : new Date();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Subscription cancelled successfully',
        accessUntil: accessUntil.toISOString(),
        details: `You will retain access until ${accessUntil.toLocaleDateString()}`
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in cancel-subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
