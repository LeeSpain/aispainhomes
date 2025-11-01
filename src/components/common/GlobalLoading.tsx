
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Helmet } from "react-helmet";

const GlobalLoading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const timer = setTimeout(() => {
      setProgress(30);
    }, 100);
    
    const timer2 = setTimeout(() => {
      setProgress(60);
    }, 200);
    
    const timer3 = setTimeout(() => {
      setProgress(90);
    }, 400);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <Helmet>
        <title>Loading... | AI Homes Spain</title>
      </Helmet>
      <div className="w-full max-w-md px-6">
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-bold">AI Homes Spain</h2>
          <p className="text-muted-foreground">Loading your personalized experience...</p>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Please wait while we prepare everything for you
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoading;
