
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
    <div className="space-y-6">
      {/* AI Guardian Chat - Main Feature */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Guardian
          </h3>
          <p className="text-xs text-white/80 mt-1">Your personal relocation assistant</p>
        </div>
        <div className="p-0">
          <AIGuardianChat user={user} />
        </div>
      </div>

      {/* Membership Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-6">
        <MembershipOverview subscription={subscription} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-6">
        <h4 className="font-semibold mb-4">Quick Actions</h4>
        <div className="space-y-2">
          <Button 
            onClick={() => navigate('/official-resources')} 
            variant="outline" 
            className="w-full justify-between"
          >
            <span>Official Resources</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => navigate('/website-tracking')} 
            variant="outline" 
            className="w-full justify-between"
          >
            <span>Tracked Websites</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
