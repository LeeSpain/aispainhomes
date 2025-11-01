import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/components/properties/PropertyCard';
import { PropertyService } from '@/services/PropertyService';
import { scrapedPropertiesService } from '@/services/scrapedPropertiesService';
import { toast } from 'sonner';

interface DashboardInitData {
  properties: Property[];
  matchScores: Map<string, number>;
  matchReasons: Map<string, string[]>;
  questionnaireData: any;
  profileData: any;
  isLoading: boolean;
  hasCompletedQuestionnaire: boolean;
}

export const useDashboardInit = (userId: string | undefined) => {
  const [data, setData] = useState<DashboardInitData>({
    properties: [],
    matchScores: new Map(),
    matchReasons: new Map(),
    questionnaireData: null,
    profileData: null,
    isLoading: true,
    hasCompletedQuestionnaire: false,
  });

  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    const initializeDashboard = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true }));

        // Fetch all user data in parallel
        const [questionnaireResult, profileResult, sampleProperties, scrapedProperties] = await Promise.all([
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
          PropertyService.getFilteredProperties({}),
          scrapedPropertiesService.getScrapedProperties(userId)
        ]);

        if (!mounted) return;

        const questionnaireData = questionnaireResult.data;
        const profileData = profileResult.data;
        const hasCompletedQuestionnaire = !!questionnaireData;

        // Merge properties from both sources
        const allProperties = [...sampleProperties, ...scrapedProperties];

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

          const matchScores = new Map(sortedProperties.map(item => [item.property.id, item.score]));
          const matchReasons = new Map(sortedProperties.map(item => [item.property.id, item.reasons]));

          if (mounted) {
            setData({
              properties: sortedProperties.map(item => item.property),
              matchScores,
              matchReasons,
              questionnaireData,
              profileData,
              isLoading: false,
              hasCompletedQuestionnaire: true,
            });
          }
        } else {
          // No questionnaire, show all properties without scoring
          if (mounted) {
            setData({
              properties: allProperties.slice(0, 12),
              matchScores: new Map(),
              matchReasons: new Map(),
              questionnaireData,
              profileData,
              isLoading: false,
              hasCompletedQuestionnaire: false,
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
