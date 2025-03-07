
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

// Sample subscription tiers
const subscriptionTiers = [
  {
    title: 'Free',
    price: 0,
    description: 'Basic access to get you started',
    features: [
      'View 5 property matches',
      'Basic property search',
      'Single language support'
    ],
    buttonText: 'Get Started'
  },
  {
    title: 'Premium',
    price: 9.99,
    description: 'Full access for serious property hunters',
    features: [
      'Unlimited property matches',
      'Weekly email alerts',
      'Multilingual support',
      'Detailed property analytics',
      'Save favorite properties'
    ],
    isPopular: true,
    buttonText: 'Try Premium'
  },
  {
    title: 'Relocation Pro',
    price: 19.99,
    description: 'Complete package for your move to Spain',
    features: [
      'All Premium features',
      'Lawyer recommendations',
      'Utility setup guides',
      'School & healthcare finder',
      'Personalized relocation assistance',
      'Priority support'
    ],
    buttonText: 'Go Pro'
  }
];

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
          
          {/* Subscription Plans */}
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  <span className="text-xs font-medium uppercase tracking-wider">Plans & Pricing</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
                  Choose the Plan That Fits Your Needs
                </h2>
                <p className="mt-4 text-xl text-muted-foreground text-balance">
                  Whether you're just browsing or planning a complete relocation, we have the right package for you.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {subscriptionTiers.map((tier, index) => (
                  <SubscriptionCard key={index} tier={tier} />
                ))}
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
