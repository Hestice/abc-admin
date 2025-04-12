'use client';

import { Button } from '@/components/ui/button';
import { AppRoutes } from '@/constants/routes';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/utils/login';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
}

export function DashboardHeader({ heading, text }: DashboardHeaderProps) {
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2">
      <div className="grid gap-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          {heading}
        </h1>
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
