
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { QuestionnaireFormData } from './hooks/useQuestionnaireForm';
import { cities, propertyTypes, amenities } from './utils/sampleData';

interface QuestionnaireFlowProps {
  formData: QuestionnaireFormData;
  onFormChange: (field: string, value: any) => void;
  togglePropertyType: (type: string) => void;
  toggleAmenity: (amenity: string) => void;
  onComplete: () => void;
}

const QuestionnaireFlow = ({ 
  formData, 
  onFormChange, 
  togglePropertyType, 
  toggleAmenity,
  onComplete
}: QuestionnaireFlowProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
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

  return (
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
          onServiceChange={(value) => onFormChange('service', value)}
          onPurposeChange={(value) => onFormChange('purpose', value)}
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
          onLocationChange={(value) => onFormChange('location', value)}
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
          onPriceRangeChange={(value) => onFormChange('priceRange', value)}
          onBedroomsChange={(value) => onFormChange('bedrooms', value)}
          onBathroomsChange={(value) => onFormChange('bathrooms', value)}
          onMinAreaChange={(value) => onFormChange('minArea', value)}
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
  );
};

export default QuestionnaireFlow;
