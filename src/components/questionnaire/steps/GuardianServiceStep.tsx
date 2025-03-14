
import { ShieldCheck, Check } from 'lucide-react';
import QuestionnaireStep from '../QuestionnaireStep';

const GuardianServiceStep = () => {
  const guardianServices = [
    {
      category: "Property Services",
      features: [
        "AI-powered property matching",
        "Weekly property recommendations", 
        "Real-time property alerts",
        "Neighborhood analysis"
      ]
    },
    {
      category: "Legal & Financial",
      features: [
        "Visa & NIE application guidance",
        "Lawyer matching service",
        "Spanish bank account setup",
        "Tax planning assistance"
      ]
    },
    {
      category: "Relocation Essentials",
      features: [
        "Moving company comparison",
        "Utilities setup guidance",
        "Healthcare navigation",
        "School & education finder"
      ]
    },
    {
      category: "Lifestyle Integration",
      features: [
        "Community connections",
        "Language learning resources",
        "Cultural adaptation support",
        "Ongoing expat assistance"
      ]
    }
  ];

  return (
    <QuestionnaireStep
      title="Complete relocation support with AI Guardian"
      description="Your AI Guardian will help you navigate every step of your property search and relocation journey."
    >
      <div className="space-y-6 mt-6">
        <div className="p-6 border border-primary/20 rounded-lg bg-background/95 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <ShieldCheck className="w-6 h-6 mr-2 text-primary" />
            AI Guardian Service - €24.99/month
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
            {guardianServices.map((service, idx) => (
              <div key={idx}>
                <h4 className="font-medium text-primary mb-2">{service.category}</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <p className="mt-6 text-center text-muted-foreground text-sm">
            Plus 30+ additional services for every aspect of Spanish relocation!
          </p>
          
          <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center">
            <p className="text-sm font-medium">
              Start with a 7-day free trial! Card details required, billed €24.99 after trial ends.
            </p>
          </div>
        </div>

        <p className="text-center text-muted-foreground">
          Complete your questionnaire to see your personalized relocation plan preview
        </p>
      </div>
    </QuestionnaireStep>
  );
};

export default GuardianServiceStep;
