import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
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

    // TODO: Once Stripe is configured, verify webhook signature
    // const signature = req.headers.get('stripe-signature');
    // const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    // const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    const event = await req.json();
    
    console.log('Received webhook event:', event.type);

    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log('Payment succeeded for invoice:', invoice.id);

        // Find subscription by stripe_subscription_id
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', invoice.subscription)
          .single();

        if (subscription) {
          // Insert payment record
          await supabase.from('payment_history').insert({
            user_id: subscription.user_id,
            subscription_id: subscription.id,
            stripe_invoice_id: invoice.id,
            stripe_payment_intent_id: invoice.payment_intent,
            amount: invoice.amount_paid / 100, // Convert from cents
            currency: invoice.currency.toUpperCase(),
            status: 'paid',
            invoice_pdf: invoice.invoice_pdf,
            description: invoice.description || 'Monthly subscription payment',
            payment_date: new Date(invoice.created * 1000).toISOString(),
          });

          // Update subscription status to active if it was trial
          if (subscription.status === 'trial') {
            await supabase
              .from('subscriptions')
              .update({ 
                status: 'active',
                updated_at: new Date().toISOString()
              })
              .eq('id', subscription.id);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('Payment failed for invoice:', invoice.id);

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', invoice.subscription)
          .single();

        if (subscription) {
          // Insert failed payment record
          await supabase.from('payment_history').insert({
            user_id: subscription.user_id,
            subscription_id: subscription.id,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_due / 100,
            currency: invoice.currency.toUpperCase(),
            status: 'failed',
            description: 'Payment attempt failed',
            payment_date: new Date().toISOString(),
          });

          // Create alert for user
          await supabase.from('user_alerts').insert({
            user_id: subscription.user_id,
            alert_type: 'payment_failed',
            title: 'Payment Failed',
            description: 'Your subscription payment failed. Please update your payment method.',
            metadata: { invoice_id: invoice.id }
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const stripeSubscription = event.data.object;
        console.log('Subscription updated:', stripeSubscription.id);

        await supabase
          .from('subscriptions')
          .update({
            status: stripeSubscription.status === 'active' ? 'active' : 'inactive',
            cancel_at_period_end: stripeSubscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', stripeSubscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const stripeSubscription = event.data.object;
        console.log('Subscription deleted:', stripeSubscription.id);

        await supabase
          .from('subscriptions')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', stripeSubscription.id);
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const stripeSubscription = event.data.object;
        console.log('Trial ending soon:', stripeSubscription.id);

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', stripeSubscription.id)
          .single();

        if (subscription) {
          // Create reminder alert
          await supabase.from('user_alerts').insert({
            user_id: subscription.user_id,
            alert_type: 'trial_ending',
            title: 'Trial Ending Soon',
            description: 'Your 7-day free trial is ending in 2 days. Your card will be charged €24.99.',
            metadata: { subscription_id: stripeSubscription.id }
          });
        }
        break;
      }

      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in stripe-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
