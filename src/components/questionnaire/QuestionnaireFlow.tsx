
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionnaireLayout from './QuestionnaireLayout';
import PersonalInfoStep from './steps/PersonalInfoStep';
import RelocationTimelineStep from './steps/RelocationTimelineStep';
import PropertyTypeStep from './steps/PropertyTypeStep';
import LocationStep from './steps/LocationStep';
import BudgetStep from './steps/BudgetStep';
import AmenitiesStep from './steps/AmenitiesStep';
import HouseholdDetailsStep from './steps/HouseholdDetailsStep';
import EmploymentStep from './steps/EmploymentStep';
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
  const totalSteps = 10; // Complete questionnaire for both property and guardian services

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentStep]);

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
        return !formData.personalInfo.fullName || !formData.personalInfo.email || !formData.personalInfo.currentCountry;
      case 2:
        return !formData.relocationTimeline.timeframe;
      case 3:
        return formData.propertyTypes.length === 0;
      case 4:
        return !formData.location;
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
      
      {/* Step 3: Property Type & Purpose */}
      {currentStep === 3 && (
        <PropertyTypeStep
          propertyTypes={propertyTypes}
          selectedPropertyTypes={formData.propertyTypes}
          selectedPurpose={formData.purpose}
          onPropertyTypeToggle={togglePropertyType}
          onPurposeChange={(value) => onFormChange('purpose', value)}
        />
      )}
      
      {/* Step 4: Location Preferences */}
      {currentStep === 4 && (
        <LocationStep
          cities={cities}
          selectedLocation={formData.location}
          onLocationChange={(value) => onFormChange('location', value)}
        />
      )}
      
      {/* Step 5: Budget & Property Requirements */}
      {currentStep === 5 && (
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
      
      {/* Step 6: Amenities & Features */}
      {currentStep === 6 && (
        <AmenitiesStep
          amenities={amenities}
          selectedAmenities={formData.selectedAmenities}
          onAmenityToggle={toggleAmenity}
        />
      )}
      
      {/* Step 7: Household Details */}
      {currentStep === 7 && (
        <HouseholdDetailsStep
          household={formData.household}
          onHouseholdChange={(field, value) =>
            onFormChange('household', { ...formData.household, [field]: value })
          }
        />
      )}
      
      {/* Step 8: Employment & Legal Status */}
      {currentStep === 8 && (
        <>
          <EmploymentStep
            employment={formData.employment}
            onEmploymentChange={(field, value) =>
              onFormChange('employment', { ...formData.employment, [field]: value })
            }
          />
          <div className="mt-8">
            <LegalDocumentationStep
              legalDocs={formData.legalDocs}
              onLegalDocsChange={(field, value) =>
                onFormChange('legalDocs', { ...formData.legalDocs, [field]: value })
              }
            />
          </div>
        </>
      )}
      
      {/* Step 9: Lifestyle & Services */}
      {currentStep === 9 && (
        <>
          <LifestylePreferencesStep
            lifestyle={formData.lifestyle}
            onLifestyleChange={(field, value) =>
              onFormChange('lifestyle', { ...formData.lifestyle, [field]: value })
            }
          />
          <div className="mt-8">
            <ServicesNeededStep
              servicesNeeded={formData.servicesNeeded}
              onServicesChange={(field, value) =>
                onFormChange('servicesNeeded', { ...formData.servicesNeeded, [field]: value })
              }
            />
          </div>
        </>
      )}
      
      {/* Step 10: Additional Information */}
      {currentStep === 10 && (
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
