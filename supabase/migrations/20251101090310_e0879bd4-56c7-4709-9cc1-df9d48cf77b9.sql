-- Create tracked websites table for multi-tenant website monitoring
CREATE TABLE IF NOT EXISTS public.tracked_websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('properties', 'legal', 'utilities', 'movers', 'schools', 'healthcare', 'other')),
  industry VARCHAR(50),
  location VARCHAR(100),
  check_frequency VARCHAR(20) DEFAULT 'daily' CHECK (check_frequency IN ('hourly', 'daily', 'weekly')),
  is_active BOOLEAN DEFAULT true,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  last_status VARCHAR(20) DEFAULT 'pending' CHECK (last_status IN ('pending', 'active', 'error', 'paused')),
  last_error TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracked_websites_user ON public.tracked_websites(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_websites_category ON public.tracked_websites(category);
CREATE INDEX IF NOT EXISTS idx_tracked_websites_active ON public.tracked_websites(is_active);
CREATE INDEX IF NOT EXISTS idx_tracked_websites_next_check ON public.tracked_websites(last_checked_at) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.tracked_websites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tracked websites" ON public.tracked_websites 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tracked websites" ON public.tracked_websites 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tracked websites" ON public.tracked_websites 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tracked websites" ON public.tracked_websites 
  FOR DELETE USING (auth.uid() = user_id);

-- Create website scrape results table
CREATE TABLE IF NOT EXISTS public.website_scrape_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracked_website_id UUID NOT NULL REFERENCES public.tracked_websites(id) ON DELETE CASCADE,
  scrape_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
  items_found INTEGER DEFAULT 0,
  new_items INTEGER DEFAULT 0,
  changed_items INTEGER DEFAULT 0,
  removed_items INTEGER DEFAULT 0,
  scrape_duration_ms INTEGER,
  error_message TEXT,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scrape_results_website ON public.website_scrape_results(tracked_website_id);
CREATE INDEX IF NOT EXISTS idx_scrape_results_timestamp ON public.website_scrape_results(scrape_timestamp);

ALTER TABLE public.website_scrape_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scrape results" ON public.website_scrape_results 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tracked_websites 
      WHERE id = website_scrape_results.tracked_website_id 
      AND user_id = auth.uid()
    )
  );

-- Create extracted items table for detailed tracking
CREATE TABLE IF NOT EXISTS public.extracted_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracked_website_id UUID NOT NULL REFERENCES public.tracked_websites(id) ON DELETE CASCADE,
  external_id TEXT,
  item_type VARCHAR(50),
  title TEXT,
  description TEXT,
  url TEXT,
  price DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  location TEXT,
  images JSONB,
  metadata JSONB,
  first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  status_changed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tracked_website_id, external_id)
);

CREATE INDEX IF NOT EXISTS idx_extracted_items_website ON public.extracted_items(tracked_website_id);
CREATE INDEX IF NOT EXISTS idx_extracted_items_active ON public.extracted_items(is_active);
CREATE INDEX IF NOT EXISTS idx_extracted_items_first_seen ON public.extracted_items(first_seen_at);

ALTER TABLE public.extracted_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own extracted items" ON public.extracted_items 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tracked_websites 
      WHERE id = extracted_items.tracked_website_id 
      AND user_id = auth.uid()
    )
  );

-- Create website notifications table
CREATE TABLE IF NOT EXISTS public.website_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tracked_website_id UUID REFERENCES public.tracked_websites(id) ON DELETE CASCADE,
  notification_type VARCHAR(50),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.website_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.website_notifications(user_id, is_read) WHERE is_read = false;

ALTER TABLE public.website_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.website_notifications 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.website_notifications 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON public.website_notifications 
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_tracked_websites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tracked_websites_updated_at
  BEFORE UPDATE ON public.tracked_websites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tracked_websites_updated_at();

CREATE TRIGGER update_extracted_items_updated_at
  BEFORE UPDATE ON public.extracted_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tracked_websites_updated_at();