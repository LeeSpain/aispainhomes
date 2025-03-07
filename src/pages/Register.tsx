
import { Helmet } from "react-helmet";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Create Account | AI Spain Homes</title>
        <meta name="description" content="Sign up for AI Spain Homes to find your perfect property in Spain and access our relocation services." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-20 sm:pt-28 pb-12 sm:pb-16 flex items-center justify-center px-4 sm:px-6">
          <div className="container mx-auto">
            <RegisterForm />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Register;
