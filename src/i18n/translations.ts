
import { SupportedLanguage, Translations } from './types';
import { commonTranslations } from './categories/common';
import { navigationTranslations } from './categories/navigation';
import { propertyTranslations } from './categories/property';
import { dashboardTranslations } from './categories/dashboard';
import { actionTranslations } from './categories/actions';
import { subscriptionTranslations } from './categories/subscription';

// Combine all translation categories
export const translations: Translations = {
  ...commonTranslations,
  ...navigationTranslations,
  ...propertyTranslations,
  ...dashboardTranslations,
  ...actionTranslations,
  ...subscriptionTranslations,
};

export { SupportedLanguage };

export const getTranslation = (key: string, language: SupportedLanguage = 'en'): string => {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  return translations[key][language] || translations[key]['en'];
};
