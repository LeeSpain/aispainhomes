
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface QuestionnaireFormData {
  service: 'property' | 'guardian';
  propertyTypes: string[];
  purpose: 'buy' | 'rent';
  location: string;
  priceRange: [number, number];
  bedrooms: number;
  bathrooms: number;
  minArea: number;
  selectedAmenities: string[];
}

export const useQuestionnaireForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState<QuestionnaireFormData>({
    service: 'property',
    propertyTypes: [],
    purpose: 'buy',
    location: '',
    priceRange: [100000, 500000],
    bedrooms: 2,
    bathrooms: 1,
    minArea: 50,
    selectedAmenities: []
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
  
  return {
    formData,
    handleChange,
    togglePropertyType,
    toggleAmenity
  };
};
