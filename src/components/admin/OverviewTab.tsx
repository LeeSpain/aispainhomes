
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HomeIcon, Users, Building2, AlertTriangle, CheckSquare } from 'lucide-react';
import StatsCards from './StatsCards';
import { useNavigate } from 'react-router-dom';

const OverviewTab = () => {
  const [completionProgress, setCompletionProgress] = useState(68);
  const [userGrowth, setUserGrowth] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate progress update
    const timer = setTimeout(() => {
      setCompletionProgress(75);
    }, 2000);
    
    // Simulate user growth counter
    const counter = setInterval(() => {
      setUserGrowth(prev => {
        if (prev < 12) return prev + 1;
        clearInterval(counter);
        return prev;
      });
    }, 200);
    
    return () => {
      clearTimeout(timer);
      clearInterval(counter);
    };
  }, []);
  
  const stats = [
    {
      title: "Total Properties",
      value: "245",
      icon: Building2
    },
    {
      title: "Active Users",
      value: "1,892",
      icon: Users
    },
    {
      title: "New Subscriptions",
      value: "89",
      icon: HomeIcon
    },
    {
      title: "Pending Issues",
      value: "7",
      icon: AlertTriangle
    }
  ];

  return (
    <div className="space-y-8">
      <StatsCards stats={stats} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Site Completion Status</CardTitle>
            <CardDescription>
              Progress towards complete site readiness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Overall Completion</div>
                  <div className="text-sm font-medium">{completionProgress}%</div>
                </div>
                <Progress value={completionProgress} />
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={() => navigate('/pre-deployment')}
                  className="w-full"
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  View Pre-Deployment Checklist
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>
              This month's activity overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">
                    New Users
                  </p>
                  <p className="text-2xl font-bold">+{userGrowth}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-bold">4.3%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">
                    Avg. Session
                  </p>
                  <p className="text-2xl font-bold">3:12</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">
                    Bounce Rate
                  </p>
                  <p className="text-2xl font-bold">42%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Reminder</AlertTitle>
        <AlertDescription>
          Complete all items in the pre-deployment checklist before going live.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default OverviewTab;
