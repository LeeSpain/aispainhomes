
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Sun, Palmtree } from 'lucide-react';

// Placeholder images until we have real ones
const placeholderBackgrounds = [
  'linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)',
  'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)',
  'linear-gradient(to right, #ee9ca7, #ffdde1)'
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % placeholderBackgrounds.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {placeholderBackgrounds.map((gradient, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: currentImage === index ? 1 : 0,
              background: gradient,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10 mt-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary animate-fade-in">
            <Sun className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium uppercase tracking-wider">Spanish Sunshine Awaits</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-balance animate-slide-in-left">
            Find Your Perfect Home <br />Under the Spanish Sun
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance animate-slide-in-left" style={{ animationDelay: '150ms' }}>
            Our AI helps you discover ideal properties in sunny Spain and guides you through the entire relocation process, from beachfront villas to mountain retreats.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-in-left" style={{ animationDelay: '300ms' }}>
            <Button 
              size="lg" 
              className="group bg-gradient-to-r from-primary to-accent"
              onClick={() => navigate('/questionnaire')}
            >
              <Search className="mr-2 h-5 w-5" />
              Start Your Search
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/about')}
              className="border-primary/30 hover:bg-primary/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Shaped gradient at bottom with sun-inspired elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-12 right-12 text-primary/20 hidden lg:block">
          <Palmtree className="h-32 w-32" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
