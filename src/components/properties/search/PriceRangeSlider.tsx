
import { Slider } from "@/components/ui/slider";

interface PriceRangeSliderProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
}

const PriceRangeSlider = ({ priceRange, setPriceRange }: PriceRangeSliderProps) => {
  const formatPrice = (value: number) => {
    return `€${value.toLocaleString()}`;
  };

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium mb-2">
        Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
      </label>
      <Slider
        defaultValue={[0, 1000000]}
        min={0}
        max={2000000}
        step={50000}
        value={priceRange}
        onValueChange={setPriceRange}
        className="py-4"
      />
    </div>
  );
};

export default PriceRangeSlider;
