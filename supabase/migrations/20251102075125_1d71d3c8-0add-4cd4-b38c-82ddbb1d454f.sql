-- Step 1: Make user_id nullable in tracked_websites for system resources
ALTER TABLE tracked_websites ALTER COLUMN user_id DROP NOT NULL;

-- Step 2: Drop old category check constraint and create new one allowing property_websites
ALTER TABLE tracked_websites DROP CONSTRAINT IF EXISTS tracked_websites_category_check;
ALTER TABLE tracked_websites ADD CONSTRAINT tracked_websites_category_check 
  CHECK (category IN ('properties', 'property_websites', 'legal_services', 'utilities', 'moving_services', 'schools', 'healthcare', 'official_resources', 'other'));

-- Step 3: Add unique constraint on url to prevent duplicates
ALTER TABLE tracked_websites ADD CONSTRAINT tracked_websites_url_key UNIQUE (url);

-- Step 4: Sync property websites from official_resources to tracked_websites
INSERT INTO tracked_websites (
  url,
  name,
  category,
  user_id,
  is_active,
  metadata,
  created_at,
  updated_at
)
SELECT 
  url,
  title,
  'property_websites',
  NULL,
  is_active,
  jsonb_build_object(
    'authority', authority,
    'trust_level', trust_level,
    'description', description,
    'subcategory', subcategory,
    'source', 'official_resources'
  ),
  created_at,
  now()
FROM official_resources
WHERE category = 'property_websites'
  AND is_active = true
ON CONFLICT (url) DO NOTHING;

-- Step 5: Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_tracked_websites_category ON tracked_websites(category);
CREATE INDEX IF NOT EXISTS idx_tracked_websites_url ON tracked_websites(url);