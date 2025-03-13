
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, RefreshCw, Bell } from "lucide-react";
import { TrackedSite, siteTrackingService } from '@/services/site/siteTrackingService';

const SiteTracker = () => {
  const { toast } = useToast();
  const [sites, setSites] = useState<TrackedSite[]>([]);
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteName, setNewSiteName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  
  useEffect(() => {
    // Load tracked sites on component mount
    setSites(siteTrackingService.getTrackedSites());
  }, []);
  
  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSiteUrl || !newSiteName) {
      toast({
        title: "Error",
        description: "Please provide both a URL and name for the site",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Validate URL
      new URL(newSiteUrl);
      
      // Add site to tracking
      const newSite = siteTrackingService.addSiteToTrack(newSiteUrl, newSiteName);
      setSites(prev => [...prev, newSite]);
      
      toast({
        title: "Success",
        description: `${newSiteName} is now being tracked`,
      });
      
      // Clear form
      setNewSiteUrl('');
      setNewSiteName('');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add site",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveSite = (id: string, name: string) => {
    if (siteTrackingService.removeSiteFromTracking(id)) {
      setSites(prev => prev.filter(site => site.id !== id));
      
      toast({
        title: "Site Removed",
        description: `${name} has been removed from tracking`,
      });
    }
  };
  
  const handleCheckForNewProperties = async () => {
    if (sites.length === 0) {
      toast({
        title: "No Sites",
        description: "Add some sites to track first",
      });
      return;
    }
    
    setIsChecking(true);
    
    try {
      // In a real implementation, this would check actual property sites
      const updates = await siteTrackingService.checkAllSitesForNewProperties();
      
      // Refresh sites list
      setSites(siteTrackingService.getTrackedSites());
      
      if (updates.length === 0) {
        toast({
          title: "No Updates",
          description: "No new properties found",
        });
      } else {
        // Updates are shown via individual toasts in the service
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check for new properties",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Property Site Tracker</CardTitle>
        <CardDescription>
          Track Spanish property websites for new listings
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleAddSite} className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="siteUrl" className="text-sm font-medium">Website URL</label>
              <Input
                id="siteUrl"
                type="url"
                placeholder="https://example.com"
                value={newSiteUrl}
                onChange={(e) => setNewSiteUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="siteName" className="text-sm font-medium">Website Name</label>
              <Input
                id="siteName"
                type="text"
                placeholder="Spanish Property Portal"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Site to Track
          </Button>
        </form>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No sites being tracked. Add a site above to get started.
                  </TableCell>
                </TableRow>
              ) : (
                sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      <a 
                        href={site.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {site.url}
                      </a>
                    </TableCell>
                    <TableCell>{site.propertyCount}</TableCell>
                    <TableCell>{new Date(site.lastChecked).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveSite(site.id, site.name)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleCheckForNewProperties}
          disabled={isChecking || sites.length === 0}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          Check for New Properties
        </Button>
        
        {sites.length > 0 && (
          <Button variant="secondary">
            <Bell className="w-4 h-4 mr-2" />
            Configure Notifications
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SiteTracker;

