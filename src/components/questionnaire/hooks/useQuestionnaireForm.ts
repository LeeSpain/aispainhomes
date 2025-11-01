
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface QuestionnaireFormData {
  // Personal Information
  personalInfo: {
    fullName: string;
    email: string;
    currentCountry: string;
    nationality: string;
    phone: string;
    preferredLanguage: string;
  };
  
  // Relocation Timeline
  relocationTimeline: {
    timeframe: string;
    moveType: 'permanent' | 'temporary';
    visitedSpain: boolean;
  };
  
  // Property Preferences
  propertyTypes: string[];
  purpose: 'buy' | 'rent' | 'both';
  location: string;
  priceRange: [number, number];
  bedrooms: number;
  bathrooms: number;
  minArea: number;
  selectedAmenities: string[];
  parkingRequired: boolean;
  furnished: 'furnished' | 'unfurnished' | 'either';
  
  // Household
  household: {
    adults: number;
    children: number;
    childrenAges: number[];
    pets: { type: string; count: number }[];
    specialNeeds: string;
  };
  
  // Employment & Income
  employment: {
    status: string;
    profession: string;
    monthlyIncome: string;
    hasSpanishJobOffer: boolean;
  };
  
  // Legal & Documentation
  legalDocs: {
    hasNIE: boolean;
    needsVisa: boolean;
    hasSpanishBank: boolean;
    healthInsurance: string;
  };
  
  // Lifestyle Preferences
  lifestyle: {
    climatePreference: string;
    areaType: string[];
    communityPreference: string;
    proximityPriorities: string[];
  };
  
  // Services Needed
  servicesNeeded: {
    legalAssistance: boolean;
    utilitiesSetup: boolean;
    movingServices: boolean;
    education: boolean;
    healthcare: boolean;
    languageLearning: boolean;
  };
  
  // Additional
  additionalInfo: {
    referralSource: string;
    specialRequests: string;
    relocationBudget: string;
  };
}

export const useQuestionnaireForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState<QuestionnaireFormData>({
    personalInfo: {
      fullName: '',
      email: '',
      currentCountry: '',
      nationality: '',
      phone: '',
      preferredLanguage: 'en'
    },
    
    relocationTimeline: {
      timeframe: '',
      moveType: 'permanent',
      visitedSpain: false
    },
    
    propertyTypes: [],
    purpose: 'both',
    location: '',
    priceRange: [100000, 500000],
    bedrooms: 2,
    bathrooms: 1,
    minArea: 50,
    selectedAmenities: [],
    parkingRequired: false,
    furnished: 'either',
    
    household: {
      adults: 1,
      children: 0,
      childrenAges: [],
      pets: [],
      specialNeeds: ''
    },
    
    employment: {
      status: '',
      profession: '',
      monthlyIncome: '',
      hasSpanishJobOffer: false
    },
    
    legalDocs: {
      hasNIE: false,
      needsVisa: false,
      hasSpanishBank: false,
      healthInsurance: ''
    },
    
    lifestyle: {
      climatePreference: '',
      areaType: [],
      communityPreference: '',
      proximityPriorities: []
    },
    
    servicesNeeded: {
      legalAssistance: false,
      utilitiesSetup: false,
      movingServices: false,
      education: false,
      healthcare: false,
      languageLearning: false
    },
    
    additionalInfo: {
      referralSource: '',
      specialRequests: '',
      relocationBudget: ''
    }
  });
  
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
  
  return {
    formData,
    handleChange,
    togglePropertyType,
    toggleAmenity
  };
};
