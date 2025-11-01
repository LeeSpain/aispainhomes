
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import PropertiesTab from '@/components/dashboard/PropertiesTab';
import FavoritesTab from '@/components/dashboard/FavoritesTab';
import AlertsTab from '@/components/dashboard/AlertsTab';
import DocumentsTab from '@/components/dashboard/DocumentsTab';
import ServiceProviderTab from '@/components/dashboard/ServiceProviderTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import { TabsContent } from '@/components/ui/tabs';
import { Property } from '@/components/properties/PropertyCard';
import { User, UserPreferences } from '@/contexts/auth/types';

// Import mock service provider data
import { 
  lawyers, 
  utilities, 
  movers, 
  schools, 
  healthcare 
} from '@/components/dashboard/serviceProvidersData';

interface DashboardContentProps {
  user: User;
  userPreferences: UserPreferences | null;
  properties: Property[];
  favoriteProperties: Property[];
  isLoadingProperties: boolean;
  isLoadingFavorites: boolean;
  onLogout: () => void;
}

const DashboardContent = ({ 
  user, 
  userPreferences, 
  properties, 
  favoriteProperties, 
  isLoadingProperties,
  isLoadingFavorites,
  onLogout 
}: DashboardContentProps) => {
  const [activeTab, setActiveTab] = useState('properties');
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  return (
    <div>
      <DashboardHeader user={user} variant="simple" />
      
      <div className="mt-8">
        <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange}>
          <TabsContent value="properties">
            <div className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
              <PropertiesTab properties={properties} isLoading={isLoadingProperties} />
            </div>
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
              <FavoritesTab favorites={favoriteProperties} isLoading={isLoadingFavorites} />
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
                onLogout={onLogout}
              />
            </div>
          </TabsContent>
        </DashboardTabs>
      </div>
    </div>
  );
};

export default DashboardContent;
