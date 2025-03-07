
import { Property } from '@/components/properties/PropertyCard';
import { sampleProperties } from '@/data/sampleProperties';

// User-related property services
export const propertyUser = {
  // Get user's favorite properties
  getUserFavorites: async (userId: string): Promise<Property[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would fetch user-specific favorites
    // For demo, return a random subset
    return sampleProperties.filter((_, i) => i % 2 === 0);
  },
  
  // Add a property to favorites
  addPropertyToFavorites: async (userId: string, propertyId: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    // In a real app, this would add to a user_favorites table in the database
    console.log(`Added property ${propertyId} to favorites for user ${userId}`);
    return true;
  },
  
  // Remove property from favorites
  removePropertyFromFavorites: async (userId: string, propertyId: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    // In a real app, this would remove from a user_favorites table in the database
    console.log(`Removed property ${propertyId} from favorites for user ${userId}`);
    return true;
  }
};
