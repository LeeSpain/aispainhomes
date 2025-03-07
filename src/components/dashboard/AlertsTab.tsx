
import { Button } from "@/components/ui/button";

const AlertsTab = () => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Your Property Alerts</h2>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Daily Alert: Barcelona Apartments</h3>
              <p className="text-sm text-muted-foreground">Apartments in Barcelona, 2+ bedrooms, €250k-€400k</p>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Weekly Alert: Costa del Sol Villas</h3>
              <p className="text-sm text-muted-foreground">Villas in Marbella area, 3+ bedrooms, with pool</p>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsTab;
