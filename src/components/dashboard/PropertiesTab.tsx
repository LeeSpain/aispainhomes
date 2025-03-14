
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
            <Skeleton 
              key={index} 
              className="h-[350px] w-full rounded-lg"
            />
          ))}
        </div>
      ) : (
        <PropertyGrid properties={properties} isLoading={isLoading} />
      )}
    </div>
  );
};

export default PropertiesTab;
