import React, { useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { AuthContext } from './AuthContext';
import { User, UserPreferences } from './types';
import { defaultUserPreferences } from './defaultValues';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          const mappedUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'
          };
          setUser(mappedUser);
          
          // Load preferences after setting user
          setTimeout(() => {
            loadUserPreferences(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setUserPreferences(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const mappedUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'
        };
        setUser(mappedUser);
        loadUserPreferences(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserPreferences = async (userId: string) => {
    try {
      // Fetch user preferences from localStorage for now
      const storedPrefs = localStorage.getItem(`userPreferences_${userId}`);
      if (storedPrefs) {
        setUserPreferences(JSON.parse(storedPrefs));
      } else {
        setUserPreferences(defaultUserPreferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      setUserPreferences(defaultUserPreferences);
    }
  };

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (user && userPreferences) {
      localStorage.setItem(`userPreferences_${user.id}`, JSON.stringify(userPreferences));
    }
  }, [userPreferences, user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (data.user) {
        toast.success("Successfully logged in");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.message || "Failed to login");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (data.user) {
        toast.success("Account created successfully! Please check your email to verify your account.");
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error?.message || "Failed to create account");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserPreferences(null);
      setSession(null);
      toast.success("Successfully logged out");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout");
    }
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
