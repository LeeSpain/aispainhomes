
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/contexts/auth/types";
import { format } from "date-fns";

interface MembershipOverviewProps {
  subscription?: Subscription;
}

const MembershipOverview = ({ subscription }: MembershipOverviewProps) => {
  const formatPlanName = (plan?: string) => {
    if (!plan) return "Basic";
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  const getBadgeVariant = (status?: string) => {
    if (!status) return "outline";
    switch (status) {
      case "active":
        return "secondary";
      case "trial":
        return "default";
      case "cancelled":
      case "expired":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return "Inactive";
    switch (status) {
      case "active":
        return "Active";
      case "trial":
        return "Trial";
      case "cancelled":
        return "Cancelled";
      case "expired":
        return "Expired";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return "N/A";
    }
  };

  const planFeatures = {
    basic: [
      "Clara - Your AI Assistant",
      "Property Matching",
      "Service Provider Access"
    ],
    premium: [
      "Clara - Your AI Assistant",
      "Priority Property Matching",
      "Full Service Provider Network",
      "Document Storage",
      "Weekly Market Updates"
    ]
  };

  const plan = subscription?.plan || "basic";
  const features = plan === "premium" ? planFeatures.premium : planFeatures.basic;

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="bg-primary/10 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-lg">
            <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
            Membership
          </CardTitle>
          <Badge variant={getBadgeVariant(subscription?.status)}>
            {getStatusLabel(subscription?.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">{formatPlanName(subscription?.plan)} Plan</h3>
            
            <div className="mt-3 space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {subscription?.nextBillingDate && (
            <div className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Next billing: {formatDate(subscription.nextBillingDate)}
            </div>
          )}

          <Button className="w-full" variant={plan === "premium" ? "outline" : "default"}>
            {plan === "premium" ? "Manage Subscription" : "Upgrade to Premium"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipOverview;
