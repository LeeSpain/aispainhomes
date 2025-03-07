
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      // Small delay to avoid showing immediately on page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookieConsentTimestamp', new Date().toISOString());
    setIsVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential');
    localStorage.setItem('cookieConsentTimestamp', new Date().toISOString());
    setIsVisible(false);
  };

  const dismiss = () => {
    setIsDismissed(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300); // Match the animation duration
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-900 shadow-xl border-t transition-transform duration-300 ${
        isDismissed ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="hidden md:flex p-3 bg-primary/10 rounded-full">
            <Cookie className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold flex items-center">
                <Cookie className="h-5 w-5 mr-2 text-primary md:hidden" />
                Cookie Consent
              </h3>
              <Button
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0"
                onClick={dismiss}
                aria-label="Dismiss cookie notice"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              We use cookies to enhance your browsing experience, serve personalized ads,
              and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              Read our <Link to="/terms" className="underline hover:text-primary">Cookie Policy</Link> to learn more.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={acceptEssential}
              className="flex-1 md:flex-none"
            >
              Essential Only
            </Button>
            <Button
              size="sm"
              onClick={acceptAll}
              className="flex-1 md:flex-none"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
