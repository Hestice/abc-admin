'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AppRoutes } from '@/constants/routes';

export default function Index() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.push(AppRoutes.DASHBOARD);
      } else {
        router.push('/login');
      }
    }
  }, [isLoggedIn, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">Loading...</div>
    </div>
  );
}
