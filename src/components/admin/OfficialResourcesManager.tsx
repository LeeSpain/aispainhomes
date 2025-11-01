import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, CheckCircle, AlertCircle, Search, TrendingUp } from 'lucide-react';
import { officialResourcesService, OfficialResource } from '@/services/officialResources/officialResourcesService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const OfficialResourcesManager = () => {
  const [resources, setResources] = useState<OfficialResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<OfficialResource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, byCategory: {} as Record<string, number>, citations: 0 });
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
        r.category.toLowerCase().includes(searchTerm.toLowerCase())
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
      allResources?.forEach((r: any) => {
        byCategory[r.category] = (byCategory[r.category] || 0) + 1;
      });

      setStats({
        total: allResources?.length || 0,
        byCategory,
        citations: citationCount || 0
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
    } catch (error) {
      console.error('Error toggling resource:', error);
      toast({
        title: 'Error',
        description: 'Failed to update resource',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div>Loading official resources...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Official Spanish resources</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Official Resources Management</CardTitle>
          <CardDescription>
            Manage and verify official Spanish government resources
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Authority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Verified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{officialResourcesService.getCategoryIcon(resource.category)}</span>
                        <span className="capitalize">{resource.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {resource.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{resource.authority}</TableCell>
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
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerify(resource.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={resource.is_active ? 'destructive' : 'default'}
                          onClick={() => handleToggleActive(resource.id, resource.is_active)}
                        >
                          {resource.is_active ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficialResourcesManager;
