
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const OverviewTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Overview</CardTitle>
        <CardDescription>
          Key metrics and information about your platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This is a demonstration admin dashboard. In a production environment, this would display real-time analytics and actionable insights.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>New user registration</span>
                    <span className="text-muted-foreground">2 hours ago</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Property listing updated</span>
                    <span className="text-muted-foreground">5 hours ago</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Subscription payment received</span>
                    <span className="text-muted-foreground">Yesterday</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <Button size="sm" variant="outline">Add New Property</Button>
                  <Button size="sm" variant="outline">Invite User</Button>
                  <Button size="sm" variant="outline">Generate Reports</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
