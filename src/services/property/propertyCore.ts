
import { Property } from '@/components/properties/PropertyCard';
import { sampleProperties, samplePropertyImages } from '@/data/sampleProperties';

// Core property services
export const propertyCore = {
  // Get all properties
  getAllProperties: async (): Promise<Property[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...sampleProperties];
  },
  
  // Get property by ID
  getPropertyById: async (id: string): Promise<Property | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return sampleProperties.find(property => property.id === id) || null;
  },
  
  // Get property images by ID
  getPropertyImages: async (id: string): Promise<string[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return samplePropertyImages[id] || ['/placeholder.svg'];
  },
  
  // Get featured properties
  getFeaturedProperties: async (): Promise<Property[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    // Return a subset of properties as "featured"
    return sampleProperties.slice(0, 3);
  }
};
