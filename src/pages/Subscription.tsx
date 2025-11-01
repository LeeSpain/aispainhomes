
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentForm from '@/components/subscription/PaymentForm';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

const Subscription = () => {
  const { user, userPreferences } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Check if the user has an active subscription
  const hasActiveSubscription = userPreferences?.subscription?.status === 'active' || 
                              userPreferences?.subscription?.status === 'trial';
  const currentPlan = userPreferences?.subscription?.plan || 'basic';
  
  // Extract plan from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const selectedPlan = searchParams.get('plan') || 'guardian';
  
  useEffect(() => {
    // If user has an active subscription, redirect to dashboard
    if (hasActiveSubscription && currentPlan === 'guardian') {
      toast.info('You already have an active subscription');
      navigate('/dashboard');
    }
    
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login?redirect=subscription');
    }
  }, [user, hasActiveSubscription, currentPlan, navigate]);
  
  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Please verify your email to continue.');
    navigate('/verify-email');
  };
  
  return (
    <>
      <Helmet>
        <title>Complete Registration | AISpainHomes</title>
      </Helmet>
      
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-2">Complete Your Registration</h1>
            <p className="text-center text-muted-foreground mb-12">
              Start your 7-day free trial of AI Guardian
            </p>
            
            <PaymentForm 
              selectedPlan={selectedPlan}
              onSuccess={handlePaymentSuccess}
              onCancel={() => navigate('/')}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;
