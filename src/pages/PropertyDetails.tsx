import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Property } from "@/components/properties/PropertyCard";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bed,
  Bath,
  SquareIcon,
  MapPin,
  Heart,
  ArrowLeft,
  CalendarRange,
  Phone,
  MessageSquare,
  Share2,
  Printer,
  CheckCircle,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { PropertyService } from "@/services/PropertyService";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const propertyData = await PropertyService.getPropertyById(id);
        setProperty(propertyData);
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleContactAgent = () => {
    if (!user) {
      toast.error("Please log in to contact the agent");
      navigate("/login");
      return;
    }
    
    toast.success("Your request has been sent to the agent");
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{property.title} | SunnyHomeFinder</title>
        <meta name="description" content={`${property.title} - ${property.location} - ${property.type} with ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to results
            </Button>

            {/* Property Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={property.isForRent ? "default" : "secondary"}>
                    {property.isForRent ? "For Rent" : "For Sale"}
                  </Badge>
                  <Badge variant="outline">{property.type}</Badge>
                </div>
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-3xl font-bold">
                  {formatPrice(property.price, property.currency)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {property.isForRent ? 'per month' : 'for sale'}
                </div>
              </div>
            </div>

            {/* Property Image and Core Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Main Image */}
              <div className="lg:col-span-2">
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>

                {/* Thumbnails would go here in a real app */}
                <div className="hidden md:grid grid-cols-5 gap-2 mt-2">
                  {Array(5).fill(0).map((_, index) => (
                    <div key={index} className="aspect-[4/3] rounded-md bg-muted overflow-hidden">
                      <img
                        src={property.imageUrl}
                        alt={`${property.title} - view ${index + 1}`}
                        className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                {/* Key Features */}
                <div className="flex flex-wrap items-center gap-6 mt-6 p-4 border rounded-lg">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{property.bedrooms}</div>
                      <div className="text-xs text-muted-foreground">Bedrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{property.bathrooms}</div>
                      <div className="text-xs text-muted-foreground">Bathrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <SquareIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{property.area} m²</div>
                      <div className="text-xs text-muted-foreground">Area</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Agent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="default" className="w-full" onClick={handleContactAgent}>
                        <Phone className="mr-2 h-4 w-4" />
                        Request Call
                      </Button>
                      <Button variant="outline" className="w-full" onClick={handleContactAgent}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                      <Button variant="secondary" className="w-full" onClick={() => navigate("/questionnaire?service=guardian")}>
                        <CalendarRange className="mr-2 h-4 w-4" />
                        Schedule Viewing
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        variant={isFavorite ? "default" : "outline"} 
                        className="w-full" 
                        onClick={toggleFavorite}
                      >
                        <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                        {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Guardian Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Legal Document Review</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Property Value Analysis</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Relocation Assistance</span>
                      </div>
                      <Button 
                        variant="default" 
                        className="w-full mt-4"
                        onClick={() => navigate("/questionnaire?service=guardian")}
                      >
                        Activate AI Guardian
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Property Details Tabs */}
            <Tabs defaultValue="description" className="mb-12">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Property Overview</h2>
                <div className="space-y-4">
                  <p>
                    This beautiful {property.type.toLowerCase()} is located in the sought-after area of {property.location}, 
                    offering {property.bedrooms} bedrooms and {property.bathrooms} bathrooms across {property.area} square meters.
                  </p>
                  <p>
                    The property features modern finishes throughout, with an open-concept living space that's 
                    perfect for entertaining. Large windows allow for abundant natural light and showcase 
                    the stunning surroundings.
                  </p>
                  <p>
                    The kitchen is fully equipped with high-end appliances and offers ample storage space. 
                    The master bedroom includes an en-suite bathroom and walk-in closet, while the additional 
                    bedrooms are spacious and well-designed.
                  </p>
                  <p>
                    Residents will enjoy access to community amenities including a swimming pool, fitness center, 
                    and 24-hour security. The property is conveniently located near shopping centers, 
                    restaurants, and public transportation.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Property Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...property.features, 'Modern Kitchen', 'Air Conditioning', 'Central Heating', 'Double Glazing', 'Fiber Optic Internet', '24-hour Security'].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Location</h2>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
                  {/* Map would go here in a real app */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Interactive map will be displayed here</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Nearby Amenities</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="font-medium">Shopping & Dining</p>
                        <p className="text-sm text-muted-foreground">Less than 5 minutes to local shops and restaurants</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="font-medium">Transportation</p>
                        <p className="text-sm text-muted-foreground">10 minutes to public transportation links</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="font-medium">Education</p>
                        <p className="text-sm text-muted-foreground">Several international schools within 15 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="font-medium">Healthcare</p>
                        <p className="text-sm text-muted-foreground">Medical centers and hospitals nearby</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PropertyDetails;
