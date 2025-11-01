import QuestionnaireStep from '../QuestionnaireStep';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface LifestylePreferencesStepProps {
  lifestyle: {
    climatePreference: string;
    areaType: string[];
    communityPreference: string;
    proximityPriorities: string[];
  };
  onLifestyleChange: (field: string, value: any) => void;
}

const areaTypes = [
  { id: 'city-center', label: 'City Center' },
  { id: 'suburbs', label: 'Suburbs' },
  { id: 'rural', label: 'Rural' },
  { id: 'coastal', label: 'Coastal' },
  { id: 'mountain', label: 'Mountain' }
];

const proximityOptions = [
  { id: 'schools', label: 'International Schools' },
  { id: 'healthcare', label: 'Healthcare Facilities' },
  { id: 'shopping', label: 'Shopping Centers' },
  { id: 'beach', label: 'Beach Access' },
  { id: 'transport', label: 'Public Transport' },
  { id: 'airport', label: 'Airport' }
];

const LifestylePreferencesStep = ({ lifestyle, onLifestyleChange }: LifestylePreferencesStepProps) => {
  const toggleAreaType = (areaId: string) => {
    const newAreaTypes = lifestyle.areaType.includes(areaId)
      ? lifestyle.areaType.filter(a => a !== areaId)
      : [...lifestyle.areaType, areaId];
    onLifestyleChange('areaType', newAreaTypes);
  };

  const toggleProximity = (proximityId: string) => {
    const newProximities = lifestyle.proximityPriorities.includes(proximityId)
      ? lifestyle.proximityPriorities.filter(p => p !== proximityId)
      : [...lifestyle.proximityPriorities, proximityId];
    onLifestyleChange('proximityPriorities', newProximities);
  };

  return (
    <QuestionnaireStep
      title="What's your ideal lifestyle in Spain?"
      description="Help us understand your lifestyle preferences"
    >
      <div className="space-y-6">
        <div>
          <Label>Climate Preference</Label>
          <Select value={lifestyle.climatePreference} onValueChange={(value) => onLifestyleChange('climatePreference', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select climate preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="warm">Warm (Mediterranean coast)</SelectItem>
              <SelectItem value="moderate">Moderate (Central Spain)</SelectItem>
              <SelectItem value="cooler">Cooler (Northern regions)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Preferred Area Type (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {areaTypes.map((area) => (
              <div key={area.id} className="flex items-center space-x-2 p-3 rounded-lg border">
                <Checkbox
                  id={area.id}
                  checked={lifestyle.areaType.includes(area.id)}
                  onCheckedChange={() => toggleAreaType(area.id)}
                />
                <Label htmlFor={area.id} className="cursor-pointer">{area.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Community Preference</Label>
          <Select value={lifestyle.communityPreference} onValueChange={(value) => onLifestyleChange('communityPreference', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select community type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="international">International expat community</SelectItem>
              <SelectItem value="local">Local Spanish community</SelectItem>
              <SelectItem value="mixed">Mixed community</SelectItem>
              <SelectItem value="no-preference">No preference</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Proximity Priorities (select all important to you)</Label>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {proximityOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border">
                <Checkbox
                  id={option.id}
                  checked={lifestyle.proximityPriorities.includes(option.id)}
                  onCheckedChange={() => toggleProximity(option.id)}
                />
                <Label htmlFor={option.id} className="cursor-pointer">{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </QuestionnaireStep>
  );
};

export default LifestylePreferencesStep;
