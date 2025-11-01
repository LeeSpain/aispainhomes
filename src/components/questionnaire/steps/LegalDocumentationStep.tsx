import QuestionnaireStep from '../QuestionnaireStep';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface LegalDocumentationStepProps {
  legalDocs: {
    hasNIE: boolean;
    needsVisa: boolean;
    hasSpanishBank: boolean;
    healthInsurance: string;
  };
  onLegalDocsChange: (field: string, value: any) => void;
}

const LegalDocumentationStep = ({ legalDocs, onLegalDocsChange }: LegalDocumentationStepProps) => {
  return (
    <QuestionnaireStep
      title="Legal & Documentation Status"
      description="Let us know what documentation you already have"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <Label>Do you have an NIE number?</Label>
            <p className="text-sm text-muted-foreground">Spanish foreigner identification number</p>
          </div>
          <Switch
            checked={legalDocs.hasNIE}
            onCheckedChange={(checked) => onLegalDocsChange('hasNIE', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <Label>Do you need visa assistance?</Label>
            <p className="text-sm text-muted-foreground">We can connect you with immigration experts</p>
          </div>
          <Switch
            checked={legalDocs.needsVisa}
            onCheckedChange={(checked) => onLegalDocsChange('needsVisa', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <Label>Do you have a Spanish bank account?</Label>
            <p className="text-sm text-muted-foreground">Required for most rental agreements</p>
          </div>
          <Switch
            checked={legalDocs.hasSpanishBank}
            onCheckedChange={(checked) => onLegalDocsChange('hasSpanishBank', checked)}
          />
        </div>

        <div>
          <Label>Health Insurance Status</Label>
          <Select value={legalDocs.healthInsurance} onValueChange={(value) => onLegalDocsChange('healthInsurance', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select your status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No coverage yet</SelectItem>
              <SelectItem value="european">European Health Insurance Card</SelectItem>
              <SelectItem value="private">Private insurance arranged</SelectItem>
              <SelectItem value="need-help">Need help arranging</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </QuestionnaireStep>
  );
};

export default LegalDocumentationStep;
