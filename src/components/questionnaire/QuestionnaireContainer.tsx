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
        
        // Redirect to dashboard instead of showing results
        toast.success('Questionnaire completed! Welcome to your dashboard.');
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
