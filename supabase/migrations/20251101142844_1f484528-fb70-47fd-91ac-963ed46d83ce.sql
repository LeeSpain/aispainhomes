-- Performance indexes for recommendation tables
CREATE INDEX IF NOT EXISTS idx_property_recommendations_user_match 
ON property_recommendations(user_id, match_score DESC, created_at DESC)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_service_recommendations_user_category 
ON service_recommendations(user_id, service_category, created_at DESC)
WHERE is_active = true;

-- Index for questionnaire responses to support rate limiting checks
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_user_time 
ON questionnaire_responses(user_id, completed_at DESC);

-- Add a function to check rate limiting (1 submission per hour)
CREATE OR REPLACE FUNCTION public.check_questionnaire_rate_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_submission timestamptz;
BEGIN
  SELECT completed_at INTO last_submission
  FROM questionnaire_responses
  WHERE user_id = p_user_id
  ORDER BY completed_at DESC
  LIMIT 1;
  
  -- If no previous submission, allow
  IF last_submission IS NULL THEN
    RETURN true;
  END IF;
  
  -- Check if more than 1 hour has passed
  RETURN (now() - last_submission) > INTERVAL '1 hour';
END;
$$;