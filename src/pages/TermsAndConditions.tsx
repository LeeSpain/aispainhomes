
import { Helmet } from 'react-helmet';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Scroll, FileText } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | SunnyHomeFinder</title>
        <meta name="description" content="Terms and conditions for using the SunnyHomeFinder service." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24">
          {/* Header */}
          <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-10">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
                <FileText className="w-4 h-4 mr-2" />
                <span className="text-xs font-medium uppercase tracking-wider">Legal</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-balance">
                Terms and Conditions
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4 text-balance">
                Last updated: March 2024
              </p>
            </div>
          </section>
          
          {/* Content */}
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  Welcome to SunnyHomeFinder. By accessing or using our website, you agree to be bound by these Terms and Conditions.
                </p>
                
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing or using SunnyHomeFinder, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                </p>
                
                <h2>2. Description of Services</h2>
                <p>
                  SunnyHomeFinder provides an AI-powered platform to assist users in finding properties in Spain and navigating the relocation process. Our services include property matching, relocation guidance, and related assistance.
                </p>
                
                <h2>3. User Accounts</h2>
                <p>
                  When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
                
                <h2>4. Subscription and Payments</h2>
                <p>
                  Our premium services require a subscription. All payments are processed securely through our payment partners. Subscription fees are non-refundable except where required by applicable law.
                </p>
                
                <h2>5. Property Information</h2>
                <p>
                  While we strive to provide accurate property information, we cannot guarantee the availability, condition, or exact details of properties shown on our platform. Users should verify all property information before making any decisions.
                </p>
                
                <h2>6. Intellectual Property</h2>
                <p>
                  All content on SunnyHomeFinder, including text, graphics, logos, icons, images, and software, is the property of SunnyHomeFinder or our content suppliers and is protected by international copyright laws.
                </p>
                
                <h2>7. Limitation of Liability</h2>
                <p>
                  SunnyHomeFinder shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
                </p>
                
                <h2>8. Governing Law</h2>
                <p>
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of Spain, without regard to its conflict of law provisions.
                </p>
                
                <h2>9. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms and Conditions at any time. Your continued use of SunnyHomeFinder after any such changes constitutes your acceptance of the new Terms and Conditions.
                </p>
                
                <h2>10. Contact Information</h2>
                <p>
                  If you have any questions about these Terms and Conditions, please contact us at legal@sunnyhomefinder.com.
                </p>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TermsAndConditions;
