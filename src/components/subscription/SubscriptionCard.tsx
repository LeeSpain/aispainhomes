
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionTier {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  hasTrial?: boolean;
  trialDays?: number;
}

interface SubscriptionCardProps {
  tier: SubscriptionTier;
  isSelected?: boolean;
  onSelect?: () => void;
  isCurrentPlan?: boolean;
}

const SubscriptionCard = ({ tier, isSelected = false, onSelect, isCurrentPlan = false }: SubscriptionCardProps) => {
  return (
    <div 
      className={`relative glass-panel rounded-xl overflow-hidden p-8 transition-all duration-300 border ${
        isSelected ? 'border-primary shadow-primary/20' : 
        isCurrentPlan ? 'border-green-500 shadow-green-500/20' : 'border-primary/20'
      } shadow-lg`}
      onClick={onSelect}
    >
      {tier.isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
            Popular Plan
          </div>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute top-0 left-0">
          <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-br-lg">
            Current Plan
          </div>
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-2">{tier.title}</h3>
      <div className="mb-2">
        <span className="text-4xl font-bold">€{tier.price}</span>
        <span className="text-muted-foreground">/month</span>
      </div>
      
      {tier.hasTrial && (
        <div className="bg-primary/10 text-accent-foreground font-medium rounded-md py-1 px-2 text-sm mb-3 inline-block">
          {tier.trialDays}-day free trial
        </div>
      )}
      
      <p className="text-muted-foreground mb-6">{tier.description}</p>
      
      <div className="border-t border-border pt-6 mb-6">
        <h4 className="font-semibold mb-4">What's included:</h4>
        <ul className="space-y-3 mb-8">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Button 
        className={`w-full ${
          isCurrentPlan ? 'bg-green-500 hover:bg-green-600' :
          isSelected ? 'bg-primary' : 'bg-primary/80 hover:bg-primary/90'
        }`}
        onClick={onSelect}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? 'Current Plan' : tier.buttonText}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground mt-4">
        {tier.hasTrial 
          ? "Card details required. You won't be charged until after your trial ends."
          : "No long-term contract. Cancel anytime."}
      </p>
    </div>
  );
};

export default SubscriptionCard;
