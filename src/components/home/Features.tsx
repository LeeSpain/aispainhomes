
import { Search, Globe, Bell, Scale, Tv, Home } from 'lucide-react';

const features = [
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: 'Smart Property Search',
    description: 'AI-powered questionnaire that understands your needs and finds the perfect property match in Spain.'
  },
  {
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: 'Multilingual Support',
    description: 'Full experience in your language of choice: English, Spanish, French, German, Italian, and Dutch.'
  },
  {
    icon: <Bell className="h-10 w-10 text-primary" />,
    title: 'Property Alerts',
    description: 'Stay updated with automated email alerts when new properties matching your criteria hit the market.'
  },
  {
    icon: <Scale className="h-10 w-10 text-primary" />,
    title: 'Legal Assistance',
    description: 'Connect with trusted lawyers to handle contracts, titles, and residency permits for your move to Spain.'
  },
  {
    icon: <Tv className="h-10 w-10 text-primary" />,
    title: 'Utility Setup',
    description: 'Guidance on setting up essential services like TV, internet, and electricity in your new Spanish home.'
  },
  {
    icon: <Home className="h-10 w-10 text-primary" />,
    title: 'Relocation Support',
    description: 'Comprehensive guides on schools, healthcare, banking, and cultural tips for a smooth transition.'
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <span className="text-xs font-medium uppercase tracking-wider">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Everything You Need for Your Spanish Property Journey
          </h2>
          <p className="mt-4 text-xl text-muted-foreground text-balance">
            From finding your dream home to settling in comfortably, we've got you covered every step of the way.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-panel rounded-xl p-6 card-hover animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
