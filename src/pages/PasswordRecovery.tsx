
import { Helmet } from "react-helmet";
import PasswordRecovery from "@/components/auth/PasswordRecovery";

const PasswordRecoveryPage = () => {
  return (
    <>
      <Helmet>
        <title>Reset Password | AI Homes Spain</title>
        <meta name="description" content="Reset your password to access your AI Homes Spain account." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      
      <div className="pt-20 sm:pt-28 pb-12 sm:pb-16 flex items-center justify-center px-4 sm:px-6">
        <div className="container mx-auto">
          <PasswordRecovery />
        </div>
      </div>
    </>
  );
};

export default PasswordRecoveryPage;
