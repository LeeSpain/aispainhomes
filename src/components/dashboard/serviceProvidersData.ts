
import { ServiceProvider } from "./ServiceProviderList";

const sampleServiceProviders: Record<string, ServiceProvider[]> = {
  lawyers: [
    { id: '1', name: 'Martinez & Associates', type: 'Law Firm', location: 'Barcelona', contact: 'contact@martinez.es', details: 'Specializes in property law and foreign investments' },
    { id: '2', name: 'Spanish Legal Services', type: 'Law Firm', location: 'Marbella', contact: 'info@spanishlegals.com', details: 'English speaking lawyers with property expertise' },
    { id: '3', name: 'Garcia Law', type: 'Law Firm', location: 'Madrid', contact: 'office@garcia.legal', details: 'Full service legal assistance for property transactions' },
  ],
  utilities: [
    { id: '1', name: 'Movistar', type: 'Internet & TV', location: 'Nationwide', contact: 'support@movistar.es', details: 'Fiber optic internet and TV packages' },
    { id: '2', name: 'Endesa', type: 'Electricity', location: 'Nationwide', contact: 'clients@endesa.es', details: 'Electricity provider with english support' },
    { id: '3', name: 'Canal de Isabel II', type: 'Water', location: 'Madrid', contact: 'info@canaldeisabelsegunda.es', details: 'Water utility provider for Madrid region' },
  ],
  movers: [
    { id: '1', name: 'International Movers Spain', type: 'Moving Company', location: 'Barcelona', contact: 'bookings@intmovers.es', details: 'Specializes in international relocations' },
    { id: '2', name: 'MoveToSpain', type: 'Moving Company', location: 'Nationwide', contact: 'quotes@movetospain.com', details: 'Door-to-door moving services across Europe' },
    { id: '3', name: 'Express Relocations', type: 'Moving & Storage', location: 'Costa del Sol', contact: 'info@expressrelo.es', details: 'Full service moving and temporary storage' },
  ],
  schools: [
    { id: '1', name: 'British School of Barcelona', type: 'International School', location: 'Barcelona', contact: 'admissions@bsb.edu.es', details: 'British curriculum, ages 3-18' },
    { id: '2', name: 'American School of Madrid', type: 'International School', location: 'Madrid', contact: 'info@asmadrid.org', details: 'American curriculum, PreK-Grade 12' },
    { id: '3', name: 'Deutsche Schule Valencia', type: 'International School', location: 'Valencia', contact: 'info@dsvalencia.org', details: 'German curriculum with English and Spanish' },
  ],
  healthcare: [
    { id: '1', name: 'Quirónsalud Hospital', type: 'Private Hospital', location: 'Multiple Cities', contact: 'international@quironsalud.es', details: 'Network of private hospitals with international patient departments' },
    { id: '2', name: 'MAPFRE Health', type: 'Insurance Provider', location: 'Nationwide', contact: 'salud@mapfre.com', details: 'Health insurance with English-speaking doctors network' },
    { id: '3', name: 'Sanitas', type: 'Insurance & Clinics', location: 'Nationwide', contact: 'clientes@sanitas.es', details: 'Private health insurance and medical centers' },
  ]
};

export default sampleServiceProviders;
