import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) throw new Error('Unauthorized');

    // Fetch user's questionnaire data
    const { data: questionnaireData } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!questionnaireData) {
      return new Response(JSON.stringify({ 
        error: 'No questionnaire data found. Please complete the questionnaire first.',
        searchCriteria: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
      });
    }

    // Build intelligent search criteria from profile
    const searchCriteria = {
      // From property preferences
      minPrice: questionnaireData?.budget_range?.min || 0,
      maxPrice: questionnaireData?.budget_range?.max || 1000000,
      propertyTypes: questionnaireData?.property_types || [],
      locations: questionnaireData?.location_preferences || [],
      bedrooms: questionnaireData?.household_details?.bedrooms || '',
      bathrooms: questionnaireData?.household_details?.bathrooms || '',
      minArea: questionnaireData?.household_details?.minArea || 0,
      amenities: questionnaireData?.amenities_required || [],
      
      // From lifestyle preferences
      climatePreference: questionnaireData?.lifestyle_preferences?.climatePreference,
      areaType: questionnaireData?.lifestyle_preferences?.areaType,
      communityPreference: questionnaireData?.lifestyle_preferences?.communityPreference,
      proximityPriorities: questionnaireData?.lifestyle_preferences?.proximityPriorities || [],
      
      // From household details
      hasPets: questionnaireData?.household_details?.pets || false,
      hasChildren: (questionnaireData?.household_details?.children || []).length > 0,
      
      // From relocation timeline
      urgency: questionnaireData?.relocation_timeline?.relocateWhen,
      
      // Legal constraints
      hasNIE: questionnaireData?.legal_documentation?.hasNIE,
      needsVisa: questionnaireData?.legal_documentation?.needsVisa,
      
      // Default location if available
      location: questionnaireData?.location_preferences?.[0] || '',
      propertyType: questionnaireData?.property_types?.[0] || ''
    };

    return new Response(JSON.stringify({ 
      success: true,
      searchCriteria,
      message: 'AI-enhanced search criteria generated based on your profile'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-property-search:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      searchCriteria: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
