import QuestionnaireStep from '../QuestionnaireStep';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PersonalInfoStepProps {
  personalInfo: {
    fullName: string;
    currentCountry: string;
    nationality: string;
    phone: string;
    preferredLanguage: string;
  };
  onPersonalInfoChange: (field: string, value: string) => void;
}

const PersonalInfoStep = ({ personalInfo, onPersonalInfoChange }: PersonalInfoStepProps) => {
  return (
    <QuestionnaireStep
      title="Let's start with some basic information"
      description="This helps us personalize your relocation experience"
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={personalInfo.fullName}
            onChange={(e) => onPersonalInfoChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="currentCountry">Current Country of Residence *</Label>
          <Input
            id="currentCountry"
            value={personalInfo.currentCountry}
            onChange={(e) => onPersonalInfoChange('currentCountry', e.target.value)}
            placeholder="e.g., United Kingdom"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="nationality">Nationality *</Label>
          <Input
            id="nationality"
            value={personalInfo.nationality}
            onChange={(e) => onPersonalInfoChange('nationality', e.target.value)}
            placeholder="e.g., British"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="phone">Contact Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => onPersonalInfoChange('phone', e.target.value)}
            placeholder="+44 1234 567890"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="preferredLanguage">Preferred Language</Label>
          <Select value={personalInfo.preferredLanguage} onValueChange={(value) => onPersonalInfoChange('preferredLanguage', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="it">Italiano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </QuestionnaireStep>
  );
};

export default PersonalInfoStep;
