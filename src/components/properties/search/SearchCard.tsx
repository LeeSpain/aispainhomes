
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from './SearchBar';
import PropertyFilters from './PropertyFilters';
import PriceRangeSlider from './PriceRangeSlider';

interface SearchCardProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  handleSearch: () => void;
  handleClearFilters: () => void;
}

const SearchCard = ({
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  propertyType,
  setPropertyType,
  location,
  setLocation,
  bedrooms,
  setBedrooms,
  handleSearch,
  handleClearFilters
}: SearchCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <SearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              handleSearch={handleSearch} 
            />
          </div>
          
          <PropertyFilters
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            location={location}
            setLocation={setLocation}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            handleClearFilters={handleClearFilters}
          />
        </div>
        
        <PriceRangeSlider
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      </CardContent>
    </Card>
  );
};

export default SearchCard;
