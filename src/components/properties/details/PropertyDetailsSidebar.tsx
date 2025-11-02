
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

const getSourceWebsiteName = (url?: string): string => {
  if (!url) return 'Source Website';
  if (url.includes('idealista')) return 'Idealista';
  if (url.includes('fotocasa')) return 'Fotocasa';
  if (url.includes('kyero')) return 'Kyero';
  return 'Source Website';
};

const PropertyDetailsSidebar = ({ 
  property, 
  isFavorite, 
  onToggleFavorite, 
  onShare 
}: PropertyDetailsSidebarProps) => {
  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Contact for Price';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: property.currency || 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const sourceName = getSourceWebsiteName(property.externalUrl || property.sourceWebsite);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="text-3xl font-bold">{formatPrice(property.price)}</div>
          {property.priceUnit === 'monthly' && <span className="text-muted-foreground">/month</span>}
        </div>
        
        <div className="space-y-4">
          {/* Disclaimer Banner */}
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="font-semibold text-foreground mb-1">⚠️ Important Notice</p>
            <p className="text-muted-foreground text-xs">
              AI Homes Spain is a property matching service. We are NOT the listing agent. 
              Contact the agent directly through the original listing.
            </p>
          </div>

          {/* View Original Listing Button */}
          {property.externalUrl && (
            <Button className="w-full" size="lg" asChild>
              <a 
                href={property.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View on {sourceName}
              </a>
            </Button>
          )}

          {/* Source Information */}
          {(property.sourceWebsite || property.externalUrl) && (
            <div className="bg-background border rounded-lg p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Listing Source</p>
              <p>Data sourced from {sourceName}</p>
              {property.referenceNumber && (
                <p className="mt-1">Ref: {property.referenceNumber}</p>
              )}
              {property.listingDate && (
                <p className="mt-1">
                  First seen: {new Date(property.listingDate).toLocaleDateString()}
                </p>
              )}
              {property.lastChecked && (
                <p className="mt-1 text-xs">
                  Last checked: {new Date(property.lastChecked).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant={isFavorite ? "default" : "outline"} 
              className="flex-1"
              onClick={onToggleFavorite}
            >
              <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
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
        {property.referenceNumber && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ref:</span>
            <span className="font-mono text-xs">{property.referenceNumber}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type:</span>
          <span className="capitalize">{property.type}</span>
        </div>
        {property.area > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Area:</span>
            <span>{property.area} m²</span>
          </div>
        )}
        {property.bedrooms > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bedrooms:</span>
            <span>{property.bedrooms}</span>
          </div>
        )}
        {property.bathrooms > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bathrooms:</span>
            <span>{property.bathrooms}</span>
          </div>
        )}
        {property.yearBuilt && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Year Built:</span>
            <span>{property.yearBuilt}</span>
          </div>
        )}
        {property.sourceWebsite && (
          <div className="flex justify-between col-span-2">
            <span className="text-muted-foreground">Source:</span>
            <span>{property.sourceWebsite}</span>
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
