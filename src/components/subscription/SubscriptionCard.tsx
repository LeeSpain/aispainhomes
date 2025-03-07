
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionTier {
  title: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
}

interface SubscriptionCardProps {
  tier: SubscriptionTier;
}

const SubscriptionCard = ({ tier }: SubscriptionCardProps) => {
  return (
    <div 
      className={`relative glass-panel rounded-xl overflow-hidden p-6 transition-all duration-300 ${
        tier.isPopular ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
    >
      {tier.isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
            Popular
          </div>
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-2">{tier.title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">€{tier.price}</span>
        <span className="text-muted-foreground">/month</span>
      </div>
      
      <p className="text-muted-foreground mb-6">{tier.description}</p>
      
      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={`w-full ${tier.isPopular ? 'bg-primary hover:bg-primary/90' : ''}`}
        variant={tier.isPopular ? 'default' : 'outline'}
      >
        {tier.buttonText}
      </Button>
    </div>
  );
};

export default SubscriptionCard;
