
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import QuestionnaireStep from '../QuestionnaireStep';

const RelocationPlansStep = () => {
  return (
    <QuestionnaireStep
      title="Tell us about your relocation plans"
      description="Help us understand your timeframe and specific needs."
    >
      <div className="space-y-6 mt-6">
        <div>
          <Label htmlFor="timeline">When are you planning to move?</Label>
          <Select
            onValueChange={(value) => console.log(value)}
            defaultValue="3-6months"
          >
            <SelectTrigger id="timeline" className="mt-2">
              <SelectValue placeholder="Select your timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediately">Within 1 month</SelectItem>
              <SelectItem value="1-3months">1-3 months</SelectItem>
              <SelectItem value="3-6months">3-6 months</SelectItem>
              <SelectItem value="6-12months">6-12 months</SelectItem>
              <SelectItem value="future">Just exploring options</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>What aspects of relocation are you most concerned about?</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {['Visas & Residency', 'Healthcare', 'Schools & Education', 
              'Language Barriers', 'Banking & Finances', 'Finding Work', 
              'Cultural Integration', 'Legal Requirements'].map((concern) => (
              <div key={concern} className="flex items-start space-x-2">
                <Checkbox id={concern.replace(/\s+/g, '-').toLowerCase()} />
                <Label htmlFor={concern.replace(/\s+/g, '-').toLowerCase()} className="cursor-pointer">
                  {concern}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </QuestionnaireStep>
  );
};

export default RelocationPlansStep;
