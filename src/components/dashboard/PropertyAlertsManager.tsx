import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell, BellOff, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SavedSearch {
  id: string;
  name: string;
  search_criteria: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
  };
  notification_frequency: string;
  is_active: boolean;
  created_at: string;
  last_checked_at?: string;
}

const PropertyAlertsManager = () => {
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    frequency: 'instant'
  });

  useEffect(() => {
    if (user?.id) {
      loadSavedSearches();
    }
  }, [user?.id]);

  const loadSavedSearches = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedSearches((data || []) as SavedSearch[]);
    } catch (error) {
      console.error('Error loading saved searches:', error);
      toast.error('Failed to load saved searches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSearch = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a name for this search');
      return;
    }

    try {
      const searchCriteria: any = {};
      if (formData.location) searchCriteria.location = formData.location;
      if (formData.minPrice) searchCriteria.minPrice = parseInt(formData.minPrice);
      if (formData.maxPrice) searchCriteria.maxPrice = parseInt(formData.maxPrice);
      if (formData.bedrooms) searchCriteria.bedrooms = parseInt(formData.bedrooms);
      if (formData.bathrooms) searchCriteria.bathrooms = parseInt(formData.bathrooms);
      if (formData.propertyType) searchCriteria.propertyType = formData.propertyType;

      const { error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: user!.id,
          name: formData.name,
          search_criteria: searchCriteria,
          notification_frequency: formData.frequency,
          is_active: true
        });

      if (error) throw error;

      toast.success('Property alert created successfully');
      setIsCreating(false);
      resetForm();
      loadSavedSearches();
    } catch (error) {
      console.error('Error creating search:', error);
      toast.error('Failed to create property alert');
    }
  };

  const handleToggleActive = async (searchId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({ is_active: !currentStatus })
        .eq('id', searchId);

      if (error) throw error;

      setSavedSearches(searches =>
        searches.map(s => s.id === searchId ? { ...s, is_active: !currentStatus } : s)
      );

      toast.success(`Alert ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update alert status');
    }
  };

  const handleDelete = async (searchId: string) => {
    if (!confirm('Are you sure you want to delete this property alert?')) return;

    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId);

      if (error) throw error;

      setSavedSearches(searches => searches.filter(s => s.id !== searchId));
      toast.success('Property alert deleted');
    } catch (error) {
      toast.error('Failed to delete alert');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      frequency: 'instant'
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading property alerts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Property Alerts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Get notified when new properties match your criteria
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Property Alert</DialogTitle>
              <DialogDescription>
                Set up criteria for properties you'd like to be notified about
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Alert Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Beachfront Villas in Malaga"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Malaga, Barcelona"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => setFormData({ ...formData, propertyType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPrice">Min Price (€)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="e.g., 200000"
                    value={formData.minPrice}
                    onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice">Max Price (€)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="e.g., 500000"
                    value={formData.maxPrice}
                    onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="e.g., 3"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="frequency">Notification Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant (as they appear)</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => { setIsCreating(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSearch}>
                  Create Alert
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {savedSearches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Property Alerts Yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              Create your first property alert to get notified when new properties matching your criteria become available.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Alert
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedSearches.map((search) => (
            <Card key={search.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {search.name}
                      {search.is_active ? (
                        <Badge variant="default" className="ml-2">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="ml-2">Paused</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {search.notification_frequency === 'instant' && 'Instant notifications'}
                      {search.notification_frequency === 'daily' && 'Daily digest'}
                      {search.notification_frequency === 'weekly' && 'Weekly digest'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(search.id, search.is_active)}
                    >
                      {search.is_active ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(search.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {search.search_criteria.location && (
                    <Badge variant="outline">📍 {search.search_criteria.location}</Badge>
                  )}
                  {(search.search_criteria.minPrice || search.search_criteria.maxPrice) && (
                    <Badge variant="outline">
                      💰 €{search.search_criteria.minPrice?.toLocaleString() || '0'} - 
                      €{search.search_criteria.maxPrice?.toLocaleString() || '∞'}
                    </Badge>
                  )}
                  {search.search_criteria.bedrooms && (
                    <Badge variant="outline">🛏️ {search.search_criteria.bedrooms} beds</Badge>
                  )}
                  {search.search_criteria.bathrooms && (
                    <Badge variant="outline">🚿 {search.search_criteria.bathrooms} baths</Badge>
                  )}
                  {search.search_criteria.propertyType && (
                    <Badge variant="outline">🏠 {search.search_criteria.propertyType}</Badge>
                  )}
                </div>
                {search.last_checked_at && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Last checked: {new Date(search.last_checked_at).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyAlertsManager;