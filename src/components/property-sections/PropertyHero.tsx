
import { Helmet } from 'react-helmet';
import { Building2 } from "lucide-react";

const PropertyHero = () => {
  return (
    <>
      <Helmet>
        <title>Property Search Services | AIHomesSpain.com</title>
        <meta name="description" content="Discover how our AI-powered property search and guardian services help you find your perfect Spanish home with comprehensive relocation support." />
      </Helmet>
      
      <div className="pt-24 pb-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Building2 className="w-4 h-4 mr-2" />
              <span className="text-xs font-medium uppercase tracking-wider">AI-Powered Property Search</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Find Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Perfect Spanish Home</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Our comprehensive AI-powered property search and guardian services help you discover your dream Spanish property with personalized support every step of the way.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyHero;
