
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto bg-secondary/50 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-flex items-center mb-4">
              <span className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-md mr-2">
                SH
              </span>
              <span className="text-xl font-semibold">SunnyHomeFinder</span>
            </Link>
            <p className="text-muted-foreground mt-2 max-w-xs">
              Your AI-powered assistant for finding the perfect property and relocating to sunny Spain.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/questionnaire" className="text-muted-foreground hover:text-foreground transition-colors">
                  Find Property
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/questionnaire" className="text-muted-foreground hover:text-foreground transition-colors">
                  Property Search
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Relocation Services
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Legal Assistance
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Utility Setup
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground">
                  Terms & Conditions
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Cookie Policy
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} SunnyHomeFinder. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <span className="text-muted-foreground text-sm">
              Made with ♥ in Spain
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
