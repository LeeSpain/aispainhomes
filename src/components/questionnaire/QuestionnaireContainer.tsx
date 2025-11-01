import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
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
        const { error } = await supabase
          .from('questionnaire_responses')
          .upsert({
            user_id: user.id,
            service_type: formData.service,
            property_type: formData.purpose,
            property_types: formData.propertyTypes,
            location_preferences: { location: formData.location },
            budget_range: {
              min: formData.priceRange[0],
              max: formData.priceRange[1]
            },
            household_details: {
              bedrooms: formData.bedrooms,
              bathrooms: formData.bathrooms,
              minArea: formData.minArea
            },
            amenities_required: formData.selectedAmenities,
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error saving questionnaire responses:', error);
          toast.error('Failed to save your responses');
          return;
        }

        console.log('Questionnaire responses saved successfully');
        
        // Redirect to dashboard instead of showing results
        toast.success('Questionnaire completed! Welcome to your dashboard.');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error saving questionnaire responses:', error);
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
        
        <div className="min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-1 pt-28 pb-16">
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
          </main>
          
          <Footer />
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Find Your Perfect Property | SunnyHomeFinder</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <QuestionnaireFlow
            formData={formData}
            onFormChange={handleChange}
            togglePropertyType={togglePropertyType}
            toggleAmenity={toggleAmenity}
            onComplete={handleShowResults}
          />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default QuestionnaireContainer;
