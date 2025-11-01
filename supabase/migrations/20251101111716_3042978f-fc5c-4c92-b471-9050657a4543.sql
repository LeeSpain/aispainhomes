-- Create subscriptions table for tracking user subscription plans
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL CHECK (plan IN ('free', 'basic', 'premium', 'enterprise')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trial', 'cancelled', 'expired')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_billing_date TIMESTAMP WITH TIME ZONE,
  monthly_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own subscription
CREATE POLICY "Users can update own subscription"
ON public.subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert subscriptions
CREATE POLICY "Admins can insert subscriptions"
ON public.subscriptions
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update any subscription
CREATE POLICY "Admins can update any subscription"
ON public.subscriptions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Create user_alerts table for property and system alerts
CREATE TABLE public.user_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('property_match', 'new_properties', 'price_change', 'system', 'subscription')),
  title TEXT NOT NULL,
  description TEXT,
  property_id UUID,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;

-- Users can view their own alerts
CREATE POLICY "Users can view own alerts"
ON public.user_alerts
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own alerts (mark as read)
CREATE POLICY "Users can update own alerts"
ON public.user_alerts
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own alerts
CREATE POLICY "Users can delete own alerts"
ON public.user_alerts
FOR DELETE
USING (auth.uid() = user_id);

-- Service can insert alerts for users
CREATE POLICY "Service can insert alerts"
ON public.user_alerts
FOR INSERT
WITH CHECK (true);

-- Create index for faster alert queries
CREATE INDEX idx_user_alerts_user_id ON public.user_alerts(user_id);
CREATE INDEX idx_user_alerts_is_read ON public.user_alerts(user_id, is_read);
CREATE INDEX idx_user_alerts_created_at ON public.user_alerts(created_at DESC);

-- Add trigger for subscriptions updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();