import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, DollarSign, Globe, Bot, Settings, Server } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/common/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import StatsCards from '@/components/admin/StatsCards';
import OverviewTab from '@/components/admin/OverviewTab';
import SubscriptionsTab from '@/components/admin/SubscriptionsTab';
import UsersTab from '@/components/admin/UsersTab';
import WebsitesTab from '@/components/admin/WebsitesTab';
import AISettingsTab from '@/components/admin/AISettingsTab';
import SystemSettingsTab from '@/components/admin/SystemSettingsTab';
import { siteTrackingService, TrackedSite } from '@/services/site/siteTrackingService';

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
    { title: 'Monthly Revenue', value: '$149.95', icon: DollarSign },
    { title: 'Active Subscriptions', value: 3, icon: CreditCard },
    { title: 'Total Users', value: users.length, icon: Users },
    { title: 'Tracked Websites', value: trackedSites.length, icon: Globe },
  ];
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Spanish Home Finder</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your business, users, subscriptions, and system settings</p>
            </div>
            
            <StatsCards stats={stats} />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8 mt-8">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="websites">Website Tracking</TabsTrigger>
                <TabsTrigger value="ai">AI Settings</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <OverviewTab />
              </TabsContent>
              
              <TabsContent value="subscriptions">
                <SubscriptionsTab />
              </TabsContent>
              
              <TabsContent value="users">
                <UsersTab users={users} />
              </TabsContent>
              
              <TabsContent value="websites">
                <WebsitesTab trackedSites={trackedSites} />
              </TabsContent>
              
              <TabsContent value="ai">
                <AISettingsTab />
              </TabsContent>
              
              <TabsContent value="system">
                <SystemSettingsTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
