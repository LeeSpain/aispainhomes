import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AddWebsiteForm } from '@/components/sites/AddWebsiteForm';
import { TrackedWebsitesTable } from '@/components/sites/TrackedWebsitesTable';
import { useTrackedWebsites } from '@/hooks/useTrackedWebsites';
import { Bell, Globe, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const WebsiteTracking = () => {
  const {
    websites,
    notifications,
    isLoading,
    addWebsite,
    removeWebsite,
    updateWebsite,
    scrapeWebsite,
    clearNotifications,
    isAdding,
    isScraping,
  } = useTrackedWebsites();

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateWebsite({ id, updates: { is_active: isActive } });
  };

  return (
    <DashboardLayout title="Website Tracking">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Website Tracking</h1>
          <p className="text-muted-foreground">
            Monitor property sites and service providers for new listings and updates
          </p>
          <div className="flex gap-2 mt-4">
            <Badge variant="outline">
              <Globe className="h-3 w-3 mr-1" />
              {websites.length} Tracked Sites
            </Badge>
            <Badge variant="outline">
              <Bell className="h-3 w-3 mr-1" />
              {notifications.length} Pending Updates
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="tracking" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tracking">
              <Globe className="h-4 w-4 mr-2" />
              Tracked Websites
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {notifications.length > 0 && (
                <Badge className="ml-2" variant="destructive">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-4">
            <AddWebsiteForm onAdd={addWebsite} isAdding={isAdding} />

            <Card>
              <CardHeader>
                <CardTitle>Your Tracked Websites</CardTitle>
                <CardDescription>
                  Manage and monitor your tracked websites across all categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading tracked websites...</div>
                ) : (
                  <TrackedWebsitesTable
                    websites={websites}
                    onScrape={scrapeWebsite}
                    onRemove={removeWebsite}
                    onToggleActive={handleToggleActive}
                    isScraping={isScraping}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Property Updates</CardTitle>
                  <CardDescription>New listings and changes from tracked websites</CardDescription>
                </div>
                {notifications.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => clearNotifications()}>
                    Clear All
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                      >
                        <div className="p-2 rounded-full bg-primary/10">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                            </div>
                            <Badge variant={notification.severity === 'success' ? 'default' : 'secondary'}>
                              {notification.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteTracking;
