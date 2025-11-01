-- Add Stripe-related columns to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_payment_method_id text,
ADD COLUMN IF NOT EXISTS trial_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS cancelled_at timestamp with time zone;

-- Create payment_history table for tracking all payments and invoices
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_invoice_id text UNIQUE,
  stripe_payment_intent_id text,
  amount numeric NOT NULL,
  currency varchar DEFAULT 'EUR',
  status varchar NOT NULL CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
  invoice_pdf text,
  description text,
  payment_date timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on payment_history
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own payment history
CREATE POLICY "Users can view own payment history"
  ON payment_history FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Admins can view all payment history
CREATE POLICY "Admins can view all payment history"
  ON payment_history FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policy: Service can insert payment records (for webhook)
CREATE POLICY "Service can insert payment history"
  ON payment_history FOR INSERT
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_subscription_id ON payment_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_stripe_invoice_id ON payment_history(stripe_invoice_id);

-- Add comment for documentation
COMMENT ON TABLE payment_history IS 'Stores all payment transactions and invoices from Stripe for user subscriptions';