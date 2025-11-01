import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import InvitationsTab from '@/components/admin/InvitationsTab';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, RefreshCw, UserX, Pencil, Trash2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  status: string;
  subscription_plan: string;
  subscription_status: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed: boolean;
}

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    email: '',
    full_name: '',
    phone: '',
    role: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('admin-get-users');

      if (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUsers();
    setIsRefreshing(false);
    toast.success('Users refreshed');
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({
      email: user.email,
      full_name: user.full_name,
      phone: user.phone || '',
      role: user.role
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingUser) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.functions.invoke('admin-update-user', {
        body: {
          userId: editingUser.id,
          email: editForm.email !== editingUser.email ? editForm.email : undefined,
          full_name: editForm.full_name !== editingUser.full_name ? editForm.full_name : undefined,
          phone: editForm.phone !== editingUser.phone ? editForm.phone : undefined,
          role: editForm.role !== editingUser.role ? editForm.role : undefined
        }
      });

      if (error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update user');
        return;
      }

      toast.success('User updated successfully');
      setEditDialogOpen(false);
      setEditingUser(null);
      await loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setDeletingUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId: deletingUser.id }
      });

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
        return;
      }

      toast.success(`User ${deletingUser.full_name} deleted successfully`);
      setDeleteDialogOpen(false);
      setDeletingUser(null);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-50 text-red-700 ring-red-600/20';
      case 'moderator':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-gray-600/20';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-50 text-green-700 ring-green-600/20'
      : 'bg-amber-50 text-amber-700 ring-amber-600/20';
  };

  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList>
        <TabsTrigger value="users">Registered Users</TabsTrigger>
        <TabsTrigger value="invitations">Invitations</TabsTrigger>
      </TabsList>
      
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View, edit, and manage user accounts and their roles
                </CardDescription>
              </div>
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm text-muted-foreground">
                  {isLoading ? 'Loading...' : `Showing ${users.length} registered users`}
                </span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          <UserX className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.phone || '—'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-medium capitalize">{user.subscription_plan}</span>
                              <span className="text-xs text-muted-foreground capitalize">
                                {user.subscription_status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditClick(user)}
                                className="gap-1"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteClick(user)}
                                className="text-destructive hover:text-destructive gap-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="invitations">
        <InvitationsTab />
      </TabsContent>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone (Optional)</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to delete <strong>{deletingUser?.full_name}</strong>'s account?
              </p>
              <p className="text-destructive font-medium">
                This will permanently delete:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>User profile and authentication</li>
                <li>All questionnaire responses</li>
                <li>Property and service recommendations</li>
                <li>Subscriptions and payment history</li>
                <li>AI conversations and settings</li>
                <li>Tracked websites and alerts</li>
                <li>All other associated data</li>
              </ul>
              <p className="font-medium mt-4">
                After deletion, you can create a new account with the same email without conflicts.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  );
};

export default UsersTab;
