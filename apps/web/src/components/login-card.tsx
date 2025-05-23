'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
import { login } from '@/utils/login';
import { AppRoutes } from '@/constants/routes';

// Define Zod schema for form validation
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginCard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(AppRoutes.DASHBOARD);
    }
  }, [session, status, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError('');

    try {
      await login(data.username, data.password);
      router.push(AppRoutes.DASHBOARD);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If checking authentication status, show loading
  if (status === 'loading') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">Checking authentication...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your username and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {serverError}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              {...register('username')}
              aria-invalid={errors.username ? 'true' : 'false'}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
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
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
