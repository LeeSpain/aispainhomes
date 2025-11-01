
import { Helmet } from 'react-helmet';
import Navbar from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Info, 
  History, 
  Users, 
  HomeIcon, 
  Heart, 
  Shield, 
  Zap, 
  Globe, 
  Target,
  TrendingUp,
  Award,
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import aboutTeam from '@/assets/about-team.jpg';
import aboutSpainProperties from '@/assets/about-spain-properties.jpg';
import aboutAiTechnology from '@/assets/about-ai-technology.jpg';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | AI Homes Spain - Your Trusted Property Partner</title>
        <meta name="description" content="Learn about AI Homes Spain and our mission to revolutionize property search and relocation services across Spain with AI-powered technology." />
        <meta name="keywords" content="AI Homes Spain, Spanish property experts, relocation services, AI property search" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24">
          {/* Hero Section */}
          <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,140,0,0.05),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.05),transparent_50%)]"></div>
            
            <div className="container mx-auto px-4 text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                <Info className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">About AI Homes Spain</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Transforming Spanish Property Search
                <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  with AI Innovation
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                We combine cutting-edge artificial intelligence with deep local expertise to make finding your dream Spanish property seamless, personalized, and stress-free.
              </p>
            </div>
          </section>
          
          {/* Our Story */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                    <History className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Our Story</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                    From Personal Experience to Professional Excellence
                  </h2>
                  <div className="space-y-4 text-lg text-muted-foreground">
                    <p>
                      Founded in 2023 by a team of experienced expats and technology innovators, AI Homes Spain emerged from a simple yet powerful realization: relocating to Spain shouldn't be complicated.
                    </p>
                    <p>
                      Having navigated the challenges of international property search, language barriers, and complex relocation processes ourselves, we understood the pain points intimately. We knew there had to be a better way.
                    </p>
                    <p>
                      Today, we've helped thousands of families and individuals discover their perfect Spanish property using our proprietary AI-powered platform. Our technology analyzes millions of data points to match you with properties that truly fit your lifestyle, budget, and dreams.
                    </p>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src={aboutTeam} 
                      alt="Professional AI Homes Spain team working together" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Why Choose Us */}
          <section className="py-20 md:py-28 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src={aboutAiTechnology} 
                      alt="AI-powered property search technology" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Why Choose Us</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                    AI-Powered Excellence Meets Human Touch
                  </h2>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Intelligent Matching</h3>
                        <p className="text-muted-foreground">
                          Our AI analyzes thousands of properties daily, understanding your preferences to deliver perfect matches.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
                        <p className="text-muted-foreground">
                          Communicate in your language with support in English, Spanish, German, French, Italian, and more.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">End-to-End Support</h3>
                        <p className="text-muted-foreground">
                          From property search to legal assistance, utilities setup, and settling in—we're with you every step.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Our Values */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Our Values</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                  Built on Trust, Innovation & Excellence
                </h2>
                <p className="text-xl text-muted-foreground">
                  Our core values guide everything we do, ensuring you receive the best possible service.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-border">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Client-Focused</h3>
                  <p className="text-muted-foreground">
                    Your goals and dreams are our priority. We tailor every solution to your unique needs.
                  </p>
                </div>
                
                <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-border">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Innovation</h3>
                  <p className="text-muted-foreground">
                    We leverage the latest AI technology to provide smarter, faster property solutions.
                  </p>
                </div>
                
                <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-border">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Award className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Excellence</h3>
                  <p className="text-muted-foreground">
                    We maintain the highest standards in every property and service we deliver.
                  </p>
                </div>
                
                <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-border">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Community</h3>
                  <p className="text-muted-foreground">
                    We connect you with expat networks and local communities to feel at home quickly.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* What We Offer */}
          <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                  <HomeIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Our Services</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                  Comprehensive Relocation Solutions
                </h2>
                <p className="text-xl text-muted-foreground">
                  Everything you need for a successful move to Spain, all in one place.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <MapPin className="w-6 h-6" />,
                    title: "AI Property Matching",
                    description: "Advanced algorithms match you with properties that fit your exact criteria and lifestyle."
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    title: "Expert Guidance",
                    description: "Work with experienced relocation specialists who know the Spanish market inside out."
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Legal Support",
                    description: "Connect with trusted lawyers for contracts, visas, and all legal documentation."
                  },
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: "Utilities Setup",
                    description: "We handle internet, electricity, water, and TV setup so you can settle in immediately."
                  },
                  {
                    icon: <Heart className="w-6 h-6" />,
                    title: "Healthcare & Schools",
                    description: "Find quality healthcare providers and international schools for your family."
                  },
                  {
                    icon: <Globe className="w-6 h-6" />,
                    title: "24/7 Support",
                    description: "Get answers and assistance whenever you need it, in your preferred language."
                  }
                ].map((service, index) => (
                  <div key={index} className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-border">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* The Spanish Dream */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                    <Sun className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Living in Spain</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                    Your Spanish Dream Awaits
                  </h2>
                  <div className="space-y-4 text-lg text-muted-foreground mb-8">
                    <p>
                      Spain offers more than just beautiful properties—it's a lifestyle transformation. From the sun-soaked Costa del Sol to vibrant Barcelona and historic Madrid, discover a quality of life that combines:
                    </p>
                    <div className="space-y-3">
                      {[
                        "300+ days of sunshine annually",
                        "World-class healthcare system",
                        "Rich culture and gastronomy",
                        "Affordable cost of living",
                        "Welcoming expat communities",
                        "Excellent infrastructure"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link to="/questionnaire">
                    <Button size="lg" className="px-8 py-6 text-lg">
                      Start Your Journey
                    </Button>
                  </Link>
                </div>
                <div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src={aboutSpainProperties} 
                      alt="Luxury Spanish coastal properties with Mediterranean lifestyle" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Stats Section */}
          <section className="py-20 bg-gradient-to-br from-primary via-accent to-primary text-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-5xl md:text-6xl font-bold mb-2">5K+</div>
                  <div className="text-lg text-white/90">Happy Clients</div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-bold mb-2">15K+</div>
                  <div className="text-lg text-white/90">Properties Listed</div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-bold mb-2">98%</div>
                  <div className="text-lg text-white/90">Success Rate</div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-bold mb-2">24/7</div>
                  <div className="text-lg text-white/90">Support Available</div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Final CTA */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 via-accent/10 to-background rounded-3xl p-12 border border-primary/20 shadow-xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                  Ready to Find Your Perfect Spanish Property?
                </h2>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Join thousands of satisfied clients who found their dream homes with AI Homes Spain. Start your personalized property search today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <Button size="lg" className="px-10 py-6 text-lg">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link to="/property">
                    <Button size="lg" variant="outline" className="px-10 py-6 text-lg">
                      Explore Properties
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default About;
