
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-xl border p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Welcome back, <span className="text-primary">{user.name}</span>
            </h2>
            <p className="text-muted-foreground mt-1">
              Your AI Guardian is monitoring your property search and relocation needs
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange}>
        <TabsContent value="properties" className="mt-0">
          <div className="bg-background rounded-xl p-6 border shadow-sm">
            <PropertiesTab properties={properties} isLoading={isLoadingProperties} />
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-0">
          <div className="bg-background rounded-xl p-6 border shadow-sm">
            <FavoritesTab favorites={favoriteProperties} isLoading={isLoadingFavorites} />
          </div>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-0">
          <div className="bg-background rounded-xl p-6 border shadow-sm">
            <AlertsTab />
          </div>
        </TabsContent>
        
        <TabsContent value="lawyers" className="mt-0">
          <div className="bg-background rounded-xl p-6 border shadow-sm">
            <ServiceProviderTab title="Legal Services" providers={lawyers} />
          </div>
        </TabsContent>
        
        <TabsContent value="utilities" className="mt-0">
          <div className="bg-background rounded-xl p-6 border shadow-sm">
            <ServiceProviderTab title="Utility Services" providers={utilities} />
          </div>
        </TabsContent>
        
        <TabsContent value="movers" className="mt-0">
          <div className="bg-background rounded-xl p-6 border shadow-sm">
            <ServiceProviderTab title="Moving Services" providers={movers} />
          </div>
        </TabsContent>
        
        <TabsContent value="schools" className="mt-0">
          <div className="bg-background rounded-xl p-6 border shadow-sm">
            <ServiceProviderTab title="Education Services" providers={schools} />
          </div>
        </TabsContent>
        
        <TabsContent value="healthcare" className="mt-0">
          <div className="bg-background rounded-xl p-6 border shadow-sm">
            <ServiceProviderTab title="Healthcare Services" providers={healthcare} />
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-0">
          <div className="bg-background rounded-xl p-6 border shadow-sm">
            <DocumentsTab />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <div className="bg-background rounded-xl p-6 border shadow-sm">
            <SettingsTab
              user={user}
              userPreferences={userPreferences}
              onLogout={onLogout}
            />
          </div>
        </TabsContent>
      </DashboardTabs>
    </div>
  );
};

export default DashboardContent;
