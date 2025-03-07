
import { ChecklistItem, ChecklistCategory } from './types';

/**
 * Calculates the overall completion percentage for a set of checklist items
 */
export const calculateProgress = (items: ChecklistItem[]): number => {
  const completed = items.filter(item => item.checked).length;
  return Math.round((completed / items.length) * 100);
};

/**
 * Filters items by a specific category
 */
export const filterItemsByCategory = (items: ChecklistItem[], category: ChecklistCategory): ChecklistItem[] => {
  return items.filter(item => item.category === category);
};

/**
 * Calculates completion percentage for a specific category
 */
export const calculateCategoryCompletion = (items: ChecklistItem[], category: ChecklistCategory): number => {
  const categoryItems = filterItemsByCategory(items, category);
  const completed = categoryItems.filter(item => item.checked).length;
  return categoryItems.length > 0 ? Math.round((completed / categoryItems.length) * 100) : 0;
};

/**
 * Determines status for a category based on completion percentage
 */
export const determineCategoryStatus = (items: ChecklistItem[], category: ChecklistCategory): 'completed' | 'in-progress' | 'pending' => {
  const completion = calculateCategoryCompletion(items, category);
  if (completion === 100) return 'completed';
  if (completion >= 40) return 'in-progress';
  return 'pending';
};

/**
 * Gets high priority incomplete items
 */
export const getHighPriorityIncomplete = (items: ChecklistItem[]): ChecklistItem[] => {
  return items.filter(item => !item.checked && item.priority === 'high');
};

/**
 * Checks if deployment is ready based on high priority items and overall progress
 */
export const checkDeploymentReadiness = (items: ChecklistItem[]): boolean => {
  return getHighPriorityIncomplete(items).length === 0 && calculateProgress(items) >= 90;
};
