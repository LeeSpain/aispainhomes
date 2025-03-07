
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  
  return {
    t,
    language: currentLanguage,
    changeLanguage: setLanguage
  };
};
