
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Users, Home, FileText, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { PropertyService } from '@/services/PropertyService';
import { Property } from '@/components/properties/PropertyCard';
import StatsCards from '@/components/admin/StatsCards';
import OverviewTab from '@/components/admin/OverviewTab';
import PropertiesTab from '@/components/admin/PropertiesTab';
import UsersTab from '@/components/admin/UsersTab';

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
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // In a real application, check if user has admin privileges
    // For demo, we'll assume they do if they're logged in
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load properties data
        const propertiesData = await PropertyService.getFilteredProperties({});
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, navigate]);
  
  if (!user) return null;
  
  const stats = [
    { title: 'Total Properties', value: properties.length, icon: Home },
    { title: 'Total Users', value: users.length, icon: Users },
    { title: 'Active Subscriptions', value: 2, icon: BarChart3 },
    { title: 'Pending Documents', value: 5, icon: FileText },
  ];
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | AI Spain Homes</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your application, users and properties</p>
            </div>
            
            <StatsCards stats={stats} />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
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
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AdminDashboard;
