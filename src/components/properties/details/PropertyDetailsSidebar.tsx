
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, Share2, ExternalLink } from 'lucide-react';
import { Property } from '@/components/properties/PropertyCard';

interface PropertyDetailsSidebarProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
}

const PropertyDetailsSidebar = ({ 
  property, 
  isFavorite, 
  onToggleFavorite, 
  onShare 
}: PropertyDetailsSidebarProps) => {
  return (
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
              onClick={onToggleFavorite}
            >
              <Heart 
                className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} 
              />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <PropertyDetailsTable property={property} />
        
        <Separator className="my-6" />
        
        <PropertyLocation location={property.location} title={property.title} />
      </CardContent>
    </Card>
  );
};

interface PropertyDetailsTableProps {
  property: Property;
}

const PropertyDetailsTable = ({ property }: PropertyDetailsTableProps) => {
  return (
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
  );
};

interface PropertyLocationProps {
  location: string;
  title: string;
}

const PropertyLocation = ({ location, title }: PropertyLocationProps) => {
  return (
    <div>
      <h3 className="font-semibold mb-3">Location</h3>
      <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden">
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing location of ${title}`}
        />
      </div>
      <Button variant="outline" className="w-full mt-3" asChild>
        <a 
          href={`https://maps.google.com/maps?q=${encodeURIComponent(location)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Google Maps
        </a>
      </Button>
    </div>
  );
};

export default PropertyDetailsSidebar;
