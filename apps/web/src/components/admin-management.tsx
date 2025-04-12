"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Search, Trash2, UserPlus, ChevronRight } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMediaQuery } from "@/hooks/use-media-query"

// Mock data for demonstration
const admins = [
  {
    id: "A001",
    name: "Admin User",
    email: "admin@example.com",
    role: "Super Admin",
    lastActive: "2023-06-15 09:30 AM",
    status: "Active",
  },
  {
    id: "A002",
    name: "Jane Admin",
    email: "jane@example.com",
    role: "Admin",
    lastActive: "2023-06-14 02:15 PM",
    status: "Active",
  },
  {
    id: "A003",
    name: "Bob Manager",
    email: "bob@example.com",
    role: "Manager",
    lastActive: "2023-06-10 11:45 AM",
    status: "Active",
  },
  {
    id: "A004",
    name: "Sarah Viewer",
    email: "sarah@example.com",
    role: "Viewer",
    lastActive: "2023-06-05 03:20 PM",
    status: "Inactive",
  },
]

export function AdminManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Admin",
    password: "",
    confirmPassword: "",
  })

  // Filter admins based on search term
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddAdmin = () => {
    // In a real application, this would add a new admin to the database
    console.log("Adding new admin:", newAdmin)
    setIsAddDialogOpen(false)
    // Reset form
    setNewAdmin({
      name: "",
      email: "",
      role: "Admin",
      password: "",
      confirmPassword: "",
    })
  }

  const handleViewAdmin = (admin: any) => {
    setSelectedAdmin(admin)
    setIsViewDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewAdmin((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleRoleChange = (value: string) => {
    setNewAdmin((prev) => ({
      ...prev,
      role: value,
    }))
  }

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
              <DialogDescription>Create a new administrator account for the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="name" className="sm:text-right">
                  Name
                </Label>
                <Input id="name" value={newAdmin.name} onChange={handleInputChange} className="sm:col-span-3" />
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
                  <Select value={newAdmin.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
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
                  value={newAdmin.confirmPassword}
                  onChange={handleInputChange}
                  className="sm:col-span-3"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleAddAdmin} className="w-full sm:w-auto">
                Add Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Administrators</CardTitle>
          <CardDescription>Manage administrator accounts and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            // Mobile card view
            <div className="space-y-3">
              {filteredAdmins.length === 0 ? (
                <div className="rounded-md border p-4 text-center">No administrators found</div>
              ) : (
                filteredAdmins.map((admin) => (
                  <Card key={admin.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <button
                        className="flex w-full items-center justify-between p-4 text-left"
                        onClick={() => handleViewAdmin(admin)}
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{admin.name}</div>
                          <div className="text-xs text-muted-foreground">{admin.email}</div>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="text-sm">{admin.role}</div>
                            <Badge variant={admin.status === "Active" ? "default" : "secondary"}>{admin.status}</Badge>
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
                {filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No administrators found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="font-medium">{admin.name}</div>
                        <div className="text-xs text-muted-foreground">{admin.email}</div>
                      </TableCell>
                      <TableCell>{admin.role}</TableCell>
                      <TableCell>
                        <Badge variant={admin.status === "Active" ? "default" : "secondary"}>{admin.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4 mr-1" />
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Admin Details</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <div className="flex flex-col space-y-1">
                                <span className="text-xs text-muted-foreground">ID</span>
                                <span>{admin.id}</span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <div className="flex flex-col space-y-1">
                                <span className="text-xs text-muted-foreground">Last Active</span>
                                <span>{admin.lastActive}</span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {admin.status === "Active" ? (
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
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Admin
                            </DropdownMenuItem>
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
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Admin Details</DialogTitle>
            <DialogDescription>Detailed information about the administrator.</DialogDescription>
          </DialogHeader>
          {selectedAdmin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{selectedAdmin.name}</h3>
                <Badge variant={selectedAdmin.status === "Active" ? "default" : "secondary"}>
                  {selectedAdmin.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Admin ID</p>
                  <p>{selectedAdmin.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedAdmin.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p>{selectedAdmin.role}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Active</p>
                  <p>{selectedAdmin.lastActive}</p>
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
                      {selectedAdmin.status === "Active" ? (
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
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
