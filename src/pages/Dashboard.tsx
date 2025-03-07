import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Property } from "@/components/properties/PropertyCard";
import { PropertyService } from "@/services/PropertyService";
import { 
  Bell, 
  Home, 
  Settings, 
  FileText, 
  Users,
  Search,
  Truck,
  School,
  HeartPulse,
  Tv,
  Star,
  ShieldCheck
} from "lucide-react";

interface ServiceProvider {
  id: string;
  name: string;
  type: string;
  location: string;
  contact: string;
  details: string;
}

const sampleServiceProviders: Record<string, ServiceProvider[]> = {
  lawyers: [
    { id: '1', name: 'Martinez & Associates', type: 'Law Firm', location: 'Barcelona', contact: 'contact@martinez.es', details: 'Specializes in property law and foreign investments' },
    { id: '2', name: 'Spanish Legal Services', type: 'Law Firm', location: 'Marbella', contact: 'info@spanishlegals.com', details: 'English speaking lawyers with property expertise' },
    { id: '3', name: 'Garcia Law', type: 'Law Firm', location: 'Madrid', contact: 'office@garcia.legal', details: 'Full service legal assistance for property transactions' },
  ],
  utilities: [
    { id: '1', name: 'Movistar', type: 'Internet & TV', location: 'Nationwide', contact: 'support@movistar.es', details: 'Fiber optic internet and TV packages' },
    { id: '2', name: 'Endesa', type: 'Electricity', location: 'Nationwide', contact: 'clients@endesa.es', details: 'Electricity provider with english support' },
    { id: '3', name: 'Canal de Isabel II', type: 'Water', location: 'Madrid', contact: 'info@canaldeisabelsegunda.es', details: 'Water utility provider for Madrid region' },
  ],
  movers: [
    { id: '1', name: 'International Movers Spain', type: 'Moving Company', location: 'Barcelona', contact: 'bookings@intmovers.es', details: 'Specializes in international relocations' },
    { id: '2', name: 'MoveToSpain', type: 'Moving Company', location: 'Nationwide', contact: 'quotes@movetospain.com', details: 'Door-to-door moving services across Europe' },
    { id: '3', name: 'Express Relocations', type: 'Moving & Storage', location: 'Costa del Sol', contact: 'info@expressrelo.es', details: 'Full service moving and temporary storage' },
  ],
  schools: [
    { id: '1', name: 'British School of Barcelona', type: 'International School', location: 'Barcelona', contact: 'admissions@bsb.edu.es', details: 'British curriculum, ages 3-18' },
    { id: '2', name: 'American School of Madrid', type: 'International School', location: 'Madrid', contact: 'info@asmadrid.org', details: 'American curriculum, PreK-Grade 12' },
    { id: '3', name: 'Deutsche Schule Valencia', type: 'International School', location: 'Valencia', contact: 'info@dsvalencia.org', details: 'German curriculum with English and Spanish' },
  ],
  healthcare: [
    { id: '1', name: 'Quirónsalud Hospital', type: 'Private Hospital', location: 'Multiple Cities', contact: 'international@quironsalud.es', details: 'Network of private hospitals with international patient departments' },
    { id: '2', name: 'MAPFRE Health', type: 'Insurance Provider', location: 'Nationwide', contact: 'salud@mapfre.com', details: 'Health insurance with English-speaking doctors network' },
    { id: '3', name: 'Sanitas', type: 'Insurance & Clinics', location: 'Nationwide', contact: 'clientes@sanitas.es', details: 'Private health insurance and medical centers' },
  ]
};

