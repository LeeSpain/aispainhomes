
import { Helmet } from "react-helmet";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PreDeploymentChecklist from "@/components/admin/PreDeploymentChecklist";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PreDeployment = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Pre-Deployment Checklist | AI Spain Homes</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="mb-6" 
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Pre-Deployment Checklist</h1>
            <p className="text-muted-foreground mb-8">
              Complete these items before launching the site
            </p>
            
            <div className="max-w-4xl mx-auto">
              <PreDeploymentChecklist />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PreDeployment;
