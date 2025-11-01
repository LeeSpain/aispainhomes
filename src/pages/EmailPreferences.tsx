
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const EmailPreferences = () => {
  const { user, userPreferences, updateUserPreferences } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    email: true,
    propertyAlerts: true,
    weeklyNewsletter: true,
    marketUpdates: false,
    promotionalOffers: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    
    if (userPreferences?.notificationSettings) {
      setPreferences({
        ...preferences,
        email: userPreferences.notificationSettings.email,
        propertyAlerts: userPreferences.notificationSettings.propertyAlerts,
      });
    }
  }, [user, userPreferences, navigate]);

  const handleToggle = (key: string) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key as keyof typeof preferences],
    });
  };

  const handleSave = () => {
    setLoading(true);
    
    setTimeout(() => {
      updateUserPreferences({
        notificationSettings: {
          email: preferences.email,
          propertyAlerts: preferences.propertyAlerts,
        },
      });
      
      setLoading(false);
      toast.success('Email preferences updated successfully');
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Email Preferences | SunnyHomeFinder</title>
      </Helmet>
      
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Email Preferences</h1>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how and when you receive emails from us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive general notifications by email
                    </p>
                  </div>
                  <Switch
                    id="email"
                    checked={preferences.email}
                    onCheckedChange={() => handleToggle('email')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="propertyAlerts" className="text-base">Property Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about new properties matching your criteria
                    </p>
                  </div>
                  <Switch
                    id="propertyAlerts"
                    checked={preferences.propertyAlerts}
                    onCheckedChange={() => handleToggle('propertyAlerts')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyNewsletter" className="text-base">Weekly Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive our weekly newsletter with property market insights
                    </p>
                  </div>
                  <Switch
                    id="weeklyNewsletter"
                    checked={preferences.weeklyNewsletter}
                    onCheckedChange={() => handleToggle('weeklyNewsletter')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketUpdates" className="text-base">Market Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive monthly reports on the Spanish property market
                    </p>
                  </div>
                  <Switch
                    id="marketUpdates"
                    checked={preferences.marketUpdates}
                    onCheckedChange={() => handleToggle('marketUpdates')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="promotionalOffers" className="text-base">Promotional Offers</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive occasional offers and promotions
                    </p>
                  </div>
                  <Switch
                    id="promotionalOffers"
                    checked={preferences.promotionalOffers}
                    onCheckedChange={() => handleToggle('promotionalOffers')}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailPreferences;
