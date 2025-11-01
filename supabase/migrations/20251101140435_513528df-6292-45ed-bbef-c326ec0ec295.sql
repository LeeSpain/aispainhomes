-- Ensure unique index on user_id for questionnaire_responses to support upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'questionnaire_responses_user_id_unique_idx'
  ) THEN
    CREATE UNIQUE INDEX questionnaire_responses_user_id_unique_idx ON public.questionnaire_responses (user_id);
  END IF;
END $$;

-- Replace function to avoid casting text[] to jsonb and handle location flexibly
CREATE OR REPLACE FUNCTION public.sync_questionnaire_to_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE profiles
  SET
    full_name = COALESCE(NEW.personal_info->>'fullName', full_name),
    nationality = COALESCE(NEW.personal_info->>'nationality', nationality),
    current_country = COALESCE(NEW.personal_info->>'currentCountry', current_country),
    phone = COALESCE(NEW.personal_info->>'phone', phone),
    relocation_timeline = COALESCE(NEW.relocation_timeline->>'timeframe', relocation_timeline),
    budget_min = COALESCE((NEW.budget_range->>'min')::numeric, budget_min),
    budget_max = COALESCE((NEW.budget_range->>'max')::numeric, budget_max),

    preferred_locations = COALESCE(
      CASE
        WHEN jsonb_typeof(NEW.location_preferences) = 'array' THEN
          ARRAY(SELECT jsonb_array_elements_text(NEW.location_preferences))
        WHEN jsonb_typeof(NEW.location_preferences) = 'object' THEN
          CASE
            WHEN NEW.location_preferences ? 'location' THEN ARRAY[NEW.location_preferences->>'location']
            ELSE preferred_locations
          END
        ELSE preferred_locations
      END,
      preferred_locations
    ),

    property_type_preference = COALESCE(
      NULLIF(array_to_string(NEW.property_types, ', '), ''),
      property_type_preference
    ),

    household_size = COALESCE((NEW.household_details->>'adults')::integer, household_size),
    has_pets = COALESCE((NEW.household_details->>'pets')::boolean, has_pets),
    updated_at = NOW()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$function$;