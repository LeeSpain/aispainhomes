
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import QuestionnaireStep from '../QuestionnaireStep';

interface HouseholdDetailsStepProps {
  household: {
    adults: number;
    children: number;
    childrenAges: number[];
    pets: { type: string; count: number }[];
    specialNeeds: string;
  };
  onHouseholdChange: (field: string, value: any) => void;
}

const HouseholdDetailsStep = ({ household, onHouseholdChange }: HouseholdDetailsStepProps) => {
  return (
    <QuestionnaireStep
      title="Household Details"
      description="Tell us about who will be relocating with you to Spain."
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="adults">Number of adults</Label>
          <Select 
            value={household.adults.toString()} 
            onValueChange={(val) => onHouseholdChange('adults', parseInt(val))}
          >
            <SelectTrigger id="adults" className="mt-2">
              <SelectValue placeholder="Select number of adults" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="children">Number of children</Label>
          <Select 
            value={household.children.toString()} 
            onValueChange={(val) => onHouseholdChange('children', parseInt(val))}
          >
            <SelectTrigger id="children" className="mt-2">
              <SelectValue placeholder="Select number of children" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {household.children > 0 && (
          <div>
            <Label htmlFor="childrenAges">Children's ages (comma separated)</Label>
            <Input
              id="childrenAges"
              placeholder="e.g., 5, 8, 12"
              value={household.childrenAges.join(', ')}
              onChange={(e) => {
                const ages = e.target.value.split(',').map(a => parseInt(a.trim())).filter(a => !isNaN(a));
                onHouseholdChange('childrenAges', ages);
              }}
            />
          </div>
        )}

        <div>
          <Label htmlFor="pets">Do you have pets?</Label>
          <Select 
            value={household.pets.length > 0 ? household.pets[0].type : 'none'}
            onValueChange={(val) => {
              if (val === 'none') {
                onHouseholdChange('pets', []);
              } else {
                onHouseholdChange('pets', [{ type: val, count: 1 }]);
              }
            }}
          >
            <SelectTrigger id="pets" className="mt-2">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No pets</SelectItem>
              <SelectItem value="dog">Dog(s)</SelectItem>
              <SelectItem value="cat">Cat(s)</SelectItem>
              <SelectItem value="both">Both dogs and cats</SelectItem>
              <SelectItem value="other">Other pets</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="specialNeeds">Any special requirements or accessibility needs?</Label>
          <Textarea
            id="specialNeeds"
            placeholder="E.g., wheelchair accessible, medical equipment, dietary requirements..."
            value={household.specialNeeds}
            onChange={(e) => onHouseholdChange('specialNeeds', e.target.value)}
            className="mt-2"
            rows={3}
          />
        </div>
      </div>
    </QuestionnaireStep>
  );
};

export default HouseholdDetailsStep;
