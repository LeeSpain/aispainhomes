
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink } from 'lucide-react';
import { ChecklistItem as ChecklistItemType } from './types';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
}

const ChecklistItem = ({ item, onToggle }: ChecklistItemProps) => {
  return (
    <div className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50">
      <div className="mt-0.5">
        <Checkbox 
          id={item.id} 
          checked={item.checked} 
          onCheckedChange={() => onToggle(item.id)}
        />
      </div>
      <div className="grid gap-1 flex-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor={item.id}
            className={`text-sm font-medium leading-none ${item.checked ? 'line-through text-muted-foreground' : ''}`}
          >
            {item.label}
            {item.priority === 'high' && (
              <span className="ml-2 text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5 dark:bg-red-900/30 dark:text-red-400">
                High Priority
              </span>
            )}
          </label>
          {item.actionLink && (
            <Link 
              to={item.actionLink}
              className="text-xs text-primary flex items-center hover:underline"
              target={item.actionLink.startsWith('/docs') ? "_blank" : undefined}
            >
              {item.actionText} <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default ChecklistItem;
