
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShieldCheck, Calendar, FileText, Landmark, 
  Banknote, Users, School, Building, 
  MessageSquare, Check, CreditCard, ChevronRight, Globe, Sparkles
} from 'lucide-react';

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
        <meta name="description" content="AI Guardian - Your personal AI assistant for every step of your relocation journey to Spain" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16 bg-gradient-to-b from-background via-background to-background/80">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Hero section */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">AI Guardian</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Your personal AI assistant for every step of your relocation journey to Spain
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    size="lg" 
                    onClick={handleGetStarted} 
                    className="px-8 gap-2"
                  >
                    Get Started <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => setActiveTab('features')}
                    className="px-8"
                  >
                    Explore Features
                  </Button>
                </div>
              </div>
              
              {/* Stats section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
                  <Globe className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Multilingual</h3>
                  <p className="text-muted-foreground">Support in 5 languages for seamless communication</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
                  <Sparkles className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
                  <p className="text-muted-foreground">Advanced technology for personalized assistance</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
                  <MessageSquare className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                  <p className="text-muted-foreground">Always available to answer your questions</p>
                </div>
              </div>
              
              <Separator className="my-12" />
              
              {/* Tabs section */}
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-12">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-6">
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p className="text-xl leading-relaxed mb-6">
                      Relocating to a new country can be overwhelming, but with AI Guardian, you'll have a personal assistant guiding you through every step of the process.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                      <div className="bg-card border rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-primary" /> Personalized Guidance
                        </h3>
                        <p className="text-muted-foreground">
                          AI Guardian analyzes your specific situation to create a customized relocation plan tailored to your needs.
                        </p>
                      </div>
                      <div className="bg-card border rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" /> Timeline Management
                        </h3>
                        <p className="text-muted-foreground">
                          Stay on track with a detailed timeline and reminders for important deadlines throughout your relocation journey.
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xl leading-relaxed mb-6">
                      Our AI-powered service provides personalized guidance for all aspects of your move to Spain, from legal requirements to finding schools and healthcare providers.
                    </p>
                    
                    <div className="my-10 flex justify-center">
                      <Button size="lg" onClick={handleGetStarted} className="px-8 gap-2">
                        Get Started Now <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4">How It Works</h3>
                    <p className="mb-6">
                      Once you subscribe to the AI Guardian service, you'll gain access to:
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span>A personalized relocation timeline and checklist</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span>Document preparation guidance with templates and examples</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span>Visa and residency assistance with step-by-step instructions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span>Housing recommendations based on your preferences</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span>School, healthcare, and banking setup support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span>Cultural integration resources and language learning tools</span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <h4 className="font-medium mb-2">How AI Guardian helps you:</h4>
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
                        <Button onClick={handleGetStarted} className="w-full">Try AI Guardian Now</Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="pricing" className="mt-6">
                  <div className="max-w-xl mx-auto">
                    <Card className="border-primary">
                      <CardHeader className="bg-primary/5 border-b">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-2xl">AI Guardian Premium</CardTitle>
                            <CardDescription className="text-lg">Full relocation support package</CardDescription>
                          </div>
                          <ShieldCheck className="h-10 w-10 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="mb-6 text-center">
                          <span className="text-5xl font-bold">€19.99</span>
                          <span className="text-muted-foreground text-lg"> / month</span>
                          <p className="text-sm text-muted-foreground mt-2">No long-term contract. Cancel anytime.</p>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-4 mb-8">
                          <h3 className="font-semibold text-lg">All-inclusive package includes:</h3>
                          <ul className="space-y-3">
                            {[
                              'AI Guardian for full relocation support',
                              'Personalized relocation timeline',
                              'Document checklist and reminders',
                              'Visa and residency guidance',
                              'Tax planning assistance',
                              'Banking setup support',
                              'Cultural integration resources',
                              'Priority customer support',
                              '24/7 AI assistance in 5 languages'
                            ].map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-primary mr-3 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-primary/5 p-4 rounded-lg border mb-8">
                          <p className="text-sm">
                            <strong>Special Offer:</strong> Sign up now and get your first month at 50% off. Use code <span className="font-mono bg-primary/10 px-2 py-0.5 rounded">WELCOME50</span> at checkout.
                          </p>
                        </div>
                        
                        <Button size="lg" className="w-full py-6 text-lg" onClick={handleGetStarted}>
                          Get Started Now
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <div className="mt-8 text-center">
                      <p className="text-muted-foreground">
                        Questions about AI Guardian? <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/contact')}>Contact our team</Button>
                      </p>
                    </div>
                  </div>
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
