
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { siteTrackingService } from '@/services/site/siteTrackingService';

interface AddSiteFormProps {
  onSiteAdded: () => void;
}

const AddSiteForm = ({ onSiteAdded }: AddSiteFormProps) => {
  const { toast } = useToast();
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteName, setNewSiteName] = useState('');
  
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
      siteTrackingService.addSiteToTrack(newSiteUrl, newSiteName);
      
      toast({
        title: "Success",
        description: `${newSiteName} is now being tracked`,
      });
      
      // Clear form
      setNewSiteUrl('');
      setNewSiteName('');
      
      // Notify parent component
      onSiteAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add site",
        variant: "destructive",
      });
    }
  };
  
  return (
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
  );
};

export default AddSiteForm;
