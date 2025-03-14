
import PropertyCard, { Property } from './PropertyCard';
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
}

const PropertyGrid = ({ properties, isLoading = false }: PropertyGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, index) => (
          <Skeleton 
            key={index} 
            className="h-[400px] w-full rounded-lg"
          />
        ))}
      </div>
    );
  }
  
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No properties found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria to see more results.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;
