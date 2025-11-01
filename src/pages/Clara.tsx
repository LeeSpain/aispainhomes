import { Helmet } from 'react-helmet';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import HeroSection from '@/components/clara/HeroSection';
import StatsSection from '@/components/clara/StatsSection';
import TabsContainer from '@/components/clara/TabsContainer';

const Clara = () => {
  return (
    <>
      <Helmet>
        <title>Clara - Your AI Assistant | SunnyHomeFinder</title>
        <meta name="description" content="Clara - Your personal AI assistant for every step of your relocation journey to Spain" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16 bg-gradient-to-b from-background via-background to-background/80">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Hero section */}
              <HeroSection />
              
              {/* Stats section */}
              <StatsSection />
              
              <Separator className="my-12" />
              
              {/* Tabs section */}
              <TabsContainer defaultTab="overview" />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Clara;
