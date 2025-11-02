import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Save } from 'lucide-react';

interface EmailPreferences {
  property_alerts: boolean;
  weekly_digest: boolean;
  price_change_alerts: boolean;
  new_match_alerts: boolean;
  marketing_emails: boolean;
  frequency: string;
}

const EmailPreferencesManager = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<EmailPreferences>({
    property_alerts: true,
    weekly_digest: true,
    price_change_alerts: true,
    new_match_alerts: true,
    marketing_emails: false,
    frequency: 'instant'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadPreferences();
    }
  }, [user?.id]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error) {
        // If no preferences exist, create default ones
        if (error.code === 'PGRST116') {
          await supabase.from('email_preferences').insert({
            user_id: user!.id,
            ...preferences
          });
        } else {
          throw error;
        }
      } else if (data) {
        setPreferences({
          property_alerts: data.property_alerts,
          weekly_digest: data.weekly_digest,
          price_change_alerts: data.price_change_alerts,
          new_match_alerts: data.new_match_alerts,
          marketing_emails: data.marketing_emails,
          frequency: data.frequency
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Failed to load email preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('email_preferences')
        .update(preferences)
        .eq('user_id', user!.id);

      if (error) throw error;

      toast.success('Email preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading email preferences...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Preferences
        </CardTitle>
        <CardDescription>
          Manage how you receive property alerts and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="property_alerts" className="text-base">
                Property Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about properties matching your criteria
              </p>
            </div>
            <Switch
              id="property_alerts"
              checked={preferences.property_alerts}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, property_alerts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new_match_alerts" className="text-base">
                New Match Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new properties match your saved searches
              </p>
            </div>
            <Switch
              id="new_match_alerts"
              checked={preferences.new_match_alerts}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, new_match_alerts: checked })
              }
              disabled={!preferences.property_alerts}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="price_change_alerts" className="text-base">
                Price Change Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Be notified when prices change on your saved properties
              </p>
            </div>
            <Switch
              id="price_change_alerts"
              checked={preferences.price_change_alerts}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, price_change_alerts: checked })
              }
              disabled={!preferences.property_alerts}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly_digest" className="text-base">
                Weekly Digest
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary of new properties and updates
              </p>
            </div>
            <Switch
              id="weekly_digest"
              checked={preferences.weekly_digest}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, weekly_digest: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing_emails" className="text-base">
                Marketing & Tips
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive tips, guides, and updates about moving to Spain
              </p>
            </div>
            <Switch
              id="marketing_emails"
              checked={preferences.marketing_emails}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, marketing_emails: checked })
              }
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Label htmlFor="frequency" className="text-base">
            Alert Frequency
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            How often would you like to receive property alerts?
          </p>
          <Select
            value={preferences.frequency}
            onValueChange={(value) => setPreferences({ ...preferences, frequency: value })}
            disabled={!preferences.property_alerts}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant (as they appear)</SelectItem>
              <SelectItem value="daily">Daily Digest (once per day)</SelectItem>
              <SelectItem value="weekly">Weekly Digest (once per week)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailPreferencesManager;