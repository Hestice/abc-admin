'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/constants/routes';
import { logout } from '@/utils/login';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutConfirmation({
  isOpen,
  onOpenChange,
}: LogoutConfirmationProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      setTimeout(() => {
        router.push(AppRoutes.HOME);
      }, 0);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out of your account?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogout}>Log Out</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
