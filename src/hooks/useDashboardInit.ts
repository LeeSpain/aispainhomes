import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/components/properties/PropertyCard';
import { scrapedPropertiesService } from '@/services/scrapedPropertiesService';
import { toast } from 'sonner';

export interface DashboardInitData {
  properties: Property[];
  matchScores: Map<string, number>;
  matchReasons: Map<string, string[]>;
  questionnaireData: any;
  profileData: any;
  isLoading: boolean;
  isClaraProcessing: boolean;
  hasCompletedQuestionnaire: boolean;
  claraPropertyRecommendations: any[];
  claraServiceRecommendations: any[];
}

export const useDashboardInit = (userId: string | undefined) => {
  const [data, setData] = useState<DashboardInitData>({
    properties: [],
    matchScores: new Map(),
    matchReasons: new Map(),
    questionnaireData: null,
    profileData: null,
    isLoading: true,
    isClaraProcessing: false,
    hasCompletedQuestionnaire: false,
    claraPropertyRecommendations: [],
    claraServiceRecommendations: [],
  });

  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    const initializeDashboard = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true }));

        // Fetch all user data in parallel
        const [questionnaireResult, profileResult, scrapedProperties, claraProperties, claraServices] = await Promise.all([
          supabase
            .from('questionnaire_responses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle(),
          scrapedPropertiesService.getScrapedProperties(userId),
          supabase
            .from('property_recommendations')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .order('match_score', { ascending: false })
            .limit(6),
          supabase
            .from('service_recommendations')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .limit(10)
        ]);

        if (!mounted) return;

        const questionnaireData = questionnaireResult.data;
        const profileData = profileResult.data;
        const hasCompletedQuestionnaire = !!questionnaireData;
        const claraPropertyRecommendations = claraProperties.data || [];
        const claraServiceRecommendations = claraServices.data || [];

        // Check if questionnaire was recently completed (within last 2 minutes) and Clara hasn't returned results yet
        const recentlyCompleted = questionnaireData?.completed_at && 
          (new Date().getTime() - new Date(questionnaireData.completed_at).getTime()) < 120000;
        const isClaraProcessing = recentlyCompleted && 
          claraPropertyRecommendations.length === 0 && 
          claraServiceRecommendations.length === 0;

        console.log('📊 Dashboard data fetched:', {
          claraProperties: claraPropertyRecommendations.length,
          scrapedProperties: scrapedProperties.length,
          claraServices: claraServiceRecommendations.length,
          hasQuestionnaire: hasCompletedQuestionnaire,
          isClaraProcessing
        });

        // Prioritize Clara's curated properties, then fallback to scraped properties
        const allProperties: Property[] = claraPropertyRecommendations.length > 0 
          ? claraPropertyRecommendations.map((rec: any) => ({
              id: rec.id,
              title: rec.title,
              location: rec.location,
              price: rec.price,
              priceUnit: 'total',
              currency: rec.currency || 'EUR',
              image: rec.images?.[0] || '/placeholder.svg',
              images: rec.images || [],
              type: rec.property_type || 'apartment',
              bedrooms: rec.bedrooms || 0,
              bathrooms: rec.bathrooms || 0,
              area: rec.area_sqm || 0,
              features: rec.features || [],
              description: rec.description || '',
              status: 'forSale' as const,
              createdAt: rec.created_at || new Date().toISOString(),
              sourceWebsite: rec.source_website || undefined,
              externalUrl: rec.source_url || undefined,
              referenceNumber: rec.property_id || undefined,
              listingDate: rec.search_timestamp || rec.created_at || undefined,
              lastChecked: rec.search_timestamp || undefined,
            }))
          : scrapedProperties;
        
        console.log(`✅ Total properties to display: ${allProperties.length}`);

        // Calculate match scores if questionnaire exists
        if (hasCompletedQuestionnaire && allProperties.length > 0) {
          const scoredProperties = allProperties.map(property => {
            let score = 0;
            const reasons: string[] = [];

            // Budget scoring (30 points)
            if (questionnaireData.budget_range) {
              const budgetRange = questionnaireData.budget_range as any;
              const minBudget = Number(budgetRange.min) || 0;
              const maxBudget = Number(budgetRange.max) || Infinity;
              
              if (property.price >= minBudget && property.price <= maxBudget) {
                score += 30;
                reasons.push('Within your budget');
              } else if (property.price < minBudget) {
                const difference = ((property.price / minBudget) * 30);
                score += difference;
                reasons.push('Below your budget');
              } else {
                const overBudget = property.price - maxBudget;
                const percentOver = (overBudget / maxBudget) * 100;
                if (percentOver < 20) {
                  score += 15;
                  reasons.push('Slightly over budget but may be worth it');
                }
              }
            }

            // Location scoring (25 points)
            if (questionnaireData.location_preferences && Array.isArray(questionnaireData.location_preferences)) {
              const userLocations = questionnaireData.location_preferences;
              const locationMatch = userLocations.some((loc: string) => 
                property.location.toLowerCase().includes(loc.toLowerCase())
              );
              if (locationMatch) {
                score += 25;
                reasons.push('In your preferred location');
              }
            }

            // Property type scoring (20 points)
            if (questionnaireData.property_types && Array.isArray(questionnaireData.property_types)) {
              if (questionnaireData.property_types.includes(property.type)) {
                score += 20;
                reasons.push('Matches your property type preference');
              }
            }

            // Bedroom/household scoring (15 points)
            if (questionnaireData.household_details) {
              const household = questionnaireData.household_details as any;
              const adults = Number(household.adults) || 0;
              const children = Number(household.children) || 0;
              const totalPeople = adults + children;
              const bedroomsNeeded = Math.ceil(totalPeople / 2);
              
              if (property.bedrooms >= bedroomsNeeded) {
                score += 15;
                reasons.push(`${property.bedrooms} bedrooms for ${totalPeople} people`);
              } else if (property.bedrooms === bedroomsNeeded - 1) {
                score += 8;
                reasons.push('Almost enough bedrooms');
              }
            }

            // Amenities scoring (10 points)
            if (questionnaireData.amenities_required && Array.isArray(questionnaireData.amenities_required) && property.features) {
              const matchedAmenities = questionnaireData.amenities_required.filter((amenity: string) =>
                property.features.some(feature => 
                  feature.toLowerCase().includes(amenity.toLowerCase())
                )
              );
              if (matchedAmenities.length > 0) {
                const amenityScore = Math.min(10, matchedAmenities.length * 3);
                score += amenityScore;
                reasons.push(`Has ${matchedAmenities.length} desired amenities`);
              }
            }

            return { property, score, reasons };
          });

          // Sort by score
          const sortedProperties = scoredProperties
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);

          // If Clara has recommendations, use those scores/reasons
          const matchScores = claraPropertyRecommendations.length > 0
            ? new Map(claraPropertyRecommendations.map((rec: any) => [rec.id, rec.match_score || 0]))
            : new Map(sortedProperties.map(item => [item.property.id, item.score]));
          
          const matchReasons = claraPropertyRecommendations.length > 0
            ? new Map(claraPropertyRecommendations.map((rec: any) => [rec.id, rec.match_reasons || []]))
            : new Map(sortedProperties.map(item => [item.property.id, item.reasons]));

          if (mounted) {
            setData({
              properties: claraPropertyRecommendations.length > 0 
                ? allProperties 
                : sortedProperties.map(item => item.property),
              matchScores,
              matchReasons,
              questionnaireData,
              profileData,
              isLoading: false,
              isClaraProcessing,
              hasCompletedQuestionnaire,
              claraPropertyRecommendations,
              claraServiceRecommendations,
            });
          }
        } else {
          // Show properties without scoring - questionnaire status is independent of properties
          if (mounted) {
            setData({
              properties: allProperties.slice(0, 12),
              matchScores: new Map(),
              matchReasons: new Map(),
              questionnaireData,
              profileData,
              isLoading: false,
              isClaraProcessing,
              hasCompletedQuestionnaire,
              claraPropertyRecommendations,
              claraServiceRecommendations,
            });
          }
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        if (mounted) {
          toast.error('Failed to load personalized dashboard');
          setData(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    initializeDashboard();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return data;
};
