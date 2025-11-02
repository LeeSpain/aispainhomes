
import { Separator } from '@/components/ui/separator';
import PropertyImageGallery from '@/components/properties/PropertyImageGallery';
import { Property } from '@/components/properties/PropertyCard';
import { Bed, Bath, Square, Home, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropertyFeatures from './PropertyFeatures';
import SimilarProperties from './SimilarProperties';
import PropertyMatchDetails from '@/components/properties/PropertyMatchDetails';

interface PropertyDetailsContentProps {
  property: Property;
  similarProperties: Property[];
  matchScore?: number;
  matchReasons?: string[];
}

const PropertyDetailsContent = ({ property, similarProperties, matchScore, matchReasons }: PropertyDetailsContentProps) => {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{property.title}</h1>
      <div className="flex items-center text-muted-foreground mb-4">
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
      
      {/* Match Analysis Section */}
      {(matchScore || matchReasons) && (
        <>
          <Separator className="my-6" />
          <PropertyMatchDetails
            matchScore={matchScore}
            matchReasons={matchReasons}
            propertyPrice={property.price}
            propertyLocation={property.location}
            propertyBedrooms={property.bedrooms}
            propertyType={property.type}
          />
        </>
      )}
      
      <Separator className="my-6" />
      
      <div>
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        {property.description ? (
          <p className="text-muted-foreground whitespace-pre-line">
            {property.description}
          </p>
        ) : (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-muted-foreground text-sm">
              Full description not available. Please view the original listing for complete details.
            </p>
            {property.externalUrl && (
              <a 
                href={property.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary text-sm font-medium hover:underline mt-2 inline-block"
              >
                View original listing →
              </a>
            )}
          </div>
        )}
      </div>

      <Separator className="my-6" />

      {/* Property Specifications */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Property Specifications</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Property Type</p>
            <p className="font-medium capitalize">{property.type}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium capitalize">{property.status === 'forSale' ? 'For Sale' : 'For Rent'}</p>
          </div>
          {property.referenceNumber && (
            <div>
              <p className="text-muted-foreground">Reference</p>
              <p className="font-medium">{property.referenceNumber}</p>
            </div>
          )}
          {property.yearBuilt && (
            <div>
              <p className="text-muted-foreground">Year Built</p>
              <p className="font-medium">{property.yearBuilt}</p>
            </div>
          )}
          {property.listingDate && (
            <div>
              <p className="text-muted-foreground">First Seen</p>
              <p className="font-medium">
                {new Date(property.listingDate).toLocaleDateString()}
              </p>
            </div>
          )}
          {property.sourceWebsite && (
            <div>
              <p className="text-muted-foreground">Source</p>
              <p className="font-medium">{property.sourceWebsite}</p>
            </div>
          )}
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <PropertyFeatures features={property.features || []} />
      
      {similarProperties.length > 0 && (
        <>
          <Separator className="my-6" />
          <SimilarProperties properties={similarProperties} />
        </>
      )}
    </>
  );
};

export default PropertyDetailsContent;
