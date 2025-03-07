
import { Card, CardContent } from "@/components/ui/card";
import StatusIndicator from "./StatusIndicator";
import { type CategoryStatus } from './types';

interface DeploymentStatusCardProps { 
  category: string;
  completion: number;
  status: CategoryStatus;
}

const DeploymentStatusCard = ({ 
  category, 
  completion, 
  status 
}: DeploymentStatusCardProps) => {
  const statusText = {
    'completed': 'Ready',
    'in-progress': 'In Progress',
    'pending': 'Needs Attention'
  };

  const getBgColor = () => {
    switch(status) {
      case 'completed': return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50';
      case 'in-progress': return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/50';
      case 'pending': return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50';
      default: return '';
    }
  };

  return (
    <div className="col-span-1">
      <Card className={`h-full border ${getBgColor()}`}>
        <CardContent className="p-4 text-center flex flex-col items-center justify-center">
          <div className="text-2xl font-bold mb-1">{completion}%</div>
          <div className="text-sm font-medium mb-2">{category}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <StatusIndicator status={status} />
            <span className="ml-1.5">{statusText[status]}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentStatusCard;
