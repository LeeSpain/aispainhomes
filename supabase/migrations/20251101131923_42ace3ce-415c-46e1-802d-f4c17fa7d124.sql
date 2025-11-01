-- Add unique constraint on user_id to allow proper upsert
ALTER TABLE questionnaire_responses 
ADD CONSTRAINT questionnaire_responses_user_id_key UNIQUE (user_id);