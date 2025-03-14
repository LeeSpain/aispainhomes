
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { TrackedSite, siteTrackingService } from '@/services/site/siteTrackingService';
import AddSiteForm from './AddSiteForm';
import SiteTable from './SiteTable';
import SiteActionFooter from './SiteActionFooter';

const SiteTracker = () => {
  const { toast } = useToast();
  const [sites, setSites] = useState<TrackedSite[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  
  const loadSites = () => {
    setSites(siteTrackingService.getTrackedSites());
  };
  
  useEffect(() => {
    // Load tracked sites on component mount
    loadSites();
  }, []);
  
  const handleSiteAdded = () => {
    // Refresh the sites list when a new site is added
    loadSites();
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
      loadSites();
      
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
        <AddSiteForm onSiteAdded={handleSiteAdded} />
        <SiteTable sites={sites} onRemoveSite={handleRemoveSite} />
      </CardContent>
      
      <CardFooter>
        <SiteActionFooter 
          sitesExist={sites.length > 0} 
          isChecking={isChecking} 
          onCheckForProperties={handleCheckForNewProperties} 
        />
      </CardFooter>
    </Card>
  );
};

export default SiteTracker;
