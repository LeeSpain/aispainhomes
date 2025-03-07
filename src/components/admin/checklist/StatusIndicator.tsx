
import { type CategoryStatus } from './types';

interface StatusIndicatorProps {
  status: CategoryStatus;
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const colors = {
    'completed': 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    'pending': 'bg-red-500'
  };
  
  return (
    <div className={`w-3 h-3 rounded-full ${colors[status]}`}></div>
  );
};

export default StatusIndicator;
