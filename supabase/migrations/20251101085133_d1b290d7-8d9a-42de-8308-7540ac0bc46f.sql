-- Create AI Settings Table
CREATE TABLE IF NOT EXISTS public.ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  model VARCHAR(50) DEFAULT 'gpt-4o-mini' NOT NULL,
  temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 1000 CHECK (max_tokens > 0),
  system_prompt TEXT DEFAULT 'You are a helpful AI assistant for Spanish property relocation. Help users find properties, understand relocation requirements, and navigate services.',
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create AI Conversations Table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id UUID NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  model VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI Usage Metrics Table
CREATE TABLE IF NOT EXISTS public.ai_usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_requests INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  estimated_cost DECIMAL(10,4) DEFAULT 0,
  model VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date, model)
);

-- Create Client Instructions Table
CREATE TABLE IF NOT EXISTS public.ai_client_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category VARCHAR(50) CHECK (category IN ('property_search', 'relocation', 'services', 'general')),
  instruction TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session ON public.ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created ON public.ai_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_date ON public.ai_usage_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON public.ai_usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_instructions_user ON public.ai_client_instructions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_instructions_active ON public.ai_client_instructions(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_client_instructions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_settings
CREATE POLICY "Users can view own AI settings" 
  ON public.ai_settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI settings" 
  ON public.ai_settings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI settings" 
  ON public.ai_settings FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for ai_conversations
CREATE POLICY "Users can view own conversations" 
  ON public.ai_conversations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" 
  ON public.ai_conversations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_usage_metrics
CREATE POLICY "Users can view own usage metrics" 
  ON public.ai_usage_metrics FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert usage metrics" 
  ON public.ai_usage_metrics FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Service can update usage metrics" 
  ON public.ai_usage_metrics FOR UPDATE 
  USING (true);

-- RLS Policies for ai_client_instructions
CREATE POLICY "Users can view own instructions" 
  ON public.ai_client_instructions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own instructions" 
  ON public.ai_client_instructions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own instructions" 
  ON public.ai_client_instructions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own instructions" 
  ON public.ai_client_instructions FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_ai_settings
  BEFORE UPDATE ON public.ai_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_ai_instructions
  BEFORE UPDATE ON public.ai_client_instructions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to initialize default AI settings for new users
CREATE OR REPLACE FUNCTION public.initialize_ai_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.ai_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default AI settings on user signup
CREATE TRIGGER on_auth_user_created_ai_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_ai_settings();