import { useState } from 'react';
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

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  email: string;
  plan: 'paid' | 'trial';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  nextBillingDate: string;
  revenue: number;
}

const MONTHLY_PRICE = 24.99;

const SubscriptionsTab = () => {
  const [subscriptions] = useState<Subscription[]>([
    {
      id: 'sub_001',
      userId: 'user_1',
      userName: 'John Doe',
      email: 'john@example.com',
      plan: 'paid',
      status: 'active',
      startDate: '2025-01-15',
      nextBillingDate: '2025-02-15',
      revenue: MONTHLY_PRICE
    },
    {
      id: 'sub_002',
      userId: 'user_2',
      userName: 'Jane Smith',
      email: 'jane@example.com',
      plan: 'paid',
      status: 'active',
      startDate: '2025-01-10',
      nextBillingDate: '2025-02-10',
      revenue: MONTHLY_PRICE
    },
    {
      id: 'sub_003',
      userId: 'user_3',
      userName: 'Bob Wilson',
      email: 'bob@example.com',
      plan: 'paid',
      status: 'active',
      startDate: '2025-01-01',
      nextBillingDate: '2025-02-01',
      revenue: MONTHLY_PRICE
    },
    {
      id: 'sub_004',
      userId: 'user_4',
      userName: 'Alice Brown',
      email: 'alice@example.com',
      plan: 'trial',
      status: 'trial',
      startDate: '2025-01-25',
      nextBillingDate: '2025-02-08',
      revenue: 0
    },
    {
      id: 'sub_005',
      userId: 'user_5',
      userName: 'Charlie Davis',
      email: 'charlie@example.com',
      plan: 'trial',
      status: 'trial',
      startDate: '2025-01-28',
      nextBillingDate: '2025-02-11',
      revenue: 0
    },
    {
      id: 'sub_006',
      userId: 'user_6',
      userName: 'Emma White',
      email: 'emma@example.com',
      plan: 'paid',
      status: 'cancelled',
      startDate: '2024-12-01',
      nextBillingDate: '2025-02-01',
      revenue: MONTHLY_PRICE
    },
  ]);

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
  const monthlyRecurring = activeSubscriptions * MONTHLY_PRICE;
  const conversionRate = subscriptions.length > 0 
    ? ((activeSubscriptions / (activeSubscriptions + trialUsers)) * 100).toFixed(1)
    : '0.0';

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

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
              <TrendingUp className="inline h-3 w-3 text-green-500" /> {activeSubscriptions} paying subscribers
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
              At €24.99/month each
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
              Potential: {formatEuro(trialUsers * MONTHLY_PRICE)}/mo
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
                      <TableCell className="font-medium">{subscription.userName}</TableCell>
                      <TableCell>{subscription.email}</TableCell>
                      <TableCell>{getPlanBadge(subscription.plan)}</TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(subscription.startDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(subscription.nextBillingDate).toLocaleDateString()}
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
