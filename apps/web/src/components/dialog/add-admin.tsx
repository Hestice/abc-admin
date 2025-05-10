import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { DialogFooter } from '../ui/dialog';
import { addUser } from '@/utils/add-admin';
import { NewAdmin } from '@/types/admin';
import { adminFormSchema } from '@/schema/add-admin.schema';
import PasswordRequirements from './password-requirements';

interface AddAdminProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  newAdmin: NewAdmin;
  onAdminAdded?: () => void;
}

export default function AddAdmin({
  isAddDialogOpen,
  setIsAddDialogOpen,
  newAdmin,
  onAdminAdded,
}: AddAdminProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      firstName: newAdmin.firstName || '',
      lastName: newAdmin.lastName || '',
      username: newAdmin.username || '',
      email: newAdmin.email || '',
      role: newAdmin.role || 'Admin',
      password: '',
      confirmPassword: '',
      isActive: newAdmin.isActive !== undefined ? newAdmin.isActive : true,
    },
  });

  const onSubmit = async (data: z.infer<typeof adminFormSchema>) => {
    setIsLoading(true);
    try {
      await addUser({
        newAdmin: data as NewAdmin,
        setIsLoading,
      });
      setIsAddDialogOpen(false);
      reset();
      if (onAdminAdded) {
        onAdminAdded();
      }
    } catch (error) {
      console.error('Failed to add admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogDescription>
            Create a new administrator account for the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="username" className="sm:text-right">
                Username
              </Label>
              <div className="sm:col-span-3">
                <Input
                  id="username"
                  {...register('username')}
                  className="w-full"
                  aria-invalid={errors.username ? 'true' : 'false'}
                />
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="email" className="sm:text-right">
                Email
              </Label>
              <div className="sm:col-span-3">
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="role" className="sm:text-right">
                Role
              </Label>
              <div className="sm:col-span-3">
                <Select defaultValue="Admin" disabled {...register('role')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <div className="relative mb-1 sm:justify-self-end flex flex-row gap-2">
                <Label htmlFor="password" className="sm:text-right">
                  Password
                </Label>
                <PasswordRequirements />
              </div>

              <div className="sm:col-span-3">
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full"
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="confirmPassword" className="sm:text-right">
                Confirm Password
              </Label>
              <div className="sm:col-span-3">
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                reset();
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Admin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
