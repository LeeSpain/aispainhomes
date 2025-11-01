import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/components/properties/PropertyCard';
import { PropertyService } from '@/services/PropertyService';
import { scrapedPropertiesService } from '@/services/scrapedPropertiesService';
import { toast } from 'sonner';

interface PersonalizedDashboardData {
  properties: Property[];
  matchScores: Map<string, number>;
  matchReasons: Map<string, string[]>;
  isLoading: boolean;
  questionnaireData: any;
}

export const usePersonalizedDashboard = (userId: string | undefined) => {
  const [data, setData] = useState<PersonalizedDashboardData>({
    properties: [],
    matchScores: new Map(),
    matchReasons: new Map(),
    isLoading: true,
    questionnaireData: null,
  });

  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    const loadPersonalizedData = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true }));

        // Fetch questionnaire data
        const { data: questionnaireData, error: qError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (qError && qError.code !== 'PGRST116') {
          console.error('Error fetching questionnaire:', qError);
        }

        if (!mounted) return;

        // Call AI property search edge function
        const { data: aiSearchData, error: aiError } = await supabase.functions.invoke('ai-property-search', {
          body: { userId }
        });

        if (aiError) {
          console.error('AI property search error:', aiError);
          toast.error('Failed to personalize property search');
        }

        if (!mounted) return;

        // Fetch both sample and scraped properties
        const [sampleProperties, scrapedProperties] = await Promise.all([
          PropertyService.getFilteredProperties({}),
          scrapedPropertiesService.getScrapedProperties(userId)
        ]);
        
        // Merge both sources
        const allProperties = [...sampleProperties, ...scrapedProperties];
        
        // Score and sort properties
        const scoredProperties = allProperties.map(property => {
          let score = 0;
          const reasons: string[] = [];

          // Budget match
          if (questionnaireData?.budget_range) {
            const budgetRange = questionnaireData.budget_range as any;
            const minBudget = Number(budgetRange.min) || 0;
            const maxBudget = Number(budgetRange.max) || Infinity;
            if (property.price >= minBudget && property.price <= maxBudget) {
              score += 30;
              reasons.push('Within your budget');
            }
          }

          // Location match
          if (questionnaireData?.location_preferences && Array.isArray(questionnaireData.location_preferences)) {
            const userLocations = questionnaireData.location_preferences;
            if (userLocations.some((loc: string) => 
              property.location.toLowerCase().includes(loc.toLowerCase())
            )) {
              score += 25;
              reasons.push('In your preferred location');
            }
          }

          // Property type match
          if (questionnaireData?.property_types && Array.isArray(questionnaireData.property_types)) {
            if (questionnaireData.property_types.includes(property.type)) {
              score += 20;
              reasons.push('Matches your property type preference');
            }
          }

          // Bedrooms match
          if (questionnaireData?.household_details) {
            const household = questionnaireData.household_details as any;
            const adults = Number(household.adults) || 0;
            const children = Number(household.children) || 0;
            const totalPeople = adults + children;
            const bedroomsNeeded = Math.ceil(totalPeople / 2);
            if (property.bedrooms >= bedroomsNeeded) {
              score += 15;
              reasons.push('Suitable size for your household');
            }
          }

          // Amenities match
          if (questionnaireData?.amenities_required && Array.isArray(questionnaireData.amenities_required) && property.features) {
            const matchedAmenities = questionnaireData.amenities_required.filter((amenity: string) =>
              property.features.some(feature => 
                feature.toLowerCase().includes(amenity.toLowerCase())
              )
            );
            if (matchedAmenities.length > 0) {
              score += 10;
              reasons.push(`Has ${matchedAmenities.length} of your desired amenities`);
            }
          }

          return { property, score, reasons };
        });

        // Sort by score and take top matches
        const topProperties = scoredProperties
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 8);

        const matchScores = new Map(topProperties.map(item => [item.property.id, item.score]));
        const matchReasons = new Map(topProperties.map(item => [item.property.id, item.reasons]));

        if (mounted) {
          setData({
            properties: topProperties.length > 0 
              ? topProperties.map(item => item.property)
              : allProperties.slice(0, 4),
            matchScores,
            matchReasons,
            isLoading: false,
            questionnaireData,
          });
        }
      } catch (error) {
        console.error('Error loading personalized dashboard:', error);
        if (mounted) {
          toast.error('Failed to load personalized recommendations');
          setData(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    loadPersonalizedData();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return data;
};
