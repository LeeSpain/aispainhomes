
import { Link, useLocation } from 'react-router-dom';

interface NavLinksProps {
  user: { name: string } | null;
  className?: string;
}

const NavLinks = ({ user, className = "" }: NavLinksProps) => {
  const location = useLocation();
  
  return (
    <nav className={`hidden md:flex items-center space-x-8 ${className}`}>
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
    </nav>
  );
};

export default NavLinks;
