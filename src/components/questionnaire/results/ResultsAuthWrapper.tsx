
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import { useNavigate } from 'react-router-dom';

interface ResultsAuthWrapperProps {
  showAuthForms: boolean;
  authTab: 'login' | 'register';
  subscriptionTier: {
    id: string;
    title: string;
    price: number;
    description: string;
    features: string[];
    isPopular: boolean;
    buttonText: string;
  };
  onAuthTabChange: (value: 'login' | 'register') => void;
  onContinueToAuth: () => void;
}

const ResultsAuthWrapper = ({
  showAuthForms,
  authTab,
  subscriptionTier,
  onAuthTabChange,
  onContinueToAuth
}: ResultsAuthWrapperProps) => {
  const navigate = useNavigate();

  if (!showAuthForms) {
    return (
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
    );
  }

  return (
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
  );
};

export default ResultsAuthWrapper;
