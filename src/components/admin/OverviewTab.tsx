
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HomeIcon, Users, Building2, AlertTriangle, CheckSquare } from 'lucide-react';
import StatsCards from './StatsCards';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const OverviewTab = () => {
  const [completionProgress, setCompletionProgress] = useState(0);
  const [stats, setStats] = useState([
    { title: "Monthly Revenue", value: "€0.00", icon: Building2 },
    { title: "Active Users", value: "0", icon: Users },
    { title: "Active Subscriptions", value: "0", icon: HomeIcon },
    { title: "Free Trials", value: "0", icon: AlertTriangle }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [conversionRate, setConversionRate] = useState('0.0');
  const [avgPrice, setAvgPrice] = useState('€0.00');
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Load real users count
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Load real subscriptions
        const { data: subscriptions } = await supabase
          .from('subscriptions')
          .select('*');

        const activeSubscriptions = subscriptions?.filter(s => s.status === 'active') || [];
        const trialUsers = subscriptions?.filter(s => s.status === 'trial') || [];
        
        // Calculate MRR from active subscriptions
        const monthlyRevenue = activeSubscriptions.reduce((sum, sub) => 
          sum + Number(sub.monthly_price), 0
        );

        // Calculate conversion rate
        const totalPotential = activeSubscriptions.length + trialUsers.length;
        const conversion = totalPotential > 0 
          ? ((activeSubscriptions.length / totalPotential) * 100).toFixed(1)
          : '0.0';

        // Calculate average price
        const avgPriceCalc = activeSubscriptions.length > 0
          ? (monthlyRevenue / activeSubscriptions.length)
          : 0;

        setStats([
          {
            title: "Monthly Revenue",
            value: new Intl.NumberFormat('en-IE', { 
              style: 'currency', 
              currency: 'EUR' 
            }).format(monthlyRevenue),
            icon: Building2
          },
          {
            title: "Active Users",
            value: (userCount || 0).toString(),
            icon: Users
          },
          {
            title: "Active Subscriptions",
            value: activeSubscriptions.length.toString(),
            icon: HomeIcon
          },
          {
            title: "Free Trials",
            value: trialUsers.length.toString(),
            icon: AlertTriangle
          }
        ]);

        setConversionRate(conversion);
        setAvgPrice(new Intl.NumberFormat('en-IE', { 
          style: 'currency', 
          currency: 'EUR' 
        }).format(avgPriceCalc));

        // Calculate completion progress from checklist
        const { count: trackedSites } = await supabase
          .from('tracked_websites')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        const { count: extractedItems } = await supabase
          .from('extracted_items')
          .select('*', { count: 'exact', head: true });

        // Simple progress calculation based on key metrics
        let progress = 0;
        if (userCount && userCount > 0) progress += 20;
        if (trackedSites && trackedSites > 0) progress += 20;
        if (extractedItems && extractedItems > 0) progress += 30;
        if (activeSubscriptions.length > 0) progress += 15;
        if (extractedItems && extractedItems >= 50) progress += 15;

        setCompletionProgress(progress);
      } catch (error) {
        console.error('Error loading overview stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading overview...</div>;
  }

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
                    Trial Conversions
                  </p>
                  <p className="text-2xl font-bold">{conversionRate}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">
                    Completion
                  </p>
                  <p className="text-2xl font-bold">{completionProgress}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">
                    Avg. Price
                  </p>
                  <p className="text-2xl font-bold">{avgPrice}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">
                    Status
                  </p>
                  <p className="text-2xl font-bold">
                    {completionProgress >= 85 ? '✅' : '⚠️'}
                  </p>
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
