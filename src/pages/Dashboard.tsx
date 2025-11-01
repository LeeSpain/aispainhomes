
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { Bell, LogOut, Settings as SettingsIcon, User as UserIcon, User, Home, Menu, Star, FileText, Briefcase, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useAuth } from '@/contexts/auth/useAuth';
import { Property } from '@/components/properties/PropertyCard';
import { PropertyService } from '@/services/PropertyService';
import { UserPreferences } from '@/contexts/auth/types';
import { cn } from '@/lib/utils';
import { usePersonalizedDashboard } from '@/hooks/usePersonalizedDashboard';

const Dashboard = () => {
  const { user, userPreferences, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  
  // Use personalized dashboard hook for AI-enhanced property matching
  const { 
    properties, 
    matchScores, 
    matchReasons, 
    isLoading: isLoadingProperties,
    questionnaireData 
  } = usePersonalizedDashboard(user?.id);
  
  // Debug logging
  useEffect(() => {
    console.log('Dashboard - Current user:', user);
    console.log('Dashboard - User preferences:', userPreferences);
  }, [user, userPreferences]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);
  
  // Properties are now loaded via usePersonalizedDashboard hook
  
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
  
  const getUserInitials = () => {
    if (!user) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const favorites = userPreferences?.favorites || [];

  const navItems = [
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'favorites', label: 'Favorites', icon: Star, badge: favorites.length > 0 ? favorites.length : undefined },
    { id: 'alerts', label: 'Alerts', icon: AlertCircle, badge: 3 },
    { 
      id: 'services', 
      label: 'Services', 
      icon: Briefcase,
      subItems: [
        { id: 'lawyers', label: 'Legal' },
        { id: 'utilities', label: 'Utilities' },
        { id: 'movers', label: 'Moving' },
        { id: 'schools', label: 'Education' },
        { id: 'healthcare', label: 'Healthcare' },
      ]
    },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];
  
  // Don't render until auth check is complete
  if (authLoading || !user || !userPreferences) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Dashboard | AI Spain Homes</title>
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  AI Spain Homes
                </h1>
              </div>

              {/* Main Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  item.subItems ? (
                    <DropdownMenu key={item.id}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "gap-2",
                            activeTab === item.id && "bg-primary/10 text-primary"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-background" align="start">
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem
                            key={subItem.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setActiveSubTab(subItem.id);
                            }}
                            className={cn(
                              activeSubTab === subItem.id && "bg-primary/10 text-primary"
                            )}
                          >
                            {subItem.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveTab(item.id);
                        setActiveSubTab(null);
                      }}
                      className={cn(
                        "gap-2 relative",
                        activeTab === item.id && "bg-primary/10 text-primary"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                      {item.badge && (
                        <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  )
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block font-medium">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile-settings')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/subscription')}>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Subscription
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Dashboard Layout */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* AI Guardian Sidebar */}
            <aside className={`xl:col-span-4 ${!sidebarOpen && 'hidden lg:block'}`}>
              <div className="sticky top-24">
                <DashboardSidebar 
                  user={user} 
                  subscription={userPreferences.subscription} 
                />
              </div>
            </aside>
          
            {/* Main Content Area */}
            <main className="xl:col-span-8">
              <DashboardContent
                user={user}
                userPreferences={userPreferences}
                properties={properties}
                favoriteProperties={favoriteProperties}
                isLoadingProperties={isLoadingProperties}
                isLoadingFavorites={isLoadingFavorites}
                onLogout={handleLogout}
                activeTab={activeTab}
                activeSubTab={activeSubTab}
                matchScores={matchScores}
                matchReasons={matchReasons}
                questionnaireData={questionnaireData}
              />
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
