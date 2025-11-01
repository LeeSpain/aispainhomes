
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Subscription {
  plan: 'guardian';
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'inactive';
  startDate: string;
  trialEndDate?: string;
  nextBillingDate: string;
  cancelAtPeriodEnd?: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  lastFourDigits?: string;
}

export interface UserPreferences {
  favorites: string[];
  recentSearches: {
    id: string;
    query: string;
    timestamp: number;
  }[];
  language: string;
  notificationSettings: {
    email: boolean;
    propertyAlerts: boolean;
    weeklyNewsletter?: boolean;
    marketUpdates?: boolean;
    promotionalOffers?: boolean;
  };
  subscription?: Subscription;
  profile?: {
    fullName?: string;
    phone?: string;
    country?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  userPreferences: UserPreferences | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  updateUserProfile: (profile: Partial<User>) => void;
  addToFavorites: (propertyId: string) => void;
  removeFromFavorites: (propertyId: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  subscribeToEmailUpdates: (email: string) => Promise<void>;
  cancelSubscription: () => Promise<any>;
  getPaymentHistory: () => Promise<any>;
  updatePaymentMethod: (paymentMethodId: string) => Promise<void>;
}
