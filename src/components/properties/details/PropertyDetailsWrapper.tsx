
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { PropertyService } from '@/services/PropertyService';
import { Property } from '@/components/properties/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import PropertyDetailsContent from './PropertyDetailsContent';
import PropertyDetailsSidebar from './PropertyDetailsSidebar';
import PropertyDetailsLoading from './PropertyDetailsLoading';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import SocialShare from '@/components/common/SocialShare';
import { useDashboardInit } from '@/hooks/useDashboardInit';

const PropertyDetailsWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userPreferences, addToFavorites, removeFromFavorites } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  
  // Get match data from dashboard init
  const { matchScores, matchReasons } = useDashboardInit(user?.id);
  
  useEffect(() => {
    const loadProperty = async () => {
      setIsLoading(true);
      try {
        if (!id) {
          navigate('/properties');
          return;
        }
        
        const propertyData = await PropertyService.getPropertyById(id);
        if (!propertyData) {
          toast.error("Property not found");
          navigate('/properties');
          return;
        }
        
        setProperty(propertyData);
        
        // Check if property is in favorites
        if (userPreferences?.favorites) {
          setIsFavorite(userPreferences.favorites.includes(id));
        }
        
        // Load similar properties
        const similar = await PropertyService.getSimilarProperties(propertyData);
        setSimilarProperties(similar.slice(0, 3));
      } catch (error) {
        console.error("Error loading property:", error);
        toast.error("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProperty();
  }, [id, navigate, userPreferences?.favorites]);
  
  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("Please login to save favorites");
      navigate('/login?redirect=property/' + id);
      return;
    }
    
    if (isFavorite) {
      removeFromFavorites(id!);
      setIsFavorite(false);
      toast.success("Removed from favorites");
    } else {
      addToFavorites(id!);
      setIsFavorite(true);
      toast.success("Added to favorites");
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this property: ${property?.title}`,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handlePrint = () => {
    window.print();
  };
  
  if (isLoading) {
    return <PropertyDetailsLoading />;
  }
  
  if (!property) return null;
  
  return (
    <>
      <Helmet>
        <title>{property.title} | AI Spain Homes</title>
        <meta name="description" content={property.description} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col print-content">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <Button 
                variant="ghost" 
                className="pl-0 no-print" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to listings
              </Button>
              
              <div className="flex space-x-2 no-print">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                
                <SocialShare 
                  title={`${property.title} - AI Spain Homes`}
                  description={`${property.bedrooms} bed, ${property.bathrooms} bath ${property.type} in ${property.location} for ${property.isForRent ? 'rent' : 'sale'} at ${property.currency}${property.price.toLocaleString()}`}
                />
              </div>
            </div>
            
            <Breadcrumbs />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 property-details">
                <PropertyDetailsContent 
                  property={property} 
                  similarProperties={similarProperties}
                  matchScore={matchScores.get(property.id)}
                  matchReasons={matchReasons.get(property.id)}
                />
              </div>
              
              <div className="lg:col-span-1">
                <PropertyDetailsSidebar 
                  property={property}
                  isFavorite={isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onShare={handleShare}
                />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PropertyDetailsWrapper;
