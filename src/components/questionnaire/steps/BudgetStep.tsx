
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import QuestionnaireStep from '../QuestionnaireStep';

interface BudgetStepProps {
  purpose: string;
  priceRange: number[];
  bedrooms: number;
  bathrooms: number;
  minArea: number;
  onPriceRangeChange: (value: number[]) => void;
  onBedroomsChange: (value: number) => void;
  onBathroomsChange: (value: number) => void;
  onMinAreaChange: (value: number) => void;
}

const BudgetStep = ({
  purpose,
  priceRange,
  bedrooms,
  bathrooms,
  minArea,
  onPriceRangeChange,
  onBedroomsChange,
  onBathroomsChange,
  onMinAreaChange
}: BudgetStepProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <QuestionnaireStep
      title="What's your budget?"
      description={`Set your ${purpose === 'rent' ? 'monthly rental' : 'purchase'} budget range.`}
    >
      <div className="space-y-8 mt-8">
        <div>
          <div className="flex justify-between mb-4">
            <span>Price Range</span>
            <span>
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </span>
          </div>
          <Slider
            value={priceRange}
            min={purpose === 'rent' ? 500 : 50000}
            max={purpose === 'rent' ? 5000 : 1000000}
            step={purpose === 'rent' ? 100 : 10000}
            onValueChange={onPriceRangeChange}
            className="my-6"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select
              value={bedrooms.toString()}
              onValueChange={(value) => onBedroomsChange(parseInt(value))}
            >
              <SelectTrigger id="bedrooms" className="mt-2">
                <SelectValue placeholder="Select number of bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Studio</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4 Bedrooms</SelectItem>
                <SelectItem value="5">5+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Select
              value={bathrooms.toString()}
              onValueChange={(value) => onBathroomsChange(parseInt(value))}
            >
              <SelectTrigger id="bathrooms" className="mt-2">
                <SelectValue placeholder="Select number of bathrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Bathroom</SelectItem>
                <SelectItem value="2">2 Bathrooms</SelectItem>
                <SelectItem value="3">3 Bathrooms</SelectItem>
                <SelectItem value="4">4+ Bathrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="min-area">Minimum Area (m²)</Label>
          <div className="flex items-center mt-2">
            <Input
              id="min-area"
              type="number"
              min="20"
              max="1000"
              value={minArea}
              onChange={(e) => onMinAreaChange(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="ml-2">m²</span>
          </div>
        </div>
      </div>
    </QuestionnaireStep>
  );
};

export default BudgetStep;
