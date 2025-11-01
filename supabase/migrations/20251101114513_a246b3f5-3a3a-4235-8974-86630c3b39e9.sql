-- Create invitations table for user invites
CREATE TABLE public.user_invitations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_code text NOT NULL UNIQUE,
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text,
  role app_role NOT NULL DEFAULT 'user'::app_role,
  subscription_type text NOT NULL DEFAULT 'free',
  subscription_plan text,
  is_used boolean NOT NULL DEFAULT false,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Admins can view all invitations
CREATE POLICY "Admins can view all invitations"
ON public.user_invitations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can create invitations
CREATE POLICY "Admins can create invitations"
ON public.user_invitations
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view their own invitation by code (for registration)
CREATE POLICY "Public can view invitations by code"
ON public.user_invitations
FOR SELECT
USING (invitation_code IS NOT NULL AND is_used = false AND expires_at > now());

-- System can update invitations when used
CREATE POLICY "System can update used invitations"
ON public.user_invitations
FOR UPDATE
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_invitation_code ON public.user_invitations(invitation_code);
CREATE INDEX idx_invitation_email ON public.user_invitations(email);
CREATE INDEX idx_invitation_expires ON public.user_invitations(expires_at);

-- Function to generate unique invitation code
CREATE OR REPLACE FUNCTION generate_invitation_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    -- Generate a random 12-character code
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 12));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.user_invitations WHERE invitation_code = code) INTO exists;
    
    -- Exit loop if unique
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$;