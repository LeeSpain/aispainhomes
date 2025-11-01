
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyImageGallery from './PropertyImageGallery';
import { toast } from 'sonner';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  priceUnit: 'total' | 'monthly';
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  description: string;
  features: string[];
  type: string;
  status: 'forSale' | 'forRent' | 'sold' | 'rented';
  createdAt: string;
  currency?: string;
  isForRent?: boolean;
  yearBuilt?: number;
  imageUrl?: string;
  agent?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    photo: string;
  };
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { user, userPreferences, updateUserPreferences } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const isFavorite = userPreferences?.favorites?.includes(property.id) || false;
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to save favorites');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        if (isFavorite) {
          // Remove from favorites
          const updatedFavorites = userPreferences?.favorites?.filter(id => id !== property.id) || [];
          updateUserPreferences({ favorites: updatedFavorites });
          toast.success('Property removed from favorites');
        } else {
          // Add to favorites
          const updatedFavorites = [...(userPreferences?.favorites || []), property.id];
          updateUserPreferences({ favorites: updatedFavorites });
          toast.success('Property added to favorites');
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <Link to={`/property/${property.id}`} className="block h-full group">
      <div className="h-full overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
        <div className="relative">
          <PropertyImageGallery images={property.images} title={property.title} />
          
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 z-10 rounded-full bg-white/80 hover:bg-white ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
            onClick={toggleFavorite}
            disabled={isLoading}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            <span className="sr-only">{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</span>
          </Button>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-3">{property.location}</p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div>{property.bedrooms} beds</div>
            <div>{property.bathrooms} baths</div>
            <div>{property.area} m²</div>
          </div>
          
          <div className="font-semibold text-lg">
            {formatPrice(property.price)}
            {property.priceUnit === 'monthly' && <span className="text-sm font-normal text-muted-foreground"> /month</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
