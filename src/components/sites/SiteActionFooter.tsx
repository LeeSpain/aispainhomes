
import { Button } from "@/components/ui/button";
import { RefreshCw, Bell } from "lucide-react";

interface SiteActionFooterProps {
  sitesExist: boolean;
  isChecking: boolean;
  onCheckForProperties: () => void;
}

const SiteActionFooter = ({ sitesExist, isChecking, onCheckForProperties }: SiteActionFooterProps) => {
  return (
    <div className="flex justify-between pt-6 border-t border-slate-200 bg-slate-50">
      <Button
        variant="outline"
        onClick={onCheckForProperties}
        disabled={isChecking || !sitesExist}
        className="border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
        Check for New Properties
      </Button>
      
      {sitesExist && (
        <Button variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200">
          <Bell className="w-4 h-4 mr-2" />
          Configure Notifications
        </Button>
      )}
    </div>
  );
};

export default SiteActionFooter;
