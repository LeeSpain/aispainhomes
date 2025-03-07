
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import QuestionnaireStep from '../QuestionnaireStep';

interface LocationStepProps {
  cities: string[];
  selectedLocation: string;
  onLocationChange: (value: string) => void;
}

const LocationStep = ({ cities, selectedLocation, onLocationChange }: LocationStepProps) => {
  return (
    <QuestionnaireStep
      title="Where would you like to live?"
      description="Select a location in Spain where you want to find a property."
    >
      <div className="space-y-6 mt-6">
        <div>
          <Label htmlFor="location">Location</Label>
          <Select
            value={selectedLocation}
            onValueChange={onLocationChange}
          >
            <SelectTrigger id="location" className="mt-2">
              <SelectValue placeholder="Select a city or region" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Or search for a specific area</Label>
          <div className="flex mt-2">
            <Input 
              placeholder="Search for a city, neighborhood, or area"
              className="flex-1"
            />
            <Button type="button" className="ml-2">Search</Button>
          </div>
        </div>
      </div>
    </QuestionnaireStep>
  );
};

export default LocationStep;
