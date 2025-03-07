
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
import { useAuth } from '@/contexts/AuthContext';
import { Property } from '@/components/properties/PropertyCard';
import { PropertyService } from '@/services/PropertyService';
import { toast } from 'sonner';

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
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <DashboardHeader user={user} />
            
            <div className="mt-8">
              <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />
              
              <div className="mt-6 bg-background rounded-lg p-4 sm:p-6 border">
                {activeTab === 'properties' && (
                  <PropertiesTab properties={properties} isLoading={isLoading} />
                )}
                
                {activeTab === 'favorites' && (
                  <FavoritesTab favorites={favoriteProperties} isLoading={isLoading} />
                )}
                
                {activeTab === 'alerts' && (
                  <AlertsTab />
                )}
                
                {activeTab === 'documents' && (
                  <DocumentsTab />
                )}
                
                {activeTab === 'service-providers' && (
                  <ServiceProviderTab />
                )}
                
                {activeTab === 'settings' && (
                  <SettingsTab
                    user={user}
                    userPreferences={userPreferences}
                    onLogout={handleLogout}
                  />
                )}
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
