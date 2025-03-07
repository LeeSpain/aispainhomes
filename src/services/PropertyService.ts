
import { Property } from '@/components/properties/PropertyCard';

// This would be replaced by API calls in a real application
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment with Sea View',
    location: 'Marbella, Málaga',
    price: 320000,
    currency: 'EUR',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    imageUrl: '/placeholder.svg',
    features: ['Sea View', 'Pool', 'Parking', 'Terrace', 'Air Conditioning'],
    isForRent: false
  },
  {
    id: '2',
    title: 'Luxury Villa with Pool',
    location: 'Ibiza Town, Ibiza',
    price: 1250000,
    currency: 'EUR',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    imageUrl: '/placeholder.svg',
    features: ['Pool', 'Garden', 'Parking', 'Sea View', 'Security System'],
    isForRent: false
  },
  {
    id: '3',
    title: 'Cozy Studio in City Center',
    location: 'Barcelona, Catalonia',
    price: 950,
    currency: 'EUR',
    type: 'Studio',
    bedrooms: 0,
    bathrooms: 1,
    area: 48,
    imageUrl: '/placeholder.svg',
    features: ['Furnished', 'City Center', 'Air Conditioning', 'Public Transport'],
    isForRent: true
  },
  {
    id: '4',
    title: 'Beachfront Condo',
    location: 'Valencia, Comunidad Valenciana',
    price: 285000,
    currency: 'EUR',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    imageUrl: '/placeholder.svg',
    features: ['Beachfront', 'Pool', 'Furnished', 'Balcony'],
    isForRent: false
  },
  {
    id: '5',
    title: 'Countryside Finca',
    location: 'Ronda, Málaga',
    price: 495000,
    currency: 'EUR',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    imageUrl: '/placeholder.svg',
    features: ['Garden', 'Mountain View', 'Fireplace', 'Fruit Trees'],
    isForRent: false
  },
  {
    id: '6',
    title: 'City Center Penthouse',
    location: 'Madrid, Comunidad de Madrid',
    price: 750000,
    currency: 'EUR',
    type: 'Penthouse',
    bedrooms: 3,
    bathrooms: 2,
    area: 175,
    imageUrl: '/placeholder.svg',
    features: ['Terrace', 'City View', 'Parking', 'Modern Kitchen'],
    isForRent: false
  },
  {
    id: '7',
    title: 'Costa Blanca Townhouse',
    location: 'Alicante, Comunidad Valenciana',
    price: 225000,
    currency: 'EUR',
    type: 'Townhouse',
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    imageUrl: '/placeholder.svg',
    features: ['Community Pool', 'Garden', 'Near Beach', 'Furnished'],
    isForRent: false
  }
];

export const PropertyService = {
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
  
  // Get featured properties
  getFeaturedProperties: async (): Promise<Property[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    // Return a subset of properties as "featured"
    return sampleProperties.slice(0, 3);
  },
  
  // Get user's favorite properties
  getUserFavorites: async (userId: string): Promise<Property[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would fetch user-specific favorites
    // For demo, return a random subset
    return sampleProperties.filter((_, i) => i % 2 === 0);
  }
};
