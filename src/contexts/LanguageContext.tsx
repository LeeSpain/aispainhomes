import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define available languages
type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'it' | 'nl';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// This would come from JSON files in a real app
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    'app.name': 'SunnyHomeFinder',
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.about': 'About Us',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'dashboard.properties': 'Properties',
    'dashboard.favorites': 'Favorites',
    'dashboard.documents': 'Documents',
    'dashboard.alerts': 'Alerts',
    'dashboard.settings': 'Settings',
    'property.bedrooms': 'Bedrooms',
    'property.bathrooms': 'Bathrooms',
    'property.area': 'Area',
    'property.viewDetails': 'View Details',
    'property.addToFavorites': 'Add to Favorites',
    'property.removeFromFavorites': 'Remove from Favorites',
    // Add more translations as needed
  },
  es: {
    'app.name': 'SunnyHomeFinder',
    'nav.home': 'Inicio',
    'nav.search': 'Buscar',
    'nav.about': 'Sobre Nosotros',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registrarse',
    'nav.dashboard': 'Panel',
    'dashboard.properties': 'Propiedades',
    'dashboard.favorites': 'Favoritos',
    'dashboard.documents': 'Documentos',
    'dashboard.alerts': 'Alertas',
    'dashboard.settings': 'Configuración',
    'property.bedrooms': 'Dormitorios',
    'property.bathrooms': 'Baños',
    'property.area': 'Superficie',
    'property.viewDetails': 'Ver Detalles',
    'property.addToFavorites': 'Añadir a Favoritos',
    'property.removeFromFavorites': 'Quitar de Favoritos',
    // Add more translations as needed
  },
  fr: {
    'app.name': 'SunnyHomeFinder',
    'nav.home': 'Accueil',
    'nav.search': 'Rechercher',
    'nav.about': 'À Propos',
    'nav.login': 'Connexion',
    'nav.register': 'S\'inscrire',
    'nav.dashboard': 'Tableau de Bord',
    'dashboard.properties': 'Propriétés',
    'dashboard.favorites': 'Favoris',
    'dashboard.documents': 'Documents',
    'dashboard.alerts': 'Alertes',
    'dashboard.settings': 'Paramètres',
    'property.bedrooms': 'Chambres',
    'property.bathrooms': 'Salles de bain',
    'property.area': 'Surface',
    'property.viewDetails': 'Voir Détails',
    'property.addToFavorites': 'Ajouter aux Favoris',
    'property.removeFromFavorites': 'Retirer des Favoris',
    // Add more translations as needed
  },
  de: {
    // Partial German translations
    'app.name': 'SunnyHomeFinder',
    'nav.home': 'Startseite',
    'nav.dashboard': 'Dashboard',
    // Add more as needed
  },
  it: {
    // Partial Italian translations
    'app.name': 'SunnyHomeFinder',
    'nav.home': 'Home',
    'nav.dashboard': 'Pannello',
    // Add more as needed
  },
  nl: {
    // Partial Dutch translations
    'app.name': 'SunnyHomeFinder',
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    // Add more as needed
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { userPreferences, updateUserPreferences } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // Initialize language from user preferences
  useEffect(() => {
    if (userPreferences && userPreferences.language) {
      setCurrentLanguage(userPreferences.language as LanguageCode);
    }
  }, [userPreferences]);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    if (updateUserPreferences) {
      updateUserPreferences({ language: lang });
    }
  };

  // Translation function
  const t = (key: string): string => {
    return translations[currentLanguage][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
