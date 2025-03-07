
export type SupportedLanguage = 'en' | 'es' | 'de' | 'fr' | 'it';

interface Translations {
  [key: string]: {
    [language in SupportedLanguage]: string;
  };
}

export const translations: Translations = {
  // Common
  "app.name": {
    en: "SunnyHomeFinder",
    es: "BuscadorDeCasaSoleada",
    de: "SonnigerHausfinder",
    fr: "TrouveurDeMaisonEnsoleillée",
    it: "CercatoreCasaSoleggiata"
  },
  "app.tagline": {
    en: "Find your dream home in sunny Spain",
    es: "Encuentra tu casa de ensueño en la soleada España",
    de: "Finden Sie Ihr Traumhaus im sonnigen Spanien",
    fr: "Trouvez votre maison de rêve dans l'Espagne ensoleillée",
    it: "Trova la casa dei tuoi sogni nella soleggiata Spagna"
  },
  
  // Navigation
  "nav.home": {
    en: "Home",
    es: "Inicio",
    de: "Startseite",
    fr: "Accueil",
    it: "Home"
  },
  "nav.properties": {
    en: "Properties",
    es: "Propiedades",
    de: "Immobilien",
    fr: "Propriétés",
    it: "Proprietà"
  },
  "nav.about": {
    en: "About",
    es: "Acerca de",
    de: "Über uns",
    fr: "À propos",
    it: "Chi siamo"
  },
  "nav.contact": {
    en: "Contact",
    es: "Contacto",
    de: "Kontakt",
    fr: "Contact",
    it: "Contatto"
  },
  "nav.login": {
    en: "Login",
    es: "Iniciar sesión",
    de: "Anmelden",
    fr: "Connexion",
    it: "Accedi"
  },
  "nav.register": {
    en: "Register",
    es: "Registrarse",
    de: "Registrieren",
    fr: "S'inscrire",
    it: "Registrati"
  },
  "nav.dashboard": {
    en: "Dashboard",
    es: "Panel",
    de: "Dashboard",
    fr: "Tableau de bord",
    it: "Dashboard"
  },
  "nav.logout": {
    en: "Logout",
    es: "Cerrar sesión",
    de: "Abmelden",
    fr: "Déconnexion",
    it: "Disconnetti"
  },
  
  // Property related
  "property.price": {
    en: "Price",
    es: "Precio",
    de: "Preis",
    fr: "Prix",
    it: "Prezzo"
  },
  "property.bedrooms": {
    en: "Bedrooms",
    es: "Dormitorios",
    de: "Schlafzimmer",
    fr: "Chambres",
    it: "Camere da letto"
  },
  "property.bathrooms": {
    en: "Bathrooms",
    es: "Baños",
    de: "Badezimmer",
    fr: "Salles de bain",
    it: "Bagni"
  },
  "property.area": {
    en: "Area",
    es: "Área",
    de: "Fläche",
    fr: "Surface",
    it: "Area"
  },
  "property.location": {
    en: "Location",
    es: "Ubicación",
    de: "Standort",
    fr: "Emplacement",
    it: "Posizione"
  },
  "property.type": {
    en: "Property Type",
    es: "Tipo de propiedad",
    de: "Immobilientyp",
    fr: "Type de propriété",
    it: "Tipo di proprietà"
  },
  "property.features": {
    en: "Features",
    es: "Características",
    de: "Merkmale",
    fr: "Caractéristiques",
    it: "Caratteristiche"
  },
  "property.description": {
    en: "Description",
    es: "Descripción",
    de: "Beschreibung",
    fr: "Description",
    it: "Descrizione"
  },
  
  // Dashboard tabs
  "dashboard.properties": {
    en: "Properties",
    es: "Propiedades",
    de: "Immobilien",
    fr: "Propriétés",
    it: "Proprietà"
  },
  "dashboard.favorites": {
    en: "Favorites",
    es: "Favoritos",
    de: "Favoriten",
    fr: "Favoris",
    it: "Preferiti"
  },
  "dashboard.alerts": {
    en: "Alerts",
    es: "Alertas",
    de: "Benachrichtigungen",
    fr: "Alertes",
    it: "Avvisi"
  },
  "dashboard.documents": {
    en: "Documents",
    es: "Documentos",
    de: "Dokumente",
    fr: "Documents",
    it: "Documenti"
  },
  "dashboard.settings": {
    en: "Settings",
    es: "Configuración",
    de: "Einstellungen",
    fr: "Paramètres",
    it: "Impostazioni"
  },
  
  // Action buttons
  "action.search": {
    en: "Search",
    es: "Buscar",
    de: "Suchen",
    fr: "Rechercher",
    it: "Cerca"
  },
  "action.save": {
    en: "Save",
    es: "Guardar",
    de: "Speichern",
    fr: "Enregistrer",
    it: "Salva"
  },
  "action.submit": {
    en: "Submit",
    es: "Enviar",
    de: "Absenden",
    fr: "Soumettre",
    it: "Invia"
  },
  "action.cancel": {
    en: "Cancel",
    es: "Cancelar",
    de: "Abbrechen",
    fr: "Annuler",
    it: "Annulla"
  },
  "action.contact": {
    en: "Contact Agent",
    es: "Contactar Agente",
    de: "Kontakt zum Makler",
    fr: "Contacter l'agent",
    it: "Contatta agente"
  },
  
  // Subscription
  "subscription.title": {
    en: "Subscription Plans",
    es: "Planes de suscripción",
    de: "Abonnementpläne",
    fr: "Plans d'abonnement",
    it: "Piani di abbonamento"
  },
  "subscription.basic": {
    en: "Basic",
    es: "Básico",
    de: "Basic",
    fr: "Base",
    it: "Base"
  },
  "subscription.premium": {
    en: "Premium",
    es: "Premium",
    de: "Premium",
    fr: "Premium",
    it: "Premium"
  },
  "subscription.guardian": {
    en: "AI Guardian",
    es: "Guardián IA",
    de: "KI-Wächter",
    fr: "Gardien IA",
    it: "Guardiano IA"
  }
};

export const getTranslation = (key: string, language: SupportedLanguage = 'en'): string => {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  return translations[key][language] || translations[key]['en'];
};
