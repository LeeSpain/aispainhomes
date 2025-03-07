
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl md:text-2xl font-semibold tracking-tight flex items-center"
        >
          <span className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-md mr-2">
            SH
          </span>
          SunnyHomeFinder
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary font-medium' : ''
            }`}
          >
            Home
          </Link>
          <Link 
            to="/questionnaire" 
            className={`transition-colors hover:text-primary ${
              location.pathname === '/questionnaire' ? 'text-primary font-medium' : ''
            }`}
          >
            Find Property
          </Link>
          {user && (
            <Link 
              to="/dashboard" 
              className={`transition-colors hover:text-primary ${
                location.pathname === '/dashboard' ? 'text-primary font-medium' : ''
              }`}
            >
              Dashboard
            </Link>
          )}
          <Link 
            to="/about" 
            className={`transition-colors hover:text-primary ${
              location.pathname === '/about' ? 'text-primary font-medium' : ''
            }`}
          >
            About
          </Link>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <LanguageSelector minimal={true} />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
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
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-lg border-t border-gray-200 dark:border-gray-800 animate-fade-in">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`py-2 transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary font-medium' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/questionnaire" 
              className={`py-2 transition-colors hover:text-primary ${
                location.pathname === '/questionnaire' ? 'text-primary font-medium' : ''
              }`}
            >
              Find Property
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className={`py-2 transition-colors hover:text-primary ${
                  location.pathname === '/dashboard' ? 'text-primary font-medium' : ''
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link 
              to="/about" 
              className={`py-2 transition-colors hover:text-primary ${
                location.pathname === '/about' ? 'text-primary font-medium' : ''
              }`}
            >
              About
            </Link>
            
            {!user && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <Link 
                  to="/login" 
                  className="py-2 transition-colors hover:text-primary"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="py-2 transition-colors hover:text-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
