
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useAuth } from '@/contexts/auth/useAuth';
import { Property } from '@/components/properties/PropertyCard';
import { PropertyService } from '@/services/PropertyService';
import { UserPreferences } from '@/contexts/auth/types';

const Dashboard = () => {
  const { user, userPreferences, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  
  // Create a mock user if none exists (for direct access)
  const mockUser = {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@example.com'
  };
  
  // Create mock preferences that match the UserPreferences type
  const mockPreferences: UserPreferences = {
    favorites: [],
    recentSearches: [],
    subscription: {
      plan: 'basic',
      status: 'active',
      startDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    language: 'en',
    notificationSettings: {
      email: true,
      propertyAlerts: true,
      weeklyNewsletter: false,
      marketUpdates: false,
      promotionalOffers: false
    }
  };
  
  // Use the real user or the mock user
  const currentUser = user || mockUser;
  const currentPreferences = userPreferences || mockPreferences;
  
  // Load recommended properties once when auth is ready
  useEffect(() => {
    if (authLoading) return;
    
    let mounted = true;
    setIsLoadingProperties(true);
    
    PropertyService.getFilteredProperties({})
      .then(propertiesData => {
        if (mounted) {
          setProperties(propertiesData.slice(0, 4));
        }
      })
      .catch(error => {
        console.error("Error loading properties:", error);
        if (mounted) {
          toast.error("Failed to load properties.");
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoadingProperties(false);
        }
      });
    
    return () => { mounted = false; };
  }, [authLoading]);
  
  // Load favorite properties when favorites list changes
  useEffect(() => {
    if (authLoading) return;
    
    const favoriteIds = currentPreferences?.favorites || [];
    
    if (favoriteIds.length === 0) {
      setFavoriteProperties([]);
      setIsLoadingFavorites(false);
      return;
    }
    
    let mounted = true;
    setIsLoadingFavorites(true);
    
    Promise.all(favoriteIds.map(id => PropertyService.getPropertyById(id)))
      .then(results => {
        if (mounted) {
          const validResults = results.filter(item => item !== null) as Property[];
          setFavoriteProperties(validResults);
        }
      })
      .catch(error => {
        console.error("Error loading favorites:", error);
        if (mounted) {
          toast.error("Failed to load favorite properties.");
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoadingFavorites(false);
        }
      });
    
    return () => { mounted = false; };
  }, [authLoading, currentPreferences?.favorites?.join(",")]);
  
  // Handle logout
  const handleLogout = () => {
    if (user) {
      logout();
    }
    navigate('/');
  };
  
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left side - AIGuardian Chat */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <DashboardSidebar 
            user={currentUser} 
            subscription={currentPreferences.subscription} 
          />
        </div>
      
        {/* Right side - Dashboard Content */}
        <div className="lg:col-span-8 xl:col-span-9">
          <DashboardContent
            user={currentUser}
            userPreferences={currentPreferences}
            properties={properties}
            favoriteProperties={favoriteProperties}
            isLoadingProperties={isLoadingProperties}
            isLoadingFavorites={isLoadingFavorites}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
