import React from "react";
import { 
  Search, Scale, TruckIcon, GraduationCap, Globe, Tv,
  ShieldCheck, Landmark, HeartPulse, Briefcase, Car, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import featuresImage from "@/assets/features-bg.jpg";

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

        {/* Main Feature Showcase - Bento Grid Style */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Large Featured Card - AI Property Matching */}
          <div className="lg:col-span-2 lg:row-span-2 group relative p-10 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="inline-flex p-4 rounded-2xl bg-primary/20 text-primary mb-6">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">AI-Powered Property Matching</h3>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Our advanced artificial intelligence analyzes thousands of properties across Spain to find your perfect match. Simply tell us your preferences, and watch as our AI curates a personalized selection tailored to your lifestyle, budget, and dreams.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-background/50 border border-border text-sm">
                  <span className="font-semibold">500+</span> Properties
                </div>
                <div className="px-4 py-2 rounded-full bg-background/50 border border-border text-sm">
                  <span className="font-semibold">Daily</span> Updates
                </div>
                <div className="px-4 py-2 rounded-full bg-background/50 border border-border text-sm">
                  <span className="font-semibold">Smart</span> Alerts
                </div>
              </div>
            </div>
          </div>

          {/* Guardian Service Card */}
          <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="inline-flex p-3 rounded-xl bg-accent/20 text-accent mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Guardian</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your personal AI assistant guides you through every step of relocation with 24/7 support and expert advice.
              </p>
            </div>
          </div>

          {/* Legal Support Card */}
          <div className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Legal & Documentation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Navigate NIE applications, visas, and all legal requirements with comprehensive guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Landmark className="h-5 w-5" />
            </div>
            <h4 className="font-semibold mb-2">Financial Planning</h4>
            <p className="text-sm text-muted-foreground">Bank accounts, mortgages & tax guidance</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <TruckIcon className="h-5 w-5" />
            </div>
            <h4 className="font-semibold mb-2">Moving Logistics</h4>
            <p className="text-sm text-muted-foreground">Compare movers & plan your relocation</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Tv className="h-5 w-5" />
            </div>
            <h4 className="font-semibold mb-2">Utilities Setup</h4>
            <p className="text-sm text-muted-foreground">Electricity, water, internet & mobile</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <HeartPulse className="h-5 w-5" />
            </div>
            <h4 className="font-semibold mb-2">Healthcare</h4>
            <p className="text-sm text-muted-foreground">Registration, insurance & doctors</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h4 className="font-semibold mb-2">Education</h4>
            <p className="text-sm text-muted-foreground">Schools, enrollment & credentials</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Globe className="h-5 w-5" />
            </div>
            <h4 className="font-semibold mb-2">Community</h4>
            <p className="text-sm text-muted-foreground">Connect with expats & locals</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Car className="h-5 w-5" />
            </div>
            <h4 className="font-semibold mb-2">Transportation</h4>
            <p className="text-sm text-muted-foreground">Public transit, licenses & vehicles</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Briefcase className="h-5 w-5" />
            </div>
            <h4 className="font-semibold mb-2">Work & Business</h4>
            <p className="text-sm text-muted-foreground">Coworking, visas & certifications</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto">
          <div className="relative p-10 md:p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                All-Inclusive Access for Just €24.99/Month
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                One simple subscription unlocks unlimited property matching, daily alerts, AI Guardian support, and complete relocation assistance.
              </p>
              <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-accent/20 border border-accent/30">
                <span className="text-sm font-semibold text-accent-foreground">🎉 Start with a 7-Day Free Trial</span>
              </div>
              <div className="mb-8">
                <Link to="/register">
                  <Button size="lg" className="px-10 py-6 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg">
                    Begin Your Journey Free
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                No commitment required • Cancel anytime • Join hundreds of satisfied customers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
