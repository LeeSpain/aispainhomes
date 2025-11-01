import { supabase } from '@/integrations/supabase/client';

export interface UserAlert {
  id: string;
  user_id: string;
  alert_type: 'property_match' | 'new_properties' | 'price_change' | 'system' | 'subscription';
  title: string;
  description?: string;
  property_id?: string;
  metadata?: any;
  is_read: boolean;
  created_at: string;
  expires_at?: string;
}

export const alertsService = {
  /**
   * Get all alerts for the current user
   */
  async getUserAlerts(userId: string, unreadOnly: boolean = false): Promise<UserAlert[]> {
    let query = supabase
      .from('user_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user alerts:', error);
      throw error;
    }

    return (data || []) as UserAlert[];
  },

  /**
   * Get unread alert count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('user_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }

    return count || 0;
  },

  /**
   * Mark an alert as read
   */
  async markAsRead(alertId: string): Promise<void> {
    const { error } = await supabase
      .from('user_alerts')
      .update({ is_read: true })
      .eq('id', alertId);

    if (error) {
      console.error('Error marking alert as read:', error);
      throw error;
    }
  },

  /**
   * Mark all alerts as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_alerts')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all alerts as read:', error);
      throw error;
    }
  },

  /**
   * Delete an alert
   */
  async deleteAlert(alertId: string): Promise<void> {
    const { error } = await supabase
      .from('user_alerts')
      .delete()
      .eq('id', alertId);

    if (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  },

  /**
   * Create a new alert (typically called by system/edge functions)
   */
  async createAlert(alert: Omit<UserAlert, 'id' | 'created_at'>): Promise<UserAlert> {
    const { data, error } = await supabase
      .from('user_alerts')
      .insert(alert)
      .select()
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      throw error;
    }

    return data as UserAlert;
  }
};
