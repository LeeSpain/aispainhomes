
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Home, ShieldCheck } from 'lucide-react';
import QuestionnaireStep from '../QuestionnaireStep';

interface ServiceSelectionStepProps {
  selectedService: string;
  selectedPurpose: string;
  onServiceChange: (value: string) => void;
  onPurposeChange: (value: string) => void;
}

const ServiceSelectionStep = ({
  selectedService,
  selectedPurpose,
  onServiceChange,
  onPurposeChange
}: ServiceSelectionStepProps) => {
  return (
    <QuestionnaireStep
      title="What service are you looking for?"
      description="Choose what kind of assistance you need for your Spanish relocation journey."
    >
      <RadioGroup
        value={selectedService}
        onValueChange={onServiceChange}
        className="grid grid-cols-1 gap-4 mt-6 mb-8"
      >
        <div className="flex items-start space-x-3 p-4 rounded-lg border border-primary/20 hover:border-primary/50 transition-all">
          <RadioGroupItem value="property" id="property" className="mt-1" />
          <div>
            <Label htmlFor="property" className="cursor-pointer text-lg font-medium flex items-center">
              <Home className="w-5 h-5 mr-2 text-primary" />
              Property Search
            </Label>
            <p className="text-muted-foreground mt-1">
              Find your ideal home in Spain with our AI-powered property matching.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-4 rounded-lg border border-primary/20 hover:border-primary/50 transition-all">
          <RadioGroupItem value="guardian" id="guardian" className="mt-1" />
          <div>
            <Label htmlFor="guardian" className="cursor-pointer text-lg font-medium flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-primary" />
              AI Guardian
            </Label>
            <p className="text-muted-foreground mt-1">
              Get personalized guidance through every step of your relocation journey, from legal requirements to lifestyle integration.
            </p>
          </div>
        </div>
      </RadioGroup>
      
      {selectedService === 'property' && (
        <div className="mt-6">
          <p className="text-lg font-medium mb-4">What are you looking to do?</p>
          <RadioGroup
            value={selectedPurpose}
            onValueChange={onPurposeChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buy" id="buy" />
              <Label htmlFor="buy" className="cursor-pointer">Buy a property</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rent" id="rent" />
              <Label htmlFor="rent" className="cursor-pointer">Rent a property</Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </QuestionnaireStep>
  );
};

export default ServiceSelectionStep;
