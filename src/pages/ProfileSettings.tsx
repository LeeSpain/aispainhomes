
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const ProfileSettings = () => {
  const { user, userPreferences, updateUserProfile, updateUserPreferences } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Set initial form data from user and preferences
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      fullName: userPreferences?.profile?.fullName || '',
      phone: userPreferences?.profile?.phone || '',
      address: userPreferences?.profile?.address || '',
      city: userPreferences?.profile?.city || '',
      country: userPreferences?.profile?.country || '',
      postalCode: userPreferences?.profile?.postalCode || '',
    });
  }, [user, userPreferences, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Update user profile
    updateUserProfile({
      name: profileData.name,
    });

    // Update user preferences with address info
    updateUserPreferences({
      profile: {
        fullName: profileData.fullName,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        country: profileData.country,
        postalCode: profileData.postalCode,
      }
    });

    setTimeout(() => {
      setLoading(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  const currentPlan = userPreferences?.subscription?.plan || 'basic';
  const nextBillingDate = userPreferences?.subscription?.nextBillingDate 
    ? new Date(userPreferences.subscription.nextBillingDate).toLocaleDateString() 
    : 'N/A';

  return (
    <>
      <Helmet>
        <title>Profile Settings | SunnyHomeFinder</title>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Personal Information</TabsTrigger>
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your profile details here
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              value={profileData.name} 
                              onChange={handleChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              name="email" 
                              value={profileData.email} 
                              readOnly 
                              disabled 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input 
                              id="fullName" 
                              name="fullName" 
                              value={profileData.fullName} 
                              onChange={handleChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone" 
                              name="phone" 
                              type="tel" 
                              value={profileData.phone} 
                              onChange={handleChange} 
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={profileData.address} 
                            onChange={handleChange} 
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input 
                              id="city" 
                              name="city" 
                              value={profileData.city} 
                              onChange={handleChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input 
                              id="country" 
                              name="country" 
                              value={profileData.country} 
                              onChange={handleChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input 
                              id="postalCode" 
                              name="postalCode" 
                              value={profileData.postalCode} 
                              onChange={handleChange} 
                            />
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="subscription">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Management</CardTitle>
                      <CardDescription>
                        Manage your current subscription plan
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div>
                            <p className="font-semibold capitalize">{currentPlan} Plan</p>
                            <p className="text-sm text-muted-foreground">
                              {currentPlan === 'basic' 
                                ? 'Free plan' 
                                : `€${currentPlan === 'premium' ? '9.99' : '19.99'}/month • Next billing date: ${nextBillingDate}`}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 sm:mt-0"
                            onClick={() => navigate('/subscription')}
                          >
                            {currentPlan === 'basic' ? 'Upgrade Plan' : 'Manage Subscription'}
                          </Button>
                        </div>
                      </div>

                      {currentPlan !== 'basic' && (
                        <div className="p-4 border rounded-lg border-destructive/20 bg-destructive/5">
                          <p className="font-semibold">Cancel Subscription</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Your subscription will remain active until the end of your current billing period.
                          </p>
                          <Button variant="destructive" size="sm">
                            Cancel Subscription
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences">
                  <Card>
                    <CardHeader>
                      <CardTitle>Email Preferences</CardTitle>
                      <CardDescription>
                        Manage your email notification settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">
                        You can manage your email preferences on the dedicated page.
                      </p>
                      <Button onClick={() => navigate('/email-preferences')}>
                        Manage Email Preferences
                      </Button>
                    </CardContent>
                  </Card>
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

export default ProfileSettings;
