
import { Helmet } from "react-helmet";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login | AISpainHomes.com</title>
        <meta name="description" content="Login to access your property matches, saved favorites, and relocation services." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-20 sm:pt-28 pb-12 sm:pb-16 flex items-center justify-center px-4 sm:px-6">
          <div className="container mx-auto">
            <LoginForm />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Login;
