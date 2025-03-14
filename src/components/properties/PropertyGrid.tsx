
import { useEffect, useState } from 'react';
import PropertyCard, { Property } from './PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
}

const PropertyGrid = ({ properties, isLoading = false }: PropertyGridProps) => {
  const [showSkeleton, setShowSkeleton] = useState(isLoading);
  
  // Use an effect to handle the loading state transition
  useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true);
    } else {
      // Small delay before hiding skeleton to ensure smooth transition
      const timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (showSkeleton) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="h-[400px] overflow-hidden rounded-lg border bg-background shadow-sm">
            <Skeleton className="h-[200px] w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex gap-3 mb-4">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-6 w-1/3 mt-4" />
            </div>
          </div>
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
