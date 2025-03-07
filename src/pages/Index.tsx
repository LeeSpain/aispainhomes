import { Helmet } from 'react-helmet';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PropertyCard, { Property } from '@/components/properties/PropertyCard';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';

// Sample featured properties data
const featuredProperties: Property[] = [
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

// Updated subscription tier - single €9.99 option with comprehensive services
const subscriptionTier = {
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
    'Market insights and analytics'
  ],
  isPopular: true,
  buttonText: 'Start Your Journey'
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>SunnyHomeFinder | Find Your Dream Property in Spain</title>
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
                  Discover Your Dream Spanish Property
                </h2>
                <p className="mt-4 text-xl text-muted-foreground text-balance">
                  From beachfront apartments to countryside villas, find your perfect place in the sun.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              
              <div className="text-center">
                <Link to="/questionnaire">
                  <Button size="lg" className="text-lg px-8">
                    Find Your Perfect Match
                  </Button>
                </Link>
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
                  One simple plan with everything you need for finding property and relocating to Spain.
                </p>
              </div>
              
              <div className="max-w-xl mx-auto">
                <SubscriptionCard tier={subscriptionTier} />
              </div>
              
              <div className="mt-12 text-center max-w-2xl mx-auto">
                <p className="text-sm text-muted-foreground">
                  Our all-inclusive premium subscription provides unlimited property searches with AI-powered matching, 
                  daily email alerts featuring your top 10 property matches, comprehensive relocation services including 
                  lawyer and utility provider recommendations, and multilingual support throughout your journey to Spain.
                </p>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-primary/90 to-primary text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                Ready to Find Your Dream Home in Spain?
              </h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90 text-balance">
                Start your personalized property search today and receive AI-matched recommendations tailored to your needs.
              </p>
              <Link to="/questionnaire">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Begin Your Journey
                </Button>
              </Link>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
