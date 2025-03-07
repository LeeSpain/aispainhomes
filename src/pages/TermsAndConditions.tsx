
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
                <h2>1. Introduction</h2>
                <p>
                  Welcome to SunnyHomeFinder. These Terms and Conditions govern your use of our platform and services. By accessing or using SunnyHomeFinder, you agree to be bound by these Terms and Conditions in their entirety. If you disagree with any part of these terms, please refrain from using our services.
                </p>
                
                <h2>2. Definitions</h2>
                <p>
                  Throughout these Terms and Conditions, unless the context otherwise requires:
                </p>
                <ul>
                  <li>"We," "our," or "us" refers to SunnyHomeFinder, the company providing property finder and relocation services.</li>
                  <li>"You" or "your" refers to the user or client of our platform and services.</li>
                  <li>"Platform" refers to our website, applications, and any other digital services we provide.</li>
                  <li>"Content" refers to information, text, graphics, images, and other materials displayed on our Platform.</li>
                </ul>
                
                <h2>3. Services</h2>
                <p>
                  SunnyHomeFinder provides an AI-powered platform designed to assist users in finding properties in Spain and facilitating relocation processes. Our services include, but are not limited to:
                </p>
                <ul>
                  <li>AI-powered property matching based on user preferences</li>
                  <li>Regular email updates with property matches</li>
                  <li>Multilingual support for communications</li>
                  <li>Relocation assistance including recommendations for service providers</li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.
                </p>
                
                <h2>4. User Accounts</h2>
                <p>
                  4.1. To access certain features of our Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </p>
                <p>
                  4.2. You are solely responsible for safeguarding your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.
                </p>
                <p>
                  4.3. We reserve the right to terminate or suspend your account at our discretion, without prior notice, if we believe that you have violated these Terms and Conditions.
                </p>
                
                <h2>5. Intellectual Property</h2>
                <p>
                  5.1. The Platform and all content, features, and functionality thereof, including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof, are owned by SunnyHomeFinder, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                </p>
                <p>
                  5.2. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any material on our Platform, except as follows:
                </p>
                <ul>
                  <li>Your computer may temporarily store copies of such materials incidental to your accessing and viewing those materials.</li>
                  <li>You may store files that are automatically cached by your web browser for display enhancement purposes.</li>
                  <li>If we provide desktop, mobile, or other applications for download, you may download a single copy to your computer or mobile device solely for your own personal, non-commercial use.</li>
                </ul>
                
                <h2>6. Data Privacy</h2>
                <p>
                  Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use, and disclose information from our users. By using our Platform, you consent to our collection and use of personal data as outlined therein.
                </p>
                
                <h2>7. Limitation of Liability</h2>
                <p>
                  7.1. In no event shall SunnyHomeFinder, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul>
                  <li>Your access to or use of or inability to access or use the Platform;</li>
                  <li>Any conduct or content of any third party on the Platform;</li>
                  <li>Any content obtained from the Platform; and</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
                </ul>
                <p>
                  7.2. The limitations of liability set forth above shall apply to the fullest extent permitted by law in the applicable jurisdiction.
                </p>
                
                <h2>8. Indemnification</h2>
                <p>
                  You agree to defend, indemnify, and hold harmless SunnyHomeFinder, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms and Conditions or your use of the Platform.
                </p>
                
                <h2>9. Governing Law</h2>
                <p>
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of Spain, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms and Conditions will not be considered a waiver of those rights.
                </p>
                
                <h2>10. Changes to Terms and Conditions</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms and Conditions at any time. We will provide notice of any significant changes by posting the new Terms and Conditions on this page and updating the "Last updated" date. Your continued use of our Platform following the posting of any changes constitutes acceptance of those changes.
                </p>
                
                <h2>11. Contact Us</h2>
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
