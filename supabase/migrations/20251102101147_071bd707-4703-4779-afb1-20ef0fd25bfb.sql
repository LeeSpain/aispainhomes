-- Add missing columns to property_recommendations table
ALTER TABLE property_recommendations
ADD COLUMN IF NOT EXISTS external_url text,
ADD COLUMN IF NOT EXISTS reference_number text,
ADD COLUMN IF NOT EXISTS listing_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS last_checked timestamp with time zone DEFAULT now();

-- Add index on external_url for faster lookups
CREATE INDEX IF NOT EXISTS idx_property_recommendations_external_url 
ON property_recommendations(external_url);

-- Add index on reference_number for deduplication
CREATE INDEX IF NOT EXISTS idx_property_recommendations_reference_number 
ON property_recommendations(reference_number);

-- Update existing records to use source_url as external_url if not set
UPDATE property_recommendations 
SET external_url = source_url 
WHERE external_url IS NULL AND source_url IS NOT NULL;