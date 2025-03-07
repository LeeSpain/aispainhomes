
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const subscriptionTiers = [
  {
    id: 'basic',
    title: 'Basic',
    price: 0,
    description: 'Free access to property search',
    features: [
      'Property search',
      'Save favorites',
      'Basic property filters',
      'Email support',
    ],
    buttonText: 'Current Plan',
    isPopular: false,
  },
  {
    id: 'premium',
    title: 'Premium',
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
    ],
    buttonText: 'Upgrade Now',
    isPopular: true,
  },
  {
    id: 'guardian',
    title: 'AI Guardian',
    price: 19.99,
    description: 'Premium plan plus full AI relocation assistance',
    features: [
      'All Premium features',
      'AI Guardian for full relocation support',
      'Personalized relocation timeline',
      'Document checklist and reminders',
      'Visa and residency guidance',
      'Tax planning assistance',
      'Banking setup support',
      'Cultural integration resources',
      'Priority customer support',
      '24/7 AI assistance',
    ],
    buttonText: 'Get Guardian',
    isPopular: false,
  }
];

const Subscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast.success(`Successfully subscribed to ${selectedPlan} plan`);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Subscription Plans | SunnyHomeFinder</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold text-center mb-2">Choose Your Plan</h1>
              <p className="text-center text-muted-foreground mb-12">
                Select the plan that best fits your needs and start your Spanish property journey
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {subscriptionTiers.map((tier) => (
                  <div key={tier.id} className={`relative ${selectedPlan === tier.id ? 'ring-2 ring-primary' : ''}`}>
                    <SubscriptionCard 
                      tier={tier} 
                      isSelected={selectedPlan === tier.id}
                      onSelect={() => handleSelectPlan(tier.id)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Button 
                  size="lg" 
                  onClick={handleSubscribe}
                  disabled={!selectedPlan || loading}
                  className="px-8"
                >
                  {loading ? 'Processing...' : 'Subscribe Now'}
                </Button>
                
                <p className="mt-4 text-sm text-muted-foreground">
                  Secure payment processing. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Subscription;
