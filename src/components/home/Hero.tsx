
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-background to-secondary/10 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.05),transparent_70%)]"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.05),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Search className="w-4 h-4 mr-2" />
              <span className="text-xs font-medium uppercase tracking-wider">AI-Powered Property Search</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              Find Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Perfect Spanish Home</span> with AI
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Our AI matches you with your ideal Spanish property and guides you through every step of relocation with personalized recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/questionnaire">
                <Button size="lg" className="px-8 bg-gradient-to-r from-primary to-accent w-full sm:w-auto">
                  Find My Dream Home
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:flex justify-end">
            <div className="relative w-full max-w-lg">
              {/* Image with decorative elements */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-50 transform rotate-6"></div>
              <img 
                src="./assets/spanish-villa.jpg" 
                alt="Beautiful Spanish villa with white walls and terracotta roof" 
                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3] border border-white/10"
              />
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-black p-3 rounded-lg shadow-lg">
                <div className="text-xs font-medium text-muted-foreground">Mediterranean Villa</div>
                <div className="text-base font-bold">€495,000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
