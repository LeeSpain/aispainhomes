
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ServiceProvider {
  id: string;
  name: string;
  type: string;
  location: string;
  contact: string;
  details: string;
  locations?: string[];
  serviceCategory?: string;
  suitableFor?: string[];
  urgency?: 'high' | 'medium' | 'low';
}

interface ServiceProviderListProps {
  providers: ServiceProvider[];
  matchReasons?: Map<string, string[]>;
}

const ServiceProviderList = ({ providers, matchReasons }: ServiceProviderListProps) => (
  <div className="space-y-4">
    {providers.map(provider => {
      const reasons = matchReasons?.get(provider.name);
      return (
        <div key={provider.id} className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{provider.name}</h3>
            {provider.urgency === 'high' && (
              <Badge className="bg-orange-500">High Priority</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{provider.type} • {provider.location}</p>
          
          {reasons && reasons.length > 0 && (
            <div className="mt-3 mb-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-xs font-semibold text-primary mb-1">Recommended because:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <p className="mt-2">{provider.details}</p>
          <div className="mt-3 flex justify-between items-center">
            <p className="text-sm">{provider.contact}</p>
            <Button variant="outline" size="sm">Contact</Button>
          </div>
        </div>
      );
    })}
  </div>
);

export default ServiceProviderList;
