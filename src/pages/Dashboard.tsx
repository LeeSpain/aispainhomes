
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { Bell, LogOut, Settings as SettingsIcon, User as UserIcon, User, Home, Star, FileText, Briefcase, AlertCircle, CreditCard } from 'lucide-react';
import { alertsService } from '@/services/alertsService';
import MobileNavMenu from '@/components/common/MobileNavMenu';
import ClaraLoadingState from '@/components/common/ClaraLoadingState';
import GlobalLoading from '@/components/common/GlobalLoading';
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
import { useDashboardInit } from '@/hooks/useDashboardInit';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, userPreferences, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [unreadAlertCount, setUnreadAlertCount] = useState(0);
  const [profileInitialTab, setProfileInitialTab] = useState('personal');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Reset profile initial tab when navigating away from profile
  useEffect(() => {
    if (activeTab !== 'profile') {
      setProfileInitialTab('personal');
    }
  }, [activeTab]);

  // Force scroll to top whenever dashboard route is accessed (including same-path navigations)
  useEffect(() => {
    const toTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      (document.scrollingElement || document.body).scrollTop = 0;
    };
    toTop();
    requestAnimationFrame(toTop);
    setTimeout(toTop, 0);
  }, [location.pathname, location.key]);
  
  // Also scroll to top on in-page dashboard navigation (tabs/subtabs)
  useEffect(() => {
    const toTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      (document.scrollingElement || document.body).scrollTop = 0;
    };
    toTop();
    requestAnimationFrame(toTop);
  }, [activeTab, activeSubTab]);
  // Use comprehensive dashboard initialization hook
  const { 
    properties, 
    matchScores, 
    matchReasons, 
    isLoading: isLoadingProperties,
    isClaraProcessing,
    questionnaireData,
    hasCompletedQuestionnaire,
    claraServiceRecommendations
  } = useDashboardInit(user?.id, refreshKey);
  
  // Load unread alert count
  useEffect(() => {
    if (!user?.id) return;

    const loadAlertCount = async () => {
      try {
        const count = await alertsService.getUnreadCount(user.id);
        setUnreadAlertCount(count);
      } catch (error) {
        console.error('Error loading alert count:', error);
      }
    };

    loadAlertCount();
  }, [user?.id]);
  
  // Redirect guards: login -> email verification -> questionnaire -> dashboard
  useEffect(() => {
    if (authLoading || isLoadingProperties) return;
    
    // 1. Not authenticated -> login
    if (!user) {
      navigate('/login');
      return;
    }
    
    // 2. Email not verified -> email verification page
    // Check if user's email is confirmed by fetching fresh user data
    const checkEmailVerification = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser?.email_confirmed_at) {
        navigate('/verify-email');
        return;
      }
      
      // Questionnaire completion check intentionally removed to avoid false redirects during data loading
    };
    
    checkEmailVerification();
  }, [user, authLoading, isLoadingProperties, hasCompletedQuestionnaire, navigate]);
  
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
    { id: 'alerts', label: 'Alerts', icon: AlertCircle, badge: unreadAlertCount > 0 ? unreadAlertCount : undefined },
    { id: 'billing', label: 'Billing', icon: CreditCard },
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
  
  // Show loading state while auth/preferences are loading
  if (authLoading || !user || !userPreferences) {
    return <GlobalLoading />;
  }
  
  const handleNavigateToProfileProperty = () => {
    setProfileInitialTab('property');
    setActiveTab('profile');
  };

  const handleRefreshComplete = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | AI Homes Spain</title>
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
          <div className="container flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-6">
              <MobileNavMenu
                activeTab={activeTab}
                activeSubTab={activeSubTab}
                unreadAlertCount={unreadAlertCount}
                favoritesCount={favorites.length}
                onTabChange={setActiveTab}
                onSubTabChange={setActiveSubTab}
              />
              
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden lg:hidden xl:block"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Home className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  AI Homes Spain
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
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* AI Guardian Sidebar */}
            <aside className={`lg:col-span-4 ${!sidebarOpen && 'hidden lg:block'}`}>
              <div className="lg:sticky lg:top-24">
                <DashboardSidebar 
                  user={user} 
                  subscription={userPreferences.subscription} 
                />
              </div>
            </aside>
          
            {/* Main Content Area */}
            <main className="lg:col-span-8">
              {isClaraProcessing && activeTab === 'properties' ? (
                <div className="mt-6">
                  <ClaraLoadingState 
                    title="Clara is Curating Your Properties"
                    message="Finding the perfect properties that match your preferences. This usually takes 20-30 seconds."
                  />
                </div>
              ) : (
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
                  hasCompletedQuestionnaire={hasCompletedQuestionnaire}
                  isClaraProcessing={isClaraProcessing}
                  questionnaireData={questionnaireData}
                  claraServiceRecommendations={claraServiceRecommendations}
                  onNavigateToProfileProperty={handleNavigateToProfileProperty}
                  profileInitialTab={profileInitialTab}
                  onRefreshComplete={handleRefreshComplete}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
