'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { signUp } from '@/lib/auth/client';
import { AppRoutes } from '@/constants/routes';
import Link from 'next/link';
import { validateInviteCode } from '@/utils/invite-codes';

const signupSchema = z
  .object({
    inviteCode: z.string().min(1, 'Invite code is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      inviteCode: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const inviteCode = watch('inviteCode');

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.push(AppRoutes.DASHBOARD);
    }
  }, [isLoggedIn, authLoading, router]);

  // Validate invite code when it changes
  useEffect(() => {
    if (!inviteCode || inviteCode.trim() === '') {
      setIsCodeValid(false);
      setServerError('');
      return;
    }

    const validateCode = async () => {
      setIsValidatingCode(true);
      setServerError('');
      try {
        const validation = await validateInviteCode(inviteCode.trim());
        setIsCodeValid(validation.valid);
        if (!validation.valid) {
          setServerError(validation.message || 'Invalid invite code');
        }
      } catch (error) {
        setIsCodeValid(false);
        setServerError('Failed to validate invite code. Please try again.');
        console.error('Failed to validate invite code:', error);
      } finally {
        setIsValidatingCode(false);
      }
    };

    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateCode();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inviteCode]);

  const onSubmit = async (data: SignupFormValues) => {
    if (!isCodeValid) {
      setServerError('Please enter a valid invite code');
      return;
    }

    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      const { user } = await signUp(data.email, data.password, {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      });

      if (user) {
        // Store invite code in localStorage to consume after email confirmation
        // The invite code will be consumed when the user first authenticates
        localStorage.setItem('pendingInviteCode', data.inviteCode.trim());

        setSuccessMessage(
          'Account created! Please check your email to verify your account before signing in.'
        );
        // Optionally redirect to login after a delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'An error occurred during signup'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">Checking authentication...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 w-full">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
            <CardDescription>
              Create a new account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {serverError && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {serverError}
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {successMessage}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite Code</Label>
              <div className="relative">
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder="Enter your invite code"
                  {...register('inviteCode')}
                  aria-invalid={errors.inviteCode ? 'true' : 'false'}
                  className={errors.inviteCode ? 'border-red-500' : ''}
                />
                {isValidatingCode && (
                  <div className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                    Validating...
                  </div>
                )}
                {!isValidatingCode && inviteCode && (
                  <div className="absolute right-3 top-2.5">
                    {isCodeValid ? (
                      <span className="text-green-500 text-sm">✓</span>
                    ) : (
                      <span className="text-red-500 text-sm">✗</span>
                    )}
                  </div>
                )}
              </div>
              {errors.inviteCode && (
                <p className="text-sm text-red-500">
                  {errors.inviteCode.message}
                </p>
              )}
              {inviteCode &&
                !isValidatingCode &&
                !isCodeValid &&
                serverError && (
                  <p className="text-sm text-red-500">{serverError}</p>
                )}
              <p className="text-xs text-muted-foreground">
                Contact an administrator to receive an invite code.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading || !isCodeValid || isValidatingCode}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
