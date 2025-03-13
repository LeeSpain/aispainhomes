
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
    <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="propertyType">Property Type</Label>
        <Select value={propertyType || "any"} onValueChange={setPropertyType}>
          <SelectTrigger id="propertyType">
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any type</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="townhouse">Townhouse</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Select value={location || "any"} onValueChange={setLocation}>
          <SelectTrigger id="location">
            <SelectValue placeholder="Any location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any location</SelectItem>
            <SelectItem value="costa-del-sol">Costa del Sol</SelectItem>
            <SelectItem value="costa-blanca">Costa Blanca</SelectItem>
            <SelectItem value="barcelona">Barcelona</SelectItem>
            <SelectItem value="madrid">Madrid</SelectItem>
            <SelectItem value="valencia">Valencia</SelectItem>
            <SelectItem value="mallorca">Mallorca</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <Select value={bedrooms || "any"} onValueChange={setBedrooms}>
          <SelectTrigger id="bedrooms">
            <SelectValue placeholder="Any number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any number</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PropertyFilters;
