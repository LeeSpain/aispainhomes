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
            .order('search_timestamp', { ascending: false })
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
              externalUrl: rec.external_url || rec.source_url || undefined,
              referenceNumber: rec.property_id || undefined,
              listingDate: rec.search_timestamp || rec.created_at || undefined,
              lastChecked: rec.search_timestamp || undefined,
            }))
          : scrapedProperties;
        
        console.log(`✅ Total properties to display: ${allProperties.length}`);

        // PHASE 3: Calculate match scores with enhanced algorithm
        if (hasCompletedQuestionnaire && allProperties.length > 0) {
          const scoredProperties = allProperties.map(property => {
            // Get stored score from Clara
            const claraRec = claraPropertyRecommendations.find(rec => rec.id === property.id);
            const storedScore = claraRec?.match_score || 0;
            const storedReasons = claraRec?.match_reasons || [];
            
            // Recalculate if stored score is low AND property has complete data
            const hasCompleteData = property.price > 0 && property.bedrooms > 0;
            const needsRecalculation = storedScore < 30 && hasCompleteData;
            
            if (needsRecalculation) {
              console.log(`🔄 Recalculating score for property: ${property.title}`);
              
              let score = 0;
              const reasons: string[] = [];
              
              const budgetRange = questionnaireData.budget_range as any || {};
              const household = questionnaireData.household_details as any || {};
              const budgetMin = Number(budgetRange.min) || 0;
              const budgetMax = Number(budgetRange.max) || Infinity;
              
              // 1. Budget matching (35 points)
              if (property.price > 0) {
                if (property.price >= budgetMin && property.price <= budgetMax) {
                  score += 35;
                  reasons.push(`€${property.price.toLocaleString()} is within your budget`);
                } else if (property.price < budgetMin) {
                  const percentOfMin = (property.price / budgetMin) * 100;
                  if (percentOfMin >= 70) {
                    score += 30;
                    reasons.push(`€${property.price.toLocaleString()} - Great value below your budget`);
                  } else if (percentOfMin >= 50) {
                    score += 20;
                    reasons.push(`€${property.price.toLocaleString()} - Well below budget`);
                  }
                } else {
                  const overBudget = ((property.price - budgetMax) / budgetMax) * 100;
                  if (overBudget <= 10) {
                    score += 25;
                    reasons.push(`€${property.price.toLocaleString()} - Slightly over budget`);
                  } else if (overBudget <= 20) {
                    score += 15;
                    reasons.push('Over budget but may be worth it');
                  }
                }
              }

              // 2. Location matching (30 points)
              if (questionnaireData.location_preferences) {
                const locPrefs = questionnaireData.location_preferences;
                let userLocations: string[] = [];
                
                if (Array.isArray(locPrefs)) {
                  userLocations = locPrefs.map(loc => String(loc));
                } else if (typeof locPrefs === 'object' && locPrefs !== null) {
                  userLocations = [(locPrefs as any).location || 'Spain'];
                } else {
                  userLocations = [String(locPrefs)];
                }
                
                const locationMatch = userLocations.some((loc: string) => 
                  property.location.toLowerCase().includes(loc.toLowerCase())
                );
                if (locationMatch) {
                  score += 30;
                  reasons.push(`Located in ${property.location} (your preferred area)`);
                } else {
                  score += 5;
                }
              }

              // 3. Property type scoring (20 points)
              if (questionnaireData.property_types && Array.isArray(questionnaireData.property_types)) {
                if (questionnaireData.property_types.includes(property.type)) {
                  score += 20;
                  reasons.push(`${property.type} matches your property type preference`);
                } else {
                  score += 5;
                }
              }

              // 4. Bedroom scoring (10 points)
              if (property.bedrooms > 0) {
                const totalPeople = (Number(household.adults) || 0) + (Number(household.children) || 0);
                const bedroomsNeeded = Math.max(Math.ceil(totalPeople / 2), 2);
                
                if (property.bedrooms >= bedroomsNeeded) {
                  score += 10;
                  reasons.push(`${property.bedrooms} bedrooms - perfect for ${totalPeople} people`);
                } else if (property.bedrooms === bedroomsNeeded - 1) {
                  score += 6;
                  reasons.push(`${property.bedrooms} bedrooms - almost enough space`);
                }
              }

              // 5. Bathroom matching (5 points)
              if (property.bathrooms > 0) {
                score += 5;
                reasons.push(`${property.bathrooms} bathrooms`);
              }

              // 6. Area/Size matching (5 points)
              if (property.area > 0) {
                const minArea = 80;
                if (property.area >= minArea * 1.5) {
                  score += 5;
                  reasons.push(`${property.area}m² - very spacious`);
                } else if (property.area >= minArea) {
                  score += 3;
                  reasons.push(`${property.area}m² - good size`);
                }
              }

              // 7. Features (10 points)
              if (property.features && Array.isArray(property.features) && property.features.length > 0) {
                const featureScore = Math.min(10, property.features.length * 2);
                score += featureScore;
                const featureList = property.features.slice(0, 3).join(', ');
                reasons.push(`Great features: ${featureList}`);
              }

              // 8. Data completeness bonus (5 points)
              if (property.price > 0 && property.bedrooms > 0 && property.bathrooms > 0 && property.area > 0) {
                score += 5;
                reasons.push('Complete property information');
              }

              // 9. Live search freshness (5 points)
              if (property.sourceWebsite && property.sourceWebsite !== 'Database') {
                score += 5;
                reasons.push('Fresh listing');
              }

              // Normalize to 100 scale (total possible: 130)
              const normalizedScore = Math.min(100, Math.round((score / 130) * 100));
              
              return { 
                property, 
                score: normalizedScore, 
                reasons, 
                wasRecalculated: true 
              };
            }
            
            // Use stored score if it's already good or property lacks data
            return { 
              property, 
              score: storedScore, 
              reasons: storedReasons,
              wasRecalculated: false 
            };
          });

          // Sort by score
          const sortedProperties = scoredProperties
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);

          // Use the recalculated or stored scores
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
