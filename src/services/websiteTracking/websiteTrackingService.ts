import { supabase } from '@/integrations/supabase/client';

export interface TrackedWebsite {
  id: string;
  url: string;
  name: string;
  category: 'properties' | 'legal' | 'utilities' | 'movers' | 'schools' | 'healthcare' | 'other';
  industry?: string;
  location?: string;
  check_frequency: 'hourly' | 'daily' | 'weekly';
  is_active: boolean;
  last_checked_at?: string;
  last_status: 'pending' | 'active' | 'error' | 'paused';
  last_error?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface ScrapeResult {
  id: string;
  tracked_website_id: string;
  scrape_timestamp: string;
  status: 'success' | 'failed' | 'partial';
  items_found: number;
  new_items: number;
  changed_items: number;
  removed_items: number;
  scrape_duration_ms?: number;
  error_message?: string;
  raw_data?: any;
}

export interface WebsiteNotification {
  id: string;
  user_id: string;
  tracked_website_id?: string;
  notification_type: string;
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  metadata?: any;
  created_at: string;
}

export const websiteTrackingService = {
  /**
   * Get all tracked websites for the current user
   */
  async getTrackedWebsites(): Promise<TrackedWebsite[]> {
    const { data, error } = await supabase
      .from('tracked_websites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tracked websites:', error);
      throw error;
    }

    return (data || []) as TrackedWebsite[];
  },

  /**
   * Add a new website to track
   */
  async addWebsite(website: {
    url: string;
    name: string;
    category: string;
    industry?: string;
    location?: string;
    checkFrequency?: 'hourly' | 'daily' | 'weekly';
  }): Promise<TrackedWebsite> {
    const { data, error } = await supabase.functions.invoke('add-tracked-website', {
      body: website,
    });

    if (error) {
      console.error('Error adding website:', error);
      throw error;
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to add website');
    }

    return data.website;
  },

  /**
   * Remove a website from tracking
   */
  async removeWebsite(id: string): Promise<void> {
    const { error } = await supabase
      .from('tracked_websites')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing website:', error);
      throw error;
    }
  },

  /**
   * Update a tracked website
   */
  async updateWebsite(id: string, updates: Partial<TrackedWebsite>): Promise<void> {
    const { error } = await supabase
      .from('tracked_websites')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating website:', error);
      throw error;
    }
  },

  /**
   * Trigger a scrape for a specific website
   */
  async scrapeWebsite(websiteId: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('scrape-website', {
      body: { websiteId },
    });

    if (error) {
      console.error('Error scraping website:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get scrape results for a website
   */
  async getScrapeResults(websiteId: string, limit: number = 10): Promise<ScrapeResult[]> {
    const { data, error } = await supabase
      .from('website_scrape_results')
      .select('*')
      .eq('tracked_website_id', websiteId)
      .order('scrape_timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching scrape results:', error);
      throw error;
    }

    return (data || []) as ScrapeResult[];
  },

  /**
   * Get notifications for the current user
   */
  async getNotifications(unreadOnly: boolean = false): Promise<WebsiteNotification[]> {
    let query = supabase
      .from('website_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    return (data || []) as WebsiteNotification[];
  },

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('website_notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Clear all notifications
   */
  async clearNotifications(): Promise<void> {
    const { error } = await supabase
      .from('website_notifications')
      .delete()
      .eq('is_read', true);

    if (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  },
};
