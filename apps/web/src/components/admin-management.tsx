'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Edit,
  MoreHorizontal,
  Search,
  ChevronRight,
  Loader2,
} from 'lucide-react';

import { useMediaQuery } from '@/hooks/use-media-query';

import { getUsers } from '@/utils/get-users';
import { Admin } from '@/types/admin';
import ViewAdmin from './dialog/view-admin';
import AddAdmin from './dialog/add-admin';
import { UserRole } from '@abc-admin/enums';

export function AdminManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [isLoading, setIsLoading] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const users = await getUsers({ setIsLoading });
      setAdmins(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const newAdmin = {
    username: '',
    email: '',
    role: UserRole.ADMIN,
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    isActive: true,
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search admins..."
            className="w-full pl-8 sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <AddAdmin
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          newAdmin={newAdmin}
          onAdminAdded={fetchUsers}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Administrators</CardTitle>
          <CardDescription>
            Manage administrator accounts and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            // Mobile card view
            <div className="space-y-3">
              {filteredAdmins.length === 0 ? (
                <div className="rounded-md border p-4 text-center">
                  No administrators found
                </div>
              ) : (
                filteredAdmins.map((admin) => (
                  <Card key={admin.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <button
                        className="flex w-full items-center justify-between p-4 text-left"
                        onClick={() => handleViewAdmin(admin)}
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{admin.username}</div>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="text-sm">{admin.role}</div>
                            <Badge
                              variant={admin.isActive ? 'default' : 'secondary'}
                            >
                              {admin.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            // Desktop table view
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No administrators found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="font-normal">{admin.username}</div>
                      </TableCell>
                      <TableCell className="capitalize">{admin.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant={admin.isActive ? 'default' : 'secondary'}
                        >
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled>
                              <MoreHorizontal className="h-4 w-4 mr-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Admin Details</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <div className="flex flex-col space-y-1">
                                <span className="text-xs text-muted-foreground">
                                  ID
                                </span>
                                <span>{admin.id}</span>
                              </div>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {admin.isActive ? (
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
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <span className="mr-2">🔑</span>
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Admin Dialog */}
      <ViewAdmin
        isViewDialogOpen={isViewDialogOpen}
        setIsViewDialogOpen={setIsViewDialogOpen}
        selectedAdmin={selectedAdmin}
      />
    </div>
  );
}
