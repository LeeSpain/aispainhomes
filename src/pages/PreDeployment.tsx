
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import PreDeploymentChecklist from "@/components/admin/PreDeploymentChecklist";
import { useChecklist } from "@/components/admin/checklist/useChecklist";
import DeploymentSummary from "@/components/admin/checklist/DeploymentSummary";

const PreDeployment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  
  const {
    getProgress,
    getCompletionByCategory,
    getHighPriorityIncomplete,
    getCategoryStatus,
    isDeploymentReady
  } = useChecklist();
  
  const deploymentProgress = getProgress();
  const highPriorityItems = getHighPriorityIncomplete();
  const readyForDeployment = isDeploymentReady();
  
  const handleDeploy = () => {
    if (!readyForDeployment) {
      toast.error("Cannot deploy until all high priority items are completed");
      return;
    }
    
    setIsDeploying(true);
    
    setTimeout(() => {
      setIsDeploying(false);
      toast.success("Site successfully deployed! 🚀");
      navigate('/admin');
    }, 3000);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Pre-Deployment Checklist | AI Spain Homes</title>
      </Helmet>
      
      <div className="pt-28 pb-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="mb-6" 
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Button>
            
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">Pre-Deployment Checklist</h1>
                {!isLoading && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full 
                          ${deploymentProgress < 50 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                            : deploymentProgress < 80 
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' 
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                          {deploymentProgress}% Complete
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Overall completion status</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {!isLoading && readyForDeployment && (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Ready for Deployment
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-4 max-w-3xl">
                This checklist outlines all items that need to be completed before the site can go live.
                Track your progress and ensure all critical items are addressed.
              </p>
              
              <DeploymentSummary 
                isLoading={isLoading}
                deploymentProgress={deploymentProgress}
                getCompletionByCategory={getCompletionByCategory}
                getCategoryStatus={getCategoryStatus}
                highPriorityItems={highPriorityItems}
              />
            </div>
            
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <Card>
                  <div className="py-6 px-6">
                    <Skeleton className="h-8 w-3/4 mb-6" />
                    <Skeleton className="h-4 w-full mb-4" />
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="mb-6">
                        <Skeleton className="h-6 w-1/3 mb-4" />
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="flex gap-2 mb-4">
                            <Skeleton className="h-4 w-4" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-full mb-2" />
                              <Skeleton className="h-3 w-5/6" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <PreDeploymentChecklist />
              )}
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => navigate('/admin')}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to Dashboard
                </Button>
                
                <Button 
                  variant={readyForDeployment ? "default" : "outline"}
                  className="gap-2"
                  disabled={!readyForDeployment || isDeploying}
                  onClick={handleDeploy}
                >
                  {isDeploying ? (
                    <>
                      <Rocket className="h-4 w-4 animate-pulse" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4" />
                      Deploy to Production
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default PreDeployment;
