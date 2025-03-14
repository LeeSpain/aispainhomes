
import PropertyHero from "@/components/property-sections/PropertyHero";
import IntelligentMatching from "@/components/property-sections/IntelligentMatching";
import AIGuardianFeatures from "@/components/property-sections/AIGuardianFeatures";
import RelocationAssistance from "@/components/property-sections/RelocationAssistance";
import CallToAction from "@/components/property-sections/CallToAction";

const Property = () => {
  return (
    <>
      <PropertyHero />
      
      <div className="container mx-auto px-4">
        <IntelligentMatching />
      </div>
      
      <AIGuardianFeatures />
      
      <div className="container mx-auto px-4">
        <RelocationAssistance />
        <CallToAction />
      </div>
    </>
  );
};

export default Property;
