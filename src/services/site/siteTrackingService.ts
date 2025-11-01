/**
 * @deprecated This service uses localStorage and is being phased out.
 * Use websiteTrackingService.ts instead which uses the Supabase database.
 * This file is kept for backward compatibility only.
 */

import { toast } from 'sonner';

// Types for site tracking
export interface TrackedSite {
  id: string;
  url: string;
  name: string;
  lastChecked: string;
  propertyCount: number;
  addedAt: string;
}

export interface PropertyUpdate {
  siteId: string;
  newProperties: number;
  timestamp: string;
}

// Local storage keys
const TRACKED_SITES_KEY = 'spanish_home_finder_tracked_sites';
const PROPERTY_UPDATES_KEY = 'spanish_home_finder_property_updates';

/**
 * Service for tracking property websites and monitoring for new properties
 */
export const siteTrackingService = {
  /**
   * Get all tracked sites from localStorage
   */
  getTrackedSites: (): TrackedSite[] => {
    const sitesJson = localStorage.getItem(TRACKED_SITES_KEY);
    return sitesJson ? JSON.parse(sitesJson) : [];
  },

  /**
   * Get a specific tracked site by ID
   */
  getTrackedSiteById: (id: string): TrackedSite | undefined => {
    const sites = siteTrackingService.getTrackedSites();
    return sites.find(site => site.id === id);
  },

  /**
   * Add a new site to track
   */
  addSiteToTrack: (url: string, name: string, initialPropertyCount: number = 0): TrackedSite => {
    const sites = siteTrackingService.getTrackedSites();
    
    // Check if site already exists
    if (sites.some(site => site.url === url)) {
      throw new Error('This site is already being tracked');
    }

    const newSite: TrackedSite = {
      id: crypto.randomUUID(),
      url,
      name,
      lastChecked: new Date().toISOString(),
      propertyCount: initialPropertyCount,
      addedAt: new Date().toISOString()
    };

    // Add to localStorage
    localStorage.setItem(TRACKED_SITES_KEY, JSON.stringify([...sites, newSite]));
    
    return newSite;
  },

  /**
   * Remove a site from tracking
   */
  removeSiteFromTracking: (id: string): boolean => {
    const sites = siteTrackingService.getTrackedSites();
    const filteredSites = sites.filter(site => site.id !== id);
    
    if (filteredSites.length === sites.length) {
      return false; // No site was removed
    }
    
    localStorage.setItem(TRACKED_SITES_KEY, JSON.stringify(filteredSites));
    return true;
  },

  /**
   * Update property count for a site and check for new properties
   */
  updateSitePropertyCount: (id: string, newCount: number): PropertyUpdate | null => {
    const sites = siteTrackingService.getTrackedSites();
    const siteIndex = sites.findIndex(site => site.id === id);
    
    if (siteIndex === -1) {
      return null;
    }
    
    const site = sites[siteIndex];
    const previousCount = site.propertyCount;
    
    // Update site info
    const updatedSite: TrackedSite = {
      ...site,
      propertyCount: newCount,
      lastChecked: new Date().toISOString()
    };
    
    sites[siteIndex] = updatedSite;
    localStorage.setItem(TRACKED_SITES_KEY, JSON.stringify(sites));
    
    // Check if there are new properties
    if (newCount > previousCount) {
      const newPropertiesCount = newCount - previousCount;
      
      // Create update record
      const update: PropertyUpdate = {
        siteId: id,
        newProperties: newPropertiesCount,
        timestamp: new Date().toISOString()
      };
      
      // Store update
      const updates = siteTrackingService.getPropertyUpdates();
      localStorage.setItem(PROPERTY_UPDATES_KEY, JSON.stringify([...updates, update]));
      
      // Show notification
      toast.success(`${newPropertiesCount} new properties found on ${site.name}!`);
      
      return update;
    }
    
    return null;
  },

  /**
   * Get all property updates
   */
  getPropertyUpdates: (): PropertyUpdate[] => {
    const updatesJson = localStorage.getItem(PROPERTY_UPDATES_KEY);
    return updatesJson ? JSON.parse(updatesJson) : [];
  },

  /**
   * Clear all property updates
   */
  clearPropertyUpdates: (): void => {
    localStorage.setItem(PROPERTY_UPDATES_KEY, JSON.stringify([]));
  },

  /**
   * Simulate checking for new properties across all tracked sites
   * In a real app, this would make API calls to the actual property sites
   */
  checkAllSitesForNewProperties: async (): Promise<PropertyUpdate[]> => {
    const sites = siteTrackingService.getTrackedSites();
    const updates: PropertyUpdate[] = [];
    
    for (const site of sites) {
      // In a real implementation, we would fetch the actual site's data here
      // For simulation, we'll randomly add 0-3 new properties
      const newProperties = Math.floor(Math.random() * 4);
      
      if (newProperties > 0) {
        const newCount = site.propertyCount + newProperties;
        const update = siteTrackingService.updateSitePropertyCount(site.id, newCount);
        if (update) {
          updates.push(update);
        }
      }
    }
    
    return updates;
  }
};

