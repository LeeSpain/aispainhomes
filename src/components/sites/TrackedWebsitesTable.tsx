import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TrackedWebsite } from '@/services/websiteTracking/websiteTrackingService';
import { Trash2, RefreshCw, Play, Pause, History } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ScrapeHistoryModal } from './ScrapeHistoryModal';
import { toast } from 'sonner';

interface TrackedWebsitesTableProps {
  websites: TrackedWebsite[];
  onScrape: (id: string) => void;
  onRemove: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  isScraping: boolean;
}

export const TrackedWebsitesTable = ({
  websites,
  onScrape,
  onRemove,
  onToggleActive,
  isScraping,
}: TrackedWebsitesTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<TrackedWebsite | null>(null);
  const [historyWebsite, setHistoryWebsite] = useState<{ id: string; name: string } | null>(null);
  const [selectedWebsites, setSelectedWebsites] = useState<Set<string>>(new Set());

  const handleDeleteClick = (website: TrackedWebsite) => {
    setSelectedWebsite(website);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedWebsite) {
      await onRemove(selectedWebsite.id);
      setDeleteDialogOpen(false);
      setSelectedWebsite(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedWebsites(new Set(websites.map(w => w.id)));
    } else {
      setSelectedWebsites(new Set());
    }
  };

  const handleSelectWebsite = (websiteId: string, checked: boolean) => {
    const newSelected = new Set(selectedWebsites);
    if (checked) {
      newSelected.add(websiteId);
    } else {
      newSelected.delete(websiteId);
    }
    setSelectedWebsites(newSelected);
  };

  const handleBulkScrape = async () => {
    const selected = Array.from(selectedWebsites);
    toast.info(`Scraping ${selected.length} websites...`);
    for (const id of selected) {
      try {
        await onScrape(id);
      } catch (error) {
        console.error(`Error scraping ${id}:`, error);
      }
    }
    setSelectedWebsites(new Set());
  };

  const handleBulkToggle = async (active: boolean) => {
    const selected = Array.from(selectedWebsites);
    for (const id of selected) {
      try {
        await onToggleActive(id, active);
      } catch (error) {
        console.error(`Error toggling ${id}:`, error);
      }
    }
    setSelectedWebsites(new Set());
    toast.success(`${active ? 'Activated' : 'Paused'} ${selected.length} websites`);
  };

  const handleBulkDelete = async () => {
    const selected = Array.from(selectedWebsites);
    for (const id of selected) {
      try {
        await onRemove(id);
      } catch (error) {
        console.error(`Error deleting ${id}:`, error);
      }
    }
    setSelectedWebsites(new Set());
    toast.success(`Deleted ${selected.length} websites`);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      {selectedWebsites.size > 0 && (
        <div className="flex items-center gap-2 mb-4 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedWebsites.size} selected</span>
          <Button variant="outline" size="sm" onClick={handleBulkScrape} disabled={isScraping}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Scrape All
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkToggle(true)}>
            <Play className="h-3 w-3 mr-1" />
            Activate
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkToggle(false)}>
            <Pause className="h-3 w-3 mr-1" />
            Pause
          </Button>
          <Button variant="outline" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      )}

      {websites.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No tracked websites yet. Add one above to get started.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedWebsites.size === websites.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Checked</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {websites.map((website) => (
              <TableRow key={website.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedWebsites.has(website.id)}
                    onCheckedChange={(checked) => handleSelectWebsite(website.id, checked as boolean)}
                  />
                </TableCell>
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleActive(website.id, !website.is_active)}
                      title={website.is_active ? 'Pause tracking' : 'Resume tracking'}
                    >
                      {website.is_active ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onScrape(website.id)}
                      disabled={isScraping}
                      title="Scrape now"
                    >
                      <RefreshCw className={`h-4 w-4 ${isScraping ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHistoryWebsite({ id: website.id, name: website.name })}
                      title="View scrape history"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(website)}
                      title="Delete website"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tracked Website</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to stop tracking "{selectedWebsite?.name}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {historyWebsite && (
        <ScrapeHistoryModal
          websiteId={historyWebsite.id}
          websiteName={historyWebsite.name}
          open={!!historyWebsite}
          onOpenChange={(open) => !open && setHistoryWebsite(null)}
        />
      )}
    </>
  );
};
