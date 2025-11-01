import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

interface StripePaymentFormProps {
  personalDetails: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  onSuccess: () => void;
  onBack: () => void;
}

export default function StripePaymentForm({ personalDetails, onSuccess, onBack }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !user) {
      toast.error('Payment system not ready');
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: personalDetails.fullName,
          phone: personalDetails.phone,
          address: {
            line1: personalDetails.address,
            city: personalDetails.city,
            country: personalDetails.country,
            postal_code: personalDetails.postalCode,
          },
        },
      });

      if (pmError) {
        throw new Error(pmError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Call edge function to create subscription
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          paymentMethodId: paymentMethod.id,
          customerDetails: {
            email: user.email,
            name: personalDetails.fullName,
            phone: personalDetails.phone,
            address: personalDetails.address,
            city: personalDetails.city,
            country: personalDetails.country,
            postalCode: personalDetails.postalCode,
          },
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      toast.success(data.message || 'Subscription created successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'hsl(var(--foreground))',
        '::placeholder': {
          color: 'hsl(var(--muted-foreground))',
        },
      },
      invalid: {
        color: 'hsl(var(--destructive))',
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Enter your payment details to begin your 7-day free trial. You won't be charged until after your trial ends.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Card Information</Label>
            <div className="p-3 border rounded-md bg-background">
              <CardElement options={cardElementOptions} />
            </div>
            <button
              type="button"
              onClick={onSuccess}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Skip payment for testing (no Stripe setup)
            </button>
          </div>

          <div className="bg-primary/5 p-3 rounded-lg border text-sm">
            <p>
              <strong>Trial Terms:</strong> Your 7-day free trial starts today. Your card will be charged €24.99 
              after the trial period unless you cancel. Cancel anytime from your dashboard.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack} disabled={isProcessing}>
              Back
            </Button>
            <Button type="submit" disabled={!stripe || isProcessing}>
              {isProcessing ? 'Processing...' : 'Start Free Trial'}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
