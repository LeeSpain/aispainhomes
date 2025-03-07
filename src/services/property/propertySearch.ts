
import { Property } from '@/components/properties/PropertyCard';
import { sampleProperties } from '@/data/sampleProperties';

// Search and filter related property services
export const propertySearch = {
  // Get properties with filters
  getFilteredProperties: async (filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    propertyType?: string;
    isForRent?: boolean;
  }): Promise<Property[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    let filtered = [...sampleProperties];
    
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }
    
    if (filters.bedrooms !== undefined) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedrooms!);
    }
    
    if (filters.propertyType) {
      filtered = filtered.filter(p => 
        p.type.toLowerCase() === filters.propertyType!.toLowerCase()
      );
    }
    
    if (filters.isForRent !== undefined) {
      filtered = filtered.filter(p => p.isForRent === filters.isForRent);
    }
    
    return filtered;
  },
  
  // Get similar properties
  getSimilarProperties: async (property: Property): Promise<Property[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Find properties of the same type or in the same location
    return sampleProperties.filter(p => 
      p.id !== property.id && (
        p.type === property.type || 
        p.location.includes(property.location.split(',')[0])
      )
    ).slice(0, 3);
  }
};
