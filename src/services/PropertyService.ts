import { Property } from '@/components/properties/PropertyCard';

// In a real application, these would come from a database
// This structure prepares for backend integration
const samplePropertyImages: Record<string, string[]> = {
  '1': [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200',
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1200'
  ],
  '2': [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200'
  ],
  '3': [
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1200',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200'
  ],
  '4': [
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1200',
    'https://images.unsplash.com/photo-1602343168117-bb8a12d7c180?q=80&w=1200'
  ],
  '5': [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200'
  ],
  '6': [
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=1200',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200'
  ],
  '7': [
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1200',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200'
  ]
};

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

// Update all properties to use the image arrays instead of single imageUrl
sampleProperties.forEach(property => {
  const images = samplePropertyImages[property.id] || ['/placeholder.svg'];
  property.imageUrl = images[0]; // For backward compatibility
  property.images = images;
});

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
  
  // Get property images by ID
  getPropertyImages: async (id: string): Promise<string[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return samplePropertyImages[id] || ['/placeholder.svg'];
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
  },
  
  // Add a new method to prepare for backend integration
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
