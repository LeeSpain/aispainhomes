
import { ShieldCheck } from 'lucide-react';
import QuestionnaireStep from '../QuestionnaireStep';

const GuardianServiceStep = () => {
  return (
    <QuestionnaireStep
      title="Ready to unlock your personalized relocation plan"
      description="Your AI Guardian will help you navigate every step of your relocation journey."
    >
      <div className="space-y-6 mt-6">
        <div className="glass-panel p-6 border border-primary/20 rounded-lg">
          <h3 className="text-lg font-medium flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-primary" />
            AI Guardian Service - €9.99/month
          </h3>
          <ul className="mt-4 space-y-2">
            {['Personalized relocation timeline and checklist', 
              'Visa and residency guidance', 
              'Healthcare system navigation',
              'School options and enrollment assistance',
              'Banking and financial setup help',
              'Tax considerations and advice',
              'Cultural integration resources',
              'Local community connections',
              '24/7 AI assistance for all your questions'].map((feature) => (
              <li key={feature} className="flex">
                <span className="text-primary mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-muted-foreground">
          Complete your questionnaire to see your personalized relocation plan preview
        </p>
      </div>
    </QuestionnaireStep>
  );
};

export default GuardianServiceStep;
