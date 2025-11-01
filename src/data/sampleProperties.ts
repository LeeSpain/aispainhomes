
import { Property } from '@/components/properties/PropertyCard';

// Sample property images for development
export const samplePropertyImages: Record<string, string[]> = {
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

// Sample property data for development
export const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment with Sea View',
    location: 'Marbella, Málaga',
    price: 320000,
    priceUnit: 'total',
    currency: 'EUR',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200'],
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200',
    description: 'Beautiful modern apartment with stunning sea views in Marbella',
    features: ['Sea View', 'Pool', 'Parking', 'Terrace', 'Air Conditioning'],
    status: 'forSale',
    isForRent: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Luxury Villa with Pool',
    location: 'Ibiza Town, Ibiza',
    price: 1250000,
    priceUnit: 'total',
    currency: 'EUR',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200'],
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200',
    description: 'Luxury villa with private pool in exclusive Ibiza location',
    features: ['Pool', 'Garden', 'Parking', 'Sea View', 'Security System'],
    status: 'forSale',
    isForRent: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Cozy Studio in City Center',
    location: 'Barcelona, Catalonia',
    price: 950,
    priceUnit: 'monthly',
    currency: 'EUR',
    type: 'Studio',
    bedrooms: 0,
    bathrooms: 1,
    area: 48,
    images: ['https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1200', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200'],
    imageUrl: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1200',
    description: 'Cozy studio in the heart of Barcelona',
    features: ['Furnished', 'City Center', 'Air Conditioning', 'Public Transport'],
    status: 'forRent',
    isForRent: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Beachfront Condo',
    location: 'Valencia, Comunidad Valenciana',
    price: 285000,
    priceUnit: 'total',
    currency: 'EUR',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    images: ['https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1200', 'https://images.unsplash.com/photo-1602343168117-bb8a12d7c180?q=80&w=1200'],
    imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1200',
    description: 'Beachfront condo with pool and modern amenities',
    features: ['Beachfront', 'Pool', 'Furnished', 'Balcony'],
    status: 'forSale',
    isForRent: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Countryside Finca',
    location: 'Ronda, Málaga',
    price: 495000,
    priceUnit: 'total',
    currency: 'EUR',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200'],
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200',
    description: 'Charming countryside finca with mountain views',
    features: ['Garden', 'Mountain View', 'Fireplace', 'Fruit Trees'],
    status: 'forSale',
    isForRent: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    title: 'City Center Penthouse',
    location: 'Madrid, Comunidad de Madrid',
    price: 750000,
    priceUnit: 'total',
    currency: 'EUR',
    type: 'Penthouse',
    bedrooms: 3,
    bathrooms: 2,
    area: 175,
    images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=1200', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200'],
    imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=1200',
    description: 'Stunning penthouse in Madrid city center',
    features: ['Terrace', 'City View', 'Parking', 'Modern Kitchen'],
    status: 'forSale',
    isForRent: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    title: 'Costa Blanca Townhouse',
    location: 'Alicante, Comunidad Valenciana',
    price: 225000,
    priceUnit: 'total',
    currency: 'EUR',
    type: 'Townhouse',
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    images: ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1200', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200'],
    imageUrl: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1200',
    description: 'Charming townhouse on the Costa Blanca',
    features: ['Community Pool', 'Garden', 'Near Beach', 'Furnished'],
    status: 'forSale',
    isForRent: false,
    createdAt: new Date().toISOString()
  }
];

// Update properties with image arrays
sampleProperties.forEach(property => {
  if (!property.images) {
    property.images = samplePropertyImages[property.id] || [property.imageUrl || '/placeholder.svg'];
  }
});
