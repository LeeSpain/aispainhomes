
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const PricingSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!user) {
      navigate('/login?redirect=subscription');
    } else {
      navigate('/subscription?plan=clara');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card className="border-primary">
        <CardHeader className="bg-primary/5 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Clara Premium</CardTitle>
              <CardDescription className="text-lg">Full relocation support package</CardDescription>
            </div>
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4 text-center">
            <span className="text-5xl font-bold">€24.99</span>
            <span className="text-muted-foreground text-lg"> / month</span>
            <p className="text-accent-foreground font-medium mt-2">
              Start with a 7-day free trial
            </p>
            <p className="text-sm text-muted-foreground mt-1">Card details required. Cancel anytime.</p>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-lg">All-inclusive package includes:</h3>
            <ul className="space-y-3">
              {[
                'Clara - Your AI assistant for full relocation support',
                'Personalized relocation timeline',
                'Document checklist and reminders',
                'Visa and residency guidance',
                'Tax planning assistance',
                'Banking setup support',
                'Cultural integration resources',
                'Priority customer support',
                '24/7 AI assistance in 5 languages'
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border mb-8">
            <p className="text-sm">
              <strong>How it works:</strong> Sign up today and start your free 7-day trial. Your card will be charged €24.99 after the trial period unless you cancel. No long-term contract required.
            </p>
          </div>
          
          <Button size="lg" className="w-full py-6 text-lg" onClick={handleGetStarted}>
            Start Your Free Trial
          </Button>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Questions about Clara? <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/contact')}>Contact our team</Button>
        </p>
      </div>
    </div>
  );
};

export default PricingSection;
