
import { Button } from "@/components/ui/button";
import { ShieldCheck, Calendar, Check, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const OverviewSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!user) {
      navigate('/login?redirect=ai-guardian');
    } else {
      navigate('/subscription');
    }
  };

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <p className="text-xl leading-relaxed mb-6">
        Relocating to a new country can be overwhelming, but with AI Guardian, you'll have a personal assistant guiding you through every step of the process.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Personalized Guidance
          </h3>
          <p className="text-muted-foreground">
            AI Guardian analyzes your specific situation to create a customized relocation plan tailored to your needs.
          </p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Timeline Management
          </h3>
          <p className="text-muted-foreground">
            Stay on track with a detailed timeline and reminders for important deadlines throughout your relocation journey.
          </p>
        </div>
      </div>
      
      <p className="text-xl leading-relaxed mb-6">
        Our AI-powered service provides personalized guidance for all aspects of your move to Spain, from legal requirements to finding schools and healthcare providers.
      </p>
      
      <div className="my-10 flex justify-center">
        <Button size="lg" onClick={handleGetStarted} className="px-8 gap-2">
          Get Started Now <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <h3 className="text-2xl font-bold mb-4">How It Works</h3>
      <p className="mb-6">
        Once you subscribe to the AI Guardian service, you'll gain access to:
      </p>
      <ul className="space-y-3 mb-8">
        <li className="flex items-start gap-2">
          <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <span>A personalized relocation timeline and checklist</span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <span>Document preparation guidance with templates and examples</span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <span>Visa and residency assistance with step-by-step instructions</span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <span>Housing recommendations based on your preferences</span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <span>School, healthcare, and banking setup support</span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <span>Cultural integration resources and language learning tools</span>
        </li>
      </ul>
    </div>
  );
};

export default OverviewSection;
