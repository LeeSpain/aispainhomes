
import { ServiceProvider } from "./ServiceProviderList";

// Export the service provider data objects
export const lawyers: ServiceProvider[] = [
  { 
    id: '1', 
    name: 'Martinez & Associates', 
    type: 'Law Firm', 
    location: 'Barcelona', 
    contact: 'contact@martinez.es', 
    details: 'Specializes in property law and foreign investments',
    locations: ['Barcelona', 'Madrid', 'Valencia'],
    serviceCategory: 'legal',
    suitableFor: ['families', 'individuals'],
    urgency: 'high'
  },
  { 
    id: '2', 
    name: 'Spanish Legal Services', 
    type: 'Law Firm', 
    location: 'Marbella', 
    contact: 'info@spanishlegals.com', 
    details: 'English speaking lawyers with property expertise',
    locations: ['Marbella', 'Costa del Sol', 'Malaga'],
    serviceCategory: 'legal',
    suitableFor: ['families', 'individuals'],
    urgency: 'high'
  },
  { 
    id: '3', 
    name: 'Garcia Law', 
    type: 'Law Firm', 
    location: 'Madrid', 
    contact: 'office@garcia.legal', 
    details: 'Full service legal assistance for property transactions',
    locations: ['Madrid', 'Toledo'],
    serviceCategory: 'legal',
    suitableFor: ['families', 'individuals'],
    urgency: 'high'
  },
];

export const utilities: ServiceProvider[] = [
  { 
    id: '1', 
    name: 'Movistar', 
    type: 'Internet & TV', 
    location: 'Nationwide', 
    contact: 'support@movistar.es', 
    details: 'Fiber optic internet and TV packages',
    locations: ['All Spain'],
    serviceCategory: 'utilities',
    suitableFor: ['families', 'individuals'],
    urgency: 'medium'
  },
  { 
    id: '2', 
    name: 'Endesa', 
    type: 'Electricity', 
    location: 'Nationwide', 
    contact: 'clients@endesa.es', 
    details: 'Electricity provider with english support',
    locations: ['All Spain'],
    serviceCategory: 'utilities',
    suitableFor: ['families', 'individuals'],
    urgency: 'medium'
  },
  { 
    id: '3', 
    name: 'Canal de Isabel II', 
    type: 'Water', 
    location: 'Madrid', 
    contact: 'info@canaldeisabelsegunda.es', 
    details: 'Water utility provider for Madrid region',
    locations: ['Madrid'],
    serviceCategory: 'utilities',
    suitableFor: ['families', 'individuals'],
    urgency: 'medium'
  },
];

export const movers: ServiceProvider[] = [
  { 
    id: '1', 
    name: 'International Movers Spain', 
    type: 'Moving Company', 
    location: 'Barcelona', 
    contact: 'bookings@intmovers.es', 
    details: 'Specializes in international relocations',
    locations: ['Barcelona', 'Madrid', 'Valencia'],
    serviceCategory: 'movers',
    suitableFor: ['families', 'individuals', 'pets'],
    urgency: 'high'
  },
  { 
    id: '2', 
    name: 'MoveToSpain', 
    type: 'Moving Company', 
    location: 'Nationwide', 
    contact: 'quotes@movetospain.com', 
    details: 'Door-to-door moving services across Europe',
    locations: ['All Spain'],
    serviceCategory: 'movers',
    suitableFor: ['families', 'individuals', 'pets'],
    urgency: 'high'
  },
  { 
    id: '3', 
    name: 'Express Relocations', 
    type: 'Moving & Storage', 
    location: 'Costa del Sol', 
    contact: 'info@expressrelo.es', 
    details: 'Full service moving and temporary storage',
    locations: ['Costa del Sol', 'Malaga', 'Granada'],
    serviceCategory: 'movers',
    suitableFor: ['families', 'individuals', 'pets'],
    urgency: 'high'
  },
];

export const schools: ServiceProvider[] = [
  { 
    id: '1', 
    name: 'British School of Barcelona', 
    type: 'International School', 
    location: 'Barcelona', 
    contact: 'admissions@bsb.edu.es', 
    details: 'British curriculum, ages 3-18',
    locations: ['Barcelona'],
    serviceCategory: 'schools',
    suitableFor: ['families'],
    urgency: 'medium'
  },
  { 
    id: '2', 
    name: 'American School of Madrid', 
    type: 'International School', 
    location: 'Madrid', 
    contact: 'info@asmadrid.org', 
    details: 'American curriculum, PreK-Grade 12',
    locations: ['Madrid'],
    serviceCategory: 'schools',
    suitableFor: ['families'],
    urgency: 'medium'
  },
  { 
    id: '3', 
    name: 'Deutsche Schule Valencia', 
    type: 'International School', 
    location: 'Valencia', 
    contact: 'info@dsvalencia.org', 
    details: 'German curriculum with English and Spanish',
    locations: ['Valencia'],
    serviceCategory: 'schools',
    suitableFor: ['families'],
    urgency: 'medium'
  },
];

export const healthcare: ServiceProvider[] = [
  { 
    id: '1', 
    name: 'Quirónsalud Hospital', 
    type: 'Private Hospital', 
    location: 'Multiple Cities', 
    contact: 'international@quironsalud.es', 
    details: 'Network of private hospitals with international patient departments',
    locations: ['Madrid', 'Barcelona', 'Valencia', 'Marbella'],
    serviceCategory: 'healthcare',
    suitableFor: ['families', 'individuals'],
    urgency: 'medium'
  },
  { 
    id: '2', 
    name: 'MAPFRE Health', 
    type: 'Insurance Provider', 
    location: 'Nationwide', 
    contact: 'salud@mapfre.com', 
    details: 'Health insurance with English-speaking doctors network',
    locations: ['All Spain'],
    serviceCategory: 'healthcare',
    suitableFor: ['families', 'individuals'],
    urgency: 'medium'
  },
  { 
    id: '3', 
    name: 'Sanitas', 
    type: 'Insurance & Clinics', 
    location: 'Nationwide', 
    contact: 'clientes@sanitas.es', 
    details: 'Private health insurance and medical centers',
    locations: ['All Spain'],
    serviceCategory: 'healthcare',
    suitableFor: ['families', 'individuals'],
    urgency: 'medium'
  },
];
