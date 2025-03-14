import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserPreferences } from "@/contexts/AuthContext";

interface SettingsTabProps {
  user: User;
  userPreferences: UserPreferences | null;
  onLogout: () => void;
}

const SettingsTab = ({ user, userPreferences, onLogout }: SettingsTabProps) => {
  const navigate = useNavigate();
  
  const currentPlan = userPreferences?.subscription?.plan || 'basic';
  const subscriptionStatus = userPreferences?.subscription?.status || 'inactive';
  const isTrialActive = subscriptionStatus === 'trial';
  
  const trialEndDate = userPreferences?.subscription?.trialEndDate 
    ? new Date(userPreferences.subscription.trialEndDate).toLocaleDateString() 
    : '';
    
  const nextBillingDate = userPreferences?.subscription?.nextBillingDate 
    ? new Date(userPreferences.subscription.nextBillingDate).toLocaleDateString() 
    : '15/09/2023';
  
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Profile Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user.name} className="mt-1" readOnly />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user.email} className="mt-1" readOnly />
            </div>
          </div>
          <div className="pt-2">
            <Button onClick={() => navigate('/profile-settings')}>
              Edit Profile
            </Button>
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
                  defaultChecked={userPreferences?.notificationSettings?.email}
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
                  defaultChecked={userPreferences?.notificationSettings?.propertyAlerts}
                  className="form-checkbox h-5 w-5 text-primary rounded"
                />
              </div>
            </div>
          </div>
          <div className="pt-2">
            <Button variant="outline" onClick={() => navigate('/email-preferences')}>
              Manage Email Preferences
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Subscription</h3>
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold capitalize">{currentPlan} Plan</p>
                <p className="text-sm text-muted-foreground">
                  {currentPlan === 'basic' 
                    ? 'Free plan' 
                    : isTrialActive
                      ? `Free trial (€24.99/month after trial) • Trial ends: ${trialEndDate}`
                      : `€24.99/month • Next billing date: ${nextBillingDate}`}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/subscription')}>
                {currentPlan === 'basic' ? 'Upgrade Plan' : 'Manage Subscription'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <Button variant="destructive" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
