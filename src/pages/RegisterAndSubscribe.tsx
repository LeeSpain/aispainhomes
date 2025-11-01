import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import StripePaymentForm from '@/components/subscription/StripePaymentForm';

type Step = 'account' | 'billing' | 'payment' | 'complete';

const RegisterAndSubscribe = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('account');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Account details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Billing details
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim() || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password);
      toast.success('Account created!');
      setCurrentStep('billing');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || !address || !city || !country || !postalCode) {
      setError('Please fill in all billing details');
      return;
    }

    setCurrentStep('payment');
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('complete');
    setTimeout(() => {
      navigate('/questionnaire');
    }, 2500);
  };

  const renderProgressSteps = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {[
          { key: 'account', label: 'Account', number: 1 },
          { key: 'billing', label: 'Billing', number: 2 },
          { key: 'payment', label: 'Payment', number: 3 },
        ].map((step, index) => (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  currentStep === step.key
                    ? 'bg-primary text-primary-foreground'
                    : index < ['account', 'billing', 'payment', 'complete'].indexOf(currentStep)
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.number}
              </div>
              <span className="text-xs mt-2 font-medium">{step.label}</span>
            </div>
            {index < 2 && (
              <div
                className={`h-0.5 flex-1 transition-colors ${
                  index < ['account', 'billing', 'payment'].indexOf(currentStep)
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccountStep = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          Start your 7-day free trial of AI Guardian
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleAccountSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Continue to Billing'
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </p>
        </CardContent>
      </form>
    </Card>
  );

  const renderBillingStep = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>
          Required for payment processing
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleBillingSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+34 123 456 789"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Barcelona"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="08001"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Spain"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep('account')}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Continue to Payment
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );

  const renderPaymentStep = () => (
    <div className="max-w-md mx-auto">
      <Elements stripe={stripePromise}>
        <StripePaymentForm
          personalDetails={{
            fullName: name,
            phone,
            address,
            city,
            country,
            postalCode,
          }}
          onSuccess={handlePaymentSuccess}
          onBack={() => setCurrentStep('billing')}
        />
      </Elements>
    </div>
  );

  const renderCompleteStep = () => (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6 text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </div>
        <CardTitle>Welcome to AI Homes Spain!</CardTitle>
        <CardDescription className="text-base">
          Your 7-day free trial has started. You'll be charged €24.99 after the trial ends.
        </CardDescription>
        <p className="text-sm text-muted-foreground">
          Redirecting you to the questionnaire to find your perfect Spanish home...
        </p>
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Register | AI Homes Spain</title>
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Start Your Free Trial</h1>
            <p className="text-muted-foreground">
              7 days free, then €24.99/month. Cancel anytime.
            </p>
          </div>

          {currentStep !== 'complete' && renderProgressSteps()}

          {currentStep === 'account' && renderAccountStep()}
          {currentStep === 'billing' && renderBillingStep()}
          {currentStep === 'payment' && renderPaymentStep()}
          {currentStep === 'complete' && renderCompleteStep()}
        </div>
      </div>
    </>
  );
};

export default RegisterAndSubscribe;
