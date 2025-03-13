
import { sampleProperties } from '../../data/sampleProperties';
import type { Property } from '@/components/properties/PropertyCard';

interface SearchParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
}

export const propertySearch = {
  /**
   * Search properties based on various criteria
   */
  searchProperties: async (params: SearchParams): Promise<Property[]> => {
    // This would be an API call in a real application
    // For now, we'll filter the sample data
    const {
      query = '',
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
      propertyType = '',
      location = '',
      bedrooms = 0,
      bathrooms = 0,
      minArea = 0
    } = params;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return sampleProperties.filter(property => {
      // Filter by search query
      if (query && !property.title.toLowerCase().includes(query.toLowerCase()) &&
          !property.description.toLowerCase().includes(query.toLowerCase()) &&
          !property.location.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      
      // Filter by price range
      if (property.price < minPrice || property.price > maxPrice) {
        return false;
      }
      
      // Filter by property type
      if (propertyType && property.type.toLowerCase() !== propertyType.toLowerCase()) {
        return false;
      }
      
      // Filter by location
      if (location && !property.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      
      // Filter by bedrooms
      if (bedrooms > 0 && property.bedrooms < bedrooms) {
        return false;
      }
      
      // Filter by bathrooms
      if (bathrooms > 0 && property.bathrooms < bathrooms) {
        return false;
      }
      
      // Filter by area
      if (minArea > 0 && property.area < minArea) {
        return false;
      }
      
      return true;
    });
  },
  
  /**
   * Get property recommendations based on user preferences
   */
  getRecommendedProperties: async (preferences: any): Promise<Property[]> => {
    // This would use AI matching in a real application
    // For now, we'll just return some filtered properties
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return sampleProperties
      .filter(property => {
        // Basic filtering based on preferences
        if (preferences.priceRange && 
            (property.price < preferences.priceRange[0] || 
             property.price > preferences.priceRange[1])) {
          return false;
        }
        
        if (preferences.propertyTypes && 
            preferences.propertyTypes.length > 0 && 
            !preferences.propertyTypes.includes(property.type.toLowerCase())) {
          return false;
        }
        
        if (preferences.location && 
            !property.location.toLowerCase().includes(preferences.location.toLowerCase())) {
          return false;
        }
        
        if (preferences.bedrooms && property.bedrooms < preferences.bedrooms) {
          return false;
        }
        
        return true;
      })
      .slice(0, 6); // Return top 6 recommendations
  }
};
