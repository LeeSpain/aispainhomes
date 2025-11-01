import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit2, Save, X } from 'lucide-react';

interface ServicesSectionProps {
  data: any;
  onUpdate: (value: any) => void;
}

const ServicesSection = ({ data, onUpdate }: ServicesSectionProps) => {
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

  const services = [
    { key: 'legalAssistance', label: 'Legal Assistance' },
    { key: 'utilitiesSetup', label: 'Utilities Setup' },
    { key: 'movingServices', label: 'Moving & Shipping' },
    { key: 'education', label: 'Education Services' },
    { key: 'healthcare', label: 'Healthcare' },
    { key: 'languageLearning', label: 'Language Learning' }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Services Needed</h3>
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
        {services.map((service) => (
          <div key={service.key} className="flex items-center justify-between p-4 rounded-lg border">
            <Label>{service.label}</Label>
            <Switch
              checked={formData[service.key] || false}
              onCheckedChange={(checked) => setFormData({ ...formData, [service.key]: checked })}
              disabled={!isEditing}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ServicesSection;
