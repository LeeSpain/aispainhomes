import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Subscription {
  plan: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'inactive';
  startDate: string;
  nextBillingDate: string;
  trialEndDate?: string;
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
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
}

interface AuthContextType {
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const defaultUserPreferences: UserPreferences = {
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    const storedPreferences = localStorage.getItem('userPreferences');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      if (storedPreferences) {
        setUserPreferences(JSON.parse(storedPreferences));
      } else {
        setUserPreferences(defaultUserPreferences);
      }
    }
    setIsLoading(false);
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (user && userPreferences) {
      localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    }
  }, [userPreferences, user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll accept any email/password and generate a fake user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      // Load or create user preferences
      const storedPreferences = localStorage.getItem('userPreferences');
      if (storedPreferences) {
        setUserPreferences(JSON.parse(storedPreferences));
      } else {
        setUserPreferences(defaultUserPreferences);
      }
      
      toast.success("Successfully logged in");
    } catch (error) {
      toast.error("Failed to login");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a user in localStorage
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name,
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setUserPreferences(defaultUserPreferences);
      localStorage.setItem('userPreferences', JSON.stringify(defaultUserPreferences));
      
      toast.success("Account created successfully");
    } catch (error) {
      toast.error("Failed to create account");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setUserPreferences(null);
    toast.success("Successfully logged out");
  };

  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
    if (!userPreferences) return;
    
    const updatedPreferences = {
      ...userPreferences,
      ...preferences,
    };
    
    setUserPreferences(updatedPreferences);
    toast.success("Preferences updated");
  };
  
  const updateUserProfile = (profile: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...profile,
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    toast.success("Profile updated");
  };

  const addToFavorites = (propertyId: string) => {
    if (!userPreferences) return;
    
    if (!userPreferences.favorites.includes(propertyId)) {
      const updatedFavorites = [...userPreferences.favorites, propertyId];
      setUserPreferences({
        ...userPreferences,
        favorites: updatedFavorites,
      });
      toast.success("Added to favorites");
    }
  };

  const removeFromFavorites = (propertyId: string) => {
    if (!userPreferences) return;
    
    const updatedFavorites = userPreferences.favorites.filter(id => id !== propertyId);
    setUserPreferences({
      ...userPreferences,
      favorites: updatedFavorites,
    });
    toast.success("Removed from favorites");
  };

  const addRecentSearch = (query: string) => {
    if (!userPreferences) return;
    
    const newSearch = {
      id: `search-${Date.now()}`,
      query,
      timestamp: Date.now(),
    };
    
    // Keep only the 10 most recent searches
    const updatedSearches = [
      newSearch,
      ...userPreferences.recentSearches.filter(s => s.query !== query),
    ].slice(0, 10);
    
    setUserPreferences({
      ...userPreferences,
      recentSearches: updatedSearches,
    });
  };

  const clearRecentSearches = () => {
    if (!userPreferences) return;
    
    setUserPreferences({
      ...userPreferences,
      recentSearches: [],
    });
    toast.success("Search history cleared");
  };
  
  const subscribeToEmailUpdates = async (email: string) => {
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Thank you for subscribing to email updates!");
      return;
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      userPreferences,
      login, 
      register, 
      logout,
      updateUserPreferences,
      updateUserProfile,
      addToFavorites,
      removeFromFavorites,
      addRecentSearch,
      clearRecentSearches,
      subscribeToEmailUpdates
    }}>
      {children}
    </AuthContext.Provider>
  );
};
