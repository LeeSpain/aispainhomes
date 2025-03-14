
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
    <Card className="bg-slate-50 border-slate-200 shadow-sm w-full">
      <CardHeader className="bg-gradient-to-r from-slate-100 to-blue-50 border-b border-slate-200">
        <CardTitle className="text-slate-800">Property Site Tracker</CardTitle>
        <CardDescription className="text-slate-600">
          Track Spanish property websites for new listings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleAddSite} className="mb-6 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-medium mb-4 text-slate-800">Add New Website</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="siteUrl" className="text-sm font-medium text-slate-700">Website URL</label>
              <Input
                id="siteUrl"
                type="url"
                placeholder="https://example.com"
                value={newSiteUrl}
                onChange={(e) => setNewSiteUrl(e.target.value)}
                required
                className="border-slate-300 focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="siteName" className="text-sm font-medium text-slate-700">Website Name</label>
              <Input
                id="siteName"
                type="text"
                placeholder="Spanish Property Portal"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                required
                className="border-slate-300 focus:border-blue-400"
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Site to Track
          </Button>
        </form>
        
        <div className="bg-white rounded-md border border-slate-200 shadow-sm">
          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow>
                <TableHead className="text-slate-700">Name</TableHead>
                <TableHead className="text-slate-700">URL</TableHead>
                <TableHead className="text-slate-700">Properties</TableHead>
                <TableHead className="text-slate-700">Last Checked</TableHead>
                <TableHead className="text-slate-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-slate-600">
                    No sites being tracked. Add a site above to get started.
                  </TableCell>
                </TableRow>
              ) : (
                sites.map((site) => (
                  <TableRow key={site.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-800">{site.name}</TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      <a 
                        href={site.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {site.url}
                      </a>
                    </TableCell>
                    <TableCell className="text-slate-700">{site.propertyCount}</TableCell>
                    <TableCell className="text-slate-600">{new Date(site.lastChecked).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveSite(site.id, site.name)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-6 border-t border-slate-200 bg-slate-50">
        <Button
          variant="outline"
          onClick={handleCheckForNewProperties}
          disabled={isChecking || sites.length === 0}
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          Check for New Properties
        </Button>
        
        {sites.length > 0 && (
          <Button variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200">
            <Bell className="w-4 h-4 mr-2" />
            Configure Notifications
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SiteTracker;
