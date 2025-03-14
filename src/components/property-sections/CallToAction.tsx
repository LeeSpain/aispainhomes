
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, Palmtree } from "lucide-react";

const CallToAction = () => {
  return (
    <>
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Start Your Spanish Property Journey Today</h2>
        <p className="text-lg text-muted-foreground mb-8">
          With our AI-powered property search and comprehensive guardian services, finding and relocating to your dream Spanish home has never been easier. Join now to access our complete suite of tools and services.
        </p>
        <Link to="/register">
          <Button size="lg" className="px-8 bg-gradient-to-r from-primary to-accent">
            <Briefcase className="mr-2 h-5 w-5" />
            Join Now to Find Your Perfect Home
          </Button>
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">
          Start with a 7-day free trial. Cancel anytime.
        </p>
      </div>
      
      <div className="py-16 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 border border-border">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <Palmtree className="h-32 w-32 text-primary" />
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Join thousands of satisfied clients who have found their perfect Spanish property with our AI-powered platform and comprehensive relocation support.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/register">
                      <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent">
                        Register Now
                      </Button>
                    </Link>
                    <Link to="/ai-guardian">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Learn More About AI Guardian
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallToAction;
