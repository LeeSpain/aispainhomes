
import { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface LanguageSelectorProps {
  minimal?: boolean;
}

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

const LanguageSelector = ({ minimal = false }: LanguageSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    // In a real app, this would update the app's language context/state
    console.log(`Language changed to ${language.name}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center focus-ring px-2 py-1 rounded-md hover:bg-secondary transition-colors">
        {minimal ? (
          <Globe className="h-5 w-5" />
        ) : (
          <>
            <span className="mr-1">{selectedLanguage.flag}</span>
            <span className="mr-1">{selectedLanguage.name}</span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 animate-slide-in-right">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className="flex items-center justify-between cursor-pointer"
            onClick={() => handleLanguageChange(language)}
          >
            <span className="flex items-center">
              <span className="mr-2">{language.flag}</span>
              {language.name}
            </span>
            {selectedLanguage.code === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
