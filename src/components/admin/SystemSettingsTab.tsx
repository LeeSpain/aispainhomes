
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  ArrowUpDown, 
  RefreshCw, 
  Upload, 
  Download, 
  Shield 
} from 'lucide-react';
import { toast } from 'sonner';

const SystemSettingsTab = () => {
  // System settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [enableLogging, setEnableLogging] = useState(true);
  
  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [passwordMinLength, setPasswordMinLength] = useState('8');
  const [sessionTimeout, setSessionTimeout] = useState('60');
  
  // Backup settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [retentionDays, setRetentionDays] = useState('30');
  
  const handleSaveSystemSettings = () => {
    // In a real app, this would save to a database or API
    setTimeout(() => {
      toast.success("System settings saved successfully!");
    }, 500);
  };
  
  const handleSaveSecuritySettings = () => {
    setTimeout(() => {
      toast.success("Security settings saved successfully!");
    }, 500);
  };
  
  const handleSaveBackupSettings = () => {
    setTimeout(() => {
      toast.success("Backup settings saved successfully!");
    }, 500);
  };
  
  const handleManualBackup = () => {
    toast.info("Starting manual backup...");
    
    // Simulate backup process
    setTimeout(() => {
      toast.success("Backup completed successfully!");
    }, 2000);
  };
  
  const handleSystemRestart = () => {
    toast.info("System restart initiated...");
    
    // Simulate system restart
    setTimeout(() => {
      toast.success("System restarted successfully!");
    }, 3000);
  };
  
  const handleClearCache = () => {
    toast.info("Clearing system cache...");
    
    // Simulate cache clearing
    setTimeout(() => {
      toast.success("Cache cleared successfully!");
    }, 1500);
  };
  
  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General System Settings</CardTitle>
            <CardDescription>
              Configure core platform settings and functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Put the site in maintenance mode (only admins can access)
                </p>
              </div>
              <Switch
                id="maintenance-mode"
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="debug-mode">Debug Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable detailed error reporting and logging
                </p>
              </div>
              <Switch
                id="debug-mode"
                checked={debugMode}
                onCheckedChange={setDebugMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send system notifications and alerts via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-logging">System Logging</Label>
                <p className="text-sm text-muted-foreground">
                  Enable detailed system activity logging
                </p>
              </div>
              <Switch
                id="enable-logging"
                checked={enableLogging}
                onCheckedChange={setEnableLogging}
              />
            </div>
            
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={handleSystemRestart}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Restart System
              </Button>
              <Button variant="outline" onClick={handleClearCache}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Clear Cache
              </Button>
              <Button variant="outline" onClick={() => toast.info("System logs downloaded")}>
                <Download className="mr-2 h-4 w-4" />
                Download Logs
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveSystemSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Configure security settings for the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require all admin users to use two-factor authentication
                </p>
              </div>
              <Switch
                id="two-factor"
                checked={twoFactorAuth}
                onCheckedChange={setTwoFactorAuth}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password-length">Minimum Password Length</Label>
              <Input
                id="password-length"
                type="number"
                min="6"
                max="24"
                value={passwordMinLength}
                onChange={(e) => setPasswordMinLength(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                min="5"
                max="1440"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                How long before inactive users are automatically logged out
              </p>
            </div>
            
            <div className="mt-6 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-md flex">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-3 flex-shrink-0" />
              <div className="text-sm text-yellow-700 dark:text-yellow-400">
                <p className="font-medium">Security Audit Recommended</p>
                <p className="mt-1">
                  Your last security audit was over 6 months ago. We recommend running a new security audit.
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" className="w-full md:w-auto">
                <Shield className="mr-2 h-4 w-4" />
                Run Security Audit
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveSecuritySettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="backup">
        <Card>
          <CardHeader>
            <CardTitle>Backup & Restore</CardTitle>
            <CardDescription>
              Configure system backup settings and restore capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-backup">Automatic Backups</Label>
                <p className="text-sm text-muted-foreground">
                  Regularly backup system data automatically
                </p>
              </div>
              <Switch
                id="auto-backup"
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <select
                id="backup-frequency"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value)}
                disabled={!autoBackup}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retention-days">Retention Period (days)</Label>
              <Input
                id="retention-days"
                type="number"
                min="1"
                max="365"
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                disabled={!autoBackup}
              />
              <p className="text-sm text-muted-foreground">
                How long to keep backup files before automatically deleting them
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Button variant="outline" onClick={handleManualBackup}>
                <Download className="mr-2 h-4 w-4" />
                Backup Now
              </Button>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Restore from Backup
              </Button>
            </div>
            
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Recent Backups</h3>
              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Size</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2 text-sm">2023-06-14 08:00</td>
                      <td className="px-4 py-2 text-sm">4.2 MB</td>
                      <td className="px-4 py-2 text-sm">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Completed
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        <Button variant="ghost" size="sm">Download</Button>
                        <Button variant="ghost" size="sm">Restore</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm">2023-06-13 08:00</td>
                      <td className="px-4 py-2 text-sm">4.1 MB</td>
                      <td className="px-4 py-2 text-sm">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Completed
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        <Button variant="ghost" size="sm">Download</Button>
                        <Button variant="ghost" size="sm">Restore</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveBackupSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SystemSettingsTab;
