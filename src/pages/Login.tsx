
import { Helmet } from "react-helmet";
import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login | AI Spain Homes</title>
        <meta name="description" content="Login to access your property matches, saved favorites, and relocation services." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      
      <div className="pt-20 sm:pt-28 pb-12 sm:pb-16 flex items-center justify-center px-4 sm:px-6">
        <div className="container mx-auto">
          <LoginForm />
          
          <div className="mt-4 text-center">
            <Link to="/password-recovery">
              <Button variant="link" className="text-sm font-medium">
                <KeyRound className="mr-1 h-3.5 w-3.5" />
                Forgot your password?
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
