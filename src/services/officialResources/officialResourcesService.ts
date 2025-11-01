import { supabase } from '@/integrations/supabase/client';

export interface OfficialResource {
  id: string;
  category: string;
  subcategory?: string;
  authority: string;
  url: string;
  title: string;
  description: string;
  trust_level: string;
  is_active: boolean;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
  last_verified_at?: string;
}

export interface ResourceSnapshot {
  id: string;
  resource_id: string;
  snapshot_date: string;
  content_hash: string;
  content_text?: string;
  change_detected: boolean;
  change_summary?: string;
}

class OfficialResourcesService {
  async getAllResources(activeOnly = true): Promise<OfficialResource[]> {
    let query = supabase
      .from('official_resources')
      .select('*')
      .order('category')
      .order('title');
    
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async getResourcesByCategory(category: string): Promise<OfficialResource[]> {
    const { data, error } = await supabase
      .from('official_resources')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('title');
    
    if (error) throw error;
    return data || [];
  }

  async searchResources(searchTerm: string): Promise<OfficialResource[]> {
    const { data, error } = await supabase
      .from('official_resources')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('is_active', true)
      .order('title');
    
    if (error) throw error;
    return data || [];
  }

  async getResourceById(id: string): Promise<OfficialResource | null> {
    const { data, error } = await supabase
      .from('official_resources')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getResourceSnapshots(resourceId: string, limit = 10): Promise<ResourceSnapshot[]> {
    const { data, error } = await supabase
      .from('resource_content_snapshots')
      .select('*')
      .eq('resource_id', resourceId)
      .order('snapshot_date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }

  async getRecentChanges(limit = 20): Promise<ResourceSnapshot[]> {
    const { data, error } = await supabase
      .from('resource_content_snapshots')
      .select('*')
      .eq('change_detected', true)
      .order('snapshot_date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      property: '🏠',
      immigration: '🛂',
      finance: '💰',
      utilities: '⚡',
      healthcare: '🏥',
      education: '🎓',
      transport: '🚗',
      work: '💼',
      integration: '🤝',
      lifestyle: '🎨'
    };
    return icons[category] || '📄';
  }

  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      property: 'bg-blue-500',
      immigration: 'bg-purple-500',
      finance: 'bg-green-500',
      utilities: 'bg-yellow-500',
      healthcare: 'bg-red-500',
      education: 'bg-indigo-500',
      transport: 'bg-orange-500',
      work: 'bg-cyan-500',
      integration: 'bg-pink-500',
      lifestyle: 'bg-teal-500'
    };
    return colors[category] || 'bg-gray-500';
  }

  getTrustLevelBadge(trustLevel: string): string {
    const badges: Record<string, string> = {
      high: 'Verified Official',
      medium: 'Trusted Source',
      low: 'Reference'
    };
    return badges[trustLevel] || 'Source';
  }
}

export const officialResourcesService = new OfficialResourcesService();
