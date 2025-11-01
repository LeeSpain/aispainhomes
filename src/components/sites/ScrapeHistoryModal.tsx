import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { websiteTrackingService, ScrapeResult } from '@/services/websiteTracking/websiteTrackingService';
import { formatDistanceToNow } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ScrapeHistoryModalProps {
  websiteId: string;
  websiteName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScrapeHistoryModal = ({ websiteId, websiteName, open, onOpenChange }: ScrapeHistoryModalProps) => {
  const [history, setHistory] = useState<ScrapeResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open, websiteId]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const results = await websiteTrackingService.getScrapeResults(websiteId, 20);
      setHistory(results);
    } catch (error) {
      console.error('Error loading scrape history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'partial':
        return <Badge variant="secondary">Partial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Prepare chart data
  const chartData = history
    .slice(0, 10)
    .reverse()
    .map((result) => ({
      date: new Date(result.scrape_timestamp).toLocaleDateString(),
      items: result.items_found,
      new: result.new_items,
    }));

  // Calculate summary stats
  const totalScrapes = history.length;
  const successfulScrapes = history.filter((h) => h.status === 'success').length;
  const successRate = totalScrapes > 0 ? (successfulScrapes / totalScrapes) * 100 : 0;
  const avgItems = totalScrapes > 0 
    ? history.reduce((sum, h) => sum + h.items_found, 0) / totalScrapes 
    : 0;
  const totalNewItems = history.reduce((sum, h) => sum + h.new_items, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scrape History: {websiteName}</DialogTitle>
          <DialogDescription>
            View all scraping attempts and their results
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading history...</div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Scrapes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalScrapes}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Success Rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg Items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgItems.toFixed(0)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>New Items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalNewItems}</div>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Items Found Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="items" stroke="#8884d8" name="Total Items" />
                      <Line type="monotone" dataKey="new" stroke="#82ca9d" name="New Items" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* History Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scrape History</CardTitle>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No scrape history available
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>New</TableHead>
                        <TableHead>Changed</TableHead>
                        <TableHead>Removed</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>
                            {formatDistanceToNow(new Date(result.scrape_timestamp), {
                              addSuffix: true,
                            })}
                          </TableCell>
                          <TableCell>{getStatusBadge(result.status)}</TableCell>
                          <TableCell className="font-medium">{result.items_found}</TableCell>
                          <TableCell>
                            {result.new_items > 0 ? (
                              <Badge variant="outline" className="bg-green-50">
                                +{result.new_items}
                              </Badge>
                            ) : (
                              result.new_items
                            )}
                          </TableCell>
                          <TableCell>
                            {result.changed_items > 0 ? (
                              <Badge variant="outline" className="bg-blue-50">
                                {result.changed_items}
                              </Badge>
                            ) : (
                              result.changed_items
                            )}
                          </TableCell>
                          <TableCell>
                            {result.removed_items > 0 ? (
                              <Badge variant="outline" className="bg-red-50">
                                -{result.removed_items}
                              </Badge>
                            ) : (
                              result.removed_items
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {result.scrape_duration_ms 
                              ? `${(result.scrape_duration_ms / 1000).toFixed(1)}s`
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
