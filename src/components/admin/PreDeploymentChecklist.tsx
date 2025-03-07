
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useChecklist } from './checklist/useChecklist';
import { ChecklistCategory } from './checklist/types';
import CategoryStats from './checklist/CategoryStats';
import CategorySection from './checklist/CategorySection';
import HighPriorityAlert from './checklist/HighPriorityAlert';

const PreDeploymentChecklist = () => {
  const {
    items,
    toggleItem,
    getProgress,
    markAllCompleted,
    resetChecklist,
    getCompletionByCategory,
    getHighPriorityIncomplete,
    markCategoryCompleted,
    isDeploymentReady
  } = useChecklist();

  const categories = [
    { name: 'content' as const, label: 'Content', completion: getCompletionByCategory('content') },
    { name: 'functionality' as const, label: 'Functionality', completion: getCompletionByCategory('functionality') },
    { name: 'technical' as const, label: 'Technical', completion: getCompletionByCategory('technical') },
    { name: 'integration' as const, label: 'Integration', completion: getCompletionByCategory('integration') },
    { name: 'legal' as const, label: 'Legal', completion: getCompletionByCategory('legal') },
  ];

  const highPriorityIncompleteItems = getHighPriorityIncomplete();
  const deploymentReady = isDeploymentReady();

  return (
    <div className="space-y-6">
      {deploymentReady && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-900/10">
          <CardContent className="pt-6 pb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-400 font-medium">
              All critical items completed! Your site is ready for deployment.
            </span>
          </CardContent>
        </Card>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Pre-Deployment Checklist</span>
            <span className={`text-sm font-normal px-3 py-1.5 rounded-full ${
              getProgress() >= 90 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-primary/10 text-primary'
            }`}>
              {getProgress()}% Complete
            </span>
          </CardTitle>
          <CardDescription>
            Essential items that need to be completed before deploying the site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HighPriorityAlert highPriorityItems={highPriorityIncompleteItems} />
          <CategoryStats categories={categories} />

          <div className="space-y-6">
            {categories.map(category => (
              <div key={category.name} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">{category.label}</h3>
                  {category.completion === 100 ? (
                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                      <Check className="h-4 w-4 mr-1" />
                      Completed
                    </div>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markCategoryCompleted(category.name)}
                          >
                            Complete All {category.label}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mark all items in {category.label} as completed</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <CategorySection
                  title={category.label}
                  category={category.name}
                  onToggleItem={toggleItem}
                  items={items}
                />
              </div>
            ))}

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={resetChecklist}>
                Reset Checklist
              </Button>
              <Button onClick={markAllCompleted}>
                Mark All Complete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreDeploymentChecklist;
