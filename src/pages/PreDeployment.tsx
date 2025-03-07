
import { Helmet } from "react-helmet";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PreDeploymentChecklist from "@/components/admin/PreDeploymentChecklist";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clipboard, ClipboardCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

const PreDeployment = () => {
  const navigate = useNavigate();
  const [deploymentProgress, setDeploymentProgress] = useState(42);
  
  useEffect(() => {
    // Simulate progress calculation
    const timer = setTimeout(() => {
      setDeploymentProgress(47);
    }, 1000);
    
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
              <h1 className="text-3xl font-bold mb-2">Pre-Deployment Checklist</h1>
              <p className="text-muted-foreground mb-4 max-w-3xl">
                This checklist outlines all items that need to be completed before the site can go live.
                Track your progress and ensure all critical items are addressed.
              </p>
              
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Clipboard className="h-5 w-5 mr-2 text-primary" />
                      <span>Overall Deployment Readiness</span>
                    </div>
                    <span className="text-sm font-medium">{deploymentProgress}%</span>
                  </div>
                  <Progress value={deploymentProgress} className="h-2" />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${deploymentProgress < 30 ? 'bg-red-500' : 'bg-green-500'} mr-2`}></div>
                      <span className="text-sm">Content Ready</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${deploymentProgress < 50 ? 'bg-red-500' : 'bg-yellow-500'} mr-2`}></div>
                      <span className="text-sm">Functionality Tested</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${deploymentProgress < 70 ? 'bg-yellow-500' : 'bg-green-500'} mr-2`}></div>
                      <span className="text-sm">Technical Review</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${deploymentProgress < 90 ? 'bg-red-500' : 'bg-green-500'} mr-2`}></div>
                      <span className="text-sm">Legal Compliance</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <PreDeploymentChecklist />
              
              <div className="flex justify-end mt-8">
                <Button 
                  variant="default" 
                  className="gap-2"
                  onClick={() => navigate('/admin')}
                >
                  Return to Dashboard
                  <ArrowRight className="h-4 w-4" />
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

export default PreDeployment;
