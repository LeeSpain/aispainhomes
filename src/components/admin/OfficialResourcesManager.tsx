import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, CheckCircle, AlertCircle, Search, TrendingUp, Globe, Database, Link2, FileText } from 'lucide-react';
import { officialResourcesService, OfficialResource } from '@/services/officialResources/officialResourcesService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

const OfficialResourcesManager = () => {
  const [resources, setResources] = useState<OfficialResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<OfficialResource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [stats, setStats] = useState({ 
    total: 0, 
    byCategory: {} as Record<string, number>, 
    citations: 0,
    propertyWebsites: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadResources();
    loadStats();
  }, []);

  useEffect(() => {
    filterResources();
  }, [searchTerm, activeCategory, resources]);

  const filterResources = () => {
    let filtered = resources;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(r => r.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.subcategory && r.subcategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.authority.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  const loadResources = async () => {
    try {
      const data = await officialResourcesService.getAllResources(false);
      setResources(data);
      setFilteredResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
      toast({
        title: 'Error',
        description: 'Failed to load official resources',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: allResources } = await supabase
        .from('official_resources')
        .select('category')
        .eq('is_active', true);
      
      const { count: citationCount } = await supabase
        .from('ai_response_citations')
        .select('*', { count: 'exact', head: true });

      const byCategory: Record<string, number> = {};
      let propertyWebsitesCount = 0;
      
      allResources?.forEach((r: any) => {
        byCategory[r.category] = (byCategory[r.category] || 0) + 1;
        if (r.category === 'property_websites') {
          propertyWebsitesCount++;
        }
      });

      setStats({
        total: allResources?.length || 0,
        byCategory,
        citations: citationCount || 0,
        propertyWebsites: propertyWebsitesCount
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      const { error } = await supabase
        .from('official_resources')
        .update({ last_verified_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Resource marked as verified'
      });
      
      loadResources();
    } catch (error) {
      console.error('Error verifying resource:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify resource',
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('official_resources')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Resource ${!currentStatus ? 'activated' : 'deactivated'}`
      });
      
      loadResources();
      loadStats();
    } catch (error) {
      console.error('Error toggling resource:', error);
      toast({
        title: 'Error',
        description: 'Failed to update resource',
        variant: 'destructive'
      });
    }
  };

  const getSubcategoryGroups = (categoryResources: OfficialResource[]) => {
    const groups: Record<string, OfficialResource[]> = {};
    categoryResources.forEach(resource => {
      const subcat = resource.subcategory || 'general';
      if (!groups[subcat]) groups[subcat] = [];
      groups[subcat].push(resource);
    });
    return groups;
  };

  const categories = [
    { value: 'all', label: 'All Resources', icon: FileText },
    { value: 'property_websites', label: 'Property Websites', icon: Globe },
    { value: 'property', label: 'Property & Housing', icon: '🏠' },
    { value: 'immigration', label: 'Immigration & Visas', icon: '🛂' },
    { value: 'finance', label: 'Finance & Banking', icon: '💰' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'utilities', label: 'Utilities', icon: '⚡' },
    { value: 'transport', label: 'Transport', icon: '🚗' },
    { value: 'work', label: 'Work & Employment', icon: '💼' },
    { value: 'integration', label: 'Integration & Culture', icon: '🤝' },
    { value: 'lifestyle', label: 'Lifestyle', icon: '🎨' },
  ];

  if (loading) {
    return <div>Loading official resources...</div>;
  }

  const displayResources = filteredResources.filter(r => 
    activeCategory === 'all' || r.category === activeCategory
  );

  const subcategoryGroups = activeCategory !== 'all' 
    ? getSubcategoryGroups(displayResources)
    : { general: displayResources };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Official resources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Property Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.propertyWebsites}</div>
            <p className="text-xs text-muted-foreground">Tracked property portals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Citations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.citations}</div>
            <p className="text-xs text-muted-foreground">Times cited by AI</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.byCategory).length}</div>
            <p className="text-xs text-muted-foreground">Resource categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Scraping Info Alert */}
      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-start gap-2">
            <Link2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Automatic Data Collection:</strong> When property websites are scraped, all property details, 
              images, links, and metadata are automatically saved to the database. Each property maintains its 
              source URL and is tracked for changes.
            </span>
          </div>
        </AlertDescription>
      </Alert>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Official Resources Management</CardTitle>
          <CardDescription>
            Manage official Spanish government resources and property websites used for scraping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-[250px_1fr] gap-6">
            {/* Category Sidebar */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Category</label>
                <Select value={activeCategory} onValueChange={setActiveCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <span>{typeof cat.icon === 'string' ? cat.icon : null}</span>
                          <span>{cat.label}</span>
                          {activeCategory !== 'all' && (
                            <Badge variant="secondary" className="ml-auto">
                              {stats.byCategory[cat.value] || 0}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category List */}
              <ScrollArea className="h-[500px]">
                <div className="space-y-1">
                  {categories.map(cat => (
                    <Button
                      key={cat.value}
                      variant={activeCategory === cat.value ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveCategory(cat.value)}
                    >
                      <span className="mr-2">{typeof cat.icon === 'string' ? cat.icon : <cat.icon className="h-4 w-4" />}</span>
                      <span className="flex-1 text-left truncate">{cat.label}</span>
                      <Badge variant="outline" className="ml-2">
                        {cat.value === 'all' ? stats.total : (stats.byCategory[cat.value] || 0)}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Resources List */}
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {Object.entries(subcategoryGroups).map(([subcat, resources]) => (
                <div key={subcat}>
                  {activeCategory !== 'all' && subcat !== 'general' && (
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      {activeCategory === 'property_websites' && <Globe className="h-5 w-5" />}
                      {officialResourcesService.getSubcategoryLabel(subcat)}
                      <Badge variant="secondary">{resources.length}</Badge>
                    </h3>
                  )}
                  <ResourceTable 
                    resources={resources}
                    onVerify={handleVerify}
                    onToggleActive={handleToggleActive}
                    showCategory={activeCategory === 'all'}
                  />
                </div>
              ))}

              {displayResources.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No resources found matching your criteria
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ResourceTableProps {
  resources: OfficialResource[];
  onVerify: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  showCategory?: boolean;
}

const ResourceTable = ({ resources, onVerify, onToggleActive, showCategory = false }: ResourceTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {showCategory && <TableHead>Category</TableHead>}
            <TableHead>Title</TableHead>
            <TableHead>Authority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Verified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showCategory ? 6 : 5} className="text-center text-muted-foreground py-8">
                No resources found
              </TableCell>
            </TableRow>
          ) : (
            resources.map((resource) => (
              <TableRow key={resource.id}>
                {showCategory && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{officialResourcesService.getCategoryIcon(resource.category)}</span>
                      <span className="capitalize text-sm">{resource.category.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                )}
                <TableCell className="max-w-xs">
                  <div>
                    <p className="font-medium">{resource.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {resource.description}
                    </p>
                    {resource.metadata && (resource.metadata as any).scraping_supported && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        <Database className="h-3 w-3 mr-1" />
                        Scraping Enabled
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{resource.authority}</TableCell>
                <TableCell>
                  <Badge variant={resource.is_active ? 'default' : 'secondary'}>
                    {resource.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">
                  {resource.last_verified_at 
                    ? new Date(resource.last_verified_at).toLocaleDateString()
                    : 'Never'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(resource.url, '_blank')}
                      title="Open website"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onVerify(resource.id)}
                      title="Mark as verified"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={resource.is_active ? 'destructive' : 'default'}
                      onClick={() => onToggleActive(resource.id, resource.is_active)}
                    >
                      {resource.is_active ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OfficialResourcesManager;