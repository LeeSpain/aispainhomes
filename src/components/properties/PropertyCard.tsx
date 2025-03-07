
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  images?: string[]; // Array of image URLs
  features: string[];
  isForRent: boolean;
  description?: string;
}

interface PropertyCardProps {
  property: Property;
  showFavoriteButton?: boolean;
}

const PropertyCard = ({ property, showFavoriteButton = true }: PropertyCardProps) => {
  const { user, userPreferences, addToFavorites, removeFromFavorites } = useAuth();
  const [isFavorite, setIsFavorite] = useState(() => {
    if (!user || !userPreferences?.favorites) return false;
    return userPreferences.favorites.includes(property.id);
  });

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }
    
    if (isFavorite) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property.id);
    }
    
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/property/${property.id}`} className="block">
        <div className="relative">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          {showFavoriteButton && (
            <Button
              size="icon"
              variant="ghost"
              className={`absolute top-2 right-2 h-8 w-8 rounded-full ${
                isFavorite ? 'bg-white text-red-500' : 'bg-white/70 text-gray-600 hover:bg-white'
              }`}
              onClick={handleFavoriteToggle}
            >
              <Heart className={isFavorite ? 'fill-current' : ''} size={16} />
            </Button>
          )}
          <Badge 
            variant={property.isForRent ? "secondary" : "default"}
            className="absolute top-2 left-2"
          >
            {property.isForRent ? 'For Rent' : 'For Sale'}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold line-clamp-1">{property.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{property.location}</p>
          <div className="font-semibold">
            {property.currency === 'EUR' ? '€' : '$'}{property.price.toLocaleString()}
            {property.isForRent && <span className="text-xs text-muted-foreground ml-1">/month</span>}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 border-t border-border mt-1">
          <div className="flex justify-between w-full text-sm text-muted-foreground">
            <div>{property.bedrooms} beds</div>
            <div>{property.bathrooms} baths</div>
            <div>{property.area} m²</div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default PropertyCard;
