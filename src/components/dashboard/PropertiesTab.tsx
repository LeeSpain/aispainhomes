import { useState } from 'react';
import PropertyGrid from "@/components/properties/PropertyGrid";
import { Property } from "@/components/properties/PropertyCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Home as HomeIcon, DollarSign, FileQuestion, RefreshCw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ManualClaraButton from "./ManualClaraButton";
import { useAuth } from "@/contexts/auth/useAuth";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PropertiesTabProps {
  properties: Property[];
  isLoading: boolean;
  matchScores?: Map<string, number>;
  matchReasons?: Map<string, string[]>;
  questionnaireData?: any;
  hasCompletedQuestionnaire?: boolean;
}

const PropertiesTab = ({ 
  properties, 
  isLoading, 
  matchScores, 
  matchReasons,
  questionnaireData,
  hasCompletedQuestionnaire = false
}: PropertiesTabProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshMatches = async () => {
    if (!user?.id) {
      toast.error('Please log in to refresh matches');
      return;
    }

    if (!hasCompletedQuestionnaire) {
      toast.warning('Please complete the questionnaire first');
      navigate('/questionnaire');
      return;
    }

    setIsRefreshing(true);
    
    try {
      const progressToast = toast.info('🤖 Clara is searching...', {
        description: 'Searching property websites and local services',
        duration: Infinity,
      });

      const { data, error } = await supabase.functions.invoke('clara-curate-recommendations', {
        body: { userId: user.id }
      });

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

      const propertiesCount = data?.propertiesCount || 0;
      const servicesCount = data?.servicesCount || 0;

      if (propertiesCount > 0 || servicesCount > 0) {
        toast.success(`✨ Clara found ${propertiesCount} properties and ${servicesCount} services!`, {
          description: 'Refreshing your dashboard...',
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.warning('No new matches found. Check back later!');
      }
    } catch (error) {
      console.error('Exception triggering Clara:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Show user's key preferences if available
  const showPreferences = questionnaireData && (
    questionnaireData.budget_range || 
    questionnaireData.location_preferences?.length > 0 ||
    questionnaireData.property_types?.length > 0
  );

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Your Property Matches</h2>
          {properties.length > 0 && matchScores && matchScores.size > 0 && (
            <p className="text-sm text-muted-foreground">
              Showing {properties.length} properties personalized for your preferences
            </p>
          )}
          {!hasCompletedQuestionnaire && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Complete the questionnaire to get personalized match scores
            </p>
          )}
        </div>
        {hasCompletedQuestionnaire && (
          <Button 
            onClick={handleRefreshMatches}
            disabled={isRefreshing || isLoading}
            variant="outline"
            size="sm"
            className="gap-2 shrink-0"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Refresh Matches
              </>
            )}
          </Button>
        )}
      </div>

      {/* Questionnaire Prompt */}
      {!hasCompletedQuestionnaire && (
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FileQuestion className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Get Personalized Property Recommendations</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete our quick questionnaire to receive AI-powered property matches tailored to your specific needs, budget, and lifestyle preferences.
                </p>
                <Button onClick={() => navigate('/questionnaire')} size="sm">
                  Complete Questionnaire
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Preferences Summary */}
      {showPreferences && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold mb-3 text-primary">Your Search Criteria</h3>
            <div className="flex flex-wrap gap-2">
              {questionnaireData.budget_range && (
                <Badge variant="secondary" className="gap-1">
                  <DollarSign className="h-3 w-3" />
                  €{questionnaireData.budget_range.min?.toLocaleString()} - 
                  €{questionnaireData.budget_range.max?.toLocaleString()}
                </Badge>
              )}
              {questionnaireData.location_preferences?.map((loc: string) => (
                <Badge key={loc} variant="secondary" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {loc}
                </Badge>
              ))}
              {questionnaireData.property_types?.map((type: string) => (
                <Badge key={type} variant="secondary" className="gap-1">
                  <HomeIcon className="h-3 w-3" />
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Grid with Match Scores */}
      <div className="space-y-4">
        {!isLoading && properties.length === 0 && (
          <Card className="p-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <HomeIcon className="h-8 w-8 text-primary" />
            </div>
            {hasCompletedQuestionnaire ? (
              <>
                <h3 className="text-lg font-semibold">No Properties Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Clara needs to curate your personalized property recommendations. Click the button below to start the search.
                </p>
                {user && <ManualClaraButton userId={user.id} />}
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">Get Personalized Property Matches</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Complete the questionnaire to receive AI-curated property recommendations tailored to your needs.
                </p>
                <Button onClick={() => navigate('/questionnaire')} className="mt-4">
                  Start Questionnaire
                </Button>
              </>
            )}
          </Card>
        )}
        <PropertyGrid 
          properties={properties} 
          isLoading={isLoading}
          matchScores={matchScores}
          matchReasons={matchReasons}
        />
      </div>
    </div>
  );
};

export default PropertiesTab;
