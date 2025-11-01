import { ServiceProvider } from '@/components/dashboard/ServiceProviderList';
import { UserPreferences } from '@/contexts/auth/types';

interface QuestionnaireData {
  location_preferences?: string[];
  household_details?: {
    children?: number;
    pets?: boolean;
  };
  services_needed?: {
    legal?: boolean;
    utilities?: boolean;
    healthcare?: boolean;
    schools?: boolean;
    moving?: boolean;
  };
  relocation_timeline?: {
    relocateWhen?: string;
  };
}

export interface FilteredServiceResult {
  providers: ServiceProvider[];
  matchReasons: Map<string, string[]>;
}

export const filterServicesByUserNeeds = (
  providers: ServiceProvider[],
  userPreferences: UserPreferences | null,
  questionnaireData: QuestionnaireData | null
): FilteredServiceResult => {
  const matchReasons = new Map<string, string[]>();
  
  if (!userPreferences && !questionnaireData) {
    // No filtering, return all with no reasons
    return { providers, matchReasons };
  }

  const filteredProviders = providers.filter(provider => {
    const reasons: string[] = [];
    let matches = false;

    // Location matching
    const userLocations = questionnaireData?.location_preferences || [];
    if (userLocations.length > 0 && provider.locations) {
      const locationMatch = provider.locations.some(loc => 
        userLocations.some(userLoc => 
          loc.toLowerCase().includes(userLoc.toLowerCase()) ||
          userLoc.toLowerCase().includes(loc.toLowerCase())
        )
      );
      if (locationMatch) {
        matches = true;
        reasons.push(`Available in your preferred location`);
      }
    } else if (provider.locations) {
      // If no user locations specified, include all
      matches = true;
    }

    // Service needs matching
    const servicesNeeded = questionnaireData?.services_needed;
    if (servicesNeeded && provider.serviceCategory) {
      if (servicesNeeded.legal && provider.serviceCategory === 'legal') {
        matches = true;
        reasons.push('You indicated need for legal services');
      }
      if (servicesNeeded.utilities && provider.serviceCategory === 'utilities') {
        matches = true;
        reasons.push('You indicated need for utility setup');
      }
      if (servicesNeeded.healthcare && provider.serviceCategory === 'healthcare') {
        matches = true;
        reasons.push('You indicated need for healthcare services');
      }
      if (servicesNeeded.schools && provider.serviceCategory === 'schools') {
        matches = true;
        reasons.push('You indicated need for education services');
      }
      if (servicesNeeded.moving && provider.serviceCategory === 'movers') {
        matches = true;
        reasons.push('You indicated need for moving services');
      }
    }

    // Household-specific needs
    const household = questionnaireData?.household_details;
    if (household) {
      if (household.children && household.children > 0 && provider.suitableFor?.includes('families')) {
        matches = true;
        reasons.push('Family-friendly service');
      }
      if (household.pets && provider.suitableFor?.includes('pets')) {
        matches = true;
        reasons.push('Pet-friendly service');
      }
    }

    // Timeline urgency
    const timeline = questionnaireData?.relocation_timeline?.relocateWhen;
    if (timeline && provider.urgency) {
      if (timeline === '1-3 months' && provider.urgency === 'high') {
        matches = true;
        reasons.push('High priority for your timeline');
      } else if (timeline === '3-6 months' && provider.urgency === 'medium') {
        matches = true;
        reasons.push('Important for your timeline');
      }
    }

    if (matches && reasons.length > 0) {
      matchReasons.set(provider.name, reasons);
    }

    return matches || (!servicesNeeded && !household); // Include all if no preferences
  });

  return {
    providers: filteredProviders.length > 0 ? filteredProviders : providers,
    matchReasons
  };
};
