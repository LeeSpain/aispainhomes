import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { alertsService, UserAlert } from '@/services/alertsService';
import { useAuth } from '@/contexts/auth/useAuth';
import { toast } from 'sonner';
import { Trash2, Check, Bell } from 'lucide-react';

const AlertsTab = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadAlerts = async () => {
      try {
        const data = await alertsService.getUserAlerts(user.id);
        setAlerts(data);
      } catch (error) {
        console.error('Error loading alerts:', error);
        toast.error('Failed to load alerts');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlerts();
  }, [user?.id]);

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await alertsService.markAsRead(alertId);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
      toast.success('Alert marked as read');
    } catch (error) {
      toast.error('Failed to mark alert as read');
    }
  };

  const handleDelete = async (alertId: string) => {
    try {
      await alertsService.deleteAlert(alertId);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast.success('Alert deleted');
    } catch (error) {
      toast.error('Failed to delete alert');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await alertsService.markAllAsRead(user.id);
      setAlerts(alerts.map(alert => ({ ...alert, is_read: true })));
      toast.success('All alerts marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getAlertTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      property_match: 'Match',
      new_properties: 'New',
      price_change: 'Price',
      system: 'System',
      subscription: 'Account'
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading alerts...</div>;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Your Alerts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {alerts.filter(a => !a.is_read).length} unread alert{alerts.filter(a => !a.is_read).length !== 1 ? 's' : ''}
          </p>
        </div>
        {alerts.some(a => !a.is_read) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No alerts yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              You'll receive alerts here when new properties match your preferences or when there are important updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className={!alert.is_read ? 'border-primary/50' : ''}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={alert.is_read ? 'secondary' : 'default'}>
                        {getAlertTypeLabel(alert.alert_type)}
                      </Badge>
                      {!alert.is_read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">{alert.title}</h3>
                    {alert.description && (
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(alert.created_at).toLocaleDateString()} at {new Date(alert.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!alert.is_read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(alert.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsTab;
