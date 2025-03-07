
import { Button } from "@/components/ui/button";

export interface ServiceProvider {
  id: string;
  name: string;
  type: string;
  location: string;
  contact: string;
  details: string;
}

interface ServiceProviderListProps {
  providers: ServiceProvider[];
}

const ServiceProviderList = ({ providers }: ServiceProviderListProps) => (
  <div className="space-y-4">
    {providers.map(provider => (
      <div key={provider.id} className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
        <h3 className="font-semibold text-lg">{provider.name}</h3>
        <p className="text-sm text-muted-foreground">{provider.type} • {provider.location}</p>
        <p className="mt-2">{provider.details}</p>
        <div className="mt-3 flex justify-between items-center">
          <p className="text-sm">{provider.contact}</p>
          <Button variant="outline" size="sm">Contact</Button>
        </div>
      </div>
    ))}
  </div>
);

export default ServiceProviderList;
