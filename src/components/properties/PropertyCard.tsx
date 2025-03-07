import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Bed, Bath, SquareIcon, MapPin, Heart } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  features: string[];
  isForRent?: boolean;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { user, userPreferences, addToFavorites, removeFromFavorites } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  
  // Check if property is in favorites when component mounts or when userPreferences changes
  useEffect(() => {
    if (userPreferences && property.id) {
      setIsFavorite(userPreferences.favorites.includes(property.id));
    }
  }, [userPreferences, property.id]);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast("Please login to save favorites", {
        variant: "destructive"
      });
      return;
    }
    
    if (isFavorite) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property.id);
    }
    
    setIsFavorite(!isFavorite);
  };
  
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden card-hover cursor-pointer" onClick={handleViewDetails}>
      {/* Property Image */}
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img 
            src={property.imageUrl || '/placeholder.svg'} 
            alt={property.title}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {property.type}
          </Badge>
          {property.isForRent ? (
            <Badge className="bg-primary">For Rent</Badge>
          ) : (
            <Badge className="bg-primary">For Sale</Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 rounded-full bg-white/80 hover:bg-white ${
            isFavorite ? 'text-destructive' : 'text-muted-foreground'
          }`}
          onClick={toggleFavorite}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      {/* Property Details */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
        </div>
        
        <div className="flex items-center text-muted-foreground mt-1 mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>
        
        <div className="flex items-center gap-4 my-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{property.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <SquareIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{property.area} m²</span>
          </div>
        </div>
        
        {/* Features */}
        <div className="flex flex-wrap gap-2 my-3">
          {property.features.slice(0, 3).map((feature, index) => (
            <Badge variant="outline" key={index} className="bg-secondary/50">
              {feature}
            </Badge>
          ))}
          {property.features.length > 3 && (
            <Badge variant="outline" className="bg-secondary/50">
              +{property.features.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div>
            <div className="text-lg font-bold">
              {formatPrice(property.price, property.currency)}
            </div>
            <div className="text-xs text-muted-foreground">
              {property.isForRent ? 'per month' : 'for sale'}
            </div>
          </div>
          
          <Button size="sm" onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}>View Details</Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
