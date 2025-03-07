
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import QuestionnaireLayout from '@/components/questionnaire/QuestionnaireLayout';
import QuestionnaireStep from '@/components/questionnaire/QuestionnaireStep';
import PropertyGrid from '@/components/properties/PropertyGrid';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Property } from '@/components/properties/PropertyCard';

const cities = [
  'Barcelona', 'Madrid', 'Valencia', 'Malaga', 'Alicante', 
  'Marbella', 'Ibiza', 'Mallorca', 'Tenerife', 'Gran Canaria'
];

const propertyTypes = [
  'Apartment', 'House', 'Villa', 'Penthouse', 'Studio', 'Townhouse', 'Land'
];

const amenities = [
  'Swimming Pool', 'Garden', 'Terrace', 'Parking', 'Air Conditioning', 
  'Sea View', 'Mountain View', 'Security System', 'Elevator', 'Gym'
];

const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment with Sea View',
    location: 'Marbella, Málaga',
    price: 320000,
    currency: 'EUR',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    imageUrl: '/placeholder.svg',
    features: ['Sea View', 'Pool', 'Parking', 'Terrace', 'Air Conditioning'],
    isForRent: false
  },
  {
    id: '2',
    title: 'Luxury Villa with Pool',
    location: 'Ibiza Town, Ibiza',
    price: 1250000,
    currency: 'EUR',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    imageUrl: '/placeholder.svg',
    features: ['Pool', 'Garden', 'Parking', 'Sea View', 'Security System'],
    isForRent: false
  },
  {
    id: '3',
    title: 'Cozy Studio in City Center',
    location: 'Barcelona, Catalonia',
    price: 950,
    currency: 'EUR',
    type: 'Studio',
    bedrooms: 0,
    bathrooms: 1,
    area: 48,
    imageUrl: '/placeholder.svg',
    features: ['Furnished', 'City Center', 'Air Conditioning', 'Public Transport'],
    isForRent: true
  },
  {
    id: '4',
    title: 'Beachfront Condo',
    location: 'Valencia, Comunidad Valenciana',
    price: 285000,
    currency: 'EUR',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    imageUrl: '/placeholder.svg',
    features: ['Beachfront', 'Pool', 'Furnished', 'Balcony'],
    isForRent: false
  },
  {
    id: '5',
    title: 'Countryside Finca',
    location: 'Ronda, Málaga',
    price: 495000,
    currency: 'EUR',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    imageUrl: '/placeholder.svg',
    features: ['Garden', 'Mountain View', 'Fireplace', 'Fruit Trees'],
    isForRent: false
  }
];

const subscriptionTiers = [
  {
    title: 'Free',
    price: 0,
    description: 'Basic access to get you started',
    features: [
      'View 5 property matches',
      'Basic property search',
      'Single language support'
    ],
    buttonText: 'Continue with Free'
  },
  {
    title: 'Premium',
    price: 9.99,
    description: 'Full access for serious property hunters',
    features: [
      'Unlimited property matches',
      'Weekly email alerts',
      'Multilingual support',
      'Detailed property analytics',
      'Save favorite properties'
    ],
    isPopular: true,
    buttonText: 'Try Premium'
  }
];

