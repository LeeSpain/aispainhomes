import QuestionnaireStep from '../QuestionnaireStep';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Scale, Zap, Truck, GraduationCap, Heart, Languages } from 'lucide-react';

interface ServicesNeededStepProps {
  servicesNeeded: {
    legalAssistance: boolean;
    utilitiesSetup: boolean;
    movingServices: boolean;
    education: boolean;
    healthcare: boolean;
    languageLearning: boolean;
  };
  onServicesChange: (field: string, value: boolean) => void;
}

const ServicesNeededStep = ({ servicesNeeded, onServicesChange }: ServicesNeededStepProps) => {
  const services = [
    {
      key: 'legalAssistance',
      icon: Scale,
      title: 'Legal Assistance',
      description: 'NIE, residency, contracts, and legal paperwork'
    },
    {
      key: 'utilitiesSetup',
      icon: Zap,
      title: 'Utilities Setup',
      description: 'Electricity, water, internet, and phone services'
    },
    {
      key: 'movingServices',
      icon: Truck,
      title: 'Moving & Shipping',
      description: 'International moving, storage, and logistics'
    },
    {
      key: 'education',
      icon: GraduationCap,
      title: 'Education Services',
      description: 'School enrollment and educational guidance'
    },
    {
      key: 'healthcare',
      icon: Heart,
      title: 'Healthcare',
      description: 'Register with healthcare system, find doctors'
    },
    {
      key: 'languageLearning',
      icon: Languages,
      title: 'Language Learning',
      description: 'Spanish classes and language resources'
    }
  ];

  return (
    <QuestionnaireStep
      title="Which services do you need help with?"
      description="Select all the services you'd like assistance with during your relocation"
    >
      <div className="space-y-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.key} className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label className="text-base font-medium">{service.title}</Label>
                  <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                </div>
              </div>
              <Switch
                checked={servicesNeeded[service.key as keyof typeof servicesNeeded]}
                onCheckedChange={(checked) => onServicesChange(service.key, checked)}
              />
            </div>
          );
        })}
      </div>
    </QuestionnaireStep>
  );
};

export default ServicesNeededStep;
