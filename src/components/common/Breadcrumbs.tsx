
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive: boolean;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const generateBreadcrumbs = () => {
      // Skip rendering breadcrumbs on the homepage
      if (location.pathname === '/') return [];

      const paths = location.pathname.split('/').filter(path => path);
      
      const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Home', path: '/', isActive: false }
      ];

      let currentPath = '';
      
      paths.forEach((path, index) => {
        currentPath += `/${path}`;
        const isLast = index === paths.length - 1;
        
        let label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
        
        // Handle special cases
        if (path === 'property' && paths[index + 1]) {
          label = 'Property Details';
        } else if (path === 'clara' || path === 'ai-guardian') {
          label = 'Clara';
        } else if (path === 'email-preferences') {
          label = 'Email Preferences';
        } else if (path === 'profile-settings') {
          label = 'Profile Settings';
        }
        
        breadcrumbItems.push({
          label,
          path: currentPath,
          isActive: isLast
        });
      });
      
      return breadcrumbItems;
    };
    
    setBreadcrumbs(generateBreadcrumbs());
  }, [location.pathname]);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index === 0 ? (
              <Link 
                to={breadcrumb.path} 
                className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="Home"
              >
                <Home className="h-3.5 w-3.5" />
              </Link>
            ) : index === breadcrumbs.length - 1 ? (
              <span 
                className="text-foreground font-medium"
                aria-current="page"
              >
                {breadcrumb.label}
              </span>
            ) : (
              <Link 
                to={breadcrumb.path} 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
            
            {index < breadcrumbs.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 mx-2 text-muted-foreground" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
