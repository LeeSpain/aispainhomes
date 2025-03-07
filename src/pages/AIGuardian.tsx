
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Calendar, FileText, Passport, Landmark, Banknote, Users, School, Building, MessageSquare } from 'lucide-react';

const AIGuardian = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleGetStarted = () => {
    if (!user) {
      navigate('/login?redirect=ai-guardian');
    } else {
      navigate('/subscription');
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Guardian | SunnyHomeFinder</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold mb-4">AI Guardian</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Your personal AI assistant for every step of your relocation journey to Spain
                </p>
              </div>
              
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-12">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-6">
                  <div className="prose prose-lg max-w-none">
                    <p>
                      Relocating to a new country can be overwhelming, but with AI Guardian, you'll have a personal assistant guiding you through every step of the process.
                    </p>
                    <p>
                      Our AI-powered service provides personalized guidance for all aspects of your move to Spain, from legal requirements to finding schools and healthcare providers.
                    </p>
                    <p>
                      With multilingual support and 24/7 availability, AI Guardian ensures you never feel lost or confused during your relocation journey.
                    </p>
                    
                    <div className="my-8 flex justify-center">
                      <Button size="lg" onClick={handleGetStarted} className="px-8">
                        Get Started with AI Guardian
                      </Button>
                    </div>
                    
                    <h3>How It Works</h3>
                    <p>
                      Once you subscribe to the AI Guardian service, you'll gain access to:
                    </p>
                    <ul>
                      <li>A personalized relocation timeline and checklist</li>
                      <li>Document preparation guidance</li>
                      <li>Visa and residency assistance</li>
                      <li>Housing recommendations</li>
                      <li>School, healthcare, and banking setup support</li>
                      <li>Cultural integration resources</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <Calendar className="h-5 w-5 text-primary mb-2" />
                        <CardTitle>Personalized Timeline</CardTitle>
                        <CardDescription>Custom relocation schedule based on your specific needs</CardDescription>
                      </CardHeader>
                      <CardContent>
                        Our AI creates a tailored timeline with reminders for important deadlines and tasks.
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <FileText className="h-5 w-5 text-primary mb-2" />
                        <CardTitle>Document Checklist</CardTitle>
                        <CardDescription>Never miss an important document</CardDescription>
                      </CardHeader>
                      <CardContent>
                        Get a comprehensive checklist of all documents needed for your move and residency application.
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <Passport className="h-5 w-5 text-primary mb-2" />
                        <CardTitle>Visa & Residency</CardTitle>
                        <CardDescription>Navigate Spanish immigration requirements</CardDescription>
                      </CardHeader>
                      <CardContent>
                        Step-by-step guidance through visa applications and residency permits.
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <Landmark className="h-5 w-5 text-primary mb-2" />
                        <CardTitle>Legal & Tax Guidance</CardTitle>
                        <CardDescription>Understand your legal and tax obligations</CardDescription>
                      </CardHeader>
                      <CardContent>
                        Clear explanations of Spanish tax system and legal requirements for expats.
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <Banknote className="h-5 w-5 text-primary mb-2" />
                        <CardTitle>Banking Setup</CardTitle>
                        <CardDescription>Financial services guidance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        Recommendations for banking services and help setting up accounts in Spain.
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <Building className="h-5 w-5 text-primary mb-2" />
                        <CardTitle>Housing Support</CardTitle>
                        <CardDescription>Find your perfect home</CardDescription>
                      </CardHeader>
                      <CardContent>
                        Property recommendations and guidance through the Spanish property market.
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <School className="h-5 w-5 text-primary mb-2" />
                        <CardTitle>Education & Healthcare</CardTitle>
                        <CardDescription>Essential services for families</CardDescription>
                      </CardHeader>
                      <CardContent>
                        Help finding schools for children and navigating the Spanish healthcare system.
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <Users className="h-5 w-5 text-primary mb-2" />
                        <CardTitle>Cultural Integration</CardTitle>
                        <CardDescription>Adapt to your new home</CardDescription>
                      </CardHeader>
                      <CardContent>
                        Resources for language learning and understanding Spanish culture and customs.
                      </CardContent>
                    </Card>
                    
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <MessageSquare className="h-5 w-5 text-primary mb-2" />
                        <CardTitle>24/7 AI Support</CardTitle>
                        <CardDescription>Always there when you need help</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">
                          Ask questions anytime and get immediate answers about your relocation to Spain.
                        </p>
                        <Button onClick={handleGetStarted}>Try AI Guardian Now</Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="pricing" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Guardian Premium</CardTitle>
                      <CardDescription>Full relocation support package</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">€19.99</span>
                        <span className="text-muted-foreground"> / month</span>
                      </div>
                      <p className="mb-6">Includes all Premium Plan features plus comprehensive AI relocation assistance:</p>
                      <ul className="space-y-2 mb-6">
                        {[
                          'AI Guardian for full relocation support',
                          'Personalized relocation timeline',
                          'Document checklist and reminders',
                          'Visa and residency guidance',
                          'Tax planning assistance',
                          'Banking setup support',
                          'Cultural integration resources',
                          'Priority customer support',
                          '24/7 AI assistance'
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button size="lg" className="w-full" onClick={handleGetStarted}>
                        Get Started
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-4">
                        No long-term contract. Cancel anytime.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AIGuardian;
