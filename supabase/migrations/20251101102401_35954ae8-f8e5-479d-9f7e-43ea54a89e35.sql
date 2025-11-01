-- Add new columns to questionnaire_responses for comprehensive data capture
ALTER TABLE questionnaire_responses
ADD COLUMN IF NOT EXISTS personal_info JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS relocation_timeline JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS legal_documentation JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS lifestyle_preferences JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS services_needed JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS special_requirements TEXT,
ADD COLUMN IF NOT EXISTS referral_source TEXT,
ADD COLUMN IF NOT EXISTS relocation_budget_range JSONB DEFAULT '{}'::jsonb;

-- Create user_questionnaire_history table for tracking changes
CREATE TABLE IF NOT EXISTS public.user_questionnaire_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  questionnaire_response_id UUID REFERENCES public.questionnaire_responses(id) ON DELETE CASCADE,
  field_changed TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on history table
ALTER TABLE public.user_questionnaire_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for history table
CREATE POLICY "Users can view own history"
ON public.user_questionnaire_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert history"
ON public.user_questionnaire_history
FOR INSERT
WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_questionnaire_history_user_id 
ON public.user_questionnaire_history(user_id);

CREATE INDEX IF NOT EXISTS idx_questionnaire_history_response_id 
ON public.user_questionnaire_history(questionnaire_response_id);