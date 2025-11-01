
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionnaireLayout from './QuestionnaireLayout';
import PersonalInfoStep from './steps/PersonalInfoStep';
import RelocationTimelineStep from './steps/RelocationTimelineStep';
import ServiceSelectionStep from './steps/ServiceSelectionStep';
import PropertyTypeStep from './steps/PropertyTypeStep';
import LocationStep from './steps/LocationStep';
import BudgetStep from './steps/BudgetStep';
import AmenitiesStep from './steps/AmenitiesStep';
import LegalDocumentationStep from './steps/LegalDocumentationStep';
import LifestylePreferencesStep from './steps/LifestylePreferencesStep';
import ServicesNeededStep from './steps/ServicesNeededStep';
import AdditionalInfoStep from './steps/AdditionalInfoStep';
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
  const totalSteps = 9; // Increased to 9 steps for comprehensive questionnaire

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
        return !formData.personalInfo.fullName || !formData.personalInfo.currentCountry;
      case 2:
        return !formData.relocationTimeline.timeframe;
      case 3:
        return !formData.service || (formData.service === 'property' && !formData.purpose);
      case 4:
        return formData.service === 'property' && formData.propertyTypes.length === 0;
      case 5:
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
      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <PersonalInfoStep
          personalInfo={formData.personalInfo}
          onPersonalInfoChange={(field, value) => 
            onFormChange('personalInfo', { ...formData.personalInfo, [field]: value })
          }
        />
      )}
      
      {/* Step 2: Relocation Timeline */}
      {currentStep === 2 && (
        <RelocationTimelineStep
          relocationTimeline={formData.relocationTimeline}
          onTimelineChange={(field, value) =>
            onFormChange('relocationTimeline', { ...formData.relocationTimeline, [field]: value })
          }
        />
      )}
      
      {/* Step 3: Service Selection */}
      {currentStep === 3 && (
        <ServiceSelectionStep
          selectedService={formData.service}
          selectedPurpose={formData.purpose}
          onServiceChange={(value) => onFormChange('service', value)}
          onPurposeChange={(value) => onFormChange('purpose', value)}
        />
      )}
      
      {/* Step 4: Property Type (for property service) */}
      {currentStep === 4 && formData.service === 'property' && (
        <PropertyTypeStep
          propertyTypes={propertyTypes}
          selectedPropertyTypes={formData.propertyTypes}
          onPropertyTypeToggle={togglePropertyType}
        />
      )}

      {/* Step 4: Legal Documentation (for guardian service) */}
      {currentStep === 4 && formData.service === 'guardian' && (
        <LegalDocumentationStep
          legalDocs={formData.legalDocs}
          onLegalDocsChange={(field, value) =>
            onFormChange('legalDocs', { ...formData.legalDocs, [field]: value })
          }
        />
      )}
      
      {/* Step 5: Location (for property service) */}
      {currentStep === 5 && formData.service === 'property' && (
        <LocationStep
          cities={cities}
          selectedLocation={formData.location}
          onLocationChange={(value) => onFormChange('location', value)}
        />
      )}

      {/* Step 5: Lifestyle Preferences (for guardian service) */}
      {currentStep === 5 && formData.service === 'guardian' && (
        <LifestylePreferencesStep
          lifestyle={formData.lifestyle}
          onLifestyleChange={(field, value) =>
            onFormChange('lifestyle', { ...formData.lifestyle, [field]: value })
          }
        />
      )}
      
      {/* Step 6: Budget & Requirements (for property service) */}
      {currentStep === 6 && formData.service === 'property' && (
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

      {/* Step 6: Services Needed (for guardian service) */}
      {currentStep === 6 && formData.service === 'guardian' && (
        <ServicesNeededStep
          servicesNeeded={formData.servicesNeeded}
          onServicesChange={(field, value) =>
            onFormChange('servicesNeeded', { ...formData.servicesNeeded, [field]: value })
          }
        />
      )}
      
      {/* Step 7: Amenities (for property service) */}
      {currentStep === 7 && formData.service === 'property' && (
        <AmenitiesStep
          amenities={amenities}
          selectedAmenities={formData.selectedAmenities}
          onAmenityToggle={toggleAmenity}
        />
      )}

      {/* Step 7: Legal Documentation (for guardian service) */}
      {currentStep === 7 && formData.service === 'guardian' && (
        <LegalDocumentationStep
          legalDocs={formData.legalDocs}
          onLegalDocsChange={(field, value) =>
            onFormChange('legalDocs', { ...formData.legalDocs, [field]: value })
          }
        />
      )}

      {/* Step 8: Legal Documentation (for property service) */}
      {currentStep === 8 && formData.service === 'property' && (
        <LegalDocumentationStep
          legalDocs={formData.legalDocs}
          onLegalDocsChange={(field, value) =>
            onFormChange('legalDocs', { ...formData.legalDocs, [field]: value })
          }
        />
      )}

      {/* Step 8: Lifestyle Preferences (for guardian service) */}
      {currentStep === 8 && formData.service === 'guardian' && (
        <LifestylePreferencesStep
          lifestyle={formData.lifestyle}
          onLifestyleChange={(field, value) =>
            onFormChange('lifestyle', { ...formData.lifestyle, [field]: value })
          }
        />
      )}

      {/* Step 9: Additional Information (both services) */}
      {currentStep === 9 && (
        <AdditionalInfoStep
          additionalInfo={formData.additionalInfo}
          onAdditionalInfoChange={(field, value) =>
            onFormChange('additionalInfo', { ...formData.additionalInfo, [field]: value })
          }
        />
      )}
    </QuestionnaireLayout>
  );
};

export default QuestionnaireFlow;
