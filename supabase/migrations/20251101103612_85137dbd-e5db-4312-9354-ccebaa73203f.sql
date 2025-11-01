-- Fix search_path security issue for sync_questionnaire_to_profile function
CREATE OR REPLACE FUNCTION sync_questionnaire_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET
    full_name = COALESCE((NEW.personal_info->>'fullName'), full_name),
    nationality = COALESCE((NEW.personal_info->>'nationality'), nationality),
    current_country = COALESCE((NEW.personal_info->>'currentCountry'), current_country),
    phone = COALESCE((NEW.personal_info->>'phone'), phone),
    relocation_timeline = COALESCE((NEW.relocation_timeline->>'relocateWhen'), relocation_timeline),
    budget_min = COALESCE((NEW.budget_range->>'min')::numeric, budget_min),
    budget_max = COALESCE((NEW.budget_range->>'max')::numeric, budget_max),
    preferred_locations = COALESCE(
      ARRAY(SELECT jsonb_array_elements_text(NEW.location_preferences)),
      preferred_locations
    ),
    property_type_preference = COALESCE(
      (SELECT string_agg(elem::text, ', ') FROM jsonb_array_elements_text(NEW.property_types::jsonb) AS elem),
      property_type_preference
    ),
    household_size = COALESCE((NEW.household_details->>'adults')::integer, household_size),
    has_pets = COALESCE((NEW.household_details->>'pets')::boolean, has_pets),
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;