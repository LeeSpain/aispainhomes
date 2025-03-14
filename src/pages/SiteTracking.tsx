import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SiteTracker from '@/components/sites/SiteTracker';
import { PropertyUpdate, siteTrackingService } from '@/services/site/siteTrackingService';
import { Bot, Trash2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Property Site Tracking</h1>
          <p className="text-muted-foreground">
            Track Spanish property websites and get notified when new properties are added
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1">
            {siteTrackingService.getTrackedSites().length} Sites
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
            {updates.length} Updates
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="sites" className="space-y-6">
        <TabsList className="bg-slate-100 border border-slate-200">
          <TabsTrigger value="sites" className="data-[state=active]:bg-white">Tracked Sites</TabsTrigger>
          <TabsTrigger value="updates" className="data-[state=active]:bg-white">Property Updates</TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-white">
            <Bot className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sites">
          <SiteTracker />
        </TabsContent>
        
        <TabsContent value="updates">
          <Card className="bg-slate-50 border-slate-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-blue-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-800">Property Updates</CardTitle>
                {updates.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearUpdates}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Updates
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {updates.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-md border border-slate-200">
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
                      <div key={index} className="flex p-4 border rounded-md bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-800">{site?.name || 'Unknown Site'}</h3>
                          <p className="text-green-600">
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card className="bg-slate-50 border-slate-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-purple-50 border-b border-slate-200">
              <CardTitle className="flex items-center text-slate-800">
                <Bot className="w-5 h-5 mr-2 text-purple-500" />
                AI Guardian Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-6 bg-white rounded-lg border border-slate-200">
                <h3 className="text-lg font-medium mb-4 text-slate-800">Website Recommendations</h3>
                <p className="text-slate-600 mb-4">
                  Our AI Guardian has analyzed your property preferences and search patterns. 
                  Here are some recommended property websites that match your interests:
                </p>
                
                <div className="space-y-3 mt-4">
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                    <h4 className="font-medium text-slate-800">Idealista</h4>
                    <p className="text-sm text-slate-600 mb-2">Spain's largest property portal with comprehensive listings</p>
                    <div className="flex justify-between items-center">
                      <a href="https://www.idealista.com" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline">
                        https://www.idealista.com
                      </a>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs h-8">
                        <Plus className="w-3 h-3 mr-1" /> Track Site
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                    <h4 className="font-medium text-slate-800">Fotocasa</h4>
                    <p className="text-sm text-slate-600 mb-2">Popular portal with many exclusive listings</p>
                    <div className="flex justify-between items-center">
                      <a href="https://www.fotocasa.es" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline">
                        https://www.fotocasa.es
                      </a>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs h-8">
                        <Plus className="w-3 h-3 mr-1" /> Track Site
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                    <h4 className="font-medium text-slate-800">Kyero</h4>
                    <p className="text-sm text-slate-600 mb-2">International portal focusing on Spanish properties</p>
                    <div className="flex justify-between items-center">
                      <a href="https://www.kyero.com" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline">
                        https://www.kyero.com
                      </a>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs h-8">
                        <Plus className="w-3 h-3 mr-1" /> Track Site
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteTracking;
