import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, DollarSign, Globe, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import StatsCards from '@/components/admin/StatsCards';
import OverviewTab from '@/components/admin/OverviewTab';
import SubscriptionsTab from '@/components/admin/SubscriptionsTab';
import UsersTab from '@/components/admin/UsersTab';
import AdminWebsiteTrackingTab from '@/components/admin/AdminWebsiteTrackingTab';
import AISettingsTab from '@/components/admin/AISettingsTab';
import SystemSettingsTab from '@/components/admin/SystemSettingsTab';
import OfficialResourcesManager from '@/components/admin/OfficialResourcesManager';
import { siteTrackingService, TrackedSite } from '@/services/site/siteTrackingService';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'User', status: 'Active' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'User', status: 'Active' },
  ]);
  const [trackedSites, setTrackedSites] = useState<TrackedSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create a mock admin user for direct access
  const mockAdminUser = {
    id: 'admin-demo',
    name: 'Admin Demo',
    email: 'admin@example.com' // Use admin email to enable admin features
  };
  
  // Use real user or mock admin
  const currentUser = user || mockAdminUser;
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load tracked sites
        const sites = siteTrackingService.getTrackedSites();
        setTrackedSites(sites);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const stats = [
    { title: 'Monthly Revenue', value: '€74.97', icon: DollarSign },
    { title: 'Active Subscriptions', value: 3, icon: CreditCard },
    { title: 'Total Users', value: users.length, icon: Users },
    { title: 'Tracked Websites', value: trackedSites.length, icon: Globe },
  ];

  const handleLogout = () => {
    if (user) {
      logout();
    }
    navigate('/');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'subscriptions':
        return <SubscriptionsTab />;
      case 'users':
        return <UsersTab users={users} />;
      case 'websites':
        return <AdminWebsiteTrackingTab />;
      case 'resources':
        return <OfficialResourcesManager />;
      case 'ai':
        return <AISettingsTab />;
      case 'system':
        return <SystemSettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      overview: 'Dashboard Overview',
      subscriptions: 'Subscription Management',
      users: 'User Management',
      websites: 'Website Tracking',
      ai: 'AI Settings',
      system: 'System Settings'
    };
    return titles[activeTab] || 'Dashboard Overview';
  };

  const getPageDescription = () => {
    const descriptions: Record<string, string> = {
      overview: 'Monitor your business metrics and system health',
      subscriptions: 'Manage user subscriptions and billing',
      users: 'View and manage registered users',
      websites: 'Track and monitor website performance',
      ai: 'Configure AI assistant settings',
      system: 'System configuration and maintenance'
    };
    return descriptions[activeTab] || 'Monitor your business metrics and system health';
  };
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Spanish Home Finder</title>
      </Helmet>
      
      <SidebarProvider defaultOpen>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="flex-1 flex flex-col">
            {/* Admin Header */}
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
                    <p className="text-xs text-muted-foreground">{getPageDescription()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto p-6 space-y-6">
                {activeTab === 'overview' && <StatsCards stats={stats} />}
                {renderTabContent()}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default AdminDashboard;
