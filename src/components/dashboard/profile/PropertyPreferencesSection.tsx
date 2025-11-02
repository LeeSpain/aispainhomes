import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, X, Plus, Trash2 } from 'lucide-react';

interface PropertyPreferencesSectionProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

const PROPERTY_TYPE_OPTIONS = [
  'Apartment',
  'House',
  'Villa',
  'Townhouse',
  'Studio',
  'Penthouse',
  'Duplex',
  'Farmhouse'
];

const AMENITY_OPTIONS = [
  'Pool',
  'Garden',
  'Garage',
  'Terrace',
  'Balcony',
  'Air Conditioning',
  'Heating',
  'Elevator',
  'Storage Room',
  'Fireplace',
  'Sea View',
  'Mountain View',
  'Parking',
  'Security',
  'Gym',
  'Concierge'
];

const PropertyPreferencesSection = ({ data, onUpdate }: PropertyPreferencesSectionProps) => {
  const [editingPropertyTypes, setEditingPropertyTypes] = useState(false);
  const [editingLocations, setEditingLocations] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [editingAmenities, setEditingAmenities] = useState(false);

  // Local state for editing
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(data.property_types || []);
  const [locations, setLocations] = useState<string[]>(() => {
    if (!data.location_preferences) return [];
    if (Array.isArray(data.location_preferences)) return data.location_preferences;
    if (typeof data.location_preferences === 'object' && data.location_preferences.location) {
      return [data.location_preferences.location];
    }
    return [];
  });
  const [newLocation, setNewLocation] = useState('');
  const [budgetMin, setBudgetMin] = useState(data.budget_range?.min || 0);
  const [budgetMax, setBudgetMax] = useState(data.budget_range?.max || 1000000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(data.amenities_required || []);

  const handleSavePropertyTypes = () => {
    onUpdate('property_types', selectedPropertyTypes);
    setEditingPropertyTypes(false);
  };

  const handleSaveLocations = () => {
    onUpdate('location_preferences', locations);
    setEditingLocations(false);
  };

  const handleAddLocation = () => {
    if (newLocation.trim() && !locations.includes(newLocation.trim())) {
      setLocations([...locations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (location: string) => {
    setLocations(locations.filter(l => l !== location));
  };

  const handleSaveBudget = () => {
    onUpdate('budget_range', { min: budgetMin, max: budgetMax });
    setEditingBudget(false);
  };

  const handleSaveAmenities = () => {
    onUpdate('amenities_required', selectedAmenities);
    setEditingAmenities(false);
  };

  const togglePropertyType = (type: string) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes(selectedPropertyTypes.filter(t => t !== type));
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Property Preferences</h3>

      <div className="space-y-8">
        {/* Property Types */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base">Property Types</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingPropertyTypes(!editingPropertyTypes)}
            >
              {editingPropertyTypes ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
          </div>
          
          {editingPropertyTypes ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {PROPERTY_TYPE_OPTIONS.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedPropertyTypes.includes(type)}
                      onCheckedChange={() => togglePropertyType(type)}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
              <Button onClick={handleSavePropertyTypes} size="sm">
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedPropertyTypes.length > 0 ? (
                selectedPropertyTypes.map((type) => (
                  <Badge key={type} variant="secondary">{type}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No property types selected</p>
              )}
            </div>
          )}
        </div>

        {/* Preferred Locations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base">Preferred Locations</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingLocations(!editingLocations)}
            >
              {editingLocations ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
          </div>
          
          {editingLocations ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add location (e.g., Barcelona, Madrid)"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                />
                <Button onClick={handleAddLocation} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <Badge key={location} variant="secondary" className="gap-1">
                    {location}
                    <button onClick={() => handleRemoveLocation(location)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Button onClick={handleSaveLocations} size="sm">
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {locations.length > 0 ? (
                locations.map((location) => (
                  <Badge key={location} variant="secondary">{location}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No locations selected</p>
              )}
            </div>
          )}
        </div>

        {/* Budget Range */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base">Budget Range</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingBudget(!editingBudget)}
            >
              {editingBudget ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
          </div>
          
          {editingBudget ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget-min">Minimum (€)</Label>
                  <Input
                    id="budget-min"
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="budget-max">Maximum (€)</Label>
                  <Input
                    id="budget-max"
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
              <Button onClick={handleSaveBudget} size="sm">
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="text-sm">
              {budgetMin > 0 || budgetMax > 0 ? (
                <p>€{budgetMin.toLocaleString()} - €{budgetMax.toLocaleString()}</p>
              ) : (
                <p className="text-muted-foreground">No budget range set</p>
              )}
            </div>
          )}
        </div>

        {/* Required Amenities */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base">Required Amenities</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingAmenities(!editingAmenities)}
            >
              {editingAmenities ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
          </div>
          
          {editingAmenities ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {AMENITY_OPTIONS.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <label
                      htmlFor={`amenity-${amenity}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveAmenities} size="sm">
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedAmenities.length > 0 ? (
                selectedAmenities.map((amenity) => (
                  <Badge key={amenity} variant="outline">{amenity}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No amenities selected</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PropertyPreferencesSection;
