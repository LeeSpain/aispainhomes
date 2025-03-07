
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';

const backgroundImages = [
  '/images/spain-property-1.jpg', 
  '/images/spain-property-2.jpg',
  '/images/spain-property-3.jpg'
];

// Use placeholder images until we have real images
// In a real implementation, these would be actual property images
const placeholderImages = Array(3).fill('/placeholder.svg');

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % placeholderImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {placeholderImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 bg-gradient-to-br from-blue-100 to-blue-200"
            style={{
              opacity: currentImage === index ? 1 : 0,
              backgroundImage: `url(${image})`,
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
            <span className="text-xs font-medium uppercase tracking-wider">AI-Powered Property Search</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-balance animate-slide-in-left">
            Find Your Perfect Home <br />Under the Spanish Sun
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance animate-slide-in-left" style={{ animationDelay: '150ms' }}>
            Our AI helps you discover ideal properties in Spain and guides you through the entire relocation process, from finding a home to setting up utilities.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-in-left" style={{ animationDelay: '300ms' }}>
            <Button 
              size="lg" 
              className="group"
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
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Shaped gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default Hero;
