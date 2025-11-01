import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExternalLink, Trash2, RefreshCw, Pause, Play } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TrackedWebsite } from '@/services/websiteTracking/websiteTrackingService';
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
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedWebsite(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedWebsite) {
      onRemove(selectedWebsite);
    }
    setDeleteDialogOpen(false);
    setSelectedWebsite(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      properties: 'bg-blue-500',
      legal: 'bg-purple-500',
      utilities: 'bg-green-500',
      movers: 'bg-orange-500',
      schools: 'bg-pink-500',
      healthcare: 'bg-red-500',
      other: 'bg-gray-500',
    };
    return colors[category] || colors.other;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      pending: 'secondary',
      error: 'destructive',
      paused: 'secondary',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (websites.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No websites being tracked yet. Add your first website above.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Checked</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {websites.map((website) => (
              <TableRow key={website.id}>
                <TableCell className="font-medium">{website.name}</TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(website.category)}>
                    {website.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <a
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <span className="max-w-[200px] truncate">{website.url}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell>{getStatusBadge(website.last_status)}</TableCell>
                <TableCell>
                  {website.last_checked_at
                    ? formatDistanceToNow(new Date(website.last_checked_at), {
                        addSuffix: true,
                      })
                    : 'Never'}
                </TableCell>
                <TableCell className="capitalize">{website.check_frequency}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleActive(website.id, !website.is_active)}
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
                      disabled={isScraping || !website.is_active}
                    >
                      <RefreshCw className={`h-4 w-4 ${isScraping ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(website.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Website</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to stop tracking this website? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
