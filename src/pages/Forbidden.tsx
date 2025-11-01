
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LockIcon } from "lucide-react";
import { Helmet } from "react-helmet";

const Forbidden = () => {
  useEffect(() => {
    console.error("403 Error: User attempted to access forbidden resource");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Helmet>
        <title>Access Forbidden | AI Homes Spain</title>
      </Helmet>
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-6xl font-bold text-gray-900">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800">Access Forbidden</h2>
        
        <Alert variant="destructive" className="my-6">
          <LockIcon className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access this resource.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col space-y-3">
          <Button onClick={() => window.location.href = "/login"} size="lg" className="w-full">
            Sign In
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/"} size="lg" className="w-full">
            Return to Home
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          If you believe this is an error, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default Forbidden;
