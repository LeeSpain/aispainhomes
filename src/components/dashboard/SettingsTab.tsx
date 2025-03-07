
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/contexts/AuthContext";

interface SettingsTabProps {
  user: User;
  onLogout: () => void;
}

const SettingsTab = ({ user, onLogout }: SettingsTabProps) => {
  return (
    <div className="mt-6">
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
          <Button variant="destructive" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
