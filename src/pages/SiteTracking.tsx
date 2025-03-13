
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SiteTracker from '@/components/sites/SiteTracker';
import { PropertyUpdate, siteTrackingService } from '@/services/site/siteTrackingService';

const SiteTracking = () => {
  const [updates, setUpdates] = useState<PropertyUpdate[]>([]);
  
  useEffect(() => {
    // Load property updates on component mount
    setUpdates(siteTrackingService.getPropertyUpdates());
  }, []);
  
  const handleClearUpdates = () => {
    siteTrackingService.clearPropertyUpdates();
    setUpdates([]);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Site Tracking | Spanish Home Finder</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-2">Property Site Tracking</h1>
      <p className="text-muted-foreground mb-8">
        Track Spanish property websites and get notified when new properties are added
      </p>
      
      <Tabs defaultValue="sites" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sites">Tracked Sites</TabsTrigger>
          <TabsTrigger value="updates">Property Updates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sites">
          <SiteTracker />
        </TabsContent>
        
        <TabsContent value="updates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Property Updates</CardTitle>
              {updates.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearUpdates}>
                  Clear All Updates
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {updates.length === 0 ? (
                <div className="text-center py-8">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteTracking;

