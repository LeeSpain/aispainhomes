import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import QuestionnaireLayout from './QuestionnaireLayout';
import ServiceSelectionStep from './steps/ServiceSelectionStep';
import PropertyTypeStep from './steps/PropertyTypeStep';
import RelocationPlansStep from './steps/RelocationPlansStep';
import LocationStep from './steps/LocationStep';
import HouseholdDetailsStep from './steps/HouseholdDetailsStep';
import BudgetStep from './steps/BudgetStep';
import EmploymentStep from './steps/EmploymentStep';
import AmenitiesStep from './steps/AmenitiesStep';
import GuardianServiceStep from './steps/GuardianServiceStep';
import PropertyResults from './results/PropertyResults';
import { Property } from '@/components/properties/PropertyCard';

const cities = [
  'Barcelona', 'Madrid', 'Valencia', 'Malaga', 'Alicante', 
  'Marbella', 'Ibiza', 'Mallorca', 'Tenerife', 'Gran Canaria'
];

const propertyTypes = [
  'Apartment', 'House', 'Villa', 'Penthouse', 'Studio', 'Townhouse', 'Land'
];

const amenities = [
  'Swimming Pool', 'Garden', 'Terrace', 'Parking', 'Air Conditioning', 
  'Sea View', 'Mountain View', 'Security System', 'Elevator', 'Gym'
];

const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment with Sea View',
    location: 'Marbella, Málaga',
    price: 320000,
    currency: 'EUR',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    imageUrl: '/placeholder.svg',
    features: ['Sea View', 'Pool', 'Parking', 'Terrace', 'Air Conditioning'],
    isForRent: false
  },
  {
    id: '2',
    title: 'Luxury Villa with Pool',
    location: 'Ibiza Town, Ibiza',
    price: 1250000,
    currency: 'EUR',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    imageUrl: '/placeholder.svg',
    features: ['Pool', 'Garden', 'Parking', 'Sea View', 'Security System'],
    isForRent: false
  },
  {
    id: '3',
    title: 'Cozy Studio in City Center',
    location: 'Barcelona, Catalonia',
    price: 950,
    currency: 'EUR',
    type: 'Studio',
    bedrooms: 0,
    bathrooms: 1,
    area: 48,
    imageUrl: '/placeholder.svg',
    features: ['Furnished', 'City Center', 'Air Conditioning', 'Public Transport'],
    isForRent: true
  },
  {
    id: '4',
    title: 'Beachfront Condo',
    location: 'Valencia, Comunidad Valenciana',
    price: 285000,
    currency: 'EUR',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    imageUrl: '/placeholder.svg',
    features: ['Beachfront', 'Pool', 'Furnished', 'Balcony'],
    isForRent: false
  },
  {
    id: '5',
    title: 'Countryside Finca',
    location: 'Ronda, Málaga',
    price: 495000,
    currency: 'EUR',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    imageUrl: '/placeholder.svg',
    features: ['Garden', 'Mountain View', 'Fireplace', 'Fruit Trees'],
    isForRent: false
  }
];

const subscriptionTier = {
  id: 'premium',
  title: 'Premium Access',
  price: 9.99,
  description: 'Complete access to all property search and relocation services',
  features: [
    'Unlimited property matches',
    'Daily email alerts with top 10 new properties',
    'Multilingual support (6+ languages)',
    'Lawyer and service provider searches',
    'TV and utility setup assistance',
    'School & healthcare finder',
    'Moving company recommendations',
    'Personalized relocation guides',
    'Market insights and analytics',
    'AI Guardian for full relocation support'
  ],
  isPopular: true,
  buttonText: 'Start Your Journey'
};

const QuestionnaireContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [showAuthForms, setShowAuthForms] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('register');
  const totalSteps = 5;
  
  const [formData, setFormData] = useState({
    service: 'property',
    propertyTypes: [] as string[],
    purpose: 'buy',
    location: '',
    priceRange: [100000, 500000],
    bedrooms: 2,
    bathrooms: 1,
    minArea: 50,
    selectedAmenities: [] as string[]
  });
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    if (serviceParam === 'guardian') {
      setFormData(prev => ({ ...prev, service: 'guardian' }));
    }
  }, [location]);
  
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const togglePropertyType = (type: string) => {
    setFormData(prev => {
      if (prev.propertyTypes.includes(type)) {
        return {
          ...prev,
          propertyTypes: prev.propertyTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          propertyTypes: [...prev.propertyTypes, type]
        };
      }
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => {
      if (prev.selectedAmenities.includes(amenity)) {
        return {
          ...prev,
          selectedAmenities: prev.selectedAmenities.filter(a => a !== amenity)
        };
      } else {
        return {
          ...prev,
          selectedAmenities: [...prev.selectedAmenities, amenity]
        };
      }
    });
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };
  
  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !formData.service || (formData.service === 'property' && !formData.purpose);
      case 2:
        return formData.service === 'property' && formData.propertyTypes.length === 0;
      case 3:
        return formData.service === 'property' && !formData.location;
      default:
        return false;
    }
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
        
        <QuestionnaireLayout
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onBack={handleBack}
          isNextDisabled={isNextDisabled()}
          isBackDisabled={currentStep === 1}
          isLastStep={currentStep === totalSteps}
        >
          {currentStep === 1 && (
            <ServiceSelectionStep
              selectedService={formData.service}
              selectedPurpose={formData.purpose}
              onServiceChange={(value) => handleChange('service', value)}
              onPurposeChange={(value) => handleChange('purpose', value)}
            />
          )}
          
          {currentStep === 2 && formData.service === 'property' && (
            <PropertyTypeStep
              propertyTypes={propertyTypes}
              selectedPropertyTypes={formData.propertyTypes}
              onPropertyTypeToggle={togglePropertyType}
            />
          )}

          {currentStep === 2 && formData.service === 'guardian' && (
            <RelocationPlansStep />
          )}
          
          {currentStep === 3 && formData.service === 'property' && (
            <LocationStep
              cities={cities}
              selectedLocation={formData.location}
              onLocationChange={(value) => handleChange('location', value)}
            />
          )}

          {currentStep === 3 && formData.service === 'guardian' && (
            <HouseholdDetailsStep />
          )}
          
          {currentStep === 4 && formData.service === 'property' && (
            <BudgetStep
              purpose={formData.purpose}
              priceRange={formData.priceRange}
              bedrooms={formData.bedrooms}
              bathrooms={formData.bathrooms}
              minArea={formData.minArea}
              onPriceRangeChange={(value) => handleChange('priceRange', value)}
              onBedroomsChange={(value) => handleChange('bedrooms', value)}
              onBathroomsChange={(value) => handleChange('bathrooms', value)}
              onMinAreaChange={(value) => handleChange('minArea', value)}
            />
          )}

          {currentStep === 4 && formData.service === 'guardian' && (
            <EmploymentStep />
          )}
          
          {currentStep === 5 && formData.service === 'property' && (
            <AmenitiesStep
              amenities={amenities}
              selectedAmenities={formData.selectedAmenities}
              onAmenityToggle={toggleAmenity}
            />
          )}

          {currentStep === 5 && formData.service === 'guardian' && (
            <GuardianServiceStep />
          )}
        </QuestionnaireLayout>
        
        <Footer />
      </div>
    </>
  );
};

export default QuestionnaireContainer;
