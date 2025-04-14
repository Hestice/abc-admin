import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Admin } from '@/types/admin';
import { Edit } from 'lucide-react';

interface ViewAdminProps {
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (isOpen: boolean) => void;
  selectedAdmin: Admin;
}
export default function ViewAdmin({
  isViewDialogOpen,
  setIsViewDialogOpen,
  selectedAdmin,
}: ViewAdminProps) {
  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Details</DialogTitle>
          <DialogDescription>
            Detailed information about the administrator.
          </DialogDescription>
        </DialogHeader>
        {selectedAdmin && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{selectedAdmin.username}</h3>
              <Badge variant={selectedAdmin.isActive ? 'default' : 'secondary'}>
                {selectedAdmin.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Admin ID
                </p>
                <p>{selectedAdmin.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p>{selectedAdmin.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Role
                </p>
                <p>{selectedAdmin.role}</p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Actions</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    {selectedAdmin.isActive ? (
                      <>
                        <span className="mr-2">🔒</span>
                        Deactivate
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🔓</span>
                        Activate
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <span className="mr-2">🔑</span>
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsViewDialogOpen(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
