
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useChecklist } from './checklist/useChecklist';
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
  } = useChecklist();

  const categories = [
    { name: 'content' as const, label: 'Content', completion: getCompletionByCategory('content') },
    { name: 'functionality' as const, label: 'Functionality', completion: getCompletionByCategory('functionality') },
    { name: 'technical' as const, label: 'Technical', completion: getCompletionByCategory('technical') },
    { name: 'integration' as const, label: 'Integration', completion: getCompletionByCategory('integration') },
    { name: 'legal' as const, label: 'Legal', completion: getCompletionByCategory('legal') },
  ];

  const highPriorityIncompleteItems = getHighPriorityIncomplete();

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Pre-Deployment Checklist</span>
            <span className="text-sm font-normal bg-primary/10 text-primary px-3 py-1.5 rounded-full">
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
              <CategorySection
                key={category.name}
                title={category.label}
                category={category.name}
                onToggleItem={toggleItem}
                items={items}
              />
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
