
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Helmet } from "react-helmet";

const ServerError = () => {
  useEffect(() => {
    console.error("500 Error: Server error encountered");
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Helmet>
        <title>Server Error | AI Spain Homes</title>
      </Helmet>
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-6xl font-bold text-gray-900">500</h1>
        <h2 className="text-2xl font-semibold text-gray-800">Server Error</h2>
        
        <Alert variant="destructive" className="my-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            We're experiencing some technical difficulties. Please try again later.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col space-y-3">
          <Button onClick={handleRefresh} size="lg" className="w-full">
            Refresh Page
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/"} size="lg" className="w-full">
            Return to Home
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          If the problem persists, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default ServerError;
