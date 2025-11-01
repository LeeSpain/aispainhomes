
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import OverviewSection from "./OverviewSection";
import FeaturesSection from "./FeaturesSection";
import PricingSection from "./PricingSection";

interface TabsContainerProps {
  defaultTab?: string;
}

const TabsContainer = ({ defaultTab = "overview" }: TabsContainerProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-12">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6">
        <OverviewSection />
      </TabsContent>
      
      <TabsContent value="features" className="mt-6">
        <FeaturesSection />
      </TabsContent>
      
      <TabsContent value="pricing" className="mt-6">
        <PricingSection />
      </TabsContent>
    </Tabs>
  );
};

export default TabsContainer;
