'use client';

import type React from 'react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, UserCog, Users, LogOut } from 'lucide-react';
import { AppRoutes } from '@/constants/routes';
import { LogoutConfirmation } from '@/components/dialog/logout-confirmation';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: 'Overview',
    href: AppRoutes.DASHBOARD,
    icon: BarChart3,
  },
  {
    title: 'Patients',
    href: AppRoutes.PATIENTS,
    icon: Users,
  },
  {
    title: 'Admin Management',
    href: AppRoutes.ADMINS,
    icon: UserCog,
  },
];

interface DashboardNavProps {
  collapsed?: boolean;
  onNavItemClick?: () => void;
}

export function DashboardNav({
  collapsed = false,
  onNavItemClick,
}: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleNavClick = (href: string) => {
    if (onNavItemClick) {
      onNavItemClick();
    }
    router.push(href);
  };

  return (
    <>
      <nav className="grid items-start px-2 text-sm font-medium flex-1 justify-start">
        <div className="flex flex-col gap-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground text-left',
                pathname === item.href && 'bg-muted text-foreground',
                collapsed ? 'justify-center' : ''
              )}
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.title}</span>}
            </button>
          ))}
        </div>
      </nav>
      <div className="px-2 pb-2 border-t pt-2">
        <button
          onClick={() => setShowLogoutDialog(true)}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground text-left w-full',
            collapsed ? 'justify-center' : ''
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
      <LogoutConfirmation
        isOpen={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      />
    </>
  );
}
