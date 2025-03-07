
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { ChecklistItem } from './types';

interface HighPriorityAlertProps {
  highPriorityItems: ChecklistItem[];
}

const HighPriorityAlert = ({ highPriorityItems }: HighPriorityAlertProps) => {
  if (highPriorityItems.length === 0) {
    return null;
  }

  return (
    <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/10">
      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertTitle className="text-red-600 dark:text-red-400">High Priority Items Pending</AlertTitle>
      <AlertDescription className="text-red-600/90 dark:text-red-400/90">
        You have {highPriorityItems.length} high priority items that need to be completed before deployment.
      </AlertDescription>
    </Alert>
  );
};

export default HighPriorityAlert;
