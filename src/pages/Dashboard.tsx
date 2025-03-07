
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { TabsContent } from "@/components/ui/tabs";
import { PropertyService } from "@/services/PropertyService";
import { Property } from "@/components/properties/PropertyCard";

// Import dashboard components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import PropertiesTab from "@/components/dashboard/PropertiesTab";
import FavoritesTab from "@/components/dashboard/FavoritesTab";
import AlertsTab from "@/components/dashboard/AlertsTab";
import DocumentsTab from "@/components/dashboard/DocumentsTab";
import ServiceProviderTab from "@/components/dashboard/ServiceProviderTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import sampleServiceProviders from "@/components/dashboard/serviceProvidersData";

const Dashboard = () => {
  const { user, userPreferences, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);
  
  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;
      
      setIsLoadingProperties(true);
      try {
        const propertiesData = await PropertyService.getAllProperties();
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoadingProperties(false);
      }
    };
    
    const fetchFavorites = async () => {
      if (!user) return;
      
      setIsLoadingFavorites(true);
      try {
        const favoritesData = await PropertyService.getUserFavorites(user.id);
        setFavorites(favoritesData);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };
    
    fetchProperties();
    fetchFavorites();
  }, [user, userPreferences?.favorites]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Your Dashboard | SunnyHomeFinder</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <DashboardHeader user={user} />
              
              <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab}>
                <TabsContent value="properties">
                  <PropertiesTab properties={properties} isLoading={isLoadingProperties} />
                </TabsContent>
                
                <TabsContent value="favorites">
                  <FavoritesTab favorites={favorites} isLoading={isLoadingFavorites} />
                </TabsContent>
                
                <TabsContent value="alerts">
                  <AlertsTab />
                </TabsContent>
                
                <TabsContent value="lawyers">
                  <ServiceProviderTab 
                    title="Recommended Legal Services" 
                    providers={sampleServiceProviders.lawyers} 
                  />
                </TabsContent>
                
                <TabsContent value="utilities">
                  <ServiceProviderTab 
                    title="TV & Utility Providers" 
                    providers={sampleServiceProviders.utilities} 
                  />
                </TabsContent>
                
                <TabsContent value="movers">
                  <ServiceProviderTab 
                    title="Moving Companies" 
                    providers={sampleServiceProviders.movers} 
                  />
                </TabsContent>
                
                <TabsContent value="schools">
                  <ServiceProviderTab 
                    title="Schools & Education" 
                    providers={sampleServiceProviders.schools} 
                  />
                </TabsContent>
                
                <TabsContent value="healthcare">
                  <ServiceProviderTab 
                    title="Healthcare Providers" 
                    providers={sampleServiceProviders.healthcare} 
                  />
                </TabsContent>
                
                <TabsContent value="documents">
                  <DocumentsTab />
                </TabsContent>
                
                <TabsContent value="settings">
                  <SettingsTab 
                    user={user} 
                    userPreferences={userPreferences}
                    onLogout={logout} 
                  />
                </TabsContent>
              </DashboardTabs>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
