-- Create table for AI-curated service recommendations
CREATE TABLE IF NOT EXISTS public.service_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_category VARCHAR NOT NULL, -- 'legal', 'utilities', 'movers', 'schools', 'healthcare'
  business_name TEXT NOT NULL,
  description TEXT,
  contact_info JSONB, -- phone, email, website, address
  location TEXT,
  rating NUMERIC,
  why_recommended TEXT, -- AI explanation of why this service matches user needs
  source_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_service_recommendations_user_id ON public.service_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_service_recommendations_category ON public.service_recommendations(service_category);

-- Enable RLS
ALTER TABLE public.service_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own service recommendations"
  ON public.service_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own service recommendations"
  ON public.service_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own service recommendations"
  ON public.service_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own service recommendations"
  ON public.service_recommendations FOR DELETE
  USING (auth.uid() = user_id);

-- Create table for AI-curated property recommendations
CREATE TABLE IF NOT EXISTS public.property_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID, -- Reference to extracted_items if from scraped data
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency VARCHAR DEFAULT 'EUR',
  property_type VARCHAR,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm NUMERIC,
  features TEXT[],
  images JSONB,
  source_url TEXT NOT NULL,
  match_score NUMERIC, -- AI-calculated match score (0-100)
  match_reasons TEXT[], -- Why this property matches user needs
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_property_recommendations_user_id ON public.property_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_property_recommendations_match_score ON public.property_recommendations(match_score DESC);

-- Enable RLS
ALTER TABLE public.property_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own property recommendations"
  ON public.property_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own property recommendations"
  ON public.property_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own property recommendations"
  ON public.property_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own property recommendations"
  ON public.property_recommendations FOR DELETE
  USING (auth.uid() = user_id);