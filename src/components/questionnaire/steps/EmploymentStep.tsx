
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QuestionnaireStep from '../QuestionnaireStep';

const EmploymentStep = () => {
  return (
    <QuestionnaireStep
      title="Employment & Income"
      description="Tell us about your work situation for your move to Spain."
    >
      <div className="space-y-6 mt-6">
        <div>
          <Label htmlFor="employment">What best describes your employment situation?</Label>
          <Select defaultValue="remote">
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
          <Label htmlFor="language">Do you speak Spanish?</Label>
          <Select defaultValue="basic">
            <SelectTrigger id="language" className="mt-2">
              <SelectValue placeholder="Select your Spanish level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="basic">Basic phrases</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="fluent">Fluent</SelectItem>
              <SelectItem value="native">Native speaker</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </QuestionnaireStep>
  );
};

export default EmploymentStep;
