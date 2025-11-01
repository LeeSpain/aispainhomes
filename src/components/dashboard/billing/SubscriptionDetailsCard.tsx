import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Calendar, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import CancelSubscriptionDialog from './CancelSubscriptionDialog';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  monthly_price: number;
  start_date: string;
  trial_end_date: string | null;
  next_billing_date: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  stripe_payment_method_id: string | null;
}

export default function SubscriptionDetailsCard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trial', 'cancelled'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading subscription:', error);
      } else if (data) {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) {
      return <Badge variant="secondary">Cancelling</Badge>;
    }
    
    switch (status) {
      case 'trial':
        return <Badge variant="default">Free Trial</Badge>;
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: string | null) => {
    if (!endDate) return null;
    const days = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don't have an active subscription yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = '/subscription'}>
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  const trialDaysRemaining = subscription.trial_end_date ? getDaysRemaining(subscription.trial_end_date) : null;
  const isInTrial = subscription.status === 'trial';

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Guardian Plan
                {getStatusBadge(subscription.status, subscription.cancel_at_period_end)}
              </CardTitle>
              <CardDescription>
                €{subscription.monthly_price.toFixed(2)}/month
              </CardDescription>
            </div>
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trial Status Alert */}
          {isInTrial && trialDaysRemaining !== null && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Free Trial Active</strong><br />
                {trialDaysRemaining > 0 ? (
                  <>
                    {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} remaining. 
                    You'll be charged €{subscription.monthly_price.toFixed(2)} on {formatDate(subscription.trial_end_date)}
                  </>
                ) : (
                  <>Your trial ends today. Billing will begin tomorrow.</>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Cancellation Notice */}
          {subscription.cancel_at_period_end && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Subscription Cancelled</strong><br />
                You will retain access until {formatDate(subscription.next_billing_date || subscription.trial_end_date)}
              </AlertDescription>
            </Alert>
          )}

          {/* Subscription Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Started</span>
              </div>
              <span className="text-sm font-medium">{formatDate(subscription.start_date)}</span>
            </div>

            {isInTrial && subscription.trial_end_date && (
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Trial Ends</span>
                </div>
                <span className="text-sm font-medium">{formatDate(subscription.trial_end_date)}</span>
              </div>
            )}

            {!subscription.cancel_at_period_end && subscription.next_billing_date && (
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Next Billing</span>
                </div>
                <span className="text-sm font-medium">{formatDate(subscription.next_billing_date)}</span>
              </div>
            )}

            {subscription.stripe_payment_method_id && (
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Payment Method</span>
                </div>
                <span className="text-sm font-medium">Card ending in ••••</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {!subscription.cancel_at_period_end && (
            <div className="flex gap-2 pt-4">
              <Button
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
                className="w-full"
              >
                Cancel Subscription
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CancelSubscriptionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onSuccess={loadSubscription}
        subscription={subscription}
      />
    </>
  );
}
