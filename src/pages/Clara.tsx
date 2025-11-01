import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sparkles, 
  ShieldCheck, 
  Home, 
  Scale, 
  Landmark, 
  HeartPulse, 
  GraduationCap, 
  Globe, 
  Zap,
  CheckCircle2,
  Calendar,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  Target,
  ChevronRight,
  Brain,
  Star
} from 'lucide-react';
import claraHero from '@/assets/clara-ai-hero.jpg';
import claraServices from '@/assets/clara-services.jpg';

const Clara = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!user) {
      navigate('/login?redirect=clara');
    } else {
      navigate('/subscription');
    }
  };

  const coreFeatures = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Property Matching",
      description: "AI analyzes your preferences to find perfect Spanish properties tailored to your lifestyle."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Availability",
      description: "Get instant answers and support anytime, in your preferred language."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Journey",
      description: "Custom relocation plan based on your specific needs and timeline."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Complete Guidance",
      description: "From property search to settling in—comprehensive support every step."
    }
  ];

  const serviceCategories = [
    {
      icon: <Home className="w-6 h-6" />,
      title: "Property Services",
      items: [
        "AI-powered property matching",
        "Daily top 10 recommendations",
        "Real-time alerts",
        "Virtual tour coordination"
      ]
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Legal Support",
      items: [
        "NIE application guidance",
        "Lawyer matching",
        "Document translation",
        "Visa support"
      ]
    },
    {
      icon: <Landmark className="w-6 h-6" />,
      title: "Financial Services",
      items: [
        "Bank account setup",
        "Mortgage comparison",
        "Tax guidance",
        "Insurance options"
      ]
    },
    {
      icon: <HeartPulse className="w-6 h-6" />,
      title: "Healthcare",
      items: [
        "Registration guidance",
        "Insurance comparison",
        "Doctor directory",
        "Emergency services info"
      ]
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Education",
      items: [
        "School finder",
        "Enrollment guidance",
        "Language resources",
        "Credential validation"
      ]
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Community",
      items: [
        "Expat connections",
        "Local events",
        "Cultural resources",
        "Sports & clubs"
      ]
    }
  ];

  const stats = [
    { value: "50K+", label: "Properties Matched" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "AI Support" },
    { value: "10+", label: "Service Categories" }
  ];

  return (
    <>
      <Helmet>
        <title>Clara - Your AI Relocation Assistant | AI Homes Spain</title>
        <meta name="description" content="Meet Clara, your personal AI assistant for finding properties and relocating to Spain. Get 24/7 support, smart recommendations, and comprehensive guidance." />
        <meta name="keywords" content="Clara AI, Spanish property assistant, relocation AI, property search assistant, Spain relocation guide" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative pt-28 pb-20 md:pb-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,140,0,0.08),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.08),transparent_50%)]"></div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm font-medium text-primary">Powered by AI</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                    Meet Clara
                    <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Your AI Relocation Expert
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                    Your personal AI assistant that makes finding your dream Spanish property and relocating effortless. Available 24/7 to guide you through every step of your journey.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <Button size="lg" onClick={handleGetStarted} className="px-8 py-6 text-lg group">
                      Start with Clara
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button size="lg" variant="outline" asChild className="px-8 py-6 text-lg">
                      <Link to="/about">Learn More</Link>
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Trusted by 5,000+ families</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full"></div>
                  <img 
                    src={claraHero} 
                    alt="Clara AI assistant helping find Spanish properties" 
                    className="relative rounded-2xl shadow-2xl border border-white/10"
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Stats Bar */}
          <section className="py-12 bg-gradient-to-r from-primary to-accent text-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm md:text-base text-white/90">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Core Features */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Core Features</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                  Why Clara is Your Perfect Assistant
                </h2>
                <p className="text-xl text-muted-foreground">
                  Advanced AI technology combined with local expertise to simplify your Spanish property search and relocation.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {coreFeatures.map((feature, index) => (
                  <div key={index} className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-border">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* How Clara Works */}
          <section className="py-20 md:py-28 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">How It Works</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                  Your Journey with Clara
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Share Your Preferences</h3>
                  <p className="text-muted-foreground">
                    Tell Clara about your ideal property, budget, location, and lifestyle preferences.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Get Smart Matches</h3>
                  <p className="text-muted-foreground">
                    Receive personalized property recommendations and comprehensive relocation guidance.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Settle In Spain</h3>
                  <p className="text-muted-foreground">
                    Follow Clara's step-by-step guidance through every aspect of your relocation.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <Button size="lg" onClick={handleGetStarted} className="px-10 py-6 text-lg">
                  Start Your Journey with Clara
                </Button>
              </div>
            </div>
          </section>
          
          {/* Services Overview */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Comprehensive Services</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                    Everything You Need in One Place
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Clara provides end-to-end support for your Spanish relocation, covering every aspect from property search to settling into your new community.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Personalized property recommendations",
                      "Legal and financial guidance",
                      "Healthcare and education support",
                      "Community integration resources",
                      "24/7 multilingual assistance"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <img 
                    src={claraServices} 
                    alt="Professional using Clara's relocation services" 
                    className="rounded-2xl shadow-2xl border border-white/10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceCategories.map((category, index) => (
                  <div key={index} className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-border">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-4">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Pricing CTA */}
          <section className="py-20 md:py-28 bg-gradient-to-br from-primary/10 via-accent/10 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-primary/30 relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent/20 border border-accent/30">
                      <TrendingUp className="w-4 h-4 text-accent-foreground" />
                      <span className="text-sm font-semibold text-accent-foreground">7-Day Free Trial</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                      Start Your Spanish Journey Today
                    </h2>
                    <div className="mb-6">
                      <span className="text-6xl font-bold">€24.99</span>
                      <span className="text-2xl text-muted-foreground">/month</span>
                    </div>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                      Get complete access to Clara and all relocation services. No credit card required for trial. Cancel anytime.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                      <Button size="lg" onClick={handleGetStarted} className="px-10 py-6 text-lg">
                        Start Free Trial
                      </Button>
                      <Button size="lg" variant="outline" asChild className="px-10 py-6 text-lg">
                        <Link to="/subscription">View All Features</Link>
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Join thousands of satisfied customers who found their dream Spanish home with Clara
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Clara;
