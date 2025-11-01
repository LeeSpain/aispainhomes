import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Search } from 'lucide-react';
import { officialResourcesService, OfficialResource } from '@/services/officialResources/officialResourcesService';

const OfficialResourcesBrowser = () => {
  const [resources, setResources] = useState<OfficialResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<OfficialResource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      searchResources(searchTerm);
    } else {
      setFilteredResources(resources);
    }
  }, [searchTerm, resources]);

  const loadResources = async () => {
    try {
      const data = await officialResourcesService.getAllResources();
      setResources(data);
      setFilteredResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchResources = async (term: string) => {
    try {
      const data = await officialResourcesService.searchResources(term);
      setFilteredResources(data);
    } catch (error) {
      console.error('Error searching resources:', error);
    }
  };

  const categories = Array.from(new Set(resources.map(r => r.category)));

  const getResourcesByCategory = (category: string) => {
    return filteredResources.filter(r => r.category === category);
  };

  if (loading) {
    return <div>Loading official resources...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Official Spanish Resources</CardTitle>
          <CardDescription>
            Verified government and official resources for Spanish relocation and property services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-5 lg:grid-cols-11 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map(cat => (
                <TabsTrigger key={cat} value={cat}>
                  {officialResourcesService.getCategoryIcon(cat)} {cat}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </TabsContent>

            {categories.map(cat => (
              <TabsContent key={cat} value={cat} className="space-y-4">
                {getResourcesByCategory(cat).map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const ResourceCard = ({ resource }: { resource: OfficialResource }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{officialResourcesService.getCategoryIcon(resource.category)}</span>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
            </div>
            <CardDescription>{resource.description}</CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            {officialResourcesService.getTrustLevelBadge(resource.trust_level)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              <strong>Authority:</strong> {resource.authority}
            </p>
            <p className="text-muted-foreground">
              <strong>Category:</strong> {resource.category} {resource.subcategory && `→ ${resource.subcategory}`}
            </p>
            {resource.last_verified_at && (
              <p className="text-xs text-muted-foreground">
                Last verified: {new Date(resource.last_verified_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            Visit Site <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfficialResourcesBrowser;
