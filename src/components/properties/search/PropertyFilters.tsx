
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
    <>
      <div className="md:col-span-2">
        <Select
          value={propertyType}
          onValueChange={setPropertyType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Type</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:col-span-2">
        <Select
          value={location}
          onValueChange={setLocation}
        >
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Location</SelectItem>
            <SelectItem value="costa-del-sol">Costa del Sol</SelectItem>
            <SelectItem value="costa-blanca">Costa Blanca</SelectItem>
            <SelectItem value="barcelona">Barcelona</SelectItem>
            <SelectItem value="madrid">Madrid</SelectItem>
            <SelectItem value="valencia">Valencia</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:col-span-2">
        <Select
          value={bedrooms}
          onValueChange={setBedrooms}
        >
          <SelectTrigger>
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Bedrooms</SelectItem>
            <SelectItem value="1">1+ Bedroom</SelectItem>
            <SelectItem value="2">2+ Bedrooms</SelectItem>
            <SelectItem value="3">3+ Bedrooms</SelectItem>
            <SelectItem value="4">4+ Bedrooms</SelectItem>
            <SelectItem value="5">5+ Bedrooms</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:col-span-1">
        <Button 
          variant="outline" 
          onClick={handleClearFilters}
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>
    </>
  );
};

export default PropertyFilters;
