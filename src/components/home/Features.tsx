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
    <div className="relative py-32 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={featuresImage}
          alt="AI property network visualization"
          className="w-full h-full object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Complete Relocation Platform</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Everything You Need for
            <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Spanish Journey
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From property search to settling in, our AI-powered platform guides you every step of the way.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/20">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              All This for Just €24.99/Month
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              One simple subscription includes unlimited access to all features, AI-powered property matching, daily alerts, and complete relocation support.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-accent/20 border border-accent/30">
              <span className="text-sm font-semibold text-accent-foreground">🎉 7-Day Free Trial • No card required until trial ends</span>
            </div>
            <Link to="/register">
              <Button size="lg" className="px-10 py-6 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
