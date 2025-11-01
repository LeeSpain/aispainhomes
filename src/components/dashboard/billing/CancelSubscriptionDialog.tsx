import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  subscription: {
    trial_end_date: string | null;
    next_billing_date: string | null;
  };
}

export default function CancelSubscriptionDialog({
  open,
  onOpenChange,
  onSuccess,
  subscription
}: CancelSubscriptionDialogProps) {
  const [cancelling, setCancelling] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    setCancelling(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription');

      if (error) {
        throw error;
      }

      toast({
        title: 'Subscription Cancelled',
        description: data.details || 'Your subscription has been cancelled successfully'
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel subscription',
        variant: 'destructive'
      });
    } finally {
      setCancelling(false);
    }
  };

  const accessEndDate = subscription.trial_end_date 
    ? new Date(subscription.trial_end_date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : subscription.next_billing_date
      ? new Date(subscription.next_billing_date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : 'the end of your billing period';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to cancel your AI Guardian subscription?
            </p>
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">
                What happens next:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>You'll retain full access until {accessEndDate}</li>
                <li>No further charges will be made</li>
                <li>Your data will be preserved for 30 days</li>
                <li>You can reactivate anytime before access expires</li>
              </ul>
            </div>
            <p className="text-sm">
              We're sorry to see you go. If you have any feedback, please let us know how we can improve.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cancelling}>
            Keep Subscription
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={cancelling}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel Subscription
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
