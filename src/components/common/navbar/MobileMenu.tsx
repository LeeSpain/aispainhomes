
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { ShieldCheck, Info, Home, Lightning, Building2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileMenuProps {
  isOpen: boolean;
  user: { name: string; email?: string } | null;
}

const MobileMenu = ({ isOpen, user }: MobileMenuProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  // Check if user is admin
  const isAdmin = user?.email === 'admin@example.com';

  if (!isOpen) return null;
  
  return (
    <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-lg border-t border-gray-200 dark:border-gray-800 animate-fade-in">
      <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
        <Link 
          to="/" 
          className={`py-2 transition-colors hover:text-primary flex items-center gap-2 ${
            location.pathname === '/' ? 'text-primary font-medium' : ''
          }`}
        >
          <Home className="h-4 w-4" />
          {t('nav.home')}
        </Link>
        <Link 
          to="/about" 
          className={`py-2 transition-colors hover:text-primary flex items-center gap-2 ${
            location.pathname === '/about' ? 'text-primary font-medium' : ''
          }`}
        >
          <Info className="h-4 w-4" />
          {t('nav.about')}
        </Link>
        <Link 
          to="/property" 
          className={`py-2 transition-colors hover:text-primary flex items-center gap-2 ${
            location.pathname === '/property' ? 'text-primary font-medium' : ''
          }`}
        >
          <Building2 className="h-4 w-4" />
          Property
        </Link>
        <Link 
          to="/ai-guardian" 
          className={`py-2 transition-colors hover:text-primary flex items-center gap-2 ${
            location.pathname === '/ai-guardian' ? 'text-primary font-medium' : ''
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          AI Guardian
        </Link>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="quick-access" className="border-b-0">
            <AccordionTrigger className="py-2 text-left flex items-center gap-2 hover:text-primary">
              <Lightning className="h-4 w-4" />
              <span>Quick Access</span>
            </AccordionTrigger>
            <AccordionContent className="pl-7">
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/dashboard" 
                  className="py-2 transition-colors hover:text-primary"
                >
                  User Dashboard
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="py-2 transition-colors hover:text-primary"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link 
                  to="/login" 
                  className="py-2 transition-colors hover:text-primary"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  to="/register" 
                  className="py-2 transition-colors hover:text-primary"
                >
                  {t('nav.register')}
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {user && (
          <Link 
            to="/dashboard" 
            className={`py-2 transition-colors hover:text-primary ${
              location.pathname === '/dashboard' ? 'text-primary font-medium' : ''
            }`}
          >
            {t('nav.dashboard')}
          </Link>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
