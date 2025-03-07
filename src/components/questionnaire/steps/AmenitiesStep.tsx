
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import QuestionnaireStep from '../QuestionnaireStep';

interface AmenitiesStepProps {
  amenities: string[];
  selectedAmenities: string[];
  onAmenityToggle: (amenity: string) => void;
}

const AmenitiesStep = ({ 
  amenities, 
  selectedAmenities, 
  onAmenityToggle 
}: AmenitiesStepProps) => {
  return (
    <QuestionnaireStep
      title="What amenities are important to you?"
      description="Select the features and amenities you'd like in your property."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {amenities.map((amenity) => (
          <div key={amenity} className="flex items-start space-x-2">
            <Checkbox
              id={amenity.replace(/\s+/g, '-').toLowerCase()}
              checked={selectedAmenities.includes(amenity)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onAmenityToggle(amenity);
                } else {
                  onAmenityToggle(amenity);
                }
              }}
            />
            <Label
              htmlFor={amenity.replace(/\s+/g, '-').toLowerCase()}
              className="cursor-pointer"
            >
              {amenity}
            </Label>
          </div>
        ))}
      </div>
    </QuestionnaireStep>
  );
};

export default AmenitiesStep;
