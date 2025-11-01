import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PropertyPreferencesSectionProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

const PropertyPreferencesSection = ({ data }: PropertyPreferencesSectionProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Property Preferences</h3>

      <div className="space-y-6">
        {data.property_types && data.property_types.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Property Types</p>
            <div className="flex flex-wrap gap-2">
              {data.property_types.map((type: string) => (
                <Badge key={type} variant="secondary">{type}</Badge>
              ))}
            </div>
          </div>
        )}

        {data.location_preferences && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Preferred Locations</p>
            <p>{JSON.stringify(data.location_preferences)}</p>
          </div>
        )}

        {data.budget_range && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Budget Range</p>
            <p>{JSON.stringify(data.budget_range)}</p>
          </div>
        )}

        {data.amenities_required && data.amenities_required.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Required Amenities</p>
            <div className="flex flex-wrap gap-2">
              {data.amenities_required.map((amenity: string) => (
                <Badge key={amenity} variant="outline">{amenity}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PropertyPreferencesSection;
