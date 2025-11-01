-- Add search tracking fields to property_recommendations
ALTER TABLE property_recommendations 
ADD COLUMN IF NOT EXISTS search_query text,
ADD COLUMN IF NOT EXISTS search_timestamp timestamptz,
ADD COLUMN IF NOT EXISTS source_website text,
ADD COLUMN IF NOT EXISTS search_method text DEFAULT 'live_search';

-- Add search tracking fields to service_recommendations
ALTER TABLE service_recommendations 
ADD COLUMN IF NOT EXISTS search_query text,
ADD COLUMN IF NOT EXISTS search_timestamp timestamptz,
ADD COLUMN IF NOT EXISTS search_method text DEFAULT 'live_search';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_property_recommendations_search_timestamp 
ON property_recommendations(search_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_service_recommendations_search_timestamp 
ON service_recommendations(search_timestamp DESC);