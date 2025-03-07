import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ClipboardCheck, Rocket, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PreDeploymentChecklist from "@/components/admin/PreDeploymentChecklist";
import { ChecklistCategory } from "@/components/admin/checklist/types";
import { useChecklist } from "@/components/admin/checklist/useChecklist";

const StatusIndicator = ({ status }: { status: 'completed' | 'in-progress' | 'pending' }) => {
  const colors = {
    'completed': 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    'pending': 'bg-red-500'
  };
  
  return (
    <div className={`w-3 h-3 rounded-full ${colors[status]}`}></div>
  );
};

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
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16 bg-gradient-to-b from-background to-muted/20">
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
              
              <Card className="mb-6">
                <CardContent className="pt-6">
                  {isLoading ? (
                    <>
                      <div className="mb-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                      <Skeleton className="h-2 w-full mb-6" />
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <ClipboardCheck className="h-5 w-5 mr-2 text-primary" />
                          <span>Overall Deployment Readiness</span>
                        </div>
                        <span className="text-sm font-medium">{deploymentProgress}%</span>
                      </div>
                      <Progress 
                        value={deploymentProgress} 
                        className={`h-2 mb-6 ${
                          deploymentProgress >= 90 
                            ? 'bg-green-100 [&>div]:bg-green-500' 
                            : 'bg-secondary [&>div]:bg-primary'
                        }`} 
                      />
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <DeploymentStatusCard 
                          category="Content" 
                          completion={getCompletionByCategory('content')}
                          status={getCategoryStatus('content')}
                        />
                        <DeploymentStatusCard 
                          category="Functionality" 
                          completion={getCompletionByCategory('functionality')}
                          status={getCategoryStatus('functionality')}
                        />
                        <DeploymentStatusCard 
                          category="Technical" 
                          completion={getCompletionByCategory('technical')}
                          status={getCategoryStatus('technical')}
                        />
                        <DeploymentStatusCard 
                          category="Integration" 
                          completion={getCompletionByCategory('integration')}
                          status={getCategoryStatus('integration')}
                        />
                        <DeploymentStatusCard 
                          category="Legal" 
                          completion={getCompletionByCategory('legal')}
                          status={getCategoryStatus('legal')}
                        />
                      </div>
                      
                      {highPriorityItems.length > 0 ? (
                        <div className="mt-6 text-red-600 dark:text-red-400 text-sm font-medium flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {highPriorityItems.length} high priority {highPriorityItems.length === 1 ? 'item' : 'items'} pending
                        </div>
                      ) : (
                        <div className="mt-6 text-green-600 dark:text-green-400 text-sm font-medium flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          All high priority items completed
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <Card>
                  <CardContent className="py-6">
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
                  </CardContent>
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
        </main>
        
        <Footer />
      </div>
    </>
  );
};

const DeploymentStatusCard = ({ 
  category, 
  completion, 
  status 
}: { 
  category: string;
  completion: number;
  status: 'completed' | 'in-progress' | 'pending';
}) => {
  const statusText = {
    'completed': 'Ready',
    'in-progress': 'In Progress',
    'pending': 'Needs Attention'
  };

  const getBgColor = () => {
    switch(status) {
      case 'completed': return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50';
      case 'in-progress': return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/50';
      case 'pending': return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50';
      default: return '';
    }
  };

  return (
    <div className="col-span-1">
      <Card className={`h-full border ${getBgColor()}`}>
        <CardContent className="p-4 text-center flex flex-col items-center justify-center">
          <div className="text-2xl font-bold mb-1">{completion}%</div>
          <div className="text-sm font-medium mb-2">{category}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <StatusIndicator status={status} />
            <span className="ml-1.5">{statusText[status]}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreDeployment;
