
import React from "react";
import { 
  Building2, Search, Globe, Mail, Scale, Tv, TruckIcon, 
  GraduationCap, Heart, BellRing, BarChart3 
} from "lucide-react";

const features = [
  {
    icon: <Search className="h-12 w-12 text-primary" />,
    title: "AI-Powered Property Search",
    description: "Our advanced AI analyzes your preferences to find your ideal Spanish property, filtering through thousands of listings to match your exact criteria.",
  },
  {
    icon: <Mail className="h-12 w-12 text-primary" />,
    title: "Top 10 Email Updates",
    description: "Receive curated emails with your top 10 matching properties, delivered to your inbox with photos, descriptions, and direct links.",
  },
  {
    icon: <BellRing className="h-12 w-12 text-primary" />,
    title: "Continuous Property Monitoring",
    description: "Our AI continuously scans for new listings matching your criteria, immediately alerting you to fresh opportunities or price changes.",
  },
  {
    icon: <Globe className="h-12 w-12 text-primary" />,
    title: "Multilingual Support",
    description: "Use our platform in English, Spanish, French, German, Italian, Dutch and more, with automatic translation of all property details.",
  },
  {
    icon: <Scale className="h-12 w-12 text-primary" />,
    title: "Lawyer Search Service",
    description: "Find top-rated legal experts in your area who specialize in Spanish property law and speak your language for smooth transactions.",
  },
  {
    icon: <Tv className="h-12 w-12 text-primary" />,
    title: "TV & Utility Setup",
    description: "Receive personalized recommendations for TV, internet, and utility providers in your new location, with setup guides in your language.",
  },
  {
    icon: <TruckIcon className="h-12 w-12 text-primary" />,
    title: "Moving Assistance",
    description: "Connect with reliable moving companies that service your route, complete with reviews and pricing information.",
  },
  {
    icon: <GraduationCap className="h-12 w-12 text-primary" />,
    title: "School & Healthcare Finder",
    description: "Discover the best schools and healthcare providers near your new home, with details on languages, specialties, and enrollment processes.",
  },
  {
    icon: <BarChart3 className="h-12 w-12 text-primary" />,
    title: "Market Insights",
    description: "Access up-to-date market analytics and property valuations to make informed decisions about when and where to buy.",
  },
  {
    icon: <Heart className="h-12 w-12 text-primary" />,
    title: "Comprehensive Relocation Support",
    description: "From finding properties to settling in, our platform guides you through every step of moving to Spain with personalized recommendations.",
  },
];

const Features = () => {
  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <span className="text-xs font-medium uppercase tracking-wider">AI-Powered Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Everything You Need for Your Move to Spain
          </h2>
          <p className="mt-4 text-xl text-muted-foreground text-balance">
            Our AI platform doesn't just find you a property - it provides a complete relocation solution with personalized recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-panel p-6 rounded-xl transition-all duration-300 hover:shadow-lg flex flex-col"
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground flex-grow">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
