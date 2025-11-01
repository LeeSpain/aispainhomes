
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import QuestionnaireStep from '../QuestionnaireStep';

interface PropertyTypeStepProps {
  propertyTypes: string[];
  selectedPropertyTypes: string[];
  selectedPurpose: 'buy' | 'rent' | 'both';
  onPropertyTypeToggle: (type: string) => void;
  onPurposeChange: (value: 'buy' | 'rent' | 'both') => void;
}

const PropertyTypeStep = ({
  propertyTypes,
  selectedPropertyTypes,
  selectedPurpose,
  onPropertyTypeToggle,
  onPurposeChange
}: PropertyTypeStepProps) => {
  return (
    <QuestionnaireStep
      title="Property Preferences"
      description="Tell us about your ideal property in Spain."
    >
      <div className="mb-8">
        <p className="text-lg font-medium mb-4">Are you looking to buy, rent, or both?</p>
        <RadioGroup
          value={selectedPurpose}
          onValueChange={onPurposeChange}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-primary/50 transition-all">
            <RadioGroupItem value="buy" id="buy" />
            <Label htmlFor="buy" className="cursor-pointer font-medium">Buy a property</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-primary/50 transition-all">
            <RadioGroupItem value="rent" id="rent" />
            <Label htmlFor="rent" className="cursor-pointer font-medium">Rent a property</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-primary/50 transition-all">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both" className="cursor-pointer font-medium">Exploring both options</Label>
          </div>
        </RadioGroup>
      </div>
      
      <p className="text-lg font-medium mb-4">What type of property interests you?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {propertyTypes.map((type) => (
          <div
            key={type}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedPropertyTypes.includes(type)
                ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
            onClick={() => onPropertyTypeToggle(type)}
          >
            <div className="text-center flex items-center justify-center gap-2">
              <Checkbox 
                checked={selectedPropertyTypes.includes(type)}
                className="data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
              />
              <div className="font-medium">{type}</div>
            </div>
          </div>
        ))}
      </div>
    </QuestionnaireStep>
  );
};

export default PropertyTypeStep;
