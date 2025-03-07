
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import QuestionnaireFlow from './QuestionnaireFlow';
import PropertyResults from './results/PropertyResults';
import { useQuestionnaireForm } from './hooks/useQuestionnaireForm';
import { sampleProperties, subscriptionTier } from './utils/sampleData';

const QuestionnaireContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formData, handleChange, togglePropertyType, toggleAmenity } = useQuestionnaireForm();
  const [showResults, setShowResults] = useState(false);
  const [showAuthForms, setShowAuthForms] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('register');
  
  const handleShowResults = () => {
    setShowResults(true);
  };
  
  const handleContinueToAuth = () => {
    setShowAuthForms(true);
  };
  
  const handleAuthSuccess = () => {
    navigate('/dashboard');
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
