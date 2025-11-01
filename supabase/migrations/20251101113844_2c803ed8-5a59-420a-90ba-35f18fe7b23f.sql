-- Add official Spanish government resources for relocation

-- Immigration & Visas
INSERT INTO public.official_resources (category, subcategory, authority, url, title, description, trust_level, is_active) VALUES
('immigration', 'visas', 'Spanish Government', 'https://www.exteriores.gob.es/en/', 'Ministry of Foreign Affairs - Visas', 'Official information on Spanish visas, residence permits, and immigration procedures', 'high', true),
('immigration', 'nie', 'National Police', 'https://www.policia.es/', 'National Police - NIE/TIE', 'NIE (foreigner identification number) and residence card applications', 'high', true),
('immigration', 'residence', 'Immigration Office', 'https://www.inclusion.gob.es/', 'Ministry of Inclusion - Immigration', 'Residence permits, work authorization, and immigration services', 'high', true),

-- Property & Housing
('property', 'registration', 'Property Registry', 'https://www.registradores.org/', 'Property Registry Office', 'Official property registration, title deeds, and ownership verification', 'high', true),
('property', 'rental', 'Housing Ministry', 'https://www.mitma.gob.es/', 'Ministry of Transport & Housing', 'Housing regulations, rental laws, and tenant rights', 'high', true),
('property', 'taxes', 'Tax Agency', 'https://www.agenciatributaria.es/', 'Spanish Tax Agency - Property Taxes', 'Property tax information (IBI, capital gains, wealth tax)', 'high', true),

-- Finance & Banking
('finance', 'taxes', 'Tax Agency', 'https://www.agenciatributaria.es/', 'Agencia Tributaria', 'Spanish tax authority for income tax, VAT, and all tax matters', 'high', true),
('finance', 'social_security', 'Social Security', 'https://www.seg-social.es/', 'Social Security Treasury', 'Social security registration, contributions, and benefits', 'high', true),
('finance', 'banking', 'Bank of Spain', 'https://www.bde.es/', 'Bank of Spain', 'Banking regulations, mortgage information, and financial consumer protection', 'high', true),

-- Healthcare
('healthcare', 'public', 'Health Ministry', 'https://www.sanidad.gob.es/', 'Ministry of Health', 'Public healthcare system, health card registration, and medical services', 'high', true),
('healthcare', 'insurance', 'Social Security Health', 'https://www.seg-social.es/wps/portal/wss/internet/Trabajadores', 'Social Security Healthcare', 'Public health insurance and medical coverage information', 'high', true),
('healthcare', 'european', 'European Health Card', 'https://www.seg-social.es/wps/portal/wss/internet/Inicio', 'European Health Insurance Card', 'EHIC for EU citizens and healthcare coverage across Europe', 'high', true),

-- Education
('education', 'schools', 'Education Ministry', 'https://www.educacionyfp.gob.es/', 'Ministry of Education', 'School enrollment, education system, and academic credentials', 'high', true),
('education', 'universities', 'Universities', 'https://www.universidades.gob.es/', 'Universities & Research', 'University admission, degree recognition, and higher education', 'high', true),
('education', 'language', 'Cervantes Institute', 'https://www.cervantes.es/', 'Instituto Cervantes', 'Spanish language courses and DELE certification', 'high', true),

-- Utilities
('utilities', 'electricity', 'Energy Regulator', 'https://www.cnmc.es/', 'National Energy Commission', 'Electricity providers, tariffs, and consumer rights', 'high', true),
('utilities', 'water', 'Water Authority', 'https://www.miteco.gob.es/', 'Ministry of Ecological Transition - Water', 'Water supply information and regulations', 'high', true),
('utilities', 'telecommunications', 'Telecom Regulator', 'https://www.cnmc.es/', 'Telecommunications Regulation', 'Internet, phone providers, and consumer protection', 'high', true),

-- Transport
('transport', 'drivers_license', 'DGT', 'https://sede.dgt.gob.es/', 'Directorate-General for Traffic', 'Driver license exchange, vehicle registration, and traffic regulations', 'high', true),
('transport', 'public', 'Transport Ministry', 'https://www.mitma.gob.es/', 'Ministry of Transport', 'Public transport information and infrastructure', 'high', true),
('transport', 'vehicles', 'Vehicle Registration', 'https://sede.dgt.gob.es/', 'DGT - Vehicle Registration', 'Car registration, import procedures, and vehicle documentation', 'high', true),

-- Work & Employment
('work', 'employment', 'Employment Service', 'https://www.sepe.es/', 'State Employment Service (SEPE)', 'Job search, unemployment benefits, and work permits', 'high', true),
('work', 'labor_law', 'Labor Ministry', 'https://www.mites.gob.es/', 'Ministry of Labor', 'Employment contracts, labor rights, and workplace regulations', 'high', true),
('work', 'self_employment', 'Self-Employed', 'https://www.seg-social.es/wps/portal/wss/internet/Autonomos', 'Social Security - Self-Employed', 'Autónomo registration and self-employment information', 'high', true),

-- Integration & Culture
('integration', 'citizenship', 'Justice Ministry', 'https://www.mjusticia.gob.es/', 'Ministry of Justice - Citizenship', 'Spanish citizenship, nationality applications, and civil registry', 'high', true),
('integration', 'culture', 'Culture Ministry', 'https://www.culturaydeporte.gob.es/', 'Ministry of Culture', 'Cultural integration, events, and Spanish heritage', 'high', true),
('integration', 'local_govt', 'Town Halls', 'https://www.femp.es/', 'Spanish Federation of Municipalities', 'Padrón registration and local government services', 'high', true),

-- Lifestyle
('lifestyle', 'consumer', 'Consumer Affairs', 'https://www.consumo.gob.es/', 'Ministry of Consumer Affairs', 'Consumer rights, complaints, and protection services', 'high', true),
('lifestyle', 'environment', 'Environment Ministry', 'https://www.miteco.gob.es/', 'Ministry of Ecological Transition', 'Environmental regulations and sustainability', 'high', true),
('lifestyle', 'tourism', 'Tourism Board', 'https://www.spain.info/', 'Spain Tourism Office', 'Tourist information, attractions, and travel resources', 'high', true)

ON CONFLICT (url) DO NOTHING;