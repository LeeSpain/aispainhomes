
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Calendar, FileText, CreditCard, Landmark, Banknote, Building, School, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const FeaturesSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!user) {
      navigate('/login?redirect=clara');
    } else {
      navigate('/subscription');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="features">
      <Card>
        <CardHeader>
          <Calendar className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Personalized Timeline</CardTitle>
          <CardDescription>Custom relocation schedule based on your specific needs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Our AI creates a tailored timeline with reminders for important deadlines and tasks.</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Smart deadline planning</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Automated reminders</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Progress tracking</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <FileText className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Document Checklist</CardTitle>
          <CardDescription>Never miss an important document</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Get a comprehensive checklist of all documents needed for your move and residency application.</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Document templates</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Translation assistance</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Secure document storage</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CreditCard className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Visa & Residency</CardTitle>
          <CardDescription>Navigate Spanish immigration requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Step-by-step guidance through visa applications and residency permits.</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Visa requirement analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Application form guidance</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Interview preparation</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Landmark className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Legal & Tax Guidance</CardTitle>
          <CardDescription>Understand your legal and tax obligations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Clear explanations of Spanish tax system and legal requirements for expats.</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Tax optimization advice</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Legal requirement checklist</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Professional referrals</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Banknote className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Banking Setup</CardTitle>
          <CardDescription>Financial services guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Recommendations for banking services and help setting up accounts in Spain.</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Bank comparisons</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Account setup procedures</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Currency exchange advice</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Building className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Housing Support</CardTitle>
          <CardDescription>Find your perfect home</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Property recommendations and guidance through the Spanish property market.</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Personalized property search</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Rental contract review</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Neighborhood insights</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <School className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Education & Healthcare</CardTitle>
          <CardDescription>Essential services for families</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Help finding schools for children and navigating the Spanish healthcare system.</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">School comparisons</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Healthcare registration</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Doctor and specialist referrals</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Users className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Cultural Integration</CardTitle>
          <CardDescription>Adapt to your new home</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Resources for language learning and understanding Spanish culture and customs.</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Language learning resources</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Local customs guidance</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">Community connection</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <MessageSquare className="h-6 w-6 text-primary mb-2" />
          <CardTitle>24/7 AI Support</CardTitle>
          <CardDescription>Always there when you need help</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Ask questions anytime and get immediate answers about your relocation to Spain.
          </p>
          <div className="bg-primary/5 p-4 rounded-lg border mb-6">
            <h4 className="font-medium mb-2">How Clara helps you:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-1" />
                <span className="text-sm">Instant answers to your questions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-1" />
                <span className="text-sm">Support in multiple languages</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-1" />
                <span className="text-sm">Continuous learning from your preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-1" />
                <span className="text-sm">Proactive suggestions and reminders</span>
              </li>
            </ul>
          </div>
          <Button onClick={handleGetStarted} className="w-full">Try Clara Now</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturesSection;
