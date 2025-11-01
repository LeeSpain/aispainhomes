import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Edit2, Save, X } from 'lucide-react';

interface RelocationSectionProps {
  data: any;
  onUpdate: (value: any) => void;
}

const RelocationSection = ({ data, onUpdate }: RelocationSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Relocation Timeline</h3>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label>Planned Timeframe</Label>
          <Select 
            value={formData.timeframe || ''} 
            onValueChange={(value) => setFormData({ ...formData, timeframe: value })}
            disabled={!isEditing}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate (Within 1 month)</SelectItem>
              <SelectItem value="1-3months">1-3 months</SelectItem>
              <SelectItem value="3-6months">3-6 months</SelectItem>
              <SelectItem value="6-12months">6-12 months</SelectItem>
              <SelectItem value="12+months">12+ months</SelectItem>
              <SelectItem value="exploring">Just exploring options</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Type of Move</Label>
          <Select 
            value={formData.moveType || 'permanent'} 
            onValueChange={(value) => setFormData({ ...formData, moveType: value })}
            disabled={!isEditing}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permanent">Permanent relocation</SelectItem>
              <SelectItem value="temporary">Temporary stay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <Label>Have you visited Spain before?</Label>
          </div>
          <Switch
            checked={formData.visitedSpain || false}
            onCheckedChange={(checked) => setFormData({ ...formData, visitedSpain: checked })}
            disabled={!isEditing}
          />
        </div>
      </div>
    </Card>
  );
};

export default RelocationSection;
