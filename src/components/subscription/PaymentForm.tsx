import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { stripePromise } from '@/lib/stripe';
import StripePaymentForm from './StripePaymentForm';

interface PaymentFormProps {
  selectedPlan: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm = ({ selectedPlan, onSuccess, onCancel }: PaymentFormProps) => {
  const { user, updateUserPreferences } = useAuth();
  const [step, setStep] = useState<'personal' | 'payment' | 'completed'>('personal');
  
  // Personal details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !phone || !address || !city || !country || !postalCode) {
      toast.error('Please fill in all personal details');
      return;
    }
    
    // Move to payment step
    setStep('payment');
  };

  const handlePaymentSuccess = () => {
    setStep('completed');
    
    // Notify parent component after a brief delay
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  const renderPersonalDetailsForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Registration</CardTitle>
        <CardDescription>
          Please provide your personal details to continue with your 7-day free trial.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handlePersonalSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+34 123 456 789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main Street"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Barcelona"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="08001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="Spain"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="button" variant="outline" onClick={onCancel} className="mr-2">
            Cancel
          </Button>
          <Button type="submit">
            Continue to Payment
          </Button>
        </CardFooter>
      </form>
    </Card>
  );

  const renderPaymentForm = () => (
    <Elements stripe={stripePromise}>
      <StripePaymentForm
        personalDetails={{
          fullName,
          phone,
          address,
          city,
          country,
          postalCode,
        }}
        onSuccess={handlePaymentSuccess}
        onBack={() => setStep('personal')}
      />
    </Elements>
  );

  const renderCompletionCard = () => (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="mb-2">Your Free Trial Has Started!</CardTitle>
        <CardDescription className="mb-3">
          Welcome to AI Guardian! Your 7-day free trial is now active.
        </CardDescription>
        <p className="text-sm text-muted-foreground">
          Your card will be automatically charged €24.99 after your trial period ends. 
          You can cancel anytime from your dashboard.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-md mx-auto">
      {step === 'personal' && renderPersonalDetailsForm()}
      {step === 'payment' && renderPaymentForm()}
      {step === 'completed' && renderCompletionCard()}
    </div>
  );
};

export default PaymentForm;
