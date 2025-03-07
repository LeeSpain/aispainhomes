
import { Helmet } from 'react-helmet';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Shield, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | SunnyHomeFinder</title>
        <meta name="description" content="Privacy policy for SunnyHomeFinder users." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24">
          {/* Header */}
          <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-10">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
                <Shield className="w-4 h-4 mr-2" />
                <span className="text-xs font-medium uppercase tracking-wider">Legal</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-balance">
                Privacy Policy
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
                  At SunnyHomeFinder, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
                </p>
                
                <h2>1. Information We Collect</h2>
                <p>
                  We collect information you provide directly to us, such as your name, email address, phone number, and preferences when you register for an account, fill out our questionnaire, or communicate with us.
                </p>
                
                <h2>2. How We Use Your Information</h2>
                <p>
                  We use your information to:
                </p>
                <ul>
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your property searches and match you with suitable properties</li>
                  <li>Communicate with you about our services, promotions, and updates</li>
                  <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                </ul>
                
                <h2>3. Information Sharing</h2>
                <p>
                  We may share your information with:
                </p>
                <ul>
                  <li>Service providers who perform services on our behalf</li>
                  <li>Professional advisors, such as lawyers, bankers, and insurers</li>
                  <li>Property owners or agents when necessary to facilitate your property search</li>
                  <li>Government authorities when required by law</li>
                </ul>
                
                <h2>4. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                </p>
                
                <h2>5. Your Rights</h2>
                <p>
                  Depending on your location, you may have rights regarding your personal information, including:
                </p>
                <ul>
                  <li>Accessing, correcting, or deleting your personal information</li>
                  <li>Objecting to our use of your personal information</li>
                  <li>Requesting restriction of processing of your personal information</li>
                  <li>Data portability</li>
                  <li>Withdrawing consent</li>
                </ul>
                
                <h2>6. Cookies and Similar Technologies</h2>
                <p>
                  We use cookies and similar technologies to collect information about your browsing activities and to improve your experience on our site. You can manage your cookie preferences through your browser settings.
                </p>
                
                <h2>7. International Data Transfers</h2>
                <p>
                  Your information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have different data protection laws than your country of residence.
                </p>
                
                <h2>8. Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                
                <h2>9. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date and will be effective as soon as it is accessible.
                </p>
                
                <h2>10. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy or our privacy practices, please contact us at privacy@sunnyhomefinder.com.
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

export default PrivacyPolicy;
