
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

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
  
  // Payment details
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const val = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = val.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const val = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (val.length > 2) {
      return val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    return val;
  };

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !phone || !address || !city || !country || !postalCode) {
      toast.error('Please fill in all personal details');
      return;
    }
    
    // Auto-fill card name from full name
    setCardName(fullName);
    
    // Move to payment step
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }
    
    if (!cardNumber || !expiryDate || !cvc || !cardName) {
      toast.error('Please fill in all payment details');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('completed');
      
      // Calculate trial end date (7 days from now)
      const trialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      // Update user subscription and profile in context
      updateUserPreferences({
        subscription: {
          plan: selectedPlan,
          status: 'trial',
          startDate: new Date().toISOString(),
          trialEndDate: trialEndDate.toISOString(),
          nextBillingDate: trialEndDate.toISOString(),
        },
        profile: {
          fullName,
          phone,
          address,
          city,
          country,
          postalCode
        }
      });
      
      toast.success(`Your 7-day free trial has started!`);
      
      // Notify parent component of success
      setTimeout(() => {
        onSuccess();
      }, 2000);
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
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Enter your payment details to begin your 7-day free trial. You won't be charged until after your trial ends.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handlePaymentSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              placeholder="John Smith"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                required
              />
              <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                maxLength={3}
                required
              />
            </div>
          </div>
          
          <div className="bg-primary/5 p-3 rounded-lg border text-sm">
            <p><strong>Trial Terms:</strong> Your 7-day free trial starts today. Your card will be charged €24.99 after the trial period unless you cancel. Cancel anytime from your dashboard.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => setStep('personal')}>
            Back
          </Button>
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Start Free Trial'}
          </Button>
        </CardFooter>
      </form>
    </Card>
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
