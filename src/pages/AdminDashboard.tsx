import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, DollarSign, Globe, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import StatsCards from '@/components/admin/StatsCards';
import OverviewTab from '@/components/admin/OverviewTab';
import SubscriptionsTab from '@/components/admin/SubscriptionsTab';
import UsersTab from '@/components/admin/UsersTab';
import AdminWebsiteTrackingTab from '@/components/admin/AdminWebsiteTrackingTab';
import AISettingsTab from '@/components/admin/AISettingsTab';
import SystemSettingsTab from '@/components/admin/SystemSettingsTab';
import OfficialResourcesManager from '@/components/admin/OfficialResourcesManager';
import StripeSettingsTab from '@/components/admin/StripeSettingsTab';

import { siteTrackingService, TrackedSite } from '@/services/site/siteTrackingService';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [trackedSites, setTrackedSites] = useState<TrackedSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // @ts-ignore - Type will be available after database types regenerate
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!isAdmin) return;
      
      setIsLoading(true);
      try {
        // Load tracked sites from database (not localStorage)
        const { data: sitesData, error: sitesError } = await supabase
          .from('tracked_websites')
          .select('*')
          .eq('is_active', true);

        if (sitesError) {
          console.error('Error loading tracked sites:', sitesError);
        } else {
          // Transform to TrackedSite format
          const transformedSites = (sitesData || []).map(site => ({
            id: site.id,
            url: site.url,
            name: site.name,
            lastChecked: site.last_checked_at || site.created_at,
            propertyCount: 0, // Will be calculated from extracted_items
            addedAt: site.created_at
          }));
          setTrackedSites(transformedSites);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isAdmin]);

  // Show loading while checking admin status
  if (checkingAdmin) {
    return null;
  }

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }
  
  const stats = [
    { title: 'Monthly Revenue', value: '€0.00', icon: DollarSign },
    { title: 'Active Subscriptions', value: 0, icon: CreditCard },
    { title: 'Total Users', value: '—', icon: Users },
    { title: 'Tracked Websites', value: trackedSites.length, icon: Globe },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'subscriptions':
        return <SubscriptionsTab />;
      case 'users':
        return <UsersTab />;
      case 'websites':
        return <AdminWebsiteTrackingTab />;
      case 'resources':
        return <OfficialResourcesManager />;
      case 'stripe':
        return <StripeSettingsTab />;
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
      resources: 'Official Resources',
      stripe: 'Stripe Payment Settings',
      ai: 'AI Settings',
      system: 'System Settings'
    };
    return titles[activeTab] || 'Dashboard Overview';
  };

  const getPageDescription = () => {
    const descriptions: Record<string, string> = {
      overview: 'Monitor your business metrics and system health',
      subscriptions: 'Manage user subscriptions and billing',
      users: 'View and manage registered users and invitations',
      websites: 'Track and monitor website performance',
      resources: 'Manage official government resources',
      stripe: 'Configure Stripe API keys and payment processing',
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
