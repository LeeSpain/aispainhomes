
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyGrid from '@/components/properties/PropertyGrid';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import { Property } from '@/components/properties/PropertyCard';
import { PropertyService } from '@/services/PropertyService';

interface PropertyResultsProps {
  properties?: Property[];
  user: any;
  showAuthForms: boolean;
  authTab: 'login' | 'register';
  subscriptionTier: {
    title: string;
    price: number;
    description: string;
    features: string[];
    isPopular: boolean;
    buttonText: string;
  };
  onAuthTabChange: (value: 'login' | 'register') => void;
  onContinueToAuth: () => void;
  onAuthSuccess: () => void;
}

const PropertyResults = ({
  properties: initialProperties,
  user,
  showAuthForms,
  authTab,
  subscriptionTier,
  onAuthTabChange,
  onContinueToAuth,
  onAuthSuccess
}: PropertyResultsProps) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>(initialProperties || []);
  const [isLoading, setIsLoading] = useState(!initialProperties);

  useEffect(() => {
    if (initialProperties) {
      setProperties(initialProperties);
      setIsLoading(false);
      return;
    }

    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const propertiesData = await PropertyService.getFeaturedProperties();
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [initialProperties]);

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Your Top Property Matches</h1>
        <p className="text-muted-foreground mb-8">
          Based on your preferences, we've found these properties that might interest you. 
          {user ? "We'll email you these results for easy reference." : "Create an account to unlock all matches and premium features."}
        </p>
        
        <div className="mb-12">
          <PropertyGrid properties={properties} isLoading={isLoading} />
        </div>
        
        {!user && (
          <>
            {!showAuthForms ? (
              <div className="glass-panel rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4">Unlock Premium Features</h2>
                <p className="text-muted-foreground mb-8">
                  We've found more properties that match your criteria. Subscribe to our premium service 
                  for €9.99/month to see all results, get daily email alerts, and access our complete suite 
                  of relocation services.
                </p>
                
                <div className="mb-8">
                  <SubscriptionCard tier={subscriptionTier} />
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <Button 
                    size="lg" 
                    onClick={onContinueToAuth}
                    className="px-8 py-6 text-lg"
                  >
                    Continue to Subscribe
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    className="px-8 py-6 text-lg"
                  >
                    Return to Home
                  </Button>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-xl p-8 mb-12">
                <Tabs defaultValue={authTab} onValueChange={(value) => onAuthTabChange(value as 'login' | 'register')}>
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Create Account</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <LoginForm />
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <RegisterForm />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </>
        )}
        
        {user && (
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
            
            <Button onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyResults;
