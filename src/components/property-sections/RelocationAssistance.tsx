
import { Shield } from "lucide-react";

const RelocationAssistance = () => {
  return (
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
              src="/lovable-uploads/45a17b57-e992-4ce6-8c46-32718953261a.png" 
              alt="AI Guardian helping a family relocate to Spain with holographic interface" 
              className="relative rounded-xl shadow-xl object-cover aspect-[4/3] border border-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelocationAssistance;
