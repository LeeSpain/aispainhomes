
import PropertyGrid from "@/components/properties/PropertyGrid";
import { Property } from "@/components/properties/PropertyCard";

interface FavoritesTabProps {
  favorites: Property[];
  isLoading: boolean;
}

const FavoritesTab = ({ favorites, isLoading }: FavoritesTabProps) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Your Favorite Properties</h2>
      <PropertyGrid properties={favorites} isLoading={isLoading} />
    </div>
  );
};

export default FavoritesTab;
