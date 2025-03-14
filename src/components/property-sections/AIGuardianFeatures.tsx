
import { 
  Shield, Search, Map, BarChart3, Heart, 
  Users, HeartHandshake 
} from "lucide-react";

const AIGuardianFeatures = () => {
  return (
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
      </div>
    </div>
  );
};

export default AIGuardianFeatures;
