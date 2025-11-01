import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const EmailVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    let pollInterval: NodeJS.Timeout;

    const checkEmailVerification = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (currentUser?.email_confirmed_at) {
          setIsVerified(true);
          setIsChecking(false);
          clearInterval(pollInterval);
          
          // Wait a moment to show success state
          setTimeout(() => {
            toast.success('Email verified! Complete the questionnaire to continue.');
            navigate('/questionnaire');
          }, 1500);
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Error checking email verification:', error);
        setIsChecking(false);
      }
    };

    // Initial check
    checkEmailVerification();

    // Poll every 3 seconds
    pollInterval = setInterval(checkEmailVerification, 3000);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [user, navigate]);

  const handleResendEmail = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) throw error;
      toast.success('Verification email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Error resending email:', error);
      toast.error(error.message || 'Failed to resend email');
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify Your Email | AI Homes Spain</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              {isVerified ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Mail className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isVerified ? 'Email Verified!' : 'Verify Your Email'}
            </CardTitle>
            <CardDescription>
              {isVerified 
                ? 'Your email has been successfully verified.' 
                : 'We\'ve sent a verification link to your email address.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!isVerified && (
              <>
                <div className="space-y-4 text-center text-sm text-muted-foreground">
                  <p>
                    Please check your email inbox and click the verification link to continue.
                  </p>
                  <p className="font-medium text-foreground">
                    {user?.email}
                  </p>
                  <p className="text-xs">
                    Don't forget to check your spam folder if you don't see the email.
                  </p>
                </div>

                {isChecking && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Waiting for verification...</span>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={handleResendEmail}
                    variant="outline"
                    className="w-full"
                  >
                    Resend Verification Email
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="w-full"
                  >
                    Return to Home
                  </Button>
                </div>
              </>
            )}

            {isVerified && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EmailVerification;
