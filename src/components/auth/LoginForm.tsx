
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract redirect URL from query params if present
  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get("redirect") || "/dashboard";

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate(redirectUrl);
    } catch (error) {
      console.error("Login failed:", error);
      setGeneralError(
        error instanceof Error 
          ? error.message 
          : "Failed to login. Please check your credentials and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      const form = e.currentTarget.closest('form');
      if (form) form.requestSubmit();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login to Your Account</CardTitle>
        <CardDescription>
          Enter your email and password to access your property matches and relocation services.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {generalError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">
              Email
              <span aria-hidden="true" className="text-destructive ml-1">
                *
              </span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              onKeyDown={handleKeyDown}
              placeholder="name@example.com"
              required
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive mt-1">
                {errors.email}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">
                Password
                <span aria-hidden="true" className="text-destructive ml-1">
                  *
                </span>
              </Label>
              <Link 
                to="/reset-password" 
                className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-sm"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive mt-1">
                {errors.password}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-sm"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
