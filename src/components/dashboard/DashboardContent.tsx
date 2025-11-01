
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertiesTab from '@/components/dashboard/PropertiesTab';
import ProfileTab from '@/components/dashboard/ProfileTab';
import FavoritesTab from '@/components/dashboard/FavoritesTab';
import AlertsTab from '@/components/dashboard/AlertsTab';
import DocumentsTab from '@/components/dashboard/DocumentsTab';
import ServiceProviderTab from '@/components/dashboard/ServiceProviderTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import { Property } from '@/components/properties/PropertyCard';
import { User, UserPreferences } from '@/contexts/auth/types';
import { filterServicesByUserNeeds } from '@/services/serviceFilter';

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
  activeTab: string;
  activeSubTab: string | null;
  matchScores?: Map<string, number>;
  matchReasons?: Map<string, string[]>;
  questionnaireData?: any;
  hasCompletedQuestionnaire?: boolean;
}

const DashboardContent = ({ 
  user, 
  userPreferences, 
  properties, 
  favoriteProperties, 
  isLoadingProperties,
  isLoadingFavorites,
  onLogout,
  activeTab,
  activeSubTab,
  matchScores,
  matchReasons,
  questionnaireData,
  hasCompletedQuestionnaire = false
}: DashboardContentProps) => {
  
  // Filter services based on user needs
  const filteredLawyers = filterServicesByUserNeeds(lawyers, userPreferences, questionnaireData);
  const filteredUtilities = filterServicesByUserNeeds(utilities, userPreferences, questionnaireData);
  const filteredMovers = filterServicesByUserNeeds(movers, userPreferences, questionnaireData);
  const filteredSchools = filterServicesByUserNeeds(schools, userPreferences, questionnaireData);
  const filteredHealthcare = filterServicesByUserNeeds(healthcare, userPreferences, questionnaireData);
  
  const renderContent = () => {
    // Handle services submenu
    if (activeTab === 'services' && activeSubTab) {
      switch (activeSubTab) {
        case 'lawyers':
          return (
            <ServiceProviderTab 
              title="Legal Services" 
              providers={filteredLawyers.providers}
              matchReasons={filteredLawyers.matchReasons}
              totalAvailable={lawyers.length}
            />
          );
        case 'utilities':
          return (
            <ServiceProviderTab 
              title="Utility Services" 
              providers={filteredUtilities.providers}
              matchReasons={filteredUtilities.matchReasons}
              totalAvailable={utilities.length}
            />
          );
        case 'movers':
          return (
            <ServiceProviderTab 
              title="Moving Services" 
              providers={filteredMovers.providers}
              matchReasons={filteredMovers.matchReasons}
              totalAvailable={movers.length}
            />
          );
        case 'schools':
          return (
            <ServiceProviderTab 
              title="Education Services" 
              providers={filteredSchools.providers}
              matchReasons={filteredSchools.matchReasons}
              totalAvailable={schools.length}
            />
          );
        case 'healthcare':
          return (
            <ServiceProviderTab 
              title="Healthcare Services" 
              providers={filteredHealthcare.providers}
              matchReasons={filteredHealthcare.matchReasons}
              totalAvailable={healthcare.length}
            />
          );
        default:
          return (
            <ServiceProviderTab 
              title="Legal Services" 
              providers={filteredLawyers.providers}
              matchReasons={filteredLawyers.matchReasons}
              totalAvailable={lawyers.length}
            />
          );
      }
    }

    // Handle main tabs
    switch (activeTab) {
      case 'properties':
        return (
          <PropertiesTab 
            properties={properties} 
            isLoading={isLoadingProperties}
            matchScores={matchScores}
            matchReasons={matchReasons}
            questionnaireData={questionnaireData}
            hasCompletedQuestionnaire={hasCompletedQuestionnaire}
          />
        );
      case 'profile':
        return <ProfileTab />;
      case 'favorites':
        return <FavoritesTab favorites={favoriteProperties} isLoading={isLoadingFavorites} />;
      case 'alerts':
        return <AlertsTab />;
      case 'documents':
        return <DocumentsTab />;
      case 'settings':
        return (
          <SettingsTab
            user={user}
            userPreferences={userPreferences}
            onLogout={onLogout}
          />
        );
      default:
        return (
          <PropertiesTab 
            properties={properties} 
            isLoading={isLoadingProperties}
            matchScores={matchScores}
            matchReasons={matchReasons}
            questionnaireData={questionnaireData}
            hasCompletedQuestionnaire={hasCompletedQuestionnaire}
          />
        );
    }
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
              Clara is monitoring your property search and relocation needs
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-background rounded-xl p-6 border shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardContent;
