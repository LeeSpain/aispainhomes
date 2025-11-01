import PropertyGrid from "@/components/properties/PropertyGrid";
import { Property } from "@/components/properties/PropertyCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home as HomeIcon, DollarSign } from "lucide-react";

interface PropertiesTabProps {
  properties: Property[];
  isLoading: boolean;
  matchScores?: Map<string, number>;
  matchReasons?: Map<string, string[]>;
  questionnaireData?: any;
}

const PropertiesTab = ({ 
  properties, 
  isLoading, 
  matchScores, 
  matchReasons,
  questionnaireData 
}: PropertiesTabProps) => {
  
  // Show user's key preferences if available
  const showPreferences = questionnaireData && (
    questionnaireData.budget_range || 
    questionnaireData.location_preferences?.length > 0 ||
    questionnaireData.property_types?.length > 0
  );

  return (
    <div className="mt-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Your Property Matches</h2>
        {properties.length > 0 && matchScores && matchScores.size > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing {properties.length} properties personalized for your preferences
          </p>
        )}
      </div>

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
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No properties match your criteria yet. Complete your profile to get personalized recommendations.
            </p>
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
