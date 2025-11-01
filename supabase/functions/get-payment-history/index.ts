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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
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

    console.log('Fetching payment history for user:', user.id);

    // Fetch payment history from database
    const { data: payments, error: paymentsError } = await supabase
      .from('payment_history')
      .select('*')
      .eq('user_id', user.id)
      .order('payment_date', { ascending: false });

    if (paymentsError) {
      console.error('Error fetching payment history:', paymentsError);
      throw paymentsError;
    }

    // Fetch current subscription for upcoming payment info
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'trial'])
      .single();

    let upcomingPayment = null;
    if (subscription && !subscription.cancel_at_period_end) {
      if (subscription.status === 'trial' && subscription.trial_end_date) {
        upcomingPayment = {
          amount: subscription.monthly_price,
          currency: 'EUR',
          date: subscription.trial_end_date,
          description: 'First payment after trial ends',
          status: 'scheduled'
        };
      } else if (subscription.next_billing_date) {
        upcomingPayment = {
          amount: subscription.monthly_price,
          currency: 'EUR',
          date: subscription.next_billing_date,
          description: 'Monthly subscription renewal',
          status: 'scheduled'
        };
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        payments: payments || [],
        upcomingPayment,
        subscription: subscription ? {
          plan: subscription.plan,
          status: subscription.status,
          monthlyPrice: subscription.monthly_price,
          trialEndDate: subscription.trial_end_date,
          nextBillingDate: subscription.next_billing_date,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        } : null
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in get-payment-history:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
