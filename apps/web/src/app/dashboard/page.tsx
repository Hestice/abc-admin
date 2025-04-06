'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/utils/login';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/constants/routes';
import React from 'react';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push(AppRoutes.HOME);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
