
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useAuth } from '@/contexts/auth/useAuth';
import { Property } from '@/components/properties/PropertyCard';
import { PropertyService } from '@/services/PropertyService';

const Dashboard = () => {
  const { user, userPreferences, logout } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create a mock user if none exists (for direct access)
  const mockUser = {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@example.com'
  };
  
  const mockPreferences = {
    favorites: [],
    recentSearches: [],
    subscription: {
      plan: 'basic',
      status: 'active' as 'active' | 'cancelled' | 'expired' | 'trial' | 'inactive',
      startDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  };
  
  // Use the real user or the mock user
  const currentUser = user || mockUser;
  const currentPreferences = userPreferences || mockPreferences;
  
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Load recommended properties
        const propertiesData = await PropertyService.getFilteredProperties({});
        setProperties(propertiesData.slice(0, 4)); // Show only 4 recommendations
        
        // Load favorite properties
        if (currentPreferences?.favorites && currentPreferences.favorites.length > 0) {
          const promises = currentPreferences.favorites.map(id => 
            PropertyService.getPropertyById(id)
          );
          
          const results = await Promise.all(promises);
          const validResults = results.filter(item => item !== null) as Property[];
          setFavoriteProperties(validResults);
        } else {
          setFavoriteProperties([]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [currentPreferences?.favorites]);
  
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
            isLoading={isLoading}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
