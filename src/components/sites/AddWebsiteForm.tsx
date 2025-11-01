import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AddWebsiteFormProps {
  onAdd: (website: {
    url: string;
    name: string;
    category: string;
    industry?: string;
    location?: string;
    checkFrequency?: 'hourly' | 'daily' | 'weekly';
  }) => void;
  isAdding: boolean;
}

const CATEGORIES = [
  { value: 'properties', label: 'Properties' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'movers', label: 'Moving Services' },
  { value: 'schools', label: 'Schools' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'other', label: 'Other' },
];

const FREQUENCIES = [
  { value: 'hourly', label: 'Every Hour' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

export const AddWebsiteForm = ({ onAdd, isAdding }: AddWebsiteFormProps) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('properties');
  const [frequency, setFrequency] = useState<'hourly' | 'daily' | 'weekly'>('daily');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await onAdd({
      url,
      name,
      category,
      checkFrequency: frequency,
    });

    // Reset form
    setUrl('');
    setName('');
    setCategory('properties');
    setFrequency('daily');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track New Website</CardTitle>
        <CardDescription>
          Add a website to monitor for new listings and updates across all service categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Website Name</Label>
              <Input
                id="name"
                placeholder="Example Property Site"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Check Frequency</Label>
              <Select value={frequency} onValueChange={(val: any) => setFrequency(val)}>
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={isAdding} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? 'Adding...' : 'Add Website'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
