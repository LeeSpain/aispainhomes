
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
  amenities?: string[];
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
      minArea = 0,
      amenities = []
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
      
      // Filter by amenities
      if (amenities.length > 0) {
        if (!property.features) return false;
        
        // Check if property has all required amenities
        for (const amenity of amenities) {
          if (!property.features.some(feature => 
            feature.toLowerCase().includes(amenity.toLowerCase())
          )) {
            return false;
          }
        }
      }
      
      return true;
    });
  },
  
  /**
   * Get filtered properties with simplified parameters
   * Added to support components that need a simpler filtering interface
   */
  getFilteredProperties: async (params: Partial<SearchParams>): Promise<Property[]> => {
    // This is a wrapper around searchProperties for backward compatibility
    return propertySearch.searchProperties(params);
  },
  
  /**
   * Get similar properties based on the current property
   */
  getSimilarProperties: async (property: Property): Promise<Property[]> => {
    // In a real app, this would use more sophisticated matching
    // For now, return properties with the same type or in the same location
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return sampleProperties.filter(p => 
      p.id !== property.id && (
        p.type === property.type || 
        p.location.includes(property.location.split(',')[0]) ||
        Math.abs(p.price - property.price) < property.price * 0.2
      )
    );
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
        
        // Advanced filtering with amenities preferences
        if (preferences.selectedAmenities && 
            preferences.selectedAmenities.length > 0 && 
            property.features) {
          let amenityMatchScore = 0;
          
          // Calculate how many of the preferred amenities match
          for (const amenity of preferences.selectedAmenities) {
            if (property.features.some(feature => 
              feature.toLowerCase().includes(amenity.toLowerCase())
            )) {
              amenityMatchScore++;
            }
          }
          
          // If less than half of desired amenities match, lower ranking
          if (amenityMatchScore < preferences.selectedAmenities.length / 2) {
            return Math.random() > 0.7; // Only keep 30% of properties with few amenity matches
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by match quality (can be expanded with more sophisticated logic)
        let scoreA = 0;
        let scoreB = 0;
        
        // Exact location match is highest priority
        if (preferences.location) {
          if (a.location.toLowerCase().includes(preferences.location.toLowerCase())) scoreA += 10;
          if (b.location.toLowerCase().includes(preferences.location.toLowerCase())) scoreB += 10;
        }
        
        // Price in the middle of the range is better than at the edges
        if (preferences.priceRange) {
          const idealPrice = (preferences.priceRange[0] + preferences.priceRange[1]) / 2;
          const distanceA = Math.abs(a.price - idealPrice);
          const distanceB = Math.abs(b.price - idealPrice);
          
          scoreA += (1 - distanceA / idealPrice) * 5;
          scoreB += (1 - distanceB / idealPrice) * 5;
        }
        
        return scoreB - scoreA;
      })
      .slice(0, 6); // Return top 6 recommendations
  },
  
  /**
   * Get properties that match the user's questionnaire results
   * This provides an AI-like matching algorithm based on weighted preferences
   */
  getMatchingProperties: async (formData: any): Promise<Property[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Calculate match scores for each property
    const propertiesWithScores = sampleProperties.map(property => {
      let score = 0;
      const maxScore = 100;
      
      // Location match (highest weight - 30 points)
      if (formData.location && 
          property.location.toLowerCase().includes(formData.location.toLowerCase())) {
        score += 30;
      }
      
      // Property type match (25 points)
      if (formData.propertyTypes && 
          formData.propertyTypes.includes(property.type.toLowerCase())) {
        score += 25;
      }
      
      // Price match (20 points) - closer to ideal price gets more points
      if (formData.priceRange) {
        const [min, max] = formData.priceRange;
        if (property.price >= min && property.price <= max) {
          // Full points if in range
          const idealPrice = (min + max) / 2;
          const distanceFromIdeal = Math.abs(property.price - idealPrice) / idealPrice;
          score += 20 * (1 - distanceFromIdeal);
        }
      }
      
      // Bedrooms match (10 points)
      if (formData.bedrooms && property.bedrooms >= formData.bedrooms) {
        score += 10;
      }
      
      // Bathrooms match (5 points)
      if (formData.bathrooms && property.bathrooms >= formData.bathrooms) {
        score += 5;
      }
      
      // Area match (5 points)
      if (formData.minArea && property.area >= formData.minArea) {
        score += 5;
      }
      
      // Amenities match (5 points) - partial matching allowed
      if (formData.selectedAmenities && 
          formData.selectedAmenities.length > 0 && 
          property.features) {
        const matchCount = formData.selectedAmenities.filter(amenity => 
          property.features.some(feature => 
            feature.toLowerCase().includes(amenity.toLowerCase())
          )
        ).length;
        
        const matchPercentage = matchCount / formData.selectedAmenities.length;
        score += 5 * matchPercentage;
      }
      
      // Buy/Rent preference match
      if ((formData.purpose === 'buy' && !property.isForRent) || 
          (formData.purpose === 'rent' && property.isForRent)) {
        score += 5;
      }
      
      return {
        property,
        score: (score / maxScore) * 100 // Convert to percentage
      };
    });
    
    // Sort by match score and return top results
    return propertiesWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => ({
        ...item.property,
        matchScore: Math.round(item.score) // Add match score to property object
      }));
  }
};
