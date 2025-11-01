import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  Users,
  Calendar,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Subscription {
  id: string;
  userId: string;
  userName?: string;
  email?: string;
  plan: string;
  status: string;
  startDate: string;
  nextBillingDate: string;
  revenue: number;
}

const MONTHLY_PRICE = 24.99;

const SubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading subscriptions:', error);
          toast.error('Failed to load subscriptions');
        } else {
          // Transform to match Subscription interface
          const transformed = (data || []).map((sub) => ({
            id: sub.id,
            userId: sub.user_id,
            userName: 'User', // We don't have user names in subscriptions table
            email: 'N/A', // We don't have emails in subscriptions table
            plan: sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1),
            status: sub.status,
            startDate: new Date(sub.start_date).toLocaleDateString(),
            nextBillingDate: sub.next_billing_date 
              ? new Date(sub.next_billing_date).toLocaleDateString()
              : 'N/A',
            revenue: sub.status === 'active' ? Number(sub.monthly_price) : 0
          }));
          setSubscriptions(transformed);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      trial: 'secondary',
      cancelled: 'destructive',
      expired: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getPlanBadge = (plan: string) => {
    if (plan === 'trial') {
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          Free Trial
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="bg-primary/10 text-primary">
        €24.99/month
      </Badge>
    );
  };

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.revenue, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const trialUsers = subscriptions.filter(sub => sub.status === 'trial').length;
  const monthlyRecurring = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.revenue, 0);
  const conversionRate = subscriptions.length > 0 && (activeSubscriptions + trialUsers) > 0
    ? ((activeSubscriptions / (activeSubscriptions + trialUsers)) * 100).toFixed(1)
    : '0.0';

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading subscriptions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEuro(monthlyRecurring)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeSubscriptions > 0 ? (
                <><TrendingUp className="inline h-3 w-3 text-green-500" /> {activeSubscriptions} paying subscribers</>
              ) : (
                'No active subscriptions yet'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {monthlyRecurring > 0 ? `Avg ${formatEuro(monthlyRecurring / activeSubscriptions)}/month` : 'No revenue yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trialUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {trialUsers > 0 ? `Converting to paid plans` : 'No trial users'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active vs trial users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>
                View and manage all user subscriptions
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No subscriptions found
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.userName || 'User'}</TableCell>
                      <TableCell>{subscription.email || 'N/A'}</TableCell>
                      <TableCell>{getPlanBadge(subscription.plan)}</TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {subscription.startDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {subscription.nextBillingDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatEuro(subscription.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Manage</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsTab;
