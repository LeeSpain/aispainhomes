
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

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
          className={`py-2 transition-colors hover:text-primary ${
            location.pathname === '/' ? 'text-primary font-medium' : ''
          }`}
        >
          {t('nav.home')}
        </Link>
        <Link 
          to="/search" 
          className={`py-2 transition-colors hover:text-primary ${
            location.pathname === '/search' ? 'text-primary font-medium' : ''
          }`}
        >
          {t('nav.search')}
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
        <Link 
          to="/about" 
          className={`py-2 transition-colors hover:text-primary ${
            location.pathname === '/about' ? 'text-primary font-medium' : ''
          }`}
        >
          {t('nav.about')}
        </Link>
        
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
              className="py-2 transition-colors hover:text-primary"
            >
              {t('nav.register')}
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
