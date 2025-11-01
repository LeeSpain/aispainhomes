-- Phase 1: Database Foundation for Official Spanish Resources

-- Create official_resources table
CREATE TABLE public.official_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  authority TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  trust_level VARCHAR(20) DEFAULT 'high',
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_verified_at TIMESTAMPTZ,
  CONSTRAINT unique_resource_url UNIQUE(url)
);

-- Create resource_content_snapshots table for change detection
CREATE TABLE public.resource_content_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.official_resources(id) ON DELETE CASCADE,
  content_hash VARCHAR(64) NOT NULL,
  content_text TEXT,
  snapshot_date TIMESTAMPTZ DEFAULT now(),
  change_detected BOOLEAN DEFAULT false,
  change_summary TEXT
);

-- Create ai_response_citations table
CREATE TABLE public.ai_response_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  user_id UUID NOT NULL,
  resource_id UUID NOT NULL REFERENCES public.official_resources(id) ON DELETE CASCADE,
  cited_at TIMESTAMPTZ DEFAULT now(),
  query_context TEXT
);

-- Add cited_resources column to ai_conversations
ALTER TABLE public.ai_conversations 
ADD COLUMN cited_resources JSONB DEFAULT '[]'::jsonb;

-- Create indexes for performance
CREATE INDEX idx_official_resources_category ON public.official_resources(category);
CREATE INDEX idx_official_resources_active ON public.official_resources(is_active);
CREATE INDEX idx_official_resources_trust ON public.official_resources(trust_level);
CREATE INDEX idx_resource_snapshots_resource_id ON public.resource_content_snapshots(resource_id);
CREATE INDEX idx_resource_snapshots_date ON public.resource_content_snapshots(snapshot_date DESC);
CREATE INDEX idx_ai_citations_user_id ON public.ai_response_citations(user_id);
CREATE INDEX idx_ai_citations_resource_id ON public.ai_response_citations(resource_id);

-- Enable RLS
ALTER TABLE public.official_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_content_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_response_citations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for official_resources (publicly readable)
CREATE POLICY "Official resources are viewable by everyone"
  ON public.official_resources FOR SELECT
  USING (is_active = true);

-- RLS Policies for resource_content_snapshots (admin only)
CREATE POLICY "Snapshots viewable by authenticated users"
  ON public.resource_content_snapshots FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for ai_response_citations
CREATE POLICY "Users can view own citations"
  ON public.ai_response_citations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert citations"
  ON public.ai_response_citations FOR INSERT
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_official_resources_updated_at
  BEFORE UPDATE ON public.official_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();