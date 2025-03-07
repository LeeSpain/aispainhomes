
import { ReactNode, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface QuestionnaireLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  isLastStep?: boolean;
}

const QuestionnaireLayout = ({
  children,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  isNextDisabled = false,
  isBackDisabled = false,
  isLastStep = false,
}: QuestionnaireLayoutProps) => {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen pt-28 pb-16 flex flex-col">
      <div className="container mx-auto px-4 flex-1 flex flex-col">
        <div className="max-w-3xl mx-auto w-full">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-primary">
                {progress}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Content area */}
          <div className="glass-panel rounded-xl p-8 mb-8 flex-1">
            {children}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isBackDisabled}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button
              onClick={onNext}
              disabled={isNextDisabled}
              className="flex items-center"
            >
              {isLastStep ? 'See Results' : 'Next'}
              {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireLayout;
