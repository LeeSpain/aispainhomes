
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
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);
  
  // Load recommended properties once when auth is ready
  useEffect(() => {
    if (authLoading || !user) return;
    
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
  }, [authLoading, user]);
  
  // Load favorite properties when favorites list changes
  useEffect(() => {
    if (authLoading || !user || !userPreferences) return;
    
    const favoriteIds = userPreferences.favorites || [];
    
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
  }, [authLoading, user, userPreferences?.favorites?.join(",")]);
  
  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  // Don't render until auth check is complete
  if (authLoading || !user || !userPreferences) {
    return null;
  }
  
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left side - AIGuardian Chat */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <DashboardSidebar 
            user={user} 
            subscription={userPreferences.subscription} 
          />
        </div>
      
        {/* Right side - Dashboard Content */}
        <div className="lg:col-span-8 xl:col-span-9">
          <DashboardContent
            user={user}
            userPreferences={userPreferences}
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
