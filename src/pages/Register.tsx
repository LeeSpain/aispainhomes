
import { Helmet } from "react-helmet";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Create Account | SunnyHomeFinder</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <RegisterForm />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Register;
