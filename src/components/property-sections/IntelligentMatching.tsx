
import { CheckCircle } from "lucide-react";

const IntelligentMatching = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
      <div>
        <img 
          src="/lovable-uploads/8b9ed673-fe42-4f92-b569-6f15b35e35f4.png" 
          alt="AI property search visualization showing a robot assistant displaying Spanish properties" 
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
  );
};

export default IntelligentMatching;
