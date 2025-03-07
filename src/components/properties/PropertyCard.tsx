
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Bed, Bath, Square, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import PropertyImageGallery from "./PropertyImageGallery";

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  isForRent: boolean;
  features?: string[];
  images?: string[];
  imageUrl?: string; // Added this property for backward compatibility
  yearBuilt?: number;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { user, addToFavorites, removeFromFavorites, userPreferences } = useAuth();
  
  const isFavorite = userPreferences?.favorites?.includes(property.id) || false;
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
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
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Link to={`/property/${property.id}`} className="relative">
        <PropertyImageGallery 
          images={property.images || ['/placeholder.svg']} 
          title={property.title} 
        />
        <button
          onClick={handleFavoriteClick}
          className={`absolute right-3 top-3 p-2 rounded-full ${
            isFavorite 
              ? "bg-primary-foreground text-primary" 
              : "bg-black/30 backdrop-blur-sm text-white"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary" : ""}`} />
        </button>
      </Link>
      
      <CardContent className="p-4 flex-grow">
        <Link to={`/property/${property.id}`} className="no-underline">
          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
            {property.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-2">{property.location}</p>
        
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.area} m²</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t mt-auto">
        <div className="flex justify-between w-full items-center">
          <div>
            <span className="font-bold text-lg">
              {property.currency}{property.price.toLocaleString()}
            </span>
            {property.isForRent && <span className="text-muted-foreground text-sm ml-1">/month</span>}
          </div>
          <span className="text-sm font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">
            {property.type}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
