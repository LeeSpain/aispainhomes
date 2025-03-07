
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import BrandLogo from './navbar/BrandLogo';
import NavLinks from './navbar/NavLinks';
import UserMenu from './navbar/UserMenu';
import MobileMenu from './navbar/MobileMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <BrandLogo />
        
        <NavLinks user={user} />
        
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSelector />
          <UserMenu user={user} onLogout={logout} />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <LanguageSelector minimal={true} />
          
          <UserMenu user={user} onLogout={logout} minimal={true} />
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="focus-ring rounded-md p-2"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      <MobileMenu isOpen={isMobileMenuOpen} user={user} />
    </header>
  );
};

export default Navbar;
