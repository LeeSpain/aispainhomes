import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Search, Building, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

interface ManualClaraButtonProps {
  userId: string;
  onSuccess?: () => void;
}

const ManualClaraButton = ({ userId, onSuccess }: ManualClaraButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');

  const handleTriggerClara = async () => {
    setIsProcessing(true);
    setProgress('Initializing Clara AI...');
    
    try {
      // Show initial progress
      const progressToast = toast.info('🤖 Clara is working...', {
        description: 'Searching property websites and local services',
        duration: Infinity,
      });

      // Simulate progress updates
      const progressSteps = [
        { text: '🔍 Searching Idealista.com...', delay: 2000 },
        { text: '🏘️ Searching Fotocasa.es...', delay: 4000 },
        { text: '🌍 Searching Kyero.com...', delay: 6000 },
        { text: '📍 Finding local services...', delay: 8000 },
        { text: '🎯 Analyzing best matches...', delay: 10000 },
      ];

      progressSteps.forEach(({ text, delay }) => {
        setTimeout(() => {
          if (isProcessing) {
            setProgress(text);
            toast.info(text, { duration: 2000 });
          }
        }, delay);
      });

      const { data, error } = await supabase.functions.invoke('clara-curate-recommendations', {
        body: { userId }
      });

      // Dismiss progress toast
      toast.dismiss(progressToast);

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
        toast.success(`✨ Clara found ${propertiesCount} properties and ${servicesCount} services!`, {
          description: 'From live search across Spanish property websites',
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
      setProgress('');
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/20 rounded-full p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Clara AI Live Search</h3>
              <p className="text-sm text-muted-foreground">
                Clara will search real Spanish property websites (Idealista, Fotocasa, Kyero) and find local services in your target area.
              </p>
            </div>
          </div>

          {isProcessing && progress && (
            <div className="bg-background/50 rounded-lg p-3 border border-primary/20">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="font-medium">{progress}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-background/50 rounded-lg p-3">
              <Search className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Live Search</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <Building className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Real Properties</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Local Services</p>
            </div>
          </div>

          <Button 
            onClick={handleTriggerClara}
            disabled={isProcessing}
            className="w-full gap-2"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Clara is Searching...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Start Clara Live Search
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            This will take 15-30 seconds as Clara searches multiple websites
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ManualClaraButton;