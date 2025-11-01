import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import QuestionnaireFlow from './QuestionnaireFlow';
import PropertyResults from './results/PropertyResults';
import { useQuestionnaireForm } from './hooks/useQuestionnaireForm';
import { sampleProperties, subscriptionTier } from './utils/sampleData';
import { supabase } from '@/integrations/supabase/client';

const QuestionnaireContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formData, handleChange, togglePropertyType, toggleAmenity } = useQuestionnaireForm();
  const [showResults, setShowResults] = useState(false);
  const [showAuthForms, setShowAuthForms] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('register');
  
  const handleShowResults = async () => {
    // Check if user has active subscription
    if (user?.id) {
      try {
        // Save questionnaire responses to database
        // Format lifestyle preferences to ensure arrays are properly structured
        const lifestylePrefs = {
          climatePreference: formData.lifestyle.climatePreference,
          areaType: formData.lifestyle.areaType,
          communityPreference: formData.lifestyle.communityPreference,
          proximityPriorities: formData.lifestyle.proximityPriorities
        };

        const { error } = await supabase
          .from('questionnaire_responses')
          .upsert({
            user_id: user.id,
            service_type: 'full_service',
            property_type: formData.purpose,
            property_types: formData.propertyTypes,
            personal_info: formData.personalInfo,
            relocation_timeline: formData.relocationTimeline,
            location_preferences: formData.location ? [formData.location] : [],
            budget_range: {
              min: formData.priceRange[0],
              max: formData.priceRange[1]
            },
            household_details: {
              adults: formData.household.adults,
              children: formData.household.children,
              childrenAges: formData.household.childrenAges,
              pets: formData.household.pets,
              specialNeeds: formData.household.specialNeeds,
              bedrooms: formData.bedrooms,
              bathrooms: formData.bathrooms,
              minArea: formData.minArea
            },
            amenities_required: formData.selectedAmenities,
            employment_status: formData.employment.status,
            legal_documentation: formData.legalDocs,
            lifestyle_preferences: lifestylePrefs,
            services_needed: formData.servicesNeeded,
            additional_notes: formData.additionalInfo.specialRequests,
            referral_source: formData.additionalInfo.referralSource,
            relocation_budget_range: { budget: formData.additionalInfo.relocationBudget },
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error saving questionnaire responses:', error?.message ?? error, error);
          toast.error('Failed to save your responses');
          return;
        }

        console.log('Questionnaire responses saved successfully');
        
        // Trigger Clara AI to curate recommendations with better UX
        toast.success('Questionnaire completed! Clara is curating your recommendations...');
        
        // Call Clara edge function with comprehensive error handling
        try {
          const { data, error: claraError } = await supabase.functions.invoke('clara-curate-recommendations', {
            body: { userId: user.id }
          });
          
          if (claraError) {
            console.error('Clara curation error:', claraError);
            
            // Handle specific error types
            const errorMessage = claraError.message || '';
            if (errorMessage.includes('429') || claraError.status === 429) {
              toast.warning('Too many requests. Your dashboard is ready, but recommendations will appear shortly.');
            } else if (errorMessage.includes('402') || claraError.status === 402) {
              toast.warning('AI service temporarily limited. Your dashboard is ready with available properties.');
            } else {
              toast.info('Clara is still working on your recommendations. Check your dashboard in a moment!');
            }
          } else {
            console.log('Clara recommendations generated:', data);
            const propertiesCount = data?.propertiesCount || 0;
            const servicesCount = data?.servicesCount || 0;
            
            if (propertiesCount > 0 || servicesCount > 0) {
              toast.success(`Clara found ${propertiesCount} properties and ${servicesCount} services for you!`);
            } else {
              toast.info('Clara is searching for the best matches. Check your dashboard shortly!');
            }
          }
        } catch (claraErr) {
          console.error('Exception calling Clara:', claraErr);
          toast.info('Your dashboard is ready! Clara will continue searching in the background.');
        }
        
        // Always navigate to dashboard - user can see results even if Clara is still processing
        navigate('/dashboard');
      } catch (error) {
        console.error('Error saving questionnaire responses:', error?.message ?? error, error);
        toast.error('Failed to save your responses');
        return;
      }
    } else {
      // If not logged in, show results page
      setShowResults(true);
    }
  };
  
  const handleContinueToAuth = () => {
    setShowAuthForms(true);
  };
  
  const handleAuthSuccess = () => {
    // After auth success, go straight to subscription page instead of dashboard
    navigate('/subscription?plan=guardian');
  };
  
  if (showResults) {
    return (
      <>
        <Helmet>
          <title>Your Property Matches | SunnyHomeFinder</title>
        </Helmet>
        
        <div className="pt-28 pb-16">
          <PropertyResults 
            properties={sampleProperties}
            user={user}
            showAuthForms={showAuthForms}
            authTab={authTab}
            subscriptionTier={subscriptionTier}
            onAuthTabChange={setAuthTab}
            onContinueToAuth={handleContinueToAuth}
            onAuthSuccess={handleAuthSuccess}
          />
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Find Your Perfect Property | SunnyHomeFinder</title>
      </Helmet>
      
      <div>
        <QuestionnaireFlow
          formData={formData}
          onFormChange={handleChange}
          togglePropertyType={togglePropertyType}
          toggleAmenity={toggleAmenity}
          onComplete={handleShowResults}
        />
      </div>
    </>
  );
};

export default QuestionnaireContainer;
