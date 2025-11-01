import { Card } from '@/components/ui/card';

interface HouseholdSectionProps {
  data: any;
  onUpdate: (value: any) => void;
}

const HouseholdSection = ({ data }: HouseholdSectionProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Household Information</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Adults</p>
            <p className="text-2xl font-bold">{data.adults || 1}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Children</p>
            <p className="text-2xl font-bold">{data.children || 0}</p>
          </div>
        </div>

        {data.pets && data.pets.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Pets</p>
            <div className="space-y-1">
              {data.pets.map((pet: any, index: number) => (
                <p key={index}>{pet.count} {pet.type}</p>
              ))}
            </div>
          </div>
        )}

        {data.specialNeeds && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Special Needs</p>
            <p>{data.specialNeeds}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default HouseholdSection;
