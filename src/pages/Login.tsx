
import { Helmet } from "react-helmet";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login | SunnyHomeFinder</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-28 pb-16 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <LoginForm />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Login;
