
import { ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!user) {
      navigate('/login?redirect=clara');
    } else {
      navigate('/subscription');
    }
  };

  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
        <ShieldCheck className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Clara</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Your personal AI assistant for every step of your relocation journey to Spain
      </p>
      <div className="flex justify-center gap-4">
        <Button 
          size="lg" 
          onClick={handleGetStarted} 
          className="px-8 gap-2"
        >
          Get Started <ChevronRight className="h-4 w-4" />
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-8"
        >
          Explore Features
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
