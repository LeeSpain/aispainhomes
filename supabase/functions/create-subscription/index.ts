import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateSubscriptionRequest {
  paymentMethodId: string;
  customerDetails: {
    email: string;
    name: string;
  };
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

    const { paymentMethodId, customerDetails }: CreateSubscriptionRequest = await req.json();

    console.log('Creating subscription for user:', user.id);

    // TODO: Once Stripe is configured, implement actual Stripe API calls
    // For now, create a placeholder subscription in the database
    
    // Calculate trial end date (7 days from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    // Calculate next billing date (same as trial end)
    const nextBillingDate = new Date(trialEndDate);

    // Create subscription record
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan: 'guardian',
        status: 'trial',
        monthly_price: 24.99,
        start_date: new Date().toISOString(),
        trial_end_date: trialEndDate.toISOString(),
        next_billing_date: nextBillingDate.toISOString(),
        stripe_payment_method_id: paymentMethodId,
        // These will be set once Stripe integration is active:
        // stripe_customer_id: stripeCustomer.id,
        // stripe_subscription_id: stripeSubscription.id,
      })
      .select()
      .single();

    if (subError) {
      console.error('Error creating subscription:', subError);
      throw subError;
    }

    console.log('Subscription created successfully:', subscription.id);

    return new Response(
      JSON.stringify({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          trialEndDate: subscription.trial_end_date,
          nextBillingDate: subscription.next_billing_date,
          plan: 'guardian',
          monthlyPrice: 24.99,
        },
        message: 'Subscription created with 7-day free trial. You will be charged €24.99 on ' + 
                 new Date(trialEndDate).toLocaleDateString()
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in create-subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
