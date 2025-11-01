
import { Property } from '@/components/properties/PropertyCard';

export const cities = [
  'Barcelona', 'Madrid', 'Valencia', 'Malaga', 'Alicante', 
  'Marbella', 'Ibiza', 'Mallorca', 'Tenerife', 'Gran Canaria'
];

export const propertyTypes = [
  'Apartment', 'House', 'Villa', 'Penthouse', 'Studio', 'Townhouse', 'Land'
];

export const amenities = [
  'Swimming Pool', 'Garden', 'Terrace', 'Parking', 'Air Conditioning', 
  'Sea View', 'Mountain View', 'Security System', 'Elevator', 'Gym'
];

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
    images: ['/placeholder.svg'],
    imageUrl: '/placeholder.svg',
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
    images: ['/placeholder.svg'],
    imageUrl: '/placeholder.svg',
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
    images: ['/placeholder.svg'],
    imageUrl: '/placeholder.svg',
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
    images: ['/placeholder.svg'],
    imageUrl: '/placeholder.svg',
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
    images: ['/placeholder.svg'],
    imageUrl: '/placeholder.svg',
    description: 'Charming countryside finca with mountain views',
    features: ['Garden', 'Mountain View', 'Fireplace', 'Fruit Trees'],
    status: 'forSale',
    isForRent: false,
    createdAt: new Date().toISOString()
  }
];

export const subscriptionTier = {
  id: 'premium',
  title: 'Premium Access',
  price: 9.99,
  description: 'Complete access to all property search and relocation services',
  features: [
    'Unlimited property matches',
    'Daily email alerts with top 10 new properties',
    'Multilingual support (6+ languages)',
    'Lawyer and service provider searches',
    'TV and utility setup assistance',
    'School & healthcare finder',
    'Moving company recommendations',
    'Personalized relocation guides',
    'Market insights and analytics',
    'AI Guardian for full relocation support'
  ],
  isPopular: true,
  buttonText: 'Start Your Journey'
};
