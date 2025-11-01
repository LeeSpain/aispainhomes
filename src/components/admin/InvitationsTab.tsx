import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { invitationService, Invitation } from '@/services/invitationService';
import { Copy, Plus, Trash2, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';

const InvitationsTab = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [subscriptionType, setSubscriptionType] = useState<'free' | 'paid'>('free');
  const [subscriptionPlan, setSubscriptionPlan] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('7');

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    setLoading(true);
    const { invitations: data, error } = await invitationService.getInvitations();
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load invitations',
        variant: 'destructive',
      });
    } else {
      setInvitations(data);
    }
    
    setLoading(false);
  };

  const handleCreateInvitation = async () => {
    const { invitation, error } = await invitationService.createInvitation({
      email: email || undefined,
      role,
      subscriptionType,
      subscriptionPlan: subscriptionPlan || undefined,
      expiresInDays: parseInt(expiresInDays),
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create invitation',
        variant: 'destructive',
      });
    } else if (invitation) {
      toast({
        title: 'Success',
        description: 'Invitation created successfully',
      });
      
      // Copy URL to clipboard
      const url = invitationService.getInvitationUrl(invitation.invitation_code);
      navigator.clipboard.writeText(url);
      
      toast({
        title: 'Copied to Clipboard',
        description: 'Invitation link copied to clipboard',
      });
      
      setDialogOpen(false);
      resetForm();
      loadInvitations();
    }
  };

  const resetForm = () => {
    setEmail('');
    setRole('user');
    setSubscriptionType('free');
    setSubscriptionPlan('');
    setExpiresInDays('7');
  };

  const copyInvitationUrl = (code: string) => {
    const url = invitationService.getInvitationUrl(code);
    navigator.clipboard.writeText(url);
    
    toast({
      title: 'Copied',
      description: 'Invitation link copied to clipboard',
    });
  };

  const handleDeleteInvitation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invitation?')) return;
    
    const { error } = await invitationService.deleteInvitation(id);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete invitation',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Invitation deleted',
      });
      loadInvitations();
    }
  };

  const getStatusBadge = (invitation: Invitation) => {
    if (invitation.is_used) {
      return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Used</Badge>;
    }
    
    const expired = new Date(invitation.expires_at) < new Date();
    if (expired) {
      return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Expired</Badge>;
    }
    
    return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Active</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Invitations</h2>
          <p className="text-muted-foreground">Invite users with specific roles and subscription types</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Invitation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Invitation</DialogTitle>
              <DialogDescription>
                Generate a unique invitation link with specific permissions and access level
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  If provided, only this email can use the invitation
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as 'user' | 'admin')}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Client</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subscription">Account Type</Label>
                  <Select value={subscriptionType} onValueChange={(v) => setSubscriptionType(v as 'free' | 'paid')}>
                    <SelectTrigger id="subscription">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {subscriptionType === 'paid' && (
                <div className="space-y-2">
                  <Label htmlFor="plan">Subscription Plan</Label>
                  <Select value={subscriptionPlan} onValueChange={setSubscriptionPlan}>
                    <SelectTrigger id="plan">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter - €29/month</SelectItem>
                      <SelectItem value="professional">Professional - €79/month</SelectItem>
                      <SelectItem value="premium">Premium - €199/month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="expires">Expires In (Days)</Label>
                <Input
                  id="expires"
                  type="number"
                  min="1"
                  max="365"
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateInvitation}>
                Create Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Invitations</CardTitle>
          <CardDescription>
            Manage and track all invitation links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading invitations...</div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No invitations created yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-mono text-sm">
                      {invitation.invitation_code}
                    </TableCell>
                    <TableCell>
                      {invitation.email ? (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {invitation.email}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Anyone</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {invitation.role === 'admin' ? 'Admin' : 'Client'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={invitation.subscription_type === 'paid' ? 'default' : 'secondary'}>
                        {invitation.subscription_type === 'paid' ? 'Paid' : 'Free'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(invitation)}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(invitation.expires_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!invitation.is_used && new Date(invitation.expires_at) > new Date() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyInvitationUrl(invitation.invitation_code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteInvitation(invitation.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationsTab;
