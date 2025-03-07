
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const passwordRecoverySchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type PasswordRecoveryValues = z.infer<typeof passwordRecoverySchema>;

const PasswordRecovery = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const form = useForm<PasswordRecoveryValues>({
    resolver: zodResolver(passwordRecoverySchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: PasswordRecoveryValues) => {
    setIsSubmitting(true);

    try {
      // This would connect to a real API in production
      // For now, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Password recovery requested for:', data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password recovery error:', error);
      toast.error('Failed to send recovery email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent you a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="flex justify-center py-4">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <p className="text-muted-foreground">
            We've sent an email to <strong>{form.getValues().email}</strong> with a link to reset your password.
          </p>
          <p className="text-sm text-muted-foreground">
            If you don't see it in your inbox, check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsSubmitted(false)}
          >
            Try a different email
          </Button>
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={() => navigate('/login')}
          >
            Back to login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="flex justify-center py-2">
              <KeyRound className="h-12 w-12 text-primary" />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      autoComplete="email" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full" 
              onClick={() => navigate('/login')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default PasswordRecovery;
