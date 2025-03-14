
import { Button } from "@/components/ui/button";
import { ShieldCheck, Calendar, Check, ChevronRight, Home, Scale, Landmark, Truck, Tv, HeartPulse, GraduationCap, Globe, Car, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OverviewSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!user) {
      navigate('/login?redirect=ai-guardian');
    } else {
      navigate('/subscription');
    }
  };

  const serviceCategories = [
    {
      id: "property",
      label: "Property",
      icon: <Home className="h-5 w-5 text-primary" />,
      services: [
        "AI-powered property matching",
        "Weekly top 10 property recommendations",
        "Real-time property alerts",
        "Price change notifications",
        "Virtual property tours coordination",
        "Neighborhood analysis",
        "Investment potential assessment",
        "Seasonal rental demand forecasting"
      ]
    },
    {
      id: "legal",
      label: "Legal & Documentation",
      icon: <Scale className="h-5 w-5 text-primary" />,
      services: [
        "NIE application guidance",
        "Lawyer matching service",
        "Document translation services",
        "Visa application support",
        "Contract review recommendations",
        "Power of attorney assistance",
        "Will and inheritance planning"
      ]
    },
    {
      id: "financial",
      label: "Financial",
      icon: <Landmark className="h-5 w-5 text-primary" />,
      services: [
        "Spanish bank account setup",
        "Currency exchange monitoring",
        "Mortgage comparison",
        "Tax implications calculator",
        "Property tax reminders",
        "Non-resident tax filing help",
        "Insurance options comparison"
      ]
    },
    {
      id: "relocation",
      label: "Relocation",
      icon: <Truck className="h-5 w-5 text-primary" />,
      services: [
        "Moving company comparison",
        "Customs regulations guidance",
        "Pet relocation assistance",
        "Temporary accommodation recommendations",
        "Storage solutions comparison",
        "Moving timeline creation",
        "Vehicle import guidance"
      ]
    },
    {
      id: "utilities",
      label: "Utilities & Home",
      icon: <Tv className="h-5 w-5 text-primary" />,
      services: [
        "Electricity provider setup",
        "Water service registration",
        "Internet and TV packages",
        "Mobile phone plans",
        "Home security options",
        "Smart home setup guidance",
        "Renewable energy assessment"
      ]
    },
    {
      id: "healthcare",
      label: "Healthcare",
      icon: <HeartPulse className="h-5 w-5 text-primary" />,
      services: [
        "Healthcare registration guidance",
        "Health insurance comparison",
        "Medical professional directory",
        "Medication transfer information",
        "Emergency services information",
        "Specialist referral service",
        "Medical record translation"
      ]
    },
    {
      id: "education",
      label: "Education",
      icon: <GraduationCap className="h-5 w-5 text-primary" />,
      services: [
        "School finder with filters",
        "University options",
        "Enrollment process guidance",
        "Language learning resources",
        "Tutoring services directory",
        "Credential validation help",
        "Distance learning options"
      ]
    },
    {
      id: "community",
      label: "Community",
      icon: <Globe className="h-5 w-5 text-primary" />,
      services: [
        "Expat community recommendations",
        "Local events alerts",
        "Language exchange matching",
        "Cultural adaptation resources",
        "Sports clubs directory",
        "Religious services information",
        "Volunteer opportunities"
      ]
    },
    {
      id: "transport",
      label: "Transportation",
      icon: <Car className="h-5 w-5 text-primary" />,
      services: [
        "Public transportation planning",
        "Driver's license exchange",
        "Vehicle purchase guidance",
        "Alternative transport options",
        "Regional travel assistance",
        "Airport transfer services",
        "Car sharing options"
      ]
    },
    {
      id: "work",
      label: "Work & Business",
      icon: <Briefcase className="h-5 w-5 text-primary" />,
      services: [
        "Coworking space directory",
        "Business formation guidance",
        "Digital nomad visa information",
        "Local job market insights",
        "Networking event recommendations",
        "Professional certification transfer",
        "Freelance work permits"
      ]
    }
  ];

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <p className="text-xl leading-relaxed mb-6">
        Relocating to Spain is a complex journey. Our AI Guardian provides comprehensive assistance through every step of finding your perfect property and settling into your new Spanish lifestyle.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Personalized Guidance
          </h3>
          <p className="text-muted-foreground">
            AI Guardian analyzes your specific situation to create a customized relocation plan tailored to your needs, preferences, and timeline.
          </p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Timeline Management
          </h3>
          <p className="text-muted-foreground">
            Stay on track with a detailed timeline and reminders for important deadlines throughout your property search and relocation journey.
          </p>
        </div>
      </div>
      
      <div className="my-10 flex justify-center">
        <Button size="lg" onClick={handleGetStarted} className="px-8 gap-2">
          Get Started Now <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <h3 className="text-2xl font-bold mb-6">Comprehensive Relocation Services</h3>
      
      <Tabs defaultValue="property" className="w-full mb-8">
        <TabsList className="w-full flex flex-wrap justify-start h-auto mb-6 bg-transparent">
          {serviceCategories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex items-center gap-1 m-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              {category.icon}
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {serviceCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            <div className="bg-card border rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {category.icon} {category.label} Services
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-0">
                {category.services.map((service, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <p className="text-xl leading-relaxed mt-8">
        Your AI Guardian subscription provides access to all these services, personalized to your specific relocation needs, with expert guidance available at every step of your journey to Spain.
      </p>
      
      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={handleGetStarted} className="px-8 gap-2 bg-gradient-to-r from-primary to-accent">
          Start Your Spanish Journey <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OverviewSection;
