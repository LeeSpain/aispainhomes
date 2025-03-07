
export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  category: 'content' | 'functionality' | 'technical' | 'legal' | 'integration';
  actionLink?: string;
  actionText?: string;
  priority: 'high' | 'medium' | 'low';
}

export type ChecklistCategory = ChecklistItem['category'];
