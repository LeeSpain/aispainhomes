
import { ChecklistCategory } from './types';

interface CategoryStatsProps {
  categories: {
    name: ChecklistCategory;
    label: string;
    completion: number;
  }[];
}

const CategoryStats = ({ categories }: CategoryStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {categories.map((category) => (
        <div className="col-span-1" key={category.name}>
          <div className="bg-background/80 border rounded-lg p-3 text-center">
            <div className="text-xl font-bold">{category.completion}%</div>
            <div className="text-xs text-muted-foreground">{category.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryStats;
