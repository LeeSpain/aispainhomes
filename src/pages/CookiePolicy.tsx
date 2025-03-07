
import { Helmet } from 'react-helmet';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Cookie, FileText } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | SunnyHomeFinder</title>
        <meta name="description" content="Cookie policy for SunnyHomeFinder website." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24">
          {/* Header */}
          <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-10">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
                <Cookie className="w-4 h-4 mr-2" />
                <span className="text-xs font-medium uppercase tracking-wider">Legal</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-balance">
                Cookie Policy
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
                  This Cookie Policy explains how SunnyHomeFinder uses cookies and similar technologies to recognize you when you visit our website.
                </p>
                
                <h2>1. What are Cookies?</h2>
                <p>
                  Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
                </p>
                
                <h2>2. How We Use Cookies</h2>
                <p>
                  We use cookies for the following purposes:
                </p>
                <ul>
                  <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.</li>
                  <li><strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.</li>
                  <li><strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</li>
                  <li><strong>Targeting Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.</li>
                </ul>
                
                <h2>3. Types of Cookies We Use</h2>
                <p>
                  We use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your device until you delete them).
                </p>
                
                <h2>4. Third-Party Cookies</h2>
                <p>
                  In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on.
                </p>
                
                <h2>5. How to Control Cookies</h2>
                <p>
                  You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can negatively impact your user experience and parts of our website may no longer be fully accessible.
                </p>
                <p>
                  Most browsers automatically accept cookies, but you can choose whether or not to accept cookies through your browser controls, often found in your browser's "Tools" or "Preferences" menu. For more information on how to modify your browser settings or how to block, manage or filter cookies, you can visit www.allaboutcookies.org.
                </p>
                
                <h2>6. Changes to This Cookie Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                </p>
                
                <h2>7. Contact Us</h2>
                <p>
                  If you have any questions about our use of cookies or other technologies, please email us at privacy@sunnyhomefinder.com.
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

export default CookiePolicy;
