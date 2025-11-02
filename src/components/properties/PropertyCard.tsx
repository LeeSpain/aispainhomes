
import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  sourceWebsite?: string;
  sourceLogo?: string;
  externalUrl?: string;
  listingDate?: string;
  referenceNumber?: string;
  lastChecked?: string;
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
  matchScore?: number;
  matchReasons?: string[];
}

const PropertyCard = ({ property, matchScore, matchReasons }: PropertyCardProps) => {
  const { user, userPreferences, updateUserPreferences } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const isFavorite = userPreferences?.favorites?.includes(property.id) || false;
  const displayMatchScore = matchScore ? Math.min(100, Math.round(matchScore)) : undefined;
  
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
    if (!price || price === 0) return 'Contact for Price';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: property.currency || 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = () => {
    if (property.status === 'forSale') return { text: 'For Sale', variant: 'default' as const };
    if (property.status === 'forRent') return { text: 'For Rent', variant: 'secondary' as const };
    return null;
  };

  const getListingAge = () => {
    if (!property.listingDate) return null;
    const days = Math.floor((Date.now() - new Date(property.listingDate).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Listed today';
    if (days === 1) return 'Listed yesterday';
    if (days < 7) return `Listed ${days} days ago`;
    return null;
  };
  
  // Handle card click - open external URL if available, otherwise internal page
  const handleCardClick = (e: React.MouseEvent) => {
    if (property.externalUrl) {
      e.preventDefault();
      window.open(property.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const CardWrapper = property.externalUrl ? 'div' : Link;
  const cardProps = property.externalUrl 
    ? { onClick: handleCardClick, className: "block h-full group cursor-pointer" }
    : { to: `/property/${property.id}`, className: "block h-full group" };

  return (
    <CardWrapper {...cardProps as any}>
      <div className="h-full overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
        <div className="relative">
          <PropertyImageGallery images={property.images} title={property.title} />
          
          <div className="absolute top-2 left-2 z-10 flex gap-2">
            {displayMatchScore && (
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                {displayMatchScore}% Match
              </div>
            )}
            {getStatusBadge() && (
              <Badge variant={getStatusBadge()!.variant} className="shadow-lg">
                {getStatusBadge()!.text}
              </Badge>
            )}
          </div>
          
          {property.sourceWebsite && (
            <div className="absolute bottom-2 left-2 z-10 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-medium">
              From {property.sourceWebsite}
            </div>
          )}
          
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
          
          <p className="text-muted-foreground text-sm mb-2">{property.location}</p>
          
          {getListingAge() && (
            <p className="text-xs text-muted-foreground mb-3">{getListingAge()}</p>
          )}
          
          {matchReasons && matchReasons.length > 0 && (
            <div className="mb-3 space-y-1">
              {matchReasons.slice(0, 3).map((reason, idx) => (
                <div key={idx} className="text-xs text-primary flex items-start gap-1">
                  <span>✓</span>
                  <span className="line-clamp-1">{reason}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            {property.bedrooms > 0 ? (
              <div>{property.bedrooms} beds</div>
            ) : (
              <div>TBD</div>
            )}
            {property.bathrooms > 0 ? (
              <div>{property.bathrooms} baths</div>
            ) : (
              <div>TBD</div>
            )}
            {property.area > 0 ? (
              <div>{property.area} m²</div>
            ) : (
              <div>Area TBD</div>
            )}
          </div>
          
          <div className="font-semibold text-lg">
            {formatPrice(property.price)}
            {property.priceUnit === 'monthly' && <span className="text-sm font-normal text-muted-foreground"> /month</span>}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export default memo(PropertyCard);
