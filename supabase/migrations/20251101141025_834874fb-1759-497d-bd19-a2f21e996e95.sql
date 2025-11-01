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

    -- Robust pets handling: boolean, array, or object
    has_pets = COALESCE(
      CASE
        WHEN NEW.household_details ? 'pets' THEN
          CASE
            WHEN jsonb_typeof(NEW.household_details->'pets') = 'boolean' THEN (NEW.household_details->>'pets')::boolean
            WHEN jsonb_typeof(NEW.household_details->'pets') = 'array' THEN (jsonb_array_length(NEW.household_details->'pets') > 0)
            WHEN jsonb_typeof(NEW.household_details->'pets') = 'object' THEN true
            ELSE NULL
          END
        ELSE NULL
      END,
      has_pets
    ),

    -- Optional improvement: compute household size from adults + children when available
    household_size = COALESCE(
      COALESCE((NEW.household_details->>'adults')::integer, 0) + COALESCE((NEW.household_details->>'children')::integer, 0),
      household_size
    ),

    updated_at = NOW()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$function$;