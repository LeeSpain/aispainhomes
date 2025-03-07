
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  category: 'content' | 'functionality' | 'technical' | 'legal';
}

const PreDeploymentChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    // Content Items
    {
      id: 'spanish-image',
      label: 'Upload Spanish villa image',
      description: 'Replace placeholder with high-quality Spanish property image',
      checked: false,
      category: 'content'
    },
    {
      id: 'property-data',
      label: 'Add real property listings',
      description: 'Replace sample properties with real data',
      checked: false,
      category: 'content'
    },
    {
      id: 'content-review',
      label: 'Review all website copy',
      description: 'Check for spelling, grammar, and consistency',
      checked: false,
      category: 'content'
    },
    
    // Functionality Items
    {
      id: 'auth-flow',
      label: 'Test authentication flow',
      description: 'Verify registration, login, password recovery',
      checked: false,
      category: 'functionality'
    },
    {
      id: 'search-filter',
      label: 'Test property search filters',
      description: 'Ensure all search filters work correctly',
      checked: false,
      category: 'functionality'
    },
    {
      id: 'questionnaire',
      label: 'Test questionnaire flow',
      description: 'Complete questionnaire to verify results',
      checked: false,
      category: 'functionality'
    },
    {
      id: 'subscription',
      label: 'Configure payment system',
      description: 'Set up payment gateway and test subscription process',
      checked: false,
      category: 'functionality'
    },
    
    // Technical Items
    {
      id: 'responsive',
      label: 'Check responsive design',
      description: 'Test on multiple devices and screen sizes',
      checked: false,
      category: 'technical'
    },
    {
      id: 'browser-compatibility',
      label: 'Verify browser compatibility',
      description: 'Test on Chrome, Firefox, Safari, Edge',
      checked: false,
      category: 'technical'
    },
    {
      id: 'performance',
      label: 'Optimize performance',
      description: 'Check page load times and optimize if needed',
      checked: false,
      category: 'technical'
    },
    {
      id: 'analytics',
      label: 'Set up analytics',
      description: 'Configure analytics tracking',
      checked: false,
      category: 'technical'
    },
    
    // Legal Items
    {
      id: 'privacy-policy',
      label: 'Review privacy policy',
      description: 'Ensure compliance with GDPR and other regulations',
      checked: false,
      category: 'legal'
    },
    {
      id: 'terms',
      label: 'Review terms of service',
      description: 'Update terms with legal counsel review',
      checked: false,
      category: 'legal'
    },
    {
      id: 'cookie-consent',
      label: 'Test cookie consent',
      description: 'Verify cookie banner functions correctly',
      checked: false,
      category: 'legal'
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Pre-Deployment Checklist</span>
          <span className="text-sm font-normal bg-primary/10 text-primary px-2 py-1 rounded-md">
            {getProgress()}% Complete
          </span>
        </CardTitle>
        <CardDescription>
          Items that need to be completed before deploying the site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Content</h3>
            <div className="space-y-2">
              {filterItemsByCategory('content').map(item => (
                <div key={item.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={item.id} 
                    checked={item.checked} 
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <div className="grid gap-1.5">
                    <label
                      htmlFor={item.id}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.label}
                    </label>
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
            <div className="space-y-2">
              {filterItemsByCategory('functionality').map(item => (
                <div key={item.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={item.id} 
                    checked={item.checked} 
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <div className="grid gap-1.5">
                    <label
                      htmlFor={item.id}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.label}
                    </label>
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
            <div className="space-y-2">
              {filterItemsByCategory('technical').map(item => (
                <div key={item.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={item.id} 
                    checked={item.checked} 
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <div className="grid gap-1.5">
                    <label
                      htmlFor={item.id}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.label}
                    </label>
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
            <div className="space-y-2">
              {filterItemsByCategory('legal').map(item => (
                <div key={item.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={item.id} 
                    checked={item.checked} 
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <div className="grid gap-1.5">
                    <label
                      htmlFor={item.id}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.label}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
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
  );
};

export default PreDeploymentChecklist;