const Questionnaire = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [showAuthForms, setShowAuthForms] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const totalSteps = 5;
  
  const [formData, setFormData] = useState({
    propertyType: '',
    purpose: 'buy',
    location: '',
    priceRange: [100000, 500000],
    bedrooms: 2,
    bathrooms: 1,
    minArea: 50,
    selectedAmenities: [] as string[]
  });
  
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !formData.purpose;
      case 2:
        return !formData.propertyType;
      case 3:
        return !formData.location;
      default:
        return false;
    }
  };
  
  const subscriptionTier = {
    title: 'Premium Access',
    price: 9.99,
    description: 'Complete access to all property search and relocation services',
    features: [
      'Unlimited property matches',
      'Daily email alerts with top 10 new properties',
      'Multilingual support (6+ languages)',
      'Lawyer and service provider searches',
      'TV and utility setup assistance',
      'School & healthcare finder',
      'Moving company recommendations',
      'Personalized relocation guides',
      'Market insights and analytics'
    ],
    isPopular: true,
    buttonText: 'Start Your Journey'
  };
  
  const handleContinueToAuth = () => {
    setShowAuthForms(true);
  };
  
  // After authentication, redirect to dashboard
  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };
  
  if (showResults) {
    return (
      <>
        <Helmet>
          <title>Your Property Matches | SunnyHomeFinder</title>
        </Helmet>
        
        <div className="min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-1 pt-28 pb-16">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Your Top Property Matches</h1>
                <p className="text-muted-foreground mb-8">
                  Based on your preferences, we've found these properties that might interest you. 
                  {user ? "We'll email you these results for easy reference." : "Create an account to see all matches and receive email updates."}
                </p>
                
                <div className="mb-12">
                  <PropertyGrid properties={sampleProperties.slice(0, user ? sampleProperties.length : 5)} />
                </div>
                
                {!user && (
                  <>
                    {!showAuthForms ? (
                      <div className="glass-panel rounded-xl p-8 mb-12">
                        <h2 className="text-2xl font-bold mb-4">Unlock All Your Property Matches & Relocation Services</h2>
                        <p className="text-muted-foreground mb-8">
                          We've found more properties that match your criteria. Create an account to see all results, 
                          get daily email alerts with your top 10 matches, and access our complete suite of relocation services.
                        </p>
                        
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                          <Button 
                            size="lg" 
                            onClick={handleContinueToAuth}
                            className="px-8 py-6 text-lg"
                          >
                            Create Free Account
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/')}
                            className="px-8 py-6 text-lg"
                          >
                            Return to Home
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="glass-panel rounded-xl p-8 mb-12">
                        <Tabs defaultValue={authTab} onValueChange={(value) => setAuthTab(value as 'login' | 'register')}>
                          <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Create Account</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="login">
                            <LoginForm />
                          </TabsContent>
                          
                          <TabsContent value="register">
                            <RegisterForm />
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </>
                )}
                
                {user && (
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>
                      Go to Dashboard
                    </Button>
                    
                    <Button onClick={() => navigate('/')}>
                      Back to Home
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Find Your Perfect Property | SunnyHomeFinder</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <QuestionnaireLayout
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onBack={handleBack}
          isNextDisabled={isNextDisabled()}
          isBackDisabled={currentStep === 1}
          isLastStep={currentStep === totalSteps}
        >
          {currentStep === 1 && (
            <QuestionnaireStep
              title="What are you looking to do?"
              description="Are you looking to buy or rent a property in Spain?"
            >
              <RadioGroup
                value={formData.purpose}
                onValueChange={(value) => handleChange('purpose', value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buy" id="buy" />
                  <Label htmlFor="buy" className="cursor-pointer text-lg">Buy a property</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rent" id="rent" />
                  <Label htmlFor="rent" className="cursor-pointer text-lg">Rent a property</Label>
                </div>
              </RadioGroup>
            </QuestionnaireStep>
          )}
          
          {currentStep === 2 && (
            <QuestionnaireStep
              title="What type of property are you looking for?"
              description="Select the type of property you're interested in."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {propertyTypes.map((type) => (
                  <div
                    key={type}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      formData.propertyType === type
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    onClick={() => handleChange('propertyType', type)}
                  >
                    <div className="text-center">
                      <div className="font-medium">{type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </QuestionnaireStep>
          )}
          
          {currentStep === 3 && (
            <QuestionnaireStep
              title="Where would you like to live?"
              description="Select a location in Spain where you want to find a property."
            >
              <div className="space-y-6 mt-6">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleChange('location', value)}
                  >
                    <SelectTrigger id="location" className="mt-2">
                      <SelectValue placeholder="Select a city or region" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Or search for a specific area</Label>
                  <div className="flex mt-2">
                    <Input 
                      placeholder="Search for a city, neighborhood, or area"
                      className="flex-1"
                    />
                    <Button type="button" className="ml-2">Search</Button>
                  </div>
                </div>
              </div>
            </QuestionnaireStep>
          )}
          
          {currentStep === 4 && (
            <QuestionnaireStep
              title="What's your budget?"
              description={`Set your ${formData.purpose === 'rent' ? 'monthly rental' : 'purchase'} budget range.`}
            >
              <div className="space-y-8 mt-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <span>Price Range</span>
                    <span>
                      {formatPrice(formData.priceRange[0])} - {formatPrice(formData.priceRange[1])}
                    </span>
                  </div>
                  <Slider
                    value={formData.priceRange}
                    min={formData.purpose === 'rent' ? 500 : 50000}
                    max={formData.purpose === 'rent' ? 5000 : 1000000}
                    step={formData.purpose === 'rent' ? 100 : 10000}
                    onValueChange={(value) => handleChange('priceRange', value)}
                    className="my-6"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select
                      value={formData.bedrooms.toString()}
                      onValueChange={(value) => handleChange('bedrooms', parseInt(value))}
                    >
                      <SelectTrigger id="bedrooms" className="mt-2">
                        <SelectValue placeholder="Select number of bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Studio</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4">4 Bedrooms</SelectItem>
                        <SelectItem value="5">5+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select
                      value={formData.bathrooms.toString()}
                      onValueChange={(value) => handleChange('bathrooms', parseInt(value))}
                    >
                      <SelectTrigger id="bathrooms" className="mt-2">
                        <SelectValue placeholder="Select number of bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Bathroom</SelectItem>
                        <SelectItem value="2">2 Bathrooms</SelectItem>
                        <SelectItem value="3">3 Bathrooms</SelectItem>
                        <SelectItem value="4">4+ Bathrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="min-area">Minimum Area (m²)</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      id="min-area"
                      type="number"
                      min="20"
                      max="1000"
                      value={formData.minArea}
                      onChange={(e) => handleChange('minArea', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="ml-2">m²</span>
                  </div>
                </div>
              </div>
            </QuestionnaireStep>
          )}
          
          {currentStep === 5 && (
            <QuestionnaireStep
              title="What amenities are important to you?"
              description="Select the features and amenities you'd like in your property."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-start space-x-2">
                    <Checkbox
                      id={amenity.replace(/\s+/g, '-').toLowerCase()}
                      checked={formData.selectedAmenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleChange('selectedAmenities', [...formData.selectedAmenities, amenity]);
                        } else {
                          handleChange(
                            'selectedAmenities',
                            formData.selectedAmenities.filter((item) => item !== amenity)
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={amenity.replace(/\s+/g, '-').toLowerCase()}
                      className="cursor-pointer"
                    >
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </QuestionnaireStep>
          )}
        </QuestionnaireLayout>
        
        <Footer />
      </div>
    </>
  );
};

export default Questionnaire;
