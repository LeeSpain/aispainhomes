
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import QuestionnaireStep from '../QuestionnaireStep';

interface EmploymentStepProps {
  employment: {
    status: string;
    profession: string;
    monthlyIncome: string;
    hasSpanishJobOffer: boolean;
  };
  onEmploymentChange: (field: string, value: any) => void;
}

const EmploymentStep = ({ employment, onEmploymentChange }: EmploymentStepProps) => {
  return (
    <QuestionnaireStep
      title="Employment & Income"
      description="Help us understand your work situation for your move to Spain."
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="employment">What best describes your employment situation?</Label>
          <Select 
            value={employment.status} 
            onValueChange={(val) => onEmploymentChange('status', val)}
          >
            <SelectTrigger id="employment" className="mt-2">
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote worker for non-Spanish company</SelectItem>
              <SelectItem value="transfer">Company transfer to Spain</SelectItem>
              <SelectItem value="local">Looking for work in Spain</SelectItem>
              <SelectItem value="business">Business owner/Self-employed</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="profession">Profession/Industry</Label>
          <Input
            id="profession"
            placeholder="e.g., Software Developer, Teacher, Marketing..."
            value={employment.profession}
            onChange={(e) => onEmploymentChange('profession', e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="income">Approximate monthly income (optional)</Label>
          <Select 
            value={employment.monthlyIncome}
            onValueChange={(val) => onEmploymentChange('monthlyIncome', val)}
          >
            <SelectTrigger id="income" className="mt-2">
              <SelectValue placeholder="Select income range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-specified">Prefer not to say</SelectItem>
              <SelectItem value="under-2000">Under €2,000</SelectItem>
              <SelectItem value="2000-4000">€2,000 - €4,000</SelectItem>
              <SelectItem value="4000-6000">€4,000 - €6,000</SelectItem>
              <SelectItem value="6000-10000">€6,000 - €10,000</SelectItem>
              <SelectItem value="over-10000">Over €10,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hasJobOffer" 
            checked={employment.hasSpanishJobOffer}
            onCheckedChange={(checked) => onEmploymentChange('hasSpanishJobOffer', checked)}
          />
          <Label htmlFor="hasJobOffer" className="cursor-pointer">
            I already have a job offer in Spain
          </Label>
        </div>
      </div>
    </QuestionnaireStep>
  );
};

export default EmploymentStep;
