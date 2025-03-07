
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WifiOff, Wifi } from "lucide-react";

const OfflineNotice = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
        <WifiOff className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertTitle className="text-red-600 dark:text-red-400">You're offline</AlertTitle>
        <AlertDescription className="text-red-700 dark:text-red-300">
          Some features may not be available. We'll keep trying to reconnect.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default OfflineNotice;
