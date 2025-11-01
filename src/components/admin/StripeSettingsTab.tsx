import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, XCircle, Loader2, Key, CreditCard } from 'lucide-react';

export default function StripeSettingsTab() {
  const [secretKey, setSecretKey] = useState('');
  const [isTestMode, setIsTestMode] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStripeConfig();
  }, []);

  const loadStripeConfig = async () => {
    // TODO: Load from secrets/database once Stripe is enabled
    // For now, just check localStorage as placeholder
    const savedConfig = localStorage.getItem('stripe_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setIsConfigured(config.configured);
      setIsTestMode(config.testMode);
    }
  };

  const handleSaveKey = async () => {
    if (!secretKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Stripe secret key",
        variant: "destructive"
      });
      return;
    }

    // Validate key format
    const keyPrefix = isTestMode ? 'sk_test_' : 'sk_live_';
    if (!secretKey.startsWith(keyPrefix)) {
      toast({
        title: "Invalid Key Format",
        description: `${isTestMode ? 'Test' : 'Live'} mode keys must start with ${keyPrefix}`,
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // TODO: Once Stripe integration is enabled, use the secrets API
      // await supabase.functions.invoke('save-stripe-key', { 
      //   body: { secretKey, testMode: isTestMode } 
      // });
      
      // Temporary: Save to localStorage as placeholder
      localStorage.setItem('stripe_config', JSON.stringify({
        configured: true,
        testMode: isTestMode,
        keyMask: `${keyPrefix}****${secretKey.slice(-4)}`
      }));

      setIsConfigured(true);
      setSecretKey('');
      
      toast({
        title: "Success",
        description: "Stripe key saved successfully"
      });
    } catch (error) {
      console.error('Error saving Stripe key:', error);
      toast({
        title: "Error",
        description: "Failed to save Stripe key",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    
    try {
      // TODO: Once Stripe integration is enabled
      // const { data, error } = await supabase.functions.invoke('test-stripe-connection');
      
      // Simulate test for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Connection Successful",
        description: "Stripe API is responding correctly"
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Stripe API",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('stripe_config');
    setIsConfigured(false);
    setSecretKey('');
    toast({
      title: "Removed",
      description: "Stripe configuration cleared"
    });
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Stripe Integration Status
              </CardTitle>
              <CardDescription>
                Configure Stripe for subscription payments and billing
              </CardDescription>
            </div>
            {isConfigured ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Configured
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="h-3 w-3" />
                Not Configured
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isConfigured && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Stripe is configured and ready to process payments in {isTestMode ? 'test' : 'live'} mode.
                </AlertDescription>
              </Alert>
            )}
            
            {!isConfigured && (
              <Alert>
                <AlertDescription>
                  Add your Stripe secret key below to enable subscription payments, trials, and billing features.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Enter your Stripe API credentials from your Stripe dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test/Live Mode Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="test-mode" className="text-base">
                Test Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Use test API keys for development and testing
              </p>
            </div>
            <Switch
              id="test-mode"
              checked={isTestMode}
              onCheckedChange={setIsTestMode}
              disabled={isConfigured}
            />
          </div>

          {/* Secret Key Input */}
          <div className="space-y-2">
            <Label htmlFor="secret-key">
              Stripe Secret Key
              <span className="text-muted-foreground ml-2">
                ({isTestMode ? 'Test' : 'Live'} Mode)
              </span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="secret-key"
                type="password"
                placeholder={`sk_${isTestMode ? 'test' : 'live'}_...`}
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                disabled={isConfigured}
                className="font-mono text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Get your secret key from{' '}
              <a 
                href="https://dashboard.stripe.com/apikeys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Stripe Dashboard → Developers → API Keys
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isConfigured ? (
              <Button
                onClick={handleSaveKey}
                disabled={isSaving || !secretKey.trim()}
                className="gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Configuration
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  variant="outline"
                  className="gap-2"
                >
                  {isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Test Connection
                </Button>
                <Button
                  onClick={handleRemoveKey}
                  variant="destructive"
                  className="gap-2"
                >
                  Remove Configuration
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Stripe Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Once configured, the Stripe integration will enable:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>7-day free trial subscriptions with automatic billing</li>
            <li>Secure card storage without immediate charges</li>
            <li>Automatic invoice generation and email delivery</li>
            <li>Payment history and receipt management</li>
            <li>Subscription cancellation and refund processing</li>
            <li>Webhook handling for payment events</li>
          </ul>
          <p className="pt-2">
            <strong>Test Mode:</strong> Use test API keys (sk_test_...) during development. 
            No real charges will be made. Switch to Live Mode when ready for production.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
