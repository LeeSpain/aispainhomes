
import { useContext } from 'react';
import { getTranslation, SupportedLanguage } from '@/i18n/translations';
import { LanguageContext } from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);
  
  const t = (key: string, placeholders?: Record<string, string>): string => {
    let translation = getTranslation(key, language as SupportedLanguage);
    
    if (placeholders) {
      Object.entries(placeholders).forEach(([key, value]) => {
        translation = translation.replace(`{{${key}}}`, value);
      });
    }
    
    return translation;
  };
  
  return { t };
};

export default useTranslation;
