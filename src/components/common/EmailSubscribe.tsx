
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

interface EmailSubscribeProps {
  title?: string;
  description?: string;
  className?: string;
}

const EmailSubscribe = ({
  title = "Stay updated on new properties",
  description = "Subscribe to our newsletter to receive the latest property listings and market insights.",
  className = "",
}: EmailSubscribeProps) => {
  const { subscribeToEmailUpdates } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      await subscribeToEmailUpdates(email);
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-secondary/20 rounded-xl p-6 border border-primary/10 ${className}`}>
      <div className="flex items-center mb-4">
        <Mail className="h-5 w-5 mr-2 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <p className="text-muted-foreground mb-4">
        {description}
      </p>
      
      {subscribed ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
          <p className="font-medium text-green-700 dark:text-green-300">
            Thank you for subscribing!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            You'll receive updates on new properties and market insights.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default EmailSubscribe;
