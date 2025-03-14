import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Users, Home, FileText, BarChart3, Globe, Bot, Settings, Server } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/common/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { PropertyService } from '@/services/PropertyService';
import { Property } from '@/components/properties/PropertyCard';
import StatsCards from '@/components/admin/StatsCards';
import OverviewTab from '@/components/admin/OverviewTab';
import PropertiesTab from '@/components/admin/PropertiesTab';
import UsersTab from '@/components/admin/UsersTab';
import WebsitesTab from '@/components/admin/WebsitesTab';
import AISettingsTab from '@/components/admin/AISettingsTab';
import SystemSettingsTab from '@/components/admin/SystemSettingsTab';
import { siteTrackingService, TrackedSite } from '@/services/site/siteTrackingService';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'Active' },
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
        // Load properties data
        const propertiesData = await PropertyService.getFilteredProperties({});
        setProperties(propertiesData);
        
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
    { title: 'Total Properties', value: properties.length, icon: Home },
    { title: 'Total Users', value: users.length, icon: Users },
    { title: 'Tracked Websites', value: trackedSites.length, icon: Globe },
    { title: 'Pending Documents', value: 5, icon: FileText },
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
              <p className="text-muted-foreground">Manage your application, users, properties, and AI services</p>
            </div>
            
            <StatsCards stats={stats} />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8 mt-8">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="websites">Website Tracking</TabsTrigger>
                <TabsTrigger value="ai">AI Settings</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <OverviewTab />
              </TabsContent>
              
              <TabsContent value="properties">
                <PropertiesTab properties={properties} isLoading={isLoading} />
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
