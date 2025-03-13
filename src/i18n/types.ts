
export type SupportedLanguage = 'en' | 'es' | 'de' | 'fr' | 'it';

export interface TranslationCategory {
  [key: string]: {
    [language in SupportedLanguage]: string;
  };
}

export interface Translations {
  [key: string]: {
    [language in SupportedLanguage]: string;
  };
}
