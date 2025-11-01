import ServiceProviderList, { ServiceProvider } from "./ServiceProviderList";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ServiceProviderTabProps {
  title: string;
  providers: ServiceProvider[];
  matchReasons?: Map<string, string[]>;
  totalAvailable?: number;
}

const ServiceProviderTab = ({ 
  title, 
  providers, 
  matchReasons,
  totalAvailable 
}: ServiceProviderTabProps) => {
  const showingFiltered = totalAvailable && totalAvailable > providers.length;
  
  return (
    <div className="mt-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        {showingFiltered && (
          <p className="text-sm text-muted-foreground">
            Showing {providers.length} of {totalAvailable} services personalized for your needs
          </p>
        )}
      </div>

      {matchReasons && matchReasons.size > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Recommended for You
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(Array.from(matchReasons.values()).flat())).slice(0, 5).map((reason, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {reason}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <ServiceProviderList providers={providers} matchReasons={matchReasons} />
    </div>
  );
};

export default ServiceProviderTab;
