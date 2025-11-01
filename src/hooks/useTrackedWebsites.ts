import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { websiteTrackingService } from '@/services/websiteTracking/websiteTrackingService';
import { toast } from 'sonner';

export const useTrackedWebsites = () => {
  const queryClient = useQueryClient();

  const { data: websites = [], isLoading, error, refetch } = useQuery({
    queryKey: ['tracked-websites'],
    queryFn: () => websiteTrackingService.getTrackedWebsites(),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['website-notifications'],
    queryFn: () => websiteTrackingService.getNotifications(true),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const addWebsiteMutation = useMutation({
    mutationFn: websiteTrackingService.addWebsite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracked-websites'] });
      toast.success('Website added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add website');
    },
  });

  const removeWebsiteMutation = useMutation({
    mutationFn: websiteTrackingService.removeWebsite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracked-websites'] });
      toast.success('Website removed');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove website');
    },
  });

  const updateWebsiteMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      websiteTrackingService.updateWebsite(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracked-websites'] });
      toast.success('Website updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update website');
    },
  });

  const scrapeWebsiteMutation = useMutation({
    mutationFn: websiteTrackingService.scrapeWebsite,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tracked-websites'] });
      queryClient.invalidateQueries({ queryKey: ['website-notifications'] });
      if (data.newItems > 0) {
        toast.success(`Found ${data.itemsFound} items (${data.newItems} new)`);
      } else {
        toast.info(`No new items found (${data.itemsFound} total)`);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to scrape website');
    },
  });

  const clearNotificationsMutation = useMutation({
    mutationFn: websiteTrackingService.clearNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-notifications'] });
      toast.success('Notifications cleared');
    },
  });

  return {
    websites,
    isLoading,
    error,
    notifications,
    refetch,
    addWebsite: addWebsiteMutation.mutateAsync,
    removeWebsite: removeWebsiteMutation.mutateAsync,
    updateWebsite: updateWebsiteMutation.mutateAsync,
    scrapeWebsite: scrapeWebsiteMutation.mutateAsync,
    clearNotifications: clearNotificationsMutation.mutateAsync,
    isAdding: addWebsiteMutation.isPending,
    isRemoving: removeWebsiteMutation.isPending,
    isScraping: scrapeWebsiteMutation.isPending,
  };
};
