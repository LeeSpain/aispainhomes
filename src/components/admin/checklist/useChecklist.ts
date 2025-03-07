
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ChecklistItem, ChecklistCategory } from './types';
import { initialChecklistItems, CHECKLIST_STORAGE_KEY } from './checklistData';
import { 
  calculateProgress,
  filterItemsByCategory,
  calculateCategoryCompletion,
  determineCategoryStatus,
  getHighPriorityIncomplete as getHighPriorityItems,
  checkDeploymentReadiness
} from './checklistUtils';

export const useChecklist = () => {
  // Initialize state from localStorage or use initial values
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const savedItems = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    return savedItems ? JSON.parse(savedItems) : initialChecklistItems;
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
    
    // Show toast notification
    const item = items.find(item => item.id === id);
    if (item) {
      toast.success(`${item.checked ? 'Unchecked' : 'Completed'}: ${item.label}`);
    }
  };

  const markCategoryCompleted = (category: ChecklistCategory) => {
    setItems(items.map(item => 
      item.category === category ? { ...item, checked: true } : item
    ));
    toast.success(`All ${category} items marked as completed!`);
  };

  const getProgress = () => {
    return calculateProgress(items);
  };

  const markAllCompleted = () => {
    setItems(items.map(item => ({ ...item, checked: true })));
    toast.success('All items marked as completed!');
  };

  const resetChecklist = () => {
    setItems(initialChecklistItems);
    localStorage.removeItem(CHECKLIST_STORAGE_KEY);
    toast.info('Checklist has been reset');
  };

  const getCompletionByCategory = (category: ChecklistCategory) => {
    return calculateCategoryCompletion(items, category);
  };

  const getCategoryStatus = (category: ChecklistCategory): 'completed' | 'in-progress' | 'pending' => {
    return determineCategoryStatus(items, category);
  };

  const getHighPriorityIncomplete = () => {
    return getHighPriorityItems(items);
  };

  const isDeploymentReady = () => {
    return checkDeploymentReadiness(items);
  };

  return {
    items,
    toggleItem,
    getProgress,
    markAllCompleted,
    resetChecklist,
    filterItemsByCategory: (category: ChecklistCategory) => filterItemsByCategory(items, category),
    getCompletionByCategory,
    getHighPriorityIncomplete,
    markCategoryCompleted,
    getCategoryStatus,
    isDeploymentReady
  };
};