const Dashboard = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);
  
  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;
      
      setIsLoadingProperties(true);
      try {
        const propertiesData = await PropertyService.getAllProperties();
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoadingProperties(false);
      }
    };
    
    const fetchFavorites = async () => {
      if (!user) return;
      
      setIsLoadingFavorites(true);
      try {
        const favoritesData = await PropertyService.getUserFavorites(user.id);
        setFavorites(favoritesData);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };
    
    fetchProperties();
    fetchFavorites();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  const ServiceProviderList = ({ providers }: { providers: ServiceProvider[] }) => (
    <div className="space-y-4">
      {providers.map(provider => (
        <div key={provider.id} className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
          <h3 className="font-semibold text-lg">{provider.name}</h3>
          <p className="text-sm text-muted-foreground">{provider.type} • {provider.location}</p>
          <p className="mt-2">{provider.details}</p>
          <div className="mt-3 flex justify-between items-center">
            <p className="text-sm">{provider.contact}</p>
            <Button variant="outline" size="sm">Contact</Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Your Dashboard | SunnyHomeFinder</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
                  <p className="text-muted-foreground">Manage your property search and relocation services</p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-2">
                  <Button variant="outline" onClick={() => navigate("/questionnaire")} className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Property Search
                  </Button>
                  <Button variant="default" onClick={() => navigate("/questionnaire?service=guardian")} className="flex items-center">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    AI Guardian
                  </Button>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="w-full overflow-x-auto py-2">
                  <TabsTrigger value="properties" className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Properties
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="flex items-center">
                    <Star className="mr-2 h-4 w-4" />
                    Favorites
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="flex items-center">
                    <Bell className="mr-2 h-4 w-4" />
                    Alerts
                  </TabsTrigger>
                  <TabsTrigger value="lawyers" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Lawyers
                  </TabsTrigger>
                  <TabsTrigger value="utilities" className="flex items-center">
                    <Tv className="mr-2 h-4 w-4" />
                    Utilities
                  </TabsTrigger>
                  <TabsTrigger value="movers" className="flex items-center">
                    <Truck className="mr-2 h-4 w-4" />
                    Movers
                  </TabsTrigger>
                  <TabsTrigger value="schools" className="flex items-center">
                    <School className="mr-2 h-4 w-4" />
                    Schools
                  </TabsTrigger>
                  <TabsTrigger value="healthcare" className="flex items-center">
                    <HeartPulse className="mr-2 h-4 w-4" />
                    Healthcare
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="properties" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">Your Property Matches</h2>
                  <PropertyGrid properties={properties} isLoading={isLoadingProperties} />
                </TabsContent>
                
                <TabsContent value="favorites" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">Your Favorite Properties</h2>
                  <PropertyGrid properties={favorites} isLoading={isLoadingFavorites} />
                </TabsContent>
                
                <TabsContent value="alerts" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">Your Property Alerts</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Daily Alert: Barcelona Apartments</h3>
                          <p className="text-sm text-muted-foreground">Apartments in Barcelona, 2+ bedrooms, €250k-€400k</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Weekly Alert: Costa del Sol Villas</h3>
                          <p className="text-sm text-muted-foreground">Villas in Marbella area, 3+ bedrooms, with pool</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="lawyers" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">Recommended Legal Services</h2>
                  <ServiceProviderList providers={sampleServiceProviders.lawyers} />
                </TabsContent>
                
                <TabsContent value="utilities" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">TV & Utility Providers</h2>
                  <ServiceProviderList providers={sampleServiceProviders.utilities} />
                </TabsContent>
                
                <TabsContent value="movers" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">Moving Companies</h2>
                  <ServiceProviderList providers={sampleServiceProviders.movers} />
                </TabsContent>
                
                <TabsContent value="schools" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">Schools & Education</h2>
                  <ServiceProviderList providers={sampleServiceProviders.schools} />
                </TabsContent>
                
                <TabsContent value="healthcare" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">Healthcare Providers</h2>
                  <ServiceProviderList providers={sampleServiceProviders.healthcare} />
                </TabsContent>
                
                <TabsContent value="documents" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">Your Documents</h2>
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <p>You haven't uploaded any documents yet.</p>
                    <Button variant="outline" className="mt-4">Upload Documents</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
                  <div className="space-y-6 max-w-2xl">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Profile Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" defaultValue={user.name} className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue={user.email} className="mt-1" readOnly />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Notification Preferences</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-notifications">Email notifications</Label>
                          <div>
                            <input
                              type="checkbox"
                              id="email-notifications"
                              defaultChecked={true}
                              className="form-checkbox h-5 w-5 text-primary rounded"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="property-alerts">Daily property alerts</Label>
                          <div>
                            <input
                              type="checkbox"
                              id="property-alerts"
                              defaultChecked={true}
                              className="form-checkbox h-5 w-5 text-primary rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Subscription</h3>
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Premium Plan</p>
                            <p className="text-sm text-muted-foreground">€9.99/month • Next billing date: 15/09/2023</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Manage Subscription
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="destructive" onClick={logout}>
                        Logout
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
