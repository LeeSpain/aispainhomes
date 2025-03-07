
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QuestionnaireStep from '../QuestionnaireStep';

const HouseholdDetailsStep = () => {
  return (
    <QuestionnaireStep
      title="Your household details"
      description="Tell us about who will be relocating with you."
    >
      <div className="space-y-6 mt-6">
        <div>
          <Label htmlFor="adults">Number of adults</Label>
          <Select defaultValue="1">
            <SelectTrigger id="adults" className="mt-2">
              <SelectValue placeholder="Select number of adults" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, '6+'].map((num) => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="children">Number of children</Label>
          <Select defaultValue="0">
            <SelectTrigger id="children" className="mt-2">
              <SelectValue placeholder="Select number of children" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, '6+'].map((num) => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="pets">Do you have pets?</Label>
          <Select defaultValue="no">
            <SelectTrigger id="pets" className="mt-2">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No pets</SelectItem>
              <SelectItem value="dog">Dog(s)</SelectItem>
              <SelectItem value="cat">Cat(s)</SelectItem>
              <SelectItem value="both">Both dogs and cats</SelectItem>
              <SelectItem value="other">Other pets</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </QuestionnaireStep>
  );
};

export default HouseholdDetailsStep;
