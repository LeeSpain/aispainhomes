
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { ShieldCheck, Info, Home, UserPlus } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  user: { name: string } | null;
}

const MobileMenu = ({ isOpen, user }: MobileMenuProps) => {
  const location = useLocation();
  const { t } = useTranslation();

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
          to="/ai-guardian" 
          className={`py-2 transition-colors hover:text-primary flex items-center gap-2 ${
            location.pathname === '/ai-guardian' ? 'text-primary font-medium' : ''
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          AI Guardian
        </Link>
        
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
        
        {!user && (
          <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
            <Link 
              to="/login" 
              className="py-2 transition-colors hover:text-primary"
            >
              {t('nav.login')}
            </Link>
            <Link 
              to="/register" 
              className="py-2 font-medium text-primary hover:text-primary/80 flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {t('nav.register')}
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
