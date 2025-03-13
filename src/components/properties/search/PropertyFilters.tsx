
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertyFiltersProps {
  propertyType: string;
  setPropertyType: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  handleClearFilters: () => void;
}

const PropertyFilters = ({ 
  propertyType, 
  setPropertyType, 
  location, 
  setLocation, 
  bedrooms, 
  setBedrooms,
  handleClearFilters 
}: PropertyFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="md:col-span-2">
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Type</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="penthouse">Penthouse</SelectItem>
            <SelectItem value="townhouse">Townhouse</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:col-span-2">
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Location</SelectItem>
            <SelectItem value="madrid">Madrid</SelectItem>
            <SelectItem value="barcelona">Barcelona</SelectItem>
            <SelectItem value="valencia">Valencia</SelectItem>
            <SelectItem value="malaga">Malaga</SelectItem>
            <SelectItem value="alicante">Alicante</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:col-span-2">
        <Select value={bedrooms} onValueChange={setBedrooms}>
          <SelectTrigger>
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:col-span-1">
        <Button variant="outline" onClick={handleClearFilters} className="w-full">
          Clear
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
