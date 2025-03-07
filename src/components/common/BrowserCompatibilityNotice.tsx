
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const BrowserCompatibilityNotice = () => {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // Check for older browsers that might not support all features
    const isIE = /*@cc_on!@*/false || !!(document as any).documentMode;
    const isEdgeHTML = !isIE && !!(window as any).StyleMedia;
    const isOldBrowser = isIE || isEdgeHTML || !/Chrome|Firefox|Safari/.test(navigator.userAgent);
    
    setShowNotice(isOldBrowser);
    
    // Don't show again if user dismissed
    const dismissed = localStorage.getItem("browser-notice-dismissed");
    if (dismissed) {
      setShowNotice(false);
    }
  }, []);

  const dismissNotice = () => {
    localStorage.setItem("browser-notice-dismissed", "true");
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <div className="flex w-full items-start justify-between">
          <div>
            <AlertTitle className="text-amber-600 dark:text-amber-400">Browser Compatibility</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              Your browser may not support all features. For the best experience, please use the latest version of Chrome, Firefox, Safari, or Edge.
            </AlertDescription>
          </div>
          <button 
            onClick={dismissNotice}
            className="ml-2 mt-1 text-amber-600 hover:text-amber-800 focus:outline-none dark:text-amber-400 dark:hover:text-amber-200"
          >
            ✕
          </button>
        </div>
      </Alert>
    </div>
  );
};

export default BrowserCompatibilityNotice;
