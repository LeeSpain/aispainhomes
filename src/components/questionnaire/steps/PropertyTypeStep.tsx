
import { Checkbox } from '@/components/ui/checkbox';
import QuestionnaireStep from '../QuestionnaireStep';

interface PropertyTypeStepProps {
  propertyTypes: string[];
  selectedPropertyTypes: string[];
  onPropertyTypeToggle: (type: string) => void;
}

const PropertyTypeStep = ({
  propertyTypes,
  selectedPropertyTypes,
  onPropertyTypeToggle
}: PropertyTypeStepProps) => {
  return (
    <QuestionnaireStep
      title="What type of property are you looking for?"
      description="Select one or more property types you're interested in."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
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
