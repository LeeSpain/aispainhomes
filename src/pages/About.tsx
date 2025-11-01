
import { Helmet } from 'react-helmet';
import Navbar from '@/components/common/Navbar';
import { Sun, Info, History, Users, HomeIcon, Heart } from 'lucide-react';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | AIHomesSpain.com</title>
        <meta name="description" content="Learn about AIHomesSpain.com and our mission to help you find your dream property in sunny Spain." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-16 md:py-20">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
                <Info className="w-4 h-4 mr-2" />
                <span className="text-xs font-medium uppercase tracking-wider">About Us</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Finding Your Spanish Dream Home
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
                We combine AI technology with local expertise to make your property search and relocation to Spain smoother than ever.
              </p>
            </div>
          </section>
          
          {/* Our Story */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    <History className="w-4 h-4 mr-2" />
                    <span className="text-xs font-medium uppercase tracking-wider">Our Story</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                    From Expats to Experts
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Founded in 2023 by a team of expats who experienced the challenges of relocating to Spain firsthand, AIHomesSpain.com was born from a simple idea: make the property search and relocation process as smooth as the Spanish lifestyle.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    After navigating bureaucracy, language barriers, and confusing property markets ourselves, we built the service we wish we'd had. Our AI-powered tools combine with our lived experience to guide you through every step of finding your place in the sun.
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="/lovable-uploads/ba681842-0946-4dc9-9473-7f8b5641d21f.png" 
                    alt="AI-powered Spain relocation services with expats and experts" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Our Mission */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
                <HomeIcon className="w-4 h-4 mr-2" />
                <span className="text-xs font-medium uppercase tracking-wider">Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                Making Spain Accessible to Everyone
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 text-balance">
                We believe everyone deserves the chance to experience the joy of Spanish living, without the stress that typically comes with international property searches and relocation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-background rounded-xl p-6 shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Supporting Expats</h3>
                  <p className="text-muted-foreground">
                    We guide newcomers through every step of relocating to Spain, from finding the perfect property to setting up utilities.
                  </p>
                </div>
                
                <div className="bg-background rounded-xl p-6 shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sun className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Quality Living</h3>
                  <p className="text-muted-foreground">
                    We help you find not just a property, but a home that matches your lifestyle preferences in Spain's sunniest regions.
                  </p>
                </div>
                
                <div className="bg-background rounded-xl p-6 shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Building Community</h3>
                  <p className="text-muted-foreground">
                    We connect new arrivals with established expat communities to help them settle in and feel at home quickly.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Contact CTA */}
          <section className="py-16 md:py-20 bg-gradient-to-br from-primary/90 to-accent text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                Ready to Start Your Spanish Adventure?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 text-balance">
                Whether you're looking for a beachfront apartment, a countryside villa, or a city center flat, we're here to help you find your perfect place in the sun.
              </p>
              <a 
                href="/questionnaire" 
                className="inline-flex items-center justify-center bg-white text-primary font-medium rounded-md px-6 py-3 hover:bg-white/90 transition-colors"
              >
                Find Your Dream Home
              </a>
            </div>
          </section>
        </main>
        
        {/* Removed the Footer component from here since it's already included in App.tsx */}
      </div>
    </>
  );
};

export default About;
