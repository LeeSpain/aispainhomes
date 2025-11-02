
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertiesTab from '@/components/dashboard/PropertiesTab';
import ProfileTab from '@/components/dashboard/ProfileTab';
import FavoritesTab from '@/components/dashboard/FavoritesTab';
import AlertsTab from '@/components/dashboard/AlertsTab';
import DocumentsTab from '@/components/dashboard/DocumentsTab';
import ServiceProviderTab from '@/components/dashboard/ServiceProviderTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import BillingTab from '@/components/dashboard/BillingTab';
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
  isClaraProcessing?: boolean;
  claraServiceRecommendations?: any[];
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
  hasCompletedQuestionnaire = false,
  isClaraProcessing = false,
  claraServiceRecommendations = []
}: DashboardContentProps) => {
  
  // Filter Clara services by category, fallback to mock data
  const getClaraServicesByCategory = (category: string) => {
    const claraFiltered = claraServiceRecommendations.filter(s => s.service_category === category);
    if (claraFiltered.length > 0) {
      return claraFiltered.map((s: any) => ({
        id: s.id,
        name: s.business_name,
        type: s.service_category,
        location: s.location || '',
        contact: s.contact_info?.phone || s.contact_info?.email || s.contact_info?.website || 'Contact via website',
        details: s.description || '',
        locations: [s.location],
        serviceCategory: s.service_category,
        suitableFor: [],
      }));
    }
    // Fallback to mock data
    return [];
  };

  const claraLawyers = getClaraServicesByCategory('legal');
  const claraUtilities = getClaraServicesByCategory('utilities');
  const claraMovers = getClaraServicesByCategory('movers');
  const claraSchools = getClaraServicesByCategory('schools');
  const claraHealthcare = getClaraServicesByCategory('healthcare');
  
  // Filter services based on user needs
  const filteredLawyers = claraLawyers.length > 0 ? claraLawyers : filterServicesByUserNeeds(lawyers, userPreferences, questionnaireData).providers;
  const filteredUtilities = claraUtilities.length > 0 ? claraUtilities : filterServicesByUserNeeds(utilities, userPreferences, questionnaireData).providers;
  const filteredMovers = claraMovers.length > 0 ? claraMovers : filterServicesByUserNeeds(movers, userPreferences, questionnaireData).providers;
  const filteredSchools = claraSchools.length > 0 ? claraSchools : filterServicesByUserNeeds(schools, userPreferences, questionnaireData).providers;
  const filteredHealthcare = claraHealthcare.length > 0 ? claraHealthcare : filterServicesByUserNeeds(healthcare, userPreferences, questionnaireData).providers;
  
  const renderContent = () => {
    // Handle services submenu
    if (activeTab === 'services' && activeSubTab) {
      switch (activeSubTab) {
        case 'lawyers':
          return (
            <ServiceProviderTab 
              title="Legal Services" 
              providers={filteredLawyers}
              matchReasons={claraLawyers.length > 0 ? new Map(claraServiceRecommendations.filter(s => s.service_category === 'legal').map(s => [s.business_name, [s.why_recommended]])) : undefined}
              totalAvailable={claraLawyers.length > 0 ? claraLawyers.length : lawyers.length}
            />
          );
        case 'utilities':
          return (
            <ServiceProviderTab 
              title="Utility Services" 
              providers={filteredUtilities}
              matchReasons={claraUtilities.length > 0 ? new Map(claraServiceRecommendations.filter(s => s.service_category === 'utilities').map(s => [s.business_name, [s.why_recommended]])) : undefined}
              totalAvailable={claraUtilities.length > 0 ? claraUtilities.length : utilities.length}
            />
          );
        case 'movers':
          return (
            <ServiceProviderTab 
              title="Moving Services" 
              providers={filteredMovers}
              matchReasons={claraMovers.length > 0 ? new Map(claraServiceRecommendations.filter(s => s.service_category === 'movers').map(s => [s.business_name, [s.why_recommended]])) : undefined}
              totalAvailable={claraMovers.length > 0 ? claraMovers.length : movers.length}
            />
          );
        case 'schools':
          return (
            <ServiceProviderTab 
              title="Education Services" 
              providers={filteredSchools}
              matchReasons={claraSchools.length > 0 ? new Map(claraServiceRecommendations.filter(s => s.service_category === 'schools').map(s => [s.business_name, [s.why_recommended]])) : undefined}
              totalAvailable={claraSchools.length > 0 ? claraSchools.length : schools.length}
            />
          );
        case 'healthcare':
          return (
            <ServiceProviderTab 
              title="Healthcare Services" 
              providers={filteredHealthcare}
              matchReasons={claraHealthcare.length > 0 ? new Map(claraServiceRecommendations.filter(s => s.service_category === 'healthcare').map(s => [s.business_name, [s.why_recommended]])) : undefined}
              totalAvailable={claraHealthcare.length > 0 ? claraHealthcare.length : healthcare.length}
            />
          );
        default:
          return (
            <ServiceProviderTab 
              title="Legal Services" 
              providers={filteredLawyers}
              matchReasons={claraLawyers.length > 0 ? new Map(claraServiceRecommendations.filter(s => s.service_category === 'legal').map(s => [s.business_name, [s.why_recommended]])) : undefined}
              totalAvailable={claraLawyers.length > 0 ? claraLawyers.length : lawyers.length}
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
            isClaraProcessing={isClaraProcessing}
          />
        );
      case 'profile':
        return <ProfileTab />;
      case 'favorites':
        return <FavoritesTab favorites={favoriteProperties} isLoading={isLoadingFavorites} />;
      case 'alerts':
        return <AlertsTab />;
      case 'billing':
        return <BillingTab />;
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
            isClaraProcessing={isClaraProcessing}
          />
        );
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-lg sm:rounded-xl border p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Welcome back, <span className="text-primary">{user.name}</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Clara is monitoring your property search and relocation needs
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-background rounded-lg sm:rounded-xl p-4 sm:p-6 border shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardContent;
