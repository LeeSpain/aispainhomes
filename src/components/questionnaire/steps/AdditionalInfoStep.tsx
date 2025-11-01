import QuestionnaireStep from '../QuestionnaireStep';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdditionalInfoStepProps {
  additionalInfo: {
    referralSource: string;
    specialRequests: string;
    relocationBudget: string;
  };
  onAdditionalInfoChange: (field: string, value: string) => void;
}

const AdditionalInfoStep = ({ additionalInfo, onAdditionalInfoChange }: AdditionalInfoStepProps) => {
  return (
    <QuestionnaireStep
      title="Just a few more details"
      description="Help us serve you better with some final information"
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="referralSource">How did you hear about us?</Label>
          <Select value={additionalInfo.referralSource} onValueChange={(value) => onAdditionalInfoChange('referralSource', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google Search</SelectItem>
              <SelectItem value="social-media">Social Media</SelectItem>
              <SelectItem value="friend">Friend or Family</SelectItem>
              <SelectItem value="real-estate">Real Estate Agent</SelectItem>
              <SelectItem value="expat-forum">Expat Forum</SelectItem>
              <SelectItem value="advertisement">Advertisement</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="relocationBudget">Estimated Budget for Relocation Services</Label>
          <Select value={additionalInfo.relocationBudget} onValueChange={(value) => onAdditionalInfoChange('relocationBudget', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-1k">Under €1,000</SelectItem>
              <SelectItem value="1k-3k">€1,000 - €3,000</SelectItem>
              <SelectItem value="3k-5k">€3,000 - €5,000</SelectItem>
              <SelectItem value="5k-10k">€5,000 - €10,000</SelectItem>
              <SelectItem value="10k+">€10,000+</SelectItem>
              <SelectItem value="flexible">Flexible / Not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="specialRequests">Any special requests or concerns?</Label>
          <Textarea
            id="specialRequests"
            value={additionalInfo.specialRequests}
            onChange={(e) => onAdditionalInfoChange('specialRequests', e.target.value)}
            placeholder="Tell us anything else that might help us assist you better..."
            className="mt-2 min-h-[120px]"
          />
        </div>
      </div>
    </QuestionnaireStep>
  );
};

export default AdditionalInfoStep;
