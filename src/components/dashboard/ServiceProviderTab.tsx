
import ServiceProviderList, { ServiceProvider } from "./ServiceProviderList";

interface ServiceProviderTabProps {
  title: string;
  providers: ServiceProvider[];
}

const ServiceProviderTab = ({ title, providers }: ServiceProviderTabProps) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <ServiceProviderList providers={providers} />
    </div>
  );
};

export default ServiceProviderTab;
