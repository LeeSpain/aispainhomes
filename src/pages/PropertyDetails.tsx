
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { Heart, Share2, Home, MapPin, Euro, Ruler, Bath, BedDouble, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Property } from '@/components/properties/PropertyCard';
import { PropertyService } from '@/services/PropertyService';
import { useAuth } from '@/contexts/AuthContext';
import PropertyImageGallery from '@/components/properties/PropertyImageGallery';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userPreferences, addToFavorites, removeFromFavorites } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const propertyData = await PropertyService.getPropertyById(id);
        if (!propertyData) {
          toast.error("Property not found");
          navigate('/');
          return;
        }
        
        setProperty(propertyData);
        
        // Load property images
        const images = await PropertyService.getPropertyImages(id);
        setPropertyImages(images);
        
        // Check if property is in user favorites
        if (userPreferences?.favorites?.includes(id)) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error("Error loading property:", error);
        toast.error("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProperty();
  }, [id, navigate, userPreferences?.favorites]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast("Please login to save favorites");
      navigate('/login');
      return;
    }
    
    if (!property) return;
    
    try {
      if (isFavorite) {
        await PropertyService.removePropertyFromFavorites(user.id, property.id);
        removeFromFavorites(property.id);
      } else {
        await PropertyService.addPropertyToFavorites(user.id, property.id);
        addToFavorites(property.id);
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title || 'Property Listing',
        text: `Check out this property: ${property?.title}`,
        url: window.location.href,
      })
      .then(() => toast("Shared successfully"))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast("Link copied to clipboard"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-[400px] bg-gray-200 rounded-lg mb-8"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <p className="mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{property.title} | SunnyHomeFinder</title>
        <meta name="description" content={`${property.title} - ${property.location} - ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms`} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-20 md:pt-28 pb-16">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)} 
              className="mb-4 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PropertyImageGallery 
                  images={propertyImages} 
                  title={property.title} 
                />
                
                <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
                    <p className="flex items-center text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={isFavorite ? "default" : "outline"} 
                      size="sm"
                      onClick={handleFavoriteToggle}
                      className={isFavorite ? "bg-primary" : ""}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                      {isFavorite ? "Saved" : "Save"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="flex flex-col items-center p-3 bg-background rounded-lg shadow-sm border">
                    <Home className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="font-medium">{property.type}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-background rounded-lg shadow-sm border">
                    <BedDouble className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-sm text-muted-foreground">Bedrooms</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-background rounded-lg shadow-sm border">
                    <Bath className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-sm text-muted-foreground">Bathrooms</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-background rounded-lg shadow-sm border">
                    <Ruler className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-sm text-muted-foreground">Area</span>
                    <span className="font-medium">{property.area} m²</span>
                  </div>
                </div>
                
                <Tabs defaultValue="description">
                  <TabsList className="grid w-full grid-cols-2 md:w-auto">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="pt-4">
                    <p className="text-muted-foreground leading-relaxed">
                      This gorgeous {property.type.toLowerCase()} is located in the beautiful area of {property.location}, 
                      offering {property.bedrooms} bedrooms and {property.bathrooms} bathrooms. With a total area of {property.area} m², 
                      it provides ample space for comfortable living.
                      
                      Perfect for those seeking a high-quality lifestyle in one of Spain's most desirable locations, 
                      this property offers modern conveniences while embracing the Mediterranean charm of the surroundings.
                      
                      The property features premium materials throughout, excellent natural light, and a 
                      thoughtful layout designed for both comfort and functionality.
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="features" className="pt-4">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {property.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold">
                        {property.currency === 'EUR' ? '€' : '$'}{property.price.toLocaleString()}
                      </h2>
                      <p className="text-muted-foreground">
                        {property.isForRent ? 'Per Month' : 'Purchase Price'}
                      </p>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <Button className="w-full">Contact Agent</Button>
                      <Button variant="outline" className="w-full">Schedule Viewing</Button>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="font-medium mb-3">Quick Information</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Property Type:</span>
                          <span className="font-medium">{property.type}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">For:</span>
                          <span className="font-medium">{property.isForRent ? 'Rent' : 'Sale'}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Area:</span>
                          <span className="font-medium">{property.area} m²</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Bedrooms:</span>
                          <span className="font-medium">{property.bedrooms}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Bathrooms:</span>
                          <span className="font-medium">{property.bathrooms}</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PropertyDetails;
