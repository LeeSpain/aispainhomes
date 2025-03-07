import { Helmet } from 'react-helmet';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import PropertyGrid from '@/components/properties/PropertyGrid';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import { Button } from '@/components/ui/button';

// Sample properties data for presentation
const sampleProperties = [
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
  }
];

// Updated subscription tier - single €9.99 option
const subscriptionTier = {
  title: 'Premium Access',
  price: 9.99,
  description: 'Complete access to all property search and relocation services',
  features: [
    'Unlimited property matches',
    'Daily email alerts for new properties',
    'Multilingual support (6+ languages)',
    'Lawyer and service provider searches',
    'TV and utility setup assistance',
    'School & healthcare finder',
    'Moving company recommendations',
    'Personalized relocation guides'
  ],
  isPopular: true,
  buttonText: 'Start Your Journey'
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>SunnyHomeFinder | Find Your Dream Property in Spain</title>
        <meta name="description" content="AI-powered property search and relocation assistance for Spain" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <Hero />
          <Features />
          
          {/* Featured Properties */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  <span className="text-xs font-medium uppercase tracking-wider">Featured Properties</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
                  Discover Stunning Properties Across Spain
                </h2>
                <p className="mt-4 text-xl text-muted-foreground text-balance">
                  From beachfront apartments to rustic countryside homes, find the perfect property to match your lifestyle.
                </p>
              </div>
              
              <PropertyGrid properties={sampleProperties} />
              
              <div className="mt-12 text-center">
                <Button size="lg" className="group" onClick={() => window.location.href = '/questionnaire'}>
                  Find Your Perfect Match
                </Button>
              </div>
            </div>
          </section>
          
          {/* Subscription Plan */}
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  <span className="text-xs font-medium uppercase tracking-wider">Premium Service</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
                  Complete Property & Relocation Support
                </h2>
                <p className="mt-4 text-xl text-muted-foreground text-balance">
                  One simple plan that gives you access to all our property finding and relocation services.
                </p>
              </div>
              
              <div className="max-w-md mx-auto">
                <SubscriptionCard tier={subscriptionTier} />
              </div>
              
              <div className="mt-12 text-center max-w-2xl mx-auto">
                <p className="text-sm text-muted-foreground">
                  Our premium subscription includes unlimited property searches, daily alerts, lawyer and service provider recommendations, 
                  plus comprehensive relocation support - all for one affordable monthly price.
                </p>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
