-- Set default active for property recommendations (idempotent)
ALTER TABLE public.property_recommendations
ALTER COLUMN is_active SET DEFAULT true;

-- Optimize reads when loading active recommendations per user
CREATE INDEX IF NOT EXISTS idx_property_recs_user_active
ON public.property_recommendations (user_id, is_active, search_timestamp DESC);

-- Optional but helpful: optimize service recs similarly
CREATE INDEX IF NOT EXISTS idx_service_recs_user_active
ON public.service_recommendations (user_id, is_active, search_timestamp DESC);
