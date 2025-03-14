
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Search, Shield, Building2, Map, BarChart3, Heart, 
  Users, HeartHandshake, Briefcase, Palmtree, CheckCircle 
} from "lucide-react";

const Property = () => {
  return (
    <>
      <Helmet>
        <title>Property Search Services | AISpainHomes.com</title>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="/lovable-uploads/4d7c55a0-c0b7-4960-a703-74b71a326897.png" 
                alt="AI property search visualization" 
                className="rounded-xl shadow-xl border border-white/10"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Intelligent Property Matching</h2>
              <p className="text-lg text-muted-foreground">
                Our advanced AI algorithm analyzes thousands of properties across Spain to find matches that perfectly align with your specific needs and preferences. Whether you're looking for a beachfront apartment, a countryside villa, or an urban penthouse, our platform helps you discover options you might otherwise miss.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Personalized Property Recommendations</h3>
                    <p className="text-muted-foreground">Receive custom property matches based on your unique requirements and preferences</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Comprehensive Property Database</h3>
                    <p className="text-muted-foreground">Access thousands of Spanish properties from multiple listing services and agencies</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Real-Time Market Insights</h3>
                    <p className="text-muted-foreground">Make informed decisions with up-to-date data on market trends and property values</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-accent/10 border border-accent/20 text-accent">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-xs font-medium uppercase tracking-wider">Comprehensive Support</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Your AI Guardian Throughout the Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Finding your perfect property is just the beginning. Our AI Guardian provides comprehensive support throughout your entire property search and relocation process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <Search className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Advanced Search Capabilities</h3>
              <p className="text-muted-foreground">
                Filter properties by location, price range, property features, proximity to amenities, and much more. Our intelligent search understands your preferences and adapts to provide increasingly relevant results.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <Map className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Location Analysis</h3>
              <p className="text-muted-foreground">
                Get detailed insights about neighborhoods, including safety ratings, proximity to essential services, community demographics, and quality of local amenities to ensure you choose the right location.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Market Intelligence</h3>
              <p className="text-muted-foreground">
                Access comprehensive market data, including historical price trends, current market valuations, and future growth predictions to help you make financially sound investment decisions.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <Heart className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Favorites & Comparison</h3>
              <p className="text-muted-foreground">
                Save your favorite properties, create collections, and use our side-by-side comparison tool to evaluate different options across multiple criteria before making your final decision.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Consultation</h3>
              <p className="text-muted-foreground">
                Connect with local property experts, legal advisors, and financial consultants who specialize in Spanish real estate to get professional guidance on your specific situation.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <HeartHandshake className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Negotiation Support</h3>
              <p className="text-muted-foreground">
                Get assistance with price negotiations, contract reviews, and condition assessments to ensure you secure the best possible deal for your new Spanish property.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Relocation Assistance</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Moving to a new country involves more than just finding a property. Our AI Guardian provides comprehensive relocation support to help you settle into your new Spanish home with ease.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Legal and documentation support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Banking and financial setup assistance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Healthcare navigation and registration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Utility and home services setup</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Education and school enrollment guidance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Community integration and cultural adaptation</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl opacity-50 transform -rotate-6"></div>
                  <img 
                    src="/lovable-uploads/9b33ae67-3ea6-4f31-a6f6-4c35f120950b.png" 
                    alt="Relocation assistance in Spain" 
                    className="relative rounded-xl shadow-xl object-cover aspect-[4/3] border border-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Start Your Spanish Property Journey Today</h2>
            <p className="text-lg text-muted-foreground mb-8">
              With our AI-powered property search and comprehensive guardian services, finding and relocating to your dream Spanish home has never been easier. Join now to access our complete suite of tools and services.
            </p>
            <Link to="/register">
              <Button size="lg" className="px-8 bg-gradient-to-r from-primary to-accent">
                <Briefcase className="mr-2 h-5 w-5" />
                Join Now to Find Your Perfect Home
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Start with a 7-day free trial. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 border border-border">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <Palmtree className="h-32 w-32 text-primary" />
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Join thousands of satisfied clients who have found their perfect Spanish property with our AI-powered platform and comprehensive relocation support.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/register">
                      <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent">
                        Register Now
                      </Button>
                    </Link>
                    <Link to="/ai-guardian">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Learn More About AI Guardian
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Property;
