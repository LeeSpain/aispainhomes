import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/components/properties/PropertyCard';

interface ExtractedItem {
  id: string;
  title: string | null;
  description: string | null;
  url: string | null;
  price: number | null;
  location: string | null;
  images: any;
  metadata: any;
  currency: string | null;
  item_type: string | null;
  external_id: string | null;
  is_active: boolean | null;
}

export const scrapedPropertiesService = {
  async getScrapedProperties(userId: string): Promise<Property[]> {
    try {
      // Fetch user's tracked websites
      const { data: trackedSites, error: sitesError } = await supabase
        .from('tracked_websites')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (sitesError) {
        console.error('Error fetching tracked websites:', sitesError);
        return [];
      }

      if (!trackedSites || trackedSites.length === 0) {
        return [];
      }

      const siteIds = trackedSites.map(site => site.id);

      // Fetch extracted items from tracked sites
      const { data: extractedItems, error: itemsError } = await supabase
        .from('extracted_items')
        .select('*')
        .in('tracked_website_id', siteIds)
        .eq('is_active', true)
        .order('first_seen_at', { ascending: false })
        .limit(20);

      if (itemsError) {
        console.error('Error fetching extracted items:', itemsError);
        return [];
      }

      if (!extractedItems) {
        return [];
      }

      // Convert extracted items to Property format
      return extractedItems.map((item: ExtractedItem) => this.convertToProperty(item));
    } catch (error) {
      console.error('Error in getScrapedProperties:', error);
      return [];
    }
  },

  convertToProperty(item: ExtractedItem): Property {
    const metadata = item.metadata as any || {};
    const images = Array.isArray(item.images) ? item.images : [];
    
    return {
      id: `scraped-${item.id}`,
      title: item.title || 'Property',
      location: item.location || 'Spain',
      price: item.price || 0,
      priceUnit: metadata.priceUnit || 'total',
      bedrooms: metadata.bedrooms || metadata.rooms || 0,
      bathrooms: metadata.bathrooms || 0,
      area: metadata.size_m2 || metadata.area || 0,
      images: images.length > 0 ? images : ['/placeholder.svg'],
      description: item.description || '',
      features: metadata.features || [],
      type: metadata.type || metadata.propertyType || item.item_type || 'apartment',
      status: 'forSale',
      createdAt: new Date().toISOString(),
      currency: item.currency || 'EUR',
      imageUrl: images[0] || '/placeholder.svg',
      externalUrl: item.url || undefined,
      referenceNumber: item.external_id || undefined,
      listingDate: item.is_active ? new Date().toISOString() : undefined,
    };
  },

  async searchScrapedProperties(query: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
  }): Promise<Property[]> {
    try {
      let dbQuery = supabase
        .from('extracted_items')
        .select('*')
        .eq('is_active', true)
        .order('first_seen_at', { ascending: false });

      if (query.location) {
        dbQuery = dbQuery.ilike('location', `%${query.location}%`);
      }

      if (query.minPrice) {
        dbQuery = dbQuery.gte('price', query.minPrice);
      }

      if (query.maxPrice) {
        dbQuery = dbQuery.lte('price', query.maxPrice);
      }

      if (query.propertyType) {
        dbQuery = dbQuery.ilike('item_type', `%${query.propertyType}%`);
      }

      const { data, error } = await dbQuery.limit(50);

      if (error) {
        console.error('Error searching scraped properties:', error);
        return [];
      }

      return (data || []).map(item => this.convertToProperty(item));
    } catch (error) {
      console.error('Error in searchScrapedProperties:', error);
      return [];
    }
  }
};
