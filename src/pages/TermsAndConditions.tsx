import { Helmet } from 'react-helmet';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | AISpainHomes.com</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h1>Terms and Conditions</h1>
              <p>Last updated: July 1, 2023</p>
              
              <h2>1. Introduction</h2>
              <p>
                Welcome to AISpainHomes.com. These Terms and Conditions govern your use of our website and services. 
                By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of the terms, 
                you may not access the service.
              </p>
              
              <h2>2. Definitions</h2>
              <p>
                <strong>"Service"</strong> refers to the AISpainHomes.com website and platform.<br />
                <strong>"User"</strong> refers to individuals who access or use the Service.<br />
                <strong>"Subscription"</strong> refers to the paid access to premium features of the Service.<br />
                <strong>"Content"</strong> refers to property listings, images, text, and other materials available on the Service.
              </p>
              
              <h2>3. Account Registration</h2>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. 
                You agree not to disclose your password to any third party.
              </p>
              
              <h2>4. Subscription Terms</h2>
              <p>
                Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring basis, depending on the type of subscription plan you select.
              </p>
              <p>
                At the end of each billing period, your subscription will automatically renew under the same conditions unless you cancel it or AISpainHomes.com cancels it.
              </p>
              <p>
                You may cancel your subscription at any time through your account settings or by contacting our customer support team.
              </p>
              
              <h2>5. Property Listings</h2>
              <p>
                AISpainHomes.com provides property listings as an informational service. We do not guarantee the accuracy, completeness, or quality of any listings. 
                The information is provided by third parties and we are not responsible for verifying its accuracy.
              </p>
              <p>
                Before making any decisions based on information found on our platform, we strongly recommend that you verify all details, including property specifications, prices, and availability.
              </p>
              
              <h2>6. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of AISpainHomes.com and its licensors. 
                The Service is protected by copyright, trademark, and other laws.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of AISpainHomes.com.
              </p>
              
              <h2>7. User Conduct</h2>
              <p>
                You agree not to use the Service:
              </p>
              <ul>
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                <li>To impersonate or attempt to impersonate AISpainHomes.com, a AISpainHomes.com employee, another user, or any other person or entity.</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which may harm AISpainHomes.com or users of the Service.</li>
              </ul>
              
              <h2>8. Limitation of Liability</h2>
              <p>
                In no event shall AISpainHomes.com, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul>
                <li>Your access to or use of or inability to access or use the Service.</li>
                <li>Any conduct or content of any third party on the Service.</li>
                <li>Any content obtained from the Service.</li>
                <li>Unauthorized access, use or alteration of your transmissions or content.</li>
              </ul>
              
              <h2>9. Privacy Policy</h2>
              <p>
                Our Privacy Policy describes our policies and procedures on the collection, use and disclosure of your personal information. 
                Please review our Privacy Policy, which also governs your use of our Service.
              </p>
              
              <h2>10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
              </p>
              <p>
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
              
              <h2>11. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of Spain, without regard to its conflict of law provisions.
              </p>
              <p>
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
              
              <h2>12. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at legal@AISpainHomes.com.
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TermsAndConditions;
