
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Shield, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <div className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-background to-secondary/10 overflow-hidden pt-16 md:pt-24">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.05),transparent_70%)]"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.05),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <div className="flex gap-4 mb-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                <Search className="w-4 h-4 mr-2" />
                <span className="text-xs font-medium uppercase tracking-wider">AI-Powered Property Search</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent">
                <Shield className="w-4 h-4 mr-2" />
                <span className="text-xs font-medium uppercase tracking-wider">Relocation Guardian</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              Find Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Perfect Spanish Home</span> with Complete Relocation Support
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Our AI matches you with your ideal Spanish property and guides you through every step of your relocation journey with personalized recommendations and expert assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="px-8 bg-gradient-to-r from-primary to-accent w-full sm:w-auto flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Join Now
                </Button>
              </Link>
              <Link to="/ai-guardian">
                <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto">
                  Explore AI Guardian
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:flex justify-end">
            <div className="relative w-full max-w-[110%]">
              {/* Image with decorative elements */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-50 transform rotate-6"></div>
              <img 
                src="/lovable-uploads/4d7c55a0-c0b7-4960-a703-74b71a326897.png" 
                alt="AI assistant showing Spanish coastal properties with holographic interface" 
                className="relative rounded-2xl shadow-2xl w-[110%] object-cover aspect-[4/3] border border-white/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
