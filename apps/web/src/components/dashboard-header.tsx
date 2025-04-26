'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { LogoutConfirmation } from '@/components/dialog/logout-confirmation';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
}

export function DashboardHeader({ heading, text }: DashboardHeaderProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2">
        <div className="grid gap-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {heading}
          </h1>
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <LogoutConfirmation
        isOpen={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      />
    </>
  );
}
