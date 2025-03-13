
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Home, MapPin, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PropertyService } from '@/services/PropertyService';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { Property } from '@/components/properties/PropertyCard';
import SiteTracker from '@/components/sites/SiteTracker';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PropertySearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [propertyType, setPropertyType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [activeTab, setActiveTab] = useState('search');
  
  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      try {
        const data = await PropertyService.getAllProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error loading properties:', error);
        toast.error('Failed to load properties');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProperties();
  }, []);
  
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await PropertyService.searchProperties({
        query: searchQuery,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        propertyType,
        location,
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined
      });
      
      setProperties(results);
      if (results.length === 0) {
        toast.info('No properties match your search criteria');
      }
    } catch (error) {
      console.error('Error searching properties:', error);
      toast.error('Failed to search properties');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 1000000]);
    setPropertyType('');
    setLocation('');
    setBedrooms('');
    
    // Load all properties again
    PropertyService.getAllProperties().then(data => {
      setProperties(data);
    });
  };
  
  const formatPrice = (value) => {
    return `€${value.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Helmet>
        <title>Property Search | Spanish Home Finder</title>
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Find Your Spanish Property</h1>
        <Button 
          onClick={() => navigate('/questionnaire')}
          className="flex items-center gap-2"
        >
          AI Property Finder <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" /> Property Search
          </TabsTrigger>
          <TabsTrigger value="track" className="flex items-center gap-2">
            <Home className="h-4 w-4" /> Site Tracking
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search properties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-grow"
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
                
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
            </CardContent>
          </Card>
          
          <PropertyGrid properties={properties} isLoading={isLoading} />
          
          {!isLoading && properties.length > 0 && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => navigate('/questionnaire')}>
                Can't find what you're looking for? Try our AI Property Finder
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="track">
          <SiteTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertySearch;
