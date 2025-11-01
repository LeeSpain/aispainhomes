import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import heroImage from "@/assets/hero-main.jpg";

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/10 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent/10 to-transparent blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-20 z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
              Your Dream
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Spanish Home
              </span>
              Awaits
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Discover perfect properties with AI-powered matching and get complete relocation support from Clara, your intelligent AI assistant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                  Start 7-Day Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/clara">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-base">
                  Meet Clara AI
                  <Sparkles className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Properties</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground">AI Support</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">95%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative lg:h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
            <div className="relative h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={heroImage}
                alt="Luxury Spanish villa with infinity pool overlooking Mediterranean coast at sunset"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
