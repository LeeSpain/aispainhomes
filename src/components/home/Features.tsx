
import React from "react";
import { 
  Building2, Search, Globe, Mail, Scale, Tv, TruckIcon, 
  GraduationCap, Heart, BellRing, BarChart3, Sun, Palmtree,
  ShieldCheck, Landmark, HeartPulse, Briefcase, Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Search className="h-12 w-12 text-primary" />,
    title: "AI-Powered Property Search",
    description: "Our advanced AI analyzes your preferences to find your ideal Spanish property, filtering through thousands of listings to match your exact criteria.",
  },
  {
    icon: <ShieldCheck className="h-12 w-12 text-primary" />,
    title: "Complete Relocation Guardian",
    description: "Your AI Guardian provides personalized guidance through every step of your Spanish relocation journey, from property search to settling in.",
  },
  {
    icon: <Scale className="h-12 w-12 text-primary" />,
    title: "Legal & Documentation Support",
    description: "Navigate Spanish bureaucracy with ease through our guidance on NIE applications, visa support, document translations, and legal requirements.",
  },
  {
    icon: <Landmark className="h-12 w-12 text-primary" />,
    title: "Financial Planning Assistance",
    description: "Get help with Spanish bank accounts, mortgage comparisons, currency exchange monitoring, and understanding tax implications for expats.",
  },
  {
    icon: <TruckIcon className="h-12 w-12 text-primary" />,
    title: "Relocation Logistics",
    description: "Compare moving companies, understand customs regulations, find temporary accommodation, and create a personalized moving timeline and checklist.",
  },
  {
    icon: <Tv className="h-12 w-12 text-primary" />,
    title: "Utilities & Home Setup",
    description: "Simplify setting up electricity, water, internet, mobile plans, and home security with provider comparisons and registration assistance.",
  },
  {
    icon: <HeartPulse className="h-12 w-12 text-primary" />,
    title: "Healthcare Navigation",
    description: "Access guidance on healthcare registration, insurance options, finding English-speaking medical professionals, and emergency services.",
  },
  {
    icon: <GraduationCap className="h-12 w-12 text-primary" />,
    title: "Education Resources",
    description: "Find schools and universities with our filters for language, curriculum, and fees, plus guidance on enrollment and credential validation.",
  },
  {
    icon: <Globe className="h-12 w-12 text-primary" />,
    title: "Community Integration",
    description: "Connect with expat communities, discover local events, find language exchange partners, and access cultural adaptation resources.",
  },
  {
    icon: <Car className="h-12 w-12 text-primary" />,
    title: "Transportation Guidance",
    description: "Navigate public transport, understand driver's license requirements, and explore vehicle purchase options and regional travel planning.",
  },
  {
    icon: <Briefcase className="h-12 w-12 text-primary" />,
    title: "Work & Business Support",
    description: "Access information on coworking spaces, business formation, digital nomad visas, and professional certification transfers.",
  },
  {
    icon: <Heart className="h-12 w-12 text-primary" />,
    title: "Lifestyle Support",
    description: "Discover shopping resources, restaurant recommendations, childcare services, pet care options, and seasonal events in your new area.",
  },
];

const Features = () => {
  return (
    <div className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <ShieldCheck className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium uppercase tracking-wider">Complete Relocation Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Your Comprehensive Solution for Spanish Relocation
          </h2>
          <p className="mt-4 text-xl text-muted-foreground text-balance">
            From finding your dream property to settling into your new Spanish lifestyle, our AI platform provides personalized guidance every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-black/60 backdrop-blur-sm border border-primary/10 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 flex flex-col"
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground flex-grow">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-xl text-muted-foreground">
              All these services are included in one simple subscription for just €9.99/month, providing you with comprehensive support throughout your Spanish property search and relocation journey.
            </p>
          </div>
          
          <Link to="/ai-guardian">
            <Button size="lg" className="px-8 bg-gradient-to-r from-primary to-accent">
              Explore AI Guardian Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;
