
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ChecklistItem, ChecklistCategory } from './types';

// Initial checklist data
const initialChecklistItems: ChecklistItem[] = [
  // Content Items
  {
    id: 'spanish-image',
    label: 'Upload Spanish villa image',
    description: 'Replace placeholder with high-quality Spanish property image',
    checked: false,
    category: 'content',
    actionLink: '/assets/spanish-villa.jpg',
    actionText: 'View Current Image',
    priority: 'high'
  },
  {
    id: 'property-data',
    label: 'Add real property listings',
    description: 'Replace sample properties with real data from Spanish property sources',
    checked: false,
    category: 'content',
    priority: 'high'
  },
  {
    id: 'content-review',
    label: 'Review all website copy',
    description: 'Check for spelling, grammar, and consistency across all pages',
    checked: false,
    category: 'content',
    priority: 'medium'
  },
  {
    id: 'translation',
    label: 'Implement translations',
    description: 'Add translations for all text content in Spanish, German, French, Dutch',
    checked: false,
    category: 'content',
    priority: 'high'
  },
  
  // Functionality Items
  {
    id: 'auth-flow',
    label: 'Test authentication flow',
    description: 'Verify registration, login, password recovery processes end-to-end',
    checked: false,
    category: 'functionality',
    actionLink: '/login',
    actionText: 'Test Login',
    priority: 'high'
  },
  {
    id: 'search-filter',
    label: 'Test property search filters',
    description: 'Ensure all search filters work correctly with real data',
    checked: false,
    category: 'functionality',
    priority: 'high'
  },
  {
    id: 'questionnaire',
    label: 'Test questionnaire flow',
    description: 'Complete questionnaire to verify results and recommendations',
    checked: false,
    category: 'functionality',
    actionLink: '/questionnaire',
    actionText: 'Test Questionnaire',
    priority: 'high'
  },
  {
    id: 'subscription',
    label: 'Configure payment system',
    description: 'Set up payment gateway and test subscription process (Stripe integration)',
    checked: false,
    category: 'functionality',
    actionLink: '/subscription',
    actionText: 'View Subscription Page',
    priority: 'high'
  },
  {
    id: 'email-alerts',
    label: 'Set up email notifications',
    description: 'Configure transactional emails for alerts, registration, etc.',
    checked: false,
    category: 'functionality',
    priority: 'medium'
  },
  {
    id: 'virtual-tours',
    label: 'Add virtual tour feature',
    description: 'Implement 360° property tours for premium listings',
    checked: false,
    category: 'functionality',
    priority: 'medium'
  },
  
  // Technical Items
  {
    id: 'responsive',
    label: 'Check responsive design',
    description: 'Test on multiple devices and screen sizes (mobile, tablet, desktop)',
    checked: false,
    category: 'technical',
    priority: 'high'
  },
  {
    id: 'browser-compatibility',
    label: 'Verify browser compatibility',
    description: 'Test on Chrome, Firefox, Safari, Edge, and other major browsers',
    checked: false,
    category: 'technical',
    priority: 'high'
  },
  {
    id: 'performance',
    label: 'Optimize performance',
    description: 'Check page load times, optimize images, implement lazy loading',
    checked: false,
    category: 'technical',
    priority: 'medium'
  },
  {
    id: 'analytics',
    label: 'Set up analytics',
    description: 'Configure analytics tracking for user behavior and conversion metrics',
    checked: false,
    category: 'technical',
    priority: 'medium'
  },
  {
    id: 'seo',
    label: 'Implement SEO best practices',
    description: 'Add meta tags, structured data, and sitemap',
    checked: false,
    category: 'technical',
    priority: 'medium'
  },
  
  // Integration Items
  {
    id: 'api-integration',
    label: 'Connect to property API',
    description: 'Integrate with Spanish property databases and listing services',
    checked: false,
    category: 'integration',
    actionLink: '/docs/BackendIntegrationNotes.md',
    actionText: 'View API Docs',
    priority: 'high'
  },
  {
    id: 'map-integration',
    label: 'Implement map features',
    description: 'Add interactive maps for property locations and neighborhood data',
    checked: false,
    category: 'integration',
    priority: 'medium'
  },
  {
    id: 'translation-api',
    label: 'Integrate translation API',
    description: 'Connect to translation service for multilingual content',
    checked: false,
    category: 'integration',
    priority: 'high'
  },
  {
    id: 'image-storage',
    label: 'Set up image storage',
    description: 'Configure cloud storage for property images and optimization',
    checked: false,
    category: 'integration',
    priority: 'high'
  },
  
  // Legal Items
  {
    id: 'privacy-policy',
    label: 'Review privacy policy',
    description: 'Ensure compliance with GDPR and Spanish privacy regulations',
    checked: false,
    category: 'legal',
    actionLink: '/terms',
    actionText: 'View Terms',
    priority: 'high'
  },
  {
    id: 'terms',
    label: 'Review terms of service',
    description: 'Update terms with legal counsel review for Spanish real estate',
    checked: false,
    category: 'legal',
    priority: 'high'
  },
  {
    id: 'cookie-consent',
    label: 'Test cookie consent',
    description: 'Verify cookie banner functions correctly and is compliant',
    checked: false,
    category: 'legal',
    priority: 'high'
  },
  {
    id: 'real-estate-compliance',
    label: 'Verify real estate regulations',
    description: 'Ensure compliance with Spanish property listing requirements',
    checked: false,
    category: 'legal',
    priority: 'high'
  },
];

// Key for localStorage
const CHECKLIST_STORAGE_KEY = 'deployment-checklist';

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
    const completed = items.filter(item => item.checked).length;
    return Math.round((completed / items.length) * 100);
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

  const filterItemsByCategory = (category: ChecklistCategory) => {
    return items.filter(item => item.category === category);
  };

  const getCompletionByCategory = (category: ChecklistCategory) => {
    const categoryItems = filterItemsByCategory(category);
    const completed = categoryItems.filter(item => item.checked).length;
    return categoryItems.length > 0 ? Math.round((completed / categoryItems.length) * 100) : 0;
  };

  const getCategoryStatus = (category: ChecklistCategory): 'completed' | 'in-progress' | 'pending' => {
    const completion = getCompletionByCategory(category);
    if (completion === 100) return 'completed';
    if (completion >= 40) return 'in-progress';
    return 'pending';
  };

  const getHighPriorityIncomplete = () => {
    return items.filter(item => !item.checked && item.priority === 'high');
  };

  const isDeploymentReady = () => {
    return getHighPriorityIncomplete().length === 0 && getProgress() >= 90;
  };

  return {
    items,
    toggleItem,
    getProgress,
    markAllCompleted,
    resetChecklist,
    filterItemsByCategory,
    getCompletionByCategory,
    getHighPriorityIncomplete,
    markCategoryCompleted,
    getCategoryStatus,
    isDeploymentReady
  };
};
