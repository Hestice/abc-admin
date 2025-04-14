import React from 'react';
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

interface AddAdminProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  handleAddAdmin: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newAdmin: {
    username: string;
    email: string;
    role: string;
    password: string;
  };
}

export default function AddAdmin({
  isAddDialogOpen,
  setIsAddDialogOpen,
  handleAddAdmin,
  handleInputChange,
  newAdmin,
}: AddAdminProps) {
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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="username" className="sm:text-right">
              Username
            </Label>
            <Input
              id="username"
              value={newAdmin.username}
              onChange={handleInputChange}
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="email" className="sm:text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={newAdmin.email}
              onChange={handleInputChange}
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="role" className="sm:text-right">
              Role
            </Label>
            <div className="sm:col-span-3">
              <Select value={newAdmin.role} disabled>
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
            <Label htmlFor="password" className="sm:text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={newAdmin.password}
              onChange={handleInputChange}
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="confirmPassword" className="sm:text-right">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              onChange={handleInputChange}
              className="sm:col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAddDialogOpen(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button onClick={handleAddAdmin} className="w-full sm:w-auto">
            Add Admin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
