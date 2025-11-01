import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, CheckCircle, AlertCircle, Search, TrendingUp, Globe, Database, Link2 } from 'lucide-react';
import { officialResourcesService, OfficialResource } from '@/services/officialResources/officialResourcesService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    if (searchTerm) {
      const filtered = resources.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.subcategory && r.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredResources(filtered);
    } else {
      setFilteredResources(resources);
    }
  }, [searchTerm, resources]);

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

  const getCategoryResources = (category: string) => {
    if (category === 'all') return filteredResources;
    return filteredResources.filter(r => r.category === category);
  };

  const getSubcategoryGroups = (categoryResources: OfficialResource[]) => {
    const groups: Record<string, OfficialResource[]> = {};
    categoryResources.forEach(resource => {
      const subcat = resource.subcategory || 'other';
      if (!groups[subcat]) groups[subcat] = [];
      groups[subcat].push(resource);
    });
    return groups;
  };

  const categories = Array.from(new Set(resources.map(r => r.category)));

  if (loading) {
    return <div>Loading official resources...</div>;
  }

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
            <div className="text-2xl font-bold">{categories.length}</div>
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
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${categories.length + 1}, minmax(0, 1fr))` }}>
              <TabsTrigger value="all">
                All ({filteredResources.length})
              </TabsTrigger>
              {categories.map(cat => (
                <TabsTrigger key={cat} value={cat}>
                  <span className="mr-1">{officialResourcesService.getCategoryIcon(cat)}</span>
                  <span className="hidden sm:inline capitalize">
                    {cat === 'property_websites' ? 'Property Sites' : cat}
                  </span>
                  <span className="ml-1">({stats.byCategory[cat] || 0})</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <ResourceTable 
                resources={filteredResources}
                onVerify={handleVerify}
                onToggleActive={handleToggleActive}
              />
            </TabsContent>

            {categories.map(cat => {
              const categoryResources = getCategoryResources(cat);
              const subcategoryGroups = getSubcategoryGroups(categoryResources);
              
              return (
                <TabsContent key={cat} value={cat} className="mt-6 space-y-6">
                  {cat === 'property_websites' ? (
                    // Special layout for property websites with subcategory groups
                    Object.entries(subcategoryGroups).map(([subcat, resources]) => (
                      <div key={subcat}>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          {officialResourcesService.getSubcategoryLabel(subcat)}
                          <Badge variant="secondary">{resources.length}</Badge>
                        </h3>
                        <ResourceTable 
                          resources={resources}
                          onVerify={handleVerify}
                          onToggleActive={handleToggleActive}
                          compact
                        />
                      </div>
                    ))
                  ) : (
                    // Standard table for other categories
                    <ResourceTable 
                      resources={categoryResources}
                      onVerify={handleVerify}
                      onToggleActive={handleToggleActive}
                    />
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface ResourceTableProps {
  resources: OfficialResource[];
  onVerify: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  compact?: boolean;
}

const ResourceTable = ({ resources, onVerify, onToggleActive, compact = false }: ResourceTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {!compact && <TableHead>Category</TableHead>}
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
              <TableCell colSpan={compact ? 5 : 6} className="text-center text-muted-foreground py-8">
                No resources found
              </TableCell>
            </TableRow>
          ) : (
            resources.map((resource) => (
              <TableRow key={resource.id}>
                {!compact && (
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