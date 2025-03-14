
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import PropertiesTab from '@/components/dashboard/PropertiesTab';
import FavoritesTab from '@/components/dashboard/FavoritesTab';
import AlertsTab from '@/components/dashboard/AlertsTab';
import DocumentsTab from '@/components/dashboard/DocumentsTab';
import ServiceProviderTab from '@/components/dashboard/ServiceProviderTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import AIGuardianChat from '@/components/dashboard/AIGuardianChat';
import MembershipOverview from '@/components/dashboard/MembershipOverview';
import { useAuth } from '@/contexts/auth/useAuth';
import { Property } from '@/components/properties/PropertyCard';
import { PropertyService } from '@/services/PropertyService';
import { toast } from 'sonner';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

// Import mock service provider data
import { 
  lawyers, 
  utilities, 
  movers, 
  schools, 
  healthcare 
} from '@/components/dashboard/serviceProvidersData';

const Dashboard = () => {
  const { user, userPreferences, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Load recommended properties
        const propertiesData = await PropertyService.getFilteredProperties({});
        setProperties(propertiesData.slice(0, 4)); // Show only 4 recommendations
        
        // Load favorite properties
        if (userPreferences?.favorites && userPreferences.favorites.length > 0) {
          const promises = userPreferences.favorites.map(id => 
            PropertyService.getPropertyById(id)
          );
          
          const results = await Promise.all(promises);
          const validResults = results.filter(item => item !== null) as Property[];
          setFavoriteProperties(validResults);
        } else {
          setFavoriteProperties([]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user, navigate, userPreferences?.favorites]);
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) return null;
  
  return (
    <>
      <Helmet>
        <title>Dashboard | SunnyHomeFinder</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Navbar />
        
        <main className="flex-1 pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left side - AIGuardian Chat */}
              <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                <div className="sticky top-24">
                  <AIGuardianChat user={user} />
                  <div className="mt-6">
                    <MembershipOverview subscription={userPreferences?.subscription} />
                  </div>
                  <div className="mt-4">
                    <Button 
                      onClick={() => navigate('/site-tracking')} 
                      variant="outline" 
                      className="w-full flex items-center justify-between"
                    >
                      <span>Manage Tracked Websites</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            
              {/* Right side - Dashboard Content */}
              <div className="lg:col-span-8 xl:col-span-9">
                <DashboardHeader user={user} variant="simple" />
              
                <div className="mt-8">
                  <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange}>
                    <TabsContent value="properties">
                      <div className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
                        <PropertiesTab properties={properties} isLoading={isLoading} />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="favorites">
                      <div className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
                        <FavoritesTab favorites={favoriteProperties} isLoading={isLoading} />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="alerts">
                      <div className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
                        <AlertsTab />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="lawyers">
                      <div className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
                        <ServiceProviderTab title="Legal Services" providers={lawyers} />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="utilities">
                      <div className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
                        <ServiceProviderTab title="Utility Services" providers={utilities} />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="movers">
                      <div className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
                        <ServiceProviderTab title="Moving Services" providers={movers} />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="schools">
                      <div className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
                        <ServiceProviderTab title="Education Services" providers={schools} />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="healthcare">
                      <div className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
                        <ServiceProviderTab title="Healthcare Services" providers={healthcare} />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="documents">
                      <div className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
                        <DocumentsTab />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="settings">
                      <div className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
                        <SettingsTab
                          user={user}
                          userPreferences={userPreferences}
                          onLogout={handleLogout}
                        />
                      </div>
                    </TabsContent>
                  </DashboardTabs>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
