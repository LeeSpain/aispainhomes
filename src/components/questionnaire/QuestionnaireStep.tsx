
import { ReactNode } from 'react';

interface QuestionnaireStepProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

const QuestionnaireStep = ({ title, description, children, className = "" }: QuestionnaireStepProps) => {
  return (
    <div className={`animate-fade-in ${className}`}>
      <h2 className="text-2xl font-bold tracking-tight mb-3">{title}</h2>
      {description && (
        <p className="text-muted-foreground mb-8 text-balance">{description}</p>
      )}
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
};

export default QuestionnaireStep;
