import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, CheckCircle, Clock, Globe, TrendingUp, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface TrackedWebsite {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active: boolean;
  last_checked_at: string | null;
  last_status: string;
  check_frequency: string;
  user_id: string;
}

interface ScrapeStats {
  total_websites: number;
  active_websites: number;
  total_scrapes_today: number;
  success_rate: number;
  avg_items_per_scrape: number;
  error_count: number;
}

const AdminWebsiteTrackingTab = () => {
  const [websites, setWebsites] = useState<TrackedWebsite[]>([]);
  const [stats, setStats] = useState<ScrapeStats>({
    total_websites: 0,
    active_websites: 0,
    total_scrapes_today: 0,
    success_rate: 0,
    avg_items_per_scrape: 0,
    error_count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch all tracked websites
      const { data: websitesData, error: websitesError } = await supabase
        .from('tracked_websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (websitesError) throw websitesError;

      setWebsites(websitesData || []);

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: scrapesToday, error: scrapesError } = await supabase
        .from('website_scrape_results')
        .select('status, items_found')
        .gte('created_at', today.toISOString());

      if (scrapesError) throw scrapesError;

      const totalScrapes = scrapesToday?.length || 0;
      const successfulScrapes = scrapesToday?.filter(s => s.status === 'success').length || 0;
      const totalItems = scrapesToday?.reduce((sum, s) => sum + (s.items_found || 0), 0) || 0;
      const errorCount = scrapesToday?.filter(s => s.status === 'error').length || 0;

      setStats({
        total_websites: websitesData?.length || 0,
        active_websites: websitesData?.filter(w => w.is_active).length || 0,
        total_scrapes_today: totalScrapes,
        success_rate: totalScrapes > 0 ? (successfulScrapes / totalScrapes) * 100 : 0,
        avg_items_per_scrape: totalScrapes > 0 ? totalItems / totalScrapes : 0,
        error_count: errorCount,
      });
    } catch (error) {
      console.error('Error loading admin website data:', error);
      toast.error('Failed to load website tracking data');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerScheduledScraper = async () => {
    setIsTriggering(true);
    try {
      const { error } = await supabase.functions.invoke('scheduled-scraper');
      
      if (error) throw error;
      
      toast.success('Scheduled scraper triggered successfully');
      setTimeout(() => loadData(), 2000); // Reload data after 2 seconds
    } catch (error) {
      console.error('Error triggering scraper:', error);
      toast.error('Failed to trigger scheduled scraper');
    } finally {
      setIsTriggering(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Success</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      properties: 'bg-blue-500',
      legal_services: 'bg-purple-500',
      utilities: 'bg-yellow-500',
      moving_services: 'bg-green-500',
      schools: 'bg-orange-500',
      healthcare: 'bg-red-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_websites}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active_websites} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scrapes Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_scrapes_today}</div>
            <p className="text-xs text-muted-foreground">
              {stats.success_rate.toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Items/Scrape</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avg_items_per_scrape.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.error_count} errors today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Manual Trigger */}
      <Card>
        <CardHeader>
          <CardTitle>Scraper Control</CardTitle>
          <CardDescription>Manually trigger the scheduled scraper to check all active websites</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={triggerScheduledScraper} 
            disabled={isTriggering}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isTriggering ? 'animate-spin' : ''}`} />
            {isTriggering ? 'Triggering...' : 'Trigger Scheduled Scraper'}
          </Button>
        </CardContent>
      </Card>

      {/* Websites Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tracked Websites</CardTitle>
          <CardDescription>Monitor all user-tracked websites across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {websites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tracked websites yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Check</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websites.map((website) => (
                  <TableRow key={website.id}>
                    <TableCell className="font-medium">{website.name}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(website.category)}>
                        {website.category.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <a 
                        href={website.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {website.url}
                      </a>
                    </TableCell>
                    <TableCell>{getStatusBadge(website.last_status)}</TableCell>
                    <TableCell>
                      {website.last_checked_at
                        ? formatDistanceToNow(new Date(website.last_checked_at), { addSuffix: true })
                        : 'Never'}
                    </TableCell>
                    <TableCell className="capitalize">{website.check_frequency}</TableCell>
                    <TableCell>
                      {website.is_active ? (
                        <Badge variant="outline" className="bg-green-50">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50">Paused</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWebsiteTrackingTab;
