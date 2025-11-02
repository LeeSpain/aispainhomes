import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Link } from 'react-router-dom';

interface PropertyMatchDetailsProps {
  matchScore?: number;
  matchReasons?: string[];
  propertyPrice: number;
  propertyLocation: string;
  propertyBedrooms: number;
  propertyType: string;
}

const PropertyMatchDetails = ({
  matchScore,
  matchReasons = [],
  propertyPrice,
  propertyLocation,
  propertyBedrooms,
  propertyType,
}: PropertyMatchDetailsProps) => {
  if (!matchScore || matchScore === 0) {
    return (
      <Card className="border-muted">
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm font-medium text-foreground mb-2">
                🎯 Get Personalized Match Analysis
              </p>
              <p className="text-muted-foreground text-sm">
                Complete our questionnaire to see how well this property matches your specific needs, 
                budget, and lifestyle preferences.
              </p>
            </div>
            <Button asChild>
              <Link to="/questionnaire">Complete Questionnaire</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayScore = Math.min(100, Math.round(matchScore));
  const scoreColor = displayScore >= 80 ? 'text-green-600' : displayScore >= 60 ? 'text-yellow-600' : 'text-orange-600';
  const progressColor = displayScore >= 80 ? 'bg-green-600' : displayScore >= 60 ? 'bg-yellow-600' : 'bg-orange-600';

  // Categorize reasons
  const criteriaMet = matchReasons.filter(r => 
    !r.includes('Almost') && 
    !r.includes('Slightly') && 
    !r.includes('Below')
  );
  const partialMatch = matchReasons.filter(r => 
    r.includes('Almost') || 
    r.includes('Slightly') ||
    r.includes('Below')
  );

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Match Analysis</span>
          <Badge variant="default" className={`text-lg px-4 py-1 ${scoreColor} bg-background`}>
            {displayScore}% Match
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Compatibility</span>
            <span className={`font-semibold ${scoreColor}`}>{displayScore}/100</span>
          </div>
          <div className="relative">
            <Progress value={displayScore} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all ${progressColor}`}
              style={{ width: `${displayScore}%` }}
            />
          </div>
        </div>

        {/* Criteria Met */}
        {criteriaMet.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Perfect Matches ({criteriaMet.length})
            </h4>
            <div className="space-y-2">
              {criteriaMet.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partial Matches */}
        {partialMatch.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-4 w-4" />
              Considerations ({partialMatch.length})
            </h4>
            <div className="space-y-2">
              {partialMatch.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <Circle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Property Details */}
        <div className="pt-4 border-t space-y-2">
          <h4 className="font-semibold text-sm text-muted-foreground">Property Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Price:</span>
              <span className="ml-2 font-medium">€{propertyPrice.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Location:</span>
              <span className="ml-2 font-medium">{propertyLocation}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Bedrooms:</span>
              <span className="ml-2 font-medium">{propertyBedrooms}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>
              <span className="ml-2 font-medium capitalize">{propertyType}</span>
            </div>
          </div>
        </div>

        {/* Match Quality Indicator */}
        <div className={`p-3 rounded-lg border ${
          displayScore >= 80 
            ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900' 
            : displayScore >= 60 
            ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900'
            : 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900'
        }`}>
          <p className="text-sm font-medium">
            {displayScore >= 80 && '✨ Excellent Match - Highly recommended based on your preferences'}
            {displayScore >= 60 && displayScore < 80 && '👍 Good Match - Aligns well with most of your criteria'}
            {displayScore < 60 && '💡 Worth Considering - May still meet your needs with some compromises'}
          </p>
        </div>

        {/* Additional Context */}
        <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground">
          <p>
            💡 <strong>About match scores:</strong> Our AI analyzes how properties align with your 
            questionnaire responses including budget, location preferences, household size, and amenities. 
            Lower scores don't mean bad properties—they might offer unique value not captured in your initial preferences.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyMatchDetails;
