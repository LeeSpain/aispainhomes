
import PropertyGrid from "@/components/properties/PropertyGrid";
import { Property } from "@/components/properties/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertiesTabProps {
  properties: Property[];
  isLoading: boolean;
}

const PropertiesTab = ({ properties, isLoading }: PropertiesTabProps) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Your Property Matches</h2>
      {isLoading ? (
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
      ) : (
        <PropertyGrid properties={properties} />
      )}
    </div>
  );
};

export default PropertiesTab;
