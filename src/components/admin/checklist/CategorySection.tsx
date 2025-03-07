
import { ChecklistCategory } from './types';
import ChecklistItem from './ChecklistItem';
import { useChecklist } from './useChecklist';

interface CategorySectionProps {
  title: string;
  category: ChecklistCategory;
  onToggleItem: (id: string) => void;
  items: ReturnType<typeof useChecklist>['items'];
}

const CategorySection = ({ title, category, onToggleItem, items }: CategorySectionProps) => {
  const categoryItems = items.filter(item => item.category === category);

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="space-y-3">
        {categoryItems.map(item => (
          <ChecklistItem 
            key={item.id}
            item={item}
            onToggle={onToggleItem}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
