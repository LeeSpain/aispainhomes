import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Home, UserPlus, Sparkles } from 'lucide-react';
import { PropertyService } from '@/services/PropertyService';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { Property } from '@/components/properties/PropertyCard';
import SiteTracker from '@/components/sites/SiteTracker';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import SearchHeader from '@/components/properties/search/SearchHeader';
import SearchCard from '@/components/properties/search/SearchCard';
import SearchEmptyState from '@/components/properties/search/SearchEmptyState';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const PropertySearch = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [propertyType, setPropertyType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [bathrooms, setBathrooms] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('search');
  
  useEffect(() => {
    // If user is not logged in, don't fetch properties
    if (!user) {
      setIsLoading(false);
      return;
    }
    
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
  }, [user]);
  
  const handleSearch = async () => {
    if (!user) {
      navigate('/register');
      return;
    }
    
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
  
  const handleAutoFillFromProfile = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-property-search');
      
      if (error) throw error;
      
      if (data?.searchCriteria) {
        setPriceRange([data.searchCriteria.minPrice, data.searchCriteria.maxPrice]);
        setPropertyType(data.searchCriteria.propertyType || '');
        setLocation(data.searchCriteria.location || '');
        setBedrooms(data.searchCriteria.bedrooms?.toString() || '');
        setBathrooms(data.searchCriteria.bathrooms?.toString() || '');
        setSelectedAmenities(data.searchCriteria.amenities || []);
        
        toast.success('Search filters auto-filled from your profile');
        
        // Automatically trigger search
        setTimeout(() => handleSearch(), 500);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data. Please complete the questionnaire first.');
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
    setBathrooms('');
    setSelectedAmenities([]);
    
    // Load all properties again if user is logged in
    if (user) {
      PropertyService.getAllProperties().then(data => {
        setProperties(data);
      });
    }
  };

  // Show login/register prompt if not logged in
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <Helmet>
          <title>Property Search | Spanish Home Finder</title>
        </Helmet>
        
        <div className="max-w-3xl mx-auto text-center py-16">
          <h1 className="text-4xl font-bold mb-4">Access Premium Property Search</h1>
          <p className="text-xl text-muted-foreground mb-8">
            To search for properties, you need to create an account or login. Our property search tool helps you find your perfect home in Spain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/register')} size="lg" className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Register Now
            </Button>
            <Button onClick={() => navigate('/login')} size="lg" variant="outline">
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Helmet>
        <title>Property Search | Spanish Home Finder</title>
      </Helmet>
      
      <SearchHeader />
      
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
          <div className="flex justify-end mb-4">
            <Button 
              onClick={handleAutoFillFromProfile}
              disabled={isLoading}
              variant="outline"
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Auto-Fill from My Profile
            </Button>
          </div>
          
          <SearchCard 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            location={location}
            setLocation={setLocation}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            handleSearch={handleSearch}
            handleClearFilters={handleClearFilters}
          />
          
          <PropertyGrid properties={properties} isLoading={isLoading} />
          
          {!isLoading && properties.length === 0 && <SearchEmptyState />}
        </TabsContent>
        
        <TabsContent value="track">
          <SiteTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertySearch;
