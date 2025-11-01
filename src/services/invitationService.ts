import { supabase } from '@/integrations/supabase/client';

export interface Invitation {
  id: string;
  invitation_code: string;
  invited_by: string | null;
  email: string | null;
  role: string;
  subscription_type: string;
  subscription_plan: string | null;
  is_used: boolean;
  used_by: string | null;
  expires_at: string;
  used_at: string | null;
  created_at: string;
  metadata: any;
}

export interface CreateInvitationParams {
  email?: string;
  role: 'admin' | 'user';
  subscriptionType: 'free' | 'paid';
  subscriptionPlan?: string;
  expiresInDays?: number;
}

class InvitationService {
  async createInvitation(params: CreateInvitationParams): Promise<{ invitation: Invitation | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate invitation code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_invitation_code');

      if (codeError) throw codeError;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (params.expiresInDays || 7));

      const { data, error } = await supabase
        .from('user_invitations')
        .insert([{
          invitation_code: codeData,
          invited_by: user.id,
          email: params.email || null,
          role: params.role,
          subscription_type: params.subscriptionType,
          subscription_plan: params.subscriptionPlan || null,
          expires_at: expiresAt.toISOString(),
        }])
        .select()
        .single();

      return { invitation: data, error };
    } catch (error) {
      return { invitation: null, error };
    }
  }

  async getInvitations(): Promise<{ invitations: Invitation[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      return { invitations: data || [], error };
    } catch (error) {
      return { invitations: [], error };
    }
  }

  async getInvitationByCode(code: string): Promise<{ invitation: Invitation | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .eq('invitation_code', code)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      return { invitation: data, error };
    } catch (error) {
      return { invitation: null, error };
    }
  }

  async markInvitationAsUsed(invitationId: string, userId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('user_invitations')
        .update({
          is_used: true,
          used_by: userId,
          used_at: new Date().toISOString(),
        })
        .eq('id', invitationId);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  async deleteInvitation(invitationId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('user_invitations')
        .delete()
        .eq('id', invitationId);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  getInvitationUrl(code: string): string {
    return `${window.location.origin}/register?invite=${code}`;
  }
}

export const invitationService = new InvitationService();
