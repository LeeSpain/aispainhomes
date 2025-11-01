
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIGuardianChat from '@/components/dashboard/AIGuardianChat';
import MembershipOverview from '@/components/dashboard/MembershipOverview';
import { User } from '@/contexts/auth/types';
import { Subscription } from '@/contexts/auth/types';

interface DashboardSidebarProps {
  user: User;
  subscription: Subscription;
}

const DashboardSidebar = ({ user, subscription }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="sticky top-24">
      <AIGuardianChat user={user} />
      <div className="mt-6">
        <MembershipOverview subscription={subscription} />
      </div>
      <div className="mt-4">
        <Button 
          onClick={() => navigate('/website-tracking')} 
          variant="outline" 
          className="w-full flex items-center justify-between"
        >
          <span>Manage Tracked Websites</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
