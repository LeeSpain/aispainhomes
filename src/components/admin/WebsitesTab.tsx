
import { useState } from 'react';
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
import { Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { siteTrackingService, TrackedSite, PropertyUpdate } from '@/services/site/siteTrackingService';
import { toast } from 'sonner';

interface WebsitesTabProps {
  trackedSites: TrackedSite[];
}

const WebsitesTab = ({ trackedSites: initialSites }: WebsitesTabProps) => {
  const [trackedSites, setTrackedSites] = useState<TrackedSite[]>(initialSites);
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteName, setNewSiteName] = useState('');
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [updates, setUpdates] = useState<PropertyUpdate[]>(siteTrackingService.getPropertyUpdates());

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Tracking Management</CardTitle>
        <CardDescription>
          Manage property websites to track for new listings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Add new website section */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Add New Website</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site-url">Website URL</Label>
                <Input 
                  id="site-url" 
                  placeholder="https://example.com" 
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-name">Website Name</Label>
                <Input 
                  id="site-name" 
                  placeholder="Example Property Site" 
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleAddSite}>
                <Plus className="mr-2 h-4 w-4" />
                Add Website
              </Button>
            </div>
          </div>

          {/* Tracked websites table */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Tracked Websites</h3>
              <Button 
                onClick={handleCheckAllSites}
                disabled={isCheckingAll || trackedSites.length === 0}
              >
                {isCheckingAll ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Check All Sites
              </Button>
            </div>

            {trackedSites.length === 0 ? (
              <div className="text-center py-8 bg-muted/30 rounded-md">
                <p className="text-muted-foreground">No websites are currently being tracked</p>
                <p className="text-sm text-muted-foreground mt-2">Add a website above to start tracking property listings</p>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
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
                    {trackedSites.map((site) => (
                      <TableRow key={site.id}>
                        <TableCell className="font-medium">{site.name}</TableCell>
                        <TableCell>
                          <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {site.url}
                          </a>
                        </TableCell>
                        <TableCell>{site.propertyCount}</TableCell>
                        <TableCell>{new Date(site.lastChecked).toLocaleString()}</TableCell>
                        <TableCell>{new Date(site.addedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSite(site.id)}
                            className="text-destructive"
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
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Property Updates</h3>
              {updates.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearUpdates}
                >
                  Clear All Updates
                </Button>
              )}
            </div>

            {updates.length === 0 ? (
              <div className="text-center py-8 bg-muted/30 rounded-md">
                <p className="text-muted-foreground">No property updates available</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Check for new properties on your tracked sites to see updates here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update, index) => {
                  const site = siteTrackingService.getTrackedSiteById(update.siteId);
                  return (
                    <div key={index} className="flex p-4 border rounded-md">
                      <div className="flex-1">
                        <h3 className="font-medium">{site?.name || 'Unknown Site'}</h3>
                        <p className="text-muted-foreground">
                          {update.newProperties} new {update.newProperties === 1 ? 'property' : 'properties'} found
                        </p>
                        <p className="text-xs text-muted-foreground">
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
