import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubscriptionDetailsCard from './billing/SubscriptionDetailsCard';
import PaymentHistoryTable from './billing/PaymentHistoryTable';

export default function BillingTab() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="mt-6">
          <SubscriptionDetailsCard />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <PaymentHistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
