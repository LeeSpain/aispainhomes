-- Fix 1: Add RLS policies to block direct modifications to user_roles
-- Only allow service-level operations to modify roles

CREATE POLICY "Block all INSERT on user_roles"
ON user_roles FOR INSERT
WITH CHECK (false);

CREATE POLICY "Block all UPDATE on user_roles"
ON user_roles FOR UPDATE
USING (false);

CREATE POLICY "Block all DELETE on user_roles"
ON user_roles FOR DELETE
USING (false);

-- Fix 3: Create rate limiting infrastructure
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint, window_start)
);

-- Enable RLS on rate_limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can view their own rate limit data
CREATE POLICY "Users can view own rate limits"
ON rate_limits FOR SELECT
USING (auth.uid() = user_id);

-- Service can insert/update rate limits
CREATE POLICY "Service can insert rate limits"
ON rate_limits FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service can update rate limits"
ON rate_limits FOR UPDATE
USING (true);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint_window 
ON rate_limits(user_id, endpoint, window_start);

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  _user_id UUID,
  _endpoint TEXT,
  _max_requests_per_minute INTEGER DEFAULT 20,
  _max_requests_per_hour INTEGER DEFAULT 100,
  _max_requests_per_day INTEGER DEFAULT 500,
  _tokens_used INTEGER DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  minute_window TIMESTAMPTZ;
  hour_window TIMESTAMPTZ;
  day_window TIMESTAMPTZ;
  minute_count INTEGER;
  hour_count INTEGER;
  day_count INTEGER;
  result JSON;
BEGIN
  minute_window := date_trunc('minute', NOW());
  hour_window := date_trunc('hour', NOW());
  day_window := date_trunc('day', NOW());
  
  -- Check minute limit
  SELECT COALESCE(SUM(request_count), 0) INTO minute_count
  FROM rate_limits
  WHERE user_id = _user_id 
    AND endpoint = _endpoint
    AND window_start >= minute_window;
  
  -- Check hour limit
  SELECT COALESCE(SUM(request_count), 0) INTO hour_count
  FROM rate_limits
  WHERE user_id = _user_id 
    AND endpoint = _endpoint
    AND window_start >= hour_window;
  
  -- Check day limit
  SELECT COALESCE(SUM(request_count), 0) INTO day_count
  FROM rate_limits
  WHERE user_id = _user_id 
    AND endpoint = _endpoint
    AND window_start >= day_window;
  
  -- Return limits info
  IF minute_count >= _max_requests_per_minute THEN
    result := json_build_object(
      'allowed', false,
      'limit_type', 'minute',
      'limit', _max_requests_per_minute,
      'current', minute_count,
      'retry_after', 60
    );
  ELSIF hour_count >= _max_requests_per_hour THEN
    result := json_build_object(
      'allowed', false,
      'limit_type', 'hour',
      'limit', _max_requests_per_hour,
      'current', hour_count,
      'retry_after', 3600
    );
  ELSIF day_count >= _max_requests_per_day THEN
    result := json_build_object(
      'allowed', false,
      'limit_type', 'day',
      'limit', _max_requests_per_day,
      'current', day_count,
      'retry_after', 86400
    );
  ELSE
    -- Increment counter
    INSERT INTO rate_limits (user_id, endpoint, window_start, request_count, tokens_used)
    VALUES (_user_id, _endpoint, minute_window, 1, _tokens_used)
    ON CONFLICT (user_id, endpoint, window_start)
    DO UPDATE SET 
      request_count = rate_limits.request_count + 1,
      tokens_used = rate_limits.tokens_used + _tokens_used;
    
    result := json_build_object(
      'allowed', true,
      'minute_remaining', _max_requests_per_minute - minute_count - 1,
      'hour_remaining', _max_requests_per_hour - hour_count - 1,
      'day_remaining', _max_requests_per_day - day_count - 1
    );
  END IF;
  
  RETURN result;
END;
$$;