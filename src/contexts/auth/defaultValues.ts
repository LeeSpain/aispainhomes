
import { UserPreferences } from './types';

export const defaultUserPreferences: UserPreferences = {
  favorites: [],
  recentSearches: [],
  language: 'en',
  notificationSettings: {
    email: true,
    propertyAlerts: true,
    weeklyNewsletter: true,
    marketUpdates: false,
    promotionalOffers: false,
  },
  subscription: {
    plan: 'basic',
    status: 'active',
    startDate: new Date().toISOString(),
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  profile: {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  }
};
