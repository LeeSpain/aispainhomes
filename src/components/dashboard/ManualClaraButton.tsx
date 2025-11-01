import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ManualClaraButtonProps {
  userId: string;
  onSuccess?: () => void;
}

const ManualClaraButton = ({ userId, onSuccess }: ManualClaraButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTriggerClara = async () => {
    setIsProcessing(true);
    
    try {
      toast.info('Clara is curating your recommendations...', {
        description: 'This may take 20-30 seconds',
      });

      const { data, error } = await supabase.functions.invoke('clara-curate-recommendations', {
        body: { userId }
      });

      if (error) {
        console.error('Clara error:', error);
        
        if (error.message?.includes('429')) {
          toast.error('Rate limit reached. Please wait a moment and try again.');
        } else if (error.message?.includes('402')) {
          toast.error('AI service temporarily unavailable. Please try again later.');
        } else {
          toast.error('Failed to generate recommendations. Please try again.');
        }
        return;
      }

      console.log('Clara response:', data);
      const propertiesCount = data?.propertiesCount || 0;
      const servicesCount = data?.servicesCount || 0;

      if (propertiesCount > 0 || servicesCount > 0) {
        toast.success(`Clara found ${propertiesCount} properties and ${servicesCount} services!`, {
          description: 'Refresh the page to see your personalized recommendations.',
        });
        
        // Wait a moment then refresh
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
        onSuccess?.();
      } else {
        toast.warning('Clara is still searching. Check back in a few minutes!');
      }
    } catch (error) {
      console.error('Exception triggering Clara:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handleTriggerClara}
      disabled={isProcessing}
      className="gap-2"
      variant="default"
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Clara is Working...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Get Clara Recommendations
        </>
      )}
    </Button>
  );
};

export default ManualClaraButton;