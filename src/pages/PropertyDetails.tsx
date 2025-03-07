
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { 
  Bed, Bath, Square, Euro, MapPin, Home, Calendar, 
  ExternalLink, Heart, Share2, ArrowLeft 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PropertyService } from '@/services/PropertyService';
import { Property } from '@/components/properties/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import PropertyImageGallery from '@/components/properties/PropertyImageGallery';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userPreferences, addToFavorites, removeFromFavorites } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-24 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!property) return null;
  
  return (
    <>
      <Helmet>
        <title>{property.title} | SunnyHomeFinder</title>
        <meta name="description" content={property.description} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="mb-4 pl-0" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to listings
            </Button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.location}</span>
                </div>
                
                <PropertyImageGallery 
                  images={property.images || ['/placeholder.svg']} 
                  title={property.title} 
                />
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-primary" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-primary" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2 text-primary" />
                    <span>{property.area} m²</span>
                  </div>
                  <div className="flex items-center">
                    <Home className="h-5 w-5 mr-2 text-primary" />
                    <span>{property.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <span>Built in {property.yearBuilt || "N/A"}</span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h2 className="text-xl font-semibold mb-3">Features</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {property.features?.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {similarProperties.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Similar Properties</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {similarProperties.map(similarProperty => (
                          <Card key={similarProperty.id} className="overflow-hidden">
                            <div className="aspect-[4/3] w-full overflow-hidden">
                              <img
                                src={similarProperty.images?.[0] || '/placeholder.svg'}
                                alt={similarProperty.title}
                                className="h-full w-full object-cover transition-all hover:scale-105"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold line-clamp-1">{similarProperty.title}</h3>
                              <p className="text-muted-foreground text-sm">
                                {similarProperty.location}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="font-medium">
                                  €{similarProperty.price.toLocaleString()}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => navigate(`/property/${similarProperty.id}`)}
                                >
                                  View
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <span className="text-3xl font-bold">€{property.price.toLocaleString()}</span>
                        {property.isForRent && <span className="text-muted-foreground ml-1">/month</span>}
                      </div>
                      <div className="text-muted-foreground">
                        {property.isForRent ? 'For Rent' : 'For Sale'}
                      </div>
                    </div>
                    
                    <div className="space-y-4 mt-4">
                      <Button className="w-full">Contact Agent</Button>
                      <div className="flex gap-2">
                        <Button 
                          variant={isFavorite ? "default" : "outline"} 
                          className="flex-1"
                          onClick={handleToggleFavorite}
                        >
                          <Heart 
                            className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} 
                          />
                          {isFavorite ? 'Saved' : 'Save'}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={handleShare}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Property Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ID:</span>
                          <span>{property.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span>{property.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Area:</span>
                          <span>{property.area} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bedrooms:</span>
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bathrooms:</span>
                          <span>{property.bathrooms}</span>
                        </div>
                        {property.yearBuilt && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Year Built:</span>
                            <span>{property.yearBuilt}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="font-semibold mb-3">Location</h3>
                      <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden">
                        <iframe
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                          className="w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`Map showing location of ${property.title}`}
                        />
                      </div>
                      <Button variant="outline" className="w-full mt-3" asChild>
                        <a 
                          href={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Google Maps
                        </a>
                      </Button>
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
