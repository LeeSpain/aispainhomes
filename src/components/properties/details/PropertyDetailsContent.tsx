
import { Separator } from '@/components/ui/separator';
import PropertyImageGallery from '@/components/properties/PropertyImageGallery';
import { Property } from '@/components/properties/PropertyCard';
import { Bed, Bath, Square, Home, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropertyFeatures from './PropertyFeatures';
import SimilarProperties from './SimilarProperties';

interface PropertyDetailsContentProps {
  property: Property;
  similarProperties: Property[];
}

const PropertyDetailsContent = ({ property, similarProperties }: PropertyDetailsContentProps) => {
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
      
      <Separator className="my-6" />
      
      <div>
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-muted-foreground whitespace-pre-line">
          {property.description}
        </p>
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
