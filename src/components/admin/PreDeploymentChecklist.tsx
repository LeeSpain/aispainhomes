
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ExternalLink, AlertTriangle } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  category: 'content' | 'functionality' | 'technical' | 'legal' | 'integration';
  actionLink?: string;
  actionText?: string;
  priority: 'high' | 'medium' | 'low';
}

const PreDeploymentChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
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
  ]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
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
    setItems(items.map(item => ({ ...item, checked: false })));
    toast.info('Checklist has been reset');
  };

  const filterItemsByCategory = (category: ChecklistItem['category']) => {
    return items.filter(item => item.category === category);
  };

  const getCompletionByCategory = (category: ChecklistItem['category']) => {
    const categoryItems = filterItemsByCategory(category);
    const completed = categoryItems.filter(item => item.checked).length;
    return Math.round((completed / categoryItems.length) * 100);
  };

  const getHighPriorityIncomplete = () => {
    return items.filter(item => !item.checked && item.priority === 'high');
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Pre-Deployment Checklist</span>
            <span className="text-sm font-normal bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              {getProgress()}% Complete
            </span>
          </CardTitle>
          <CardDescription>
            Essential items that need to be completed before deploying the site
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getHighPriorityIncomplete().length > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/10">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertTitle className="text-red-600 dark:text-red-400">High Priority Items Pending</AlertTitle>
              <AlertDescription className="text-red-600/90 dark:text-red-400/90">
                You have {getHighPriorityIncomplete().length} high priority items that need to be completed before deployment.
              </AlertDescription>
            </Alert>
          )}
        
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="col-span-1">
              <div className="bg-background/80 border rounded-lg p-3 text-center">
                <div className="text-xl font-bold">{getCompletionByCategory('content')}%</div>
                <div className="text-xs text-muted-foreground">Content</div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="bg-background/80 border rounded-lg p-3 text-center">
                <div className="text-xl font-bold">{getCompletionByCategory('functionality')}%</div>
                <div className="text-xs text-muted-foreground">Functionality</div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="bg-background/80 border rounded-lg p-3 text-center">
                <div className="text-xl font-bold">{getCompletionByCategory('technical')}%</div>
                <div className="text-xs text-muted-foreground">Technical</div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="bg-background/80 border rounded-lg p-3 text-center">
                <div className="text-xl font-bold">{getCompletionByCategory('integration')}%</div>
                <div className="text-xs text-muted-foreground">Integration</div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="bg-background/80 border rounded-lg p-3 text-center">
                <div className="text-xl font-bold">{getCompletionByCategory('legal')}%</div>
                <div className="text-xs text-muted-foreground">Legal</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Content</h3>
              <div className="space-y-3">
                {filterItemsByCategory('content').map(item => (
                  <div key={item.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50">
                    <div className="mt-0.5">
                      <Checkbox 
                        id={item.id} 
                        checked={item.checked} 
                        onCheckedChange={() => toggleItem(item.id)}
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
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Functionality</h3>
              <div className="space-y-3">
                {filterItemsByCategory('functionality').map(item => (
                  <div key={item.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50">
                    <div className="mt-0.5">
                      <Checkbox 
                        id={item.id} 
                        checked={item.checked} 
                        onCheckedChange={() => toggleItem(item.id)}
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
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Technical</h3>
              <div className="space-y-3">
                {filterItemsByCategory('technical').map(item => (
                  <div key={item.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50">
                    <div className="mt-0.5">
                      <Checkbox 
                        id={item.id} 
                        checked={item.checked} 
                        onCheckedChange={() => toggleItem(item.id)}
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
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Integration</h3>
              <div className="space-y-3">
                {filterItemsByCategory('integration').map(item => (
                  <div key={item.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50">
                    <div className="mt-0.5">
                      <Checkbox 
                        id={item.id} 
                        checked={item.checked} 
                        onCheckedChange={() => toggleItem(item.id)}
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
                            target="_blank"
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
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Legal</h3>
              <div className="space-y-3">
                {filterItemsByCategory('legal').map(item => (
                  <div key={item.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50">
                    <div className="mt-0.5">
                      <Checkbox 
                        id={item.id} 
                        checked={item.checked} 
                        onCheckedChange={() => toggleItem(item.id)}
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
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={resetChecklist}>
                Reset Checklist
              </Button>
              <Button onClick={markAllCompleted}>
                Mark All Complete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreDeploymentChecklist;
