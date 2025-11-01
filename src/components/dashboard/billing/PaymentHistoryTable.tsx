import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, Receipt, Loader2, Calendar } from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  payment_date: string;
  invoice_pdf: string | null;
}

interface UpcomingPayment {
  amount: number;
  currency: string;
  date: string;
  description: string;
  status: string;
}

export default function PaymentHistoryTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [upcomingPayment, setUpcomingPayment] = useState<UpcomingPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-payment-history');

      if (error) {
        console.error('Error loading payment history:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment history',
          variant: 'destructive'
        });
      } else if (data) {
        setPayments(data.payments || []);
        setUpcomingPayment(data.upcomingPayment || null);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Refunded</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Payment Alert */}
      {upcomingPayment && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <strong>Upcoming Payment:</strong> {formatAmount(upcomingPayment.amount, upcomingPayment.currency)} 
            {' '}will be charged on {formatDate(upcomingPayment.date)}
            <div className="text-xs text-muted-foreground mt-1">
              {upcomingPayment.description}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>
            View and download your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payment history yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your payments will appear here once billing begins
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {formatDate(payment.payment_date)}
                      </TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>
                        {formatAmount(payment.amount, payment.currency)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.invoice_pdf ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(payment.invoice_pdf!, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
