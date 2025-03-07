
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { SlidersHorizontal, X, Search } from 'lucide-react';

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  propertyType?: string;
  location?: string;
  isForRent?: boolean;
  sortBy?: string;
}

interface PropertySearchFiltersProps {
  filters: PropertyFilters;
  onFilterChange: (filters: PropertyFilters) => void;
  onSearch: () => void;
  locations: string[];
  propertyTypes: string[];
}

const PropertySearchFilters = ({
  filters,
  onFilterChange,
  onSearch,
  locations,
  propertyTypes
}: PropertySearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters);
  
  const updateLocalFilter = (key: keyof PropertyFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    onSearch();
  };
  
  const handleClearFilters = () => {
    const clearedFilters: PropertyFilters = {
      sortBy: localFilters.sortBy,
      isForRent: localFilters.isForRent
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
    onSearch();
  };
  
  const priceRangeText = () => {
    const min = localFilters.minPrice ? `€${localFilters.minPrice.toLocaleString()}` : 'Min';
    const max = localFilters.maxPrice ? `€${localFilters.maxPrice.toLocaleString()}` : 'Max';
    return `${min} - ${max}`;
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={localFilters.isForRent ? 'rent' : 'sale'}
              onValueChange={(v) => updateLocalFilter('isForRent', v === 'rent')}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Property for" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={localFilters.location || ''}
              onValueChange={(v) => updateLocalFilter('location', v)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Location</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {isExpanded ? 'Less Filters' : 'More Filters'}
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Select
              value={localFilters.sortBy || 'newest'}
              onValueChange={(v) => {
                updateLocalFilter('sortBy', v);
                onFilterChange({...localFilters, sortBy: v});
                onSearch();
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_low">Price (Low to High)</SelectItem>
                <SelectItem value="price_high">Price (High to Low)</SelectItem>
                <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
                <SelectItem value="bathrooms">Most Bathrooms</SelectItem>
                <SelectItem value="area">Largest Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isExpanded && (
          <div className="pt-4 border-t space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="number"
                      placeholder="Min €"
                      value={localFilters.minPrice || ''}
                      onChange={(e) => updateLocalFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Max €"
                      value={localFilters.maxPrice || ''}
                      onChange={(e) => updateLocalFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {priceRangeText()}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Select
                  value={localFilters.minBedrooms?.toString() || ''}
                  onValueChange={(v) => updateLocalFilter('minBedrooms', v ? Number(v) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
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
              
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <Select
                  value={localFilters.minBathrooms?.toString() || ''}
                  onValueChange={(v) => updateLocalFilter('minBathrooms', v ? Number(v) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={localFilters.propertyType || ''}
                  onValueChange={(v) => updateLocalFilter('propertyType', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    {propertyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
              
              <Button 
                size="sm" 
                onClick={handleApplyFilters}
              >
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertySearchFilters;
