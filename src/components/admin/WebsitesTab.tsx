
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, RefreshCw, Trash2, Bot, PanelTop } from 'lucide-react';
import { siteTrackingService, TrackedSite, PropertyUpdate } from '@/services/site/siteTrackingService';
import { toast } from 'sonner';
import { openAIService } from '@/services/ai/openAIService';

interface WebsitesTabProps {
  trackedSites: TrackedSite[];
}

const WebsitesTab = ({ trackedSites: initialSites }: WebsitesTabProps) => {
  const [trackedSites, setTrackedSites] = useState<TrackedSite[]>(initialSites);
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteName, setNewSiteName] = useState('');
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [updates, setUpdates] = useState<PropertyUpdate[]>(siteTrackingService.getPropertyUpdates());
  const [filteredSites, setFilteredSites] = useState<TrackedSite[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingAISuggestions, setIsLoadingAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<TrackedSite[]>([]);

  useEffect(() => {
    // Filter sites based on search query
    if (searchQuery.trim() === '') {
      setFilteredSites(trackedSites);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredSites(
        trackedSites.filter(
          site => site.name.toLowerCase().includes(query) || 
                 site.url.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, trackedSites]);

  const handleAddSite = () => {
    try {
      if (!newSiteUrl || !newSiteName) {
        toast.error("Please provide both URL and name for the website");
        return;
      }
      
      // Add the new site
      const newSite = siteTrackingService.addSiteToTrack(newSiteUrl, newSiteName);
      
      // Update local state
      setTrackedSites([...trackedSites, newSite]);
      
      // Clear form
      setNewSiteUrl('');
      setNewSiteName('');
      
      toast.success(`${newSiteName} added to tracked websites successfully!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add site");
    }
  };

  const handleRemoveSite = (id: string) => {
    try {
      const removed = siteTrackingService.removeSiteFromTracking(id);
      if (removed) {
        setTrackedSites(trackedSites.filter(site => site.id !== id));
        toast.success("Website removed from tracking");
      }
    } catch (error) {
      toast.error("Failed to remove website");
    }
  };

  const handleCheckAllSites = async () => {
    setIsCheckingAll(true);
    try {
      const newUpdates = await siteTrackingService.checkAllSitesForNewProperties();
      
      // Refresh the sites list
      const refreshedSites = siteTrackingService.getTrackedSites();
      setTrackedSites(refreshedSites);
      
      // Refresh updates
      setUpdates(siteTrackingService.getPropertyUpdates());
      
      toast.success(`Checked all websites. Found ${newUpdates.length} update(s).`);
    } catch (error) {
      toast.error("Failed to check websites for updates");
    } finally {
      setIsCheckingAll(false);
    }
  };

  const handleClearUpdates = () => {
    siteTrackingService.clearPropertyUpdates();
    setUpdates([]);
    toast.success("All property updates cleared");
  };

  const fetchAISuggestedSites = async () => {
    setIsLoadingAISuggestions(true);
    try {
      // Use the AI service to get website recommendations
      const suggestions = await openAIService.getWebsiteRecommendations(searchQuery);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      toast.error("Failed to load AI suggestions");
    } finally {
      setIsLoadingAISuggestions(false);
    }
  };

  const addSuggestionToTracked = (site: TrackedSite) => {
    try {
      // Check if site is already being tracked
      const existingSite = trackedSites.find(s => s.url === site.url);
      if (existingSite) {
        toast.info(`${site.name} is already being tracked`);
        return;
      }
      
      // Add the site to tracking
      const newSite = siteTrackingService.addSiteToTrack(site.url, site.name, site.propertyCount);
      setTrackedSites([...trackedSites, newSite]);
      toast.success(`${site.name} added to tracked websites`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add site");
    }
  };

  return (
    <Card className="bg-slate-50 border-slate-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-slate-100 to-blue-50 border-b border-slate-200">
        <CardTitle className="text-slate-800">Website Tracking Management</CardTitle>
        <CardDescription className="text-slate-600">
          Manage property websites to track for new listings
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-8">
          {/* Add new website section */}
          <div className="p-5 bg-white rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-medium mb-4 flex items-center text-slate-800">
              <PanelTop className="mr-2 h-5 w-5 text-blue-500" />
              Add New Website
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site-url" className="text-slate-700">Website URL</Label>
                <Input 
                  id="site-url" 
                  placeholder="https://example.com" 
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                  className="border-slate-300 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-name" className="text-slate-700">Website Name</Label>
                <Input 
                  id="site-name" 
                  placeholder="Example Property Site" 
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="border-slate-300 focus:border-blue-400"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleAddSite} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Website
              </Button>
            </div>
          </div>

          {/* AI Suggestion section */}
          <div className="p-5 bg-white rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-medium mb-4 flex items-center text-slate-800">
              <Bot className="mr-2 h-5 w-5 text-purple-500" />
              AI Website Suggestions
            </h3>
            <div className="flex items-end gap-2 mb-4">
              <div className="flex-1">
                <Label htmlFor="ai-search" className="text-slate-700 mb-2 block">Search for property websites</Label>
                <Input 
                  id="ai-search" 
                  placeholder="Spanish property portals..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-slate-300 focus:border-purple-400"
                />
              </div>
              <Button 
                onClick={fetchAISuggestedSites} 
                disabled={isLoadingAISuggestions}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoadingAISuggestions ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="mr-2 h-4 w-4" />
                )}
                Get AI Suggestions
              </Button>
            </div>
            
            {aiSuggestions.length > 0 ? (
              <div className="space-y-2 mt-4">
                {aiSuggestions.map((site) => (
                  <div key={site.id} className="flex justify-between items-center p-3 bg-purple-50 border border-purple-100 rounded-md">
                    <div>
                      <p className="font-medium text-slate-800">{site.name}</p>
                      <p className="text-sm text-slate-600">{site.url}</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => addSuggestionToTracked(site)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-md">
                <p className="text-slate-500">Search for property websites to get AI suggestions</p>
              </div>
            )}
          </div>

          {/* Tracked websites table */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-slate-800">Tracked Websites</h3>
                <p className="text-sm text-slate-500">
                  {filteredSites.length} of {trackedSites.length} websites shown
                </p>
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Filter websites..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 border-slate-300"
                />
                <Button 
                  onClick={handleCheckAllSites}
                  disabled={isCheckingAll || trackedSites.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isCheckingAll ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Check All Sites
                </Button>
              </div>
            </div>

            {filteredSites.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-md">
                <p className="text-slate-500">No websites found matching your search</p>
                {trackedSites.length === 0 && (
                  <p className="text-sm text-slate-500 mt-2">Add a website above to start tracking property listings</p>
                )}
              </div>
            ) : (
              <div className="border rounded-md border-slate-200">
                <Table>
                  <TableHeader className="bg-slate-100">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Properties</TableHead>
                      <TableHead>Last Checked</TableHead>
                      <TableHead>Added On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSites.map((site) => (
                      <TableRow key={site.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-800">{site.name}</TableCell>
                        <TableCell>
                          <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {site.url}
                          </a>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {site.propertyCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">{new Date(site.lastChecked).toLocaleString()}</TableCell>
                        <TableCell className="text-slate-600">{new Date(site.addedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSite(site.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Property updates section */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-800">Property Updates</h3>
              {updates.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearUpdates}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Clear All Updates
                </Button>
              )}
            </div>

            {updates.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-md">
                <p className="text-slate-500">No property updates available</p>
                <p className="text-sm text-slate-500 mt-2">
                  Check for new properties on your tracked sites to see updates here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update, index) => {
                  const site = siteTrackingService.getTrackedSiteById(update.siteId);
                  return (
                    <div key={index} className="flex p-4 border rounded-md bg-green-50 border-green-100">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-800">{site?.name || 'Unknown Site'}</h3>
                        <p className="text-green-700">
                          {update.newProperties} new {update.newProperties === 1 ? 'property' : 'properties'} found
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(update.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsitesTab;
