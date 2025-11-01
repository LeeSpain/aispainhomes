import React from "react";
import { 
  Search, Scale, TruckIcon, GraduationCap, Globe, Tv,
  ShieldCheck, Landmark, HeartPulse, Briefcase, Car, Home
} from "lucide-react";
import propertyMockup from "@/assets/property-app-mockup.png";
import aiAssistant from "@/assets/ai-assistant-visual.png";
import relocationSteps from "@/assets/relocation-steps.png";

const features = [
  {
    icon: Search,
    title: "AI Property Matching",
    description: "Advanced AI analyzes your preferences to find your perfect Spanish property from thousands of listings.",
  },
  {
    icon: ShieldCheck,
    title: "Relocation Guardian",
    description: "Your AI assistant guides you through every step of your Spanish relocation journey.",
  },
  {
    icon: Scale,
    title: "Legal Support",
    description: "Navigate NIE applications, visas, document translations, and legal requirements with ease.",
  },
  {
    icon: Landmark,
    title: "Financial Planning",
    description: "Get help with Spanish bank accounts, mortgages, currency exchange, and expat tax guidance.",
  },
  {
    icon: TruckIcon,
    title: "Moving Logistics",
    description: "Compare moving companies, customs guidance, and personalized relocation timelines.",
  },
  {
    icon: Tv,
    title: "Utilities Setup",
    description: "Simplified setup for electricity, water, internet, mobile plans, and home security.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare Navigation",
    description: "Healthcare registration, insurance options, and English-speaking medical professionals.",
  },
  {
    icon: GraduationCap,
    title: "Education Resources",
    description: "Find schools with filters for language, curriculum, fees, and enrollment guidance.",
  },
  {
    icon: Globe,
    title: "Community Integration",
    description: "Connect with expat communities, local events, and cultural adaptation resources.",
  },
  {
    icon: Car,
    title: "Transportation",
    description: "Public transport guidance, license requirements, and vehicle purchase assistance.",
  },
  {
    icon: Briefcase,
    title: "Work & Business",
    description: "Coworking spaces, business formation, digital nomad visas, and professional certifications.",
  },
  {
    icon: Home,
    title: "Lifestyle Integration",
    description: "Shopping, restaurants, childcare, pet care, and discover local seasonal events.",
  },
];

const Features = () => {
  return (
    <div className="relative py-32 overflow-hidden bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Complete Relocation Platform</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Everything You Need for Your
            <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Spanish Journey
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From property search to settling in, our AI-powered platform provides comprehensive support at every stage of your relocation.
          </p>
        </div>

        {/* Main Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          {/* Property Search Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border">
              <img 
                src={propertyMockup}
                alt="AI-powered property search mobile app interface"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                AI-Powered Property Discovery
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our intelligent platform analyzes thousands of properties across Spain to find your perfect match. Get personalized recommendations based on your preferences, budget, and lifestyle requirements.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="text-2xl font-bold text-primary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Properties Listed</div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="text-2xl font-bold text-primary mb-1">Daily</div>
                  <div className="text-sm text-muted-foreground">Smart Alerts</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Guardian Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div>
              <div className="inline-flex p-4 rounded-2xl bg-accent/10 text-accent mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Your Personal AI Guardian
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Get 24/7 support from your AI Guardian throughout your entire relocation journey. From answering questions about documentation to connecting you with local services, your Guardian is always ready to help.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Instant answers to relocation questions</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Personalized recommendations and guidance</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Connection to vetted service providers</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-3xl"></div>
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border">
              <img 
                src={aiAssistant}
                alt="AI Guardian assistant providing relocation support"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Services Section */}
        <div className="mb-16">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Your Complete Relocation Roadmap
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Expert guidance and comprehensive services at every stage of your Spanish journey.
            </p>
          </div>

          {/* Featured Services - Large Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Legal Support - Featured */}
            <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-card to-accent/5 border border-primary/20 p-8 hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Scale className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-bold mb-3">Legal & Documentation</h4>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Navigate Spanish bureaucracy with confidence. Get expert guidance on NIE applications, visa requirements, document translations, and all legal necessities for your relocation.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium">NIE Applications</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium">Visa Support</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium">Translations</span>
                </div>
              </div>
            </div>

            {/* Financial Planning - Featured */}
            <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-accent/5 via-card to-primary/5 border border-accent/20 p-8 hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Landmark className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-bold mb-3">Financial Planning</h4>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Comprehensive financial support for your move. From opening Spanish bank accounts to understanding mortgages, currency exchange, and expat tax implications.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-xs font-medium">Bank Accounts</span>
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-xs font-medium">Mortgages</span>
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-xs font-medium">Tax Guidance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <TruckIcon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Moving Logistics</h4>
                <p className="text-sm text-muted-foreground">Compare movers, customs guidance & timeline planning</p>
              </div>
            </div>

            <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Tv className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Utilities Setup</h4>
                <p className="text-sm text-muted-foreground">Electricity, water, internet & mobile plan assistance</p>
              </div>
            </div>

            <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Healthcare</h4>
                <p className="text-sm text-muted-foreground">Registration, insurance & finding doctors</p>
              </div>
            </div>

            <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Education</h4>
                <p className="text-sm text-muted-foreground">Schools, enrollment & credential validation</p>
              </div>
            </div>

            <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Globe className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Community</h4>
                <p className="text-sm text-muted-foreground">Connect with expats & local communities</p>
              </div>
            </div>

            <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Car className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Transportation</h4>
                <p className="text-sm text-muted-foreground">Transit info, licenses & vehicle options</p>
              </div>
            </div>

            <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Work & Business</h4>
                <p className="text-sm text-muted-foreground">Coworking spaces, visas & setup support</p>
              </div>
            </div>

            <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Home className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Lifestyle</h4>
                <p className="text-sm text-muted-foreground">Shopping, dining & local events guide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
