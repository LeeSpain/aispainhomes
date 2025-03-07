
import { Helmet } from "react-helmet";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PasswordRecovery from "@/components/auth/PasswordRecovery";

const PasswordRecoveryPage = () => {
  return (
    <>
      <Helmet>
        <title>Reset Password | AI Spain Homes</title>
        <meta name="description" content="Reset your password to access your AI Spain Homes account." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-20 sm:pt-28 pb-12 sm:pb-16 flex items-center justify-center px-4 sm:px-6">
          <div className="container mx-auto">
            <PasswordRecovery />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PasswordRecoveryPage;
