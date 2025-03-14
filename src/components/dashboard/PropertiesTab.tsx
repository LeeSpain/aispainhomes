
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
      
      {/* Pass the isLoading prop to PropertyGrid and let it handle the loading state */}
      <PropertyGrid properties={properties} isLoading={isLoading} />
    </div>
  );
};

export default PropertiesTab;
