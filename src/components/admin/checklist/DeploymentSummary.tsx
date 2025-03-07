
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChecklistCategory } from "./types";
import DeploymentStatusCard from "./DeploymentStatusCard";

interface DeploymentSummaryProps {
  isLoading: boolean;
  deploymentProgress: number;
  getCompletionByCategory: (category: ChecklistCategory) => number;
  getCategoryStatus: (category: ChecklistCategory) => 'completed' | 'in-progress' | 'pending';
  highPriorityItems: any[];
}

const DeploymentSummary = ({
  isLoading,
  deploymentProgress,
  getCompletionByCategory,
  getCategoryStatus,
  highPriorityItems
}: DeploymentSummaryProps) => {
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="mb-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-2 w-full" />
          </div>
          <Skeleton className="h-2 w-full mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <ClipboardCheck className="h-5 w-5 mr-2 text-primary" />
            <span>Overall Deployment Readiness</span>
          </div>
          <span className="text-sm font-medium">{deploymentProgress}%</span>
        </div>
        <Progress 
          value={deploymentProgress} 
          className={`h-2 mb-6 ${
            deploymentProgress >= 90 
              ? 'bg-green-100 [&>div]:bg-green-500' 
              : 'bg-secondary [&>div]:bg-primary'
          }`} 
        />
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <DeploymentStatusCard 
            category="Content" 
            completion={getCompletionByCategory('content')}
            status={getCategoryStatus('content')}
          />
          <DeploymentStatusCard 
            category="Functionality" 
            completion={getCompletionByCategory('functionality')}
            status={getCategoryStatus('functionality')}
          />
          <DeploymentStatusCard 
            category="Technical" 
            completion={getCompletionByCategory('technical')}
            status={getCategoryStatus('technical')}
          />
          <DeploymentStatusCard 
            category="Integration" 
            completion={getCompletionByCategory('integration')}
            status={getCategoryStatus('integration')}
          />
          <DeploymentStatusCard 
            category="Legal" 
            completion={getCompletionByCategory('legal')}
            status={getCategoryStatus('legal')}
          />
        </div>
        
        {highPriorityItems.length > 0 ? (
          <div className="mt-6 text-red-600 dark:text-red-400 text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {highPriorityItems.length} high priority {highPriorityItems.length === 1 ? 'item' : 'items'} pending
          </div>
        ) : (
          <div className="mt-6 text-green-600 dark:text-green-400 text-sm font-medium flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            All high priority items completed
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeploymentSummary;
