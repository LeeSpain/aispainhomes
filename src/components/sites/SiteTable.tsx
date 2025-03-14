
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { TrackedSite } from '@/services/site/siteTrackingService';

interface SiteTableProps {
  sites: TrackedSite[];
  onRemoveSite: (id: string, name: string) => void;
}

const SiteTable = ({ sites, onRemoveSite }: SiteTableProps) => {
  return (
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
                    onClick={() => onRemoveSite(site.id, site.name)}
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
  );
};

export default SiteTable;
