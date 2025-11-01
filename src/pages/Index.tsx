
import { Helmet } from 'react-helmet';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PropertyCard from '@/components/properties/PropertyCard';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import { Sun, Palmtree, Check } from 'lucide-react';
import { sampleProperties } from '@/data/sampleProperties';

// Get first 3 properties for featured section
const featuredProperties = sampleProperties.slice(0, 3);

// Updated subscription tier - single €24.99 option with comprehensive services and 7-day trial
const subscriptionTier = {
  id: 'guardian',
  title: 'AI Guardian',
  price: 24.99,
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
  buttonText: 'Start Free Trial',
  hasTrial: true,
  trialDays: 7
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>AIHomesSpain.com | Find Your Dream Property in Spain</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Hero />
          
          <Features />
          
          {/* Featured Properties */}
          <section className="py-24 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                  <Sun className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Featured Properties</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Handpicked Spanish Properties
                </h2>
                <p className="text-xl text-muted-foreground">
                  Explore our curated selection of exceptional properties across Spain's most sought-after locations.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              
              <div className="text-center">
                <Link to="/register">
                  <Button size="lg" className="px-10 py-6 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                    Discover More Properties
                  </Button>
                </Link>
              </div>
            </div>
          </section>
          
          {/* Subscription Plan */}
          <section className="py-24 relative overflow-hidden bg-gradient-to-br from-background to-secondary/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,140,0,0.03),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.03),transparent_50%)]"></div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                  <Sun className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Simple Pricing</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  One Plan, Everything Included
                </h2>
                <p className="text-xl text-muted-foreground">
                  Complete property search and relocation support for your Spanish journey.
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="relative p-10 rounded-3xl bg-card/50 backdrop-blur-sm border-2 border-primary/30 shadow-2xl hover:shadow-primary/20 transition-all duration-300">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                  
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-4">{subscriptionTier.title}</h3>
                    <div className="mb-4">
                      <span className="text-6xl font-bold">€{subscriptionTier.price}</span>
                      <span className="text-2xl text-muted-foreground">/month</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-4">
                      <span className="text-sm font-semibold text-accent-foreground">
                        🎉 7-Day Free Trial
                      </span>
                    </div>
                    <p className="text-muted-foreground text-lg">{subscriptionTier.description}</p>
                  </div>
                  
                  <div className="border-t border-border pt-8 mb-8">
                    <h4 className="font-semibold text-lg mb-6 text-center">Everything included:</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {subscriptionTier.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Link to="/register">
                    <Button className="w-full py-6 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                      {subscriptionTier.buttonText}
                    </Button>
                  </Link>
                  
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Card details required. You won't be charged until after your trial ends.
                  </p>
                </div>
              </div>
              
              <div className="mt-16 text-center max-w-2xl mx-auto">
                <p className="text-muted-foreground">
                  Join thousands of satisfied customers who found their dream Spanish home with our AI-powered platform. Cancel anytime, no questions asked.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Index;
