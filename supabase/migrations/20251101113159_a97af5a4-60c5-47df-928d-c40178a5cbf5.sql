-- Insert property websites into official_resources
-- Category: property_websites for property listing sites

INSERT INTO public.official_resources (category, subcategory, authority, url, title, description, trust_level, is_active, metadata) VALUES
-- Spanish Property Portals
('property_websites', 'spanish_portals', 'Idealista', 'https://www.idealista.com', 'Idealista', 'Leading Spanish property portal with extensive listings across Spain', 'high', true, '{"country": "ES", "type": "portal", "scraping_supported": true}'),
('property_websites', 'spanish_portals', 'Fotocasa', 'https://www.fotocasa.es', 'Fotocasa', 'Major Spanish property platform with rentals and sales listings', 'high', true, '{"country": "ES", "type": "portal", "scraping_supported": true}'),
('property_websites', 'spanish_portals', 'Habitaclia', 'https://www.habitaclia.com', 'Habitaclia', 'Popular Spanish property website focusing on Catalonia and nationwide', 'high', true, '{"country": "ES", "type": "portal", "scraping_supported": true}'),
('property_websites', 'spanish_portals', 'Pisos.com', 'https://www.pisos.com', 'Pisos.com', 'One of Spain''s oldest and most trusted property portals', 'high', true, '{"country": "ES", "type": "portal", "scraping_supported": true}'),
('property_websites', 'spanish_portals', 'YaEncontre', 'https://www.yaencontre.com', 'YaEncontre', 'Spanish property search engine aggregating multiple sources', 'medium', true, '{"country": "ES", "type": "aggregator"}'),
('property_websites', 'spanish_portals', 'Spainhouses.net', 'https://www.spainhouses.net', 'Spainhouses.net', 'Specialized portal for properties across Spain', 'medium', true, '{"country": "ES", "type": "portal"}'),
('property_websites', 'spanish_portals', 'Tucasa.com', 'https://www.tucasa.com', 'Tucasa.com', 'Spanish property marketplace for buying and renting', 'medium', true, '{"country": "ES", "type": "portal"}'),
('property_websites', 'spanish_portals', 'Globaliza', 'https://www.globaliza.com', 'Globaliza', 'International property platform with Spanish listings', 'medium', true, '{"country": "ES", "type": "international"}'),
('property_websites', 'spanish_portals', 'Indomio', 'https://www.indomio.es', 'Indomio', 'Spanish property portal with comprehensive listings', 'medium', true, '{"country": "ES", "type": "portal"}'),
('property_websites', 'spanish_portals', 'Kyero', 'https://www.kyero.com', 'Kyero', 'International portal specializing in Spanish properties for foreign buyers', 'high', true, '{"country": "ES", "type": "international", "scraping_supported": true}'),
('property_websites', 'spanish_portals', 'Housage', 'https://www.housage.com', 'Housage', 'Modern Spanish property platform', 'medium', true, '{"country": "ES", "type": "portal"}'),
('property_websites', 'spanish_portals', 'Servihabitat', 'https://www.servihabitat.com', 'Servihabitat', 'Bank-owned and foreclosed properties in Spain', 'high', true, '{"country": "ES", "type": "specialized"}'),
('property_websites', 'spanish_portals', 'Nuroa', 'https://www.nuroa.es', 'Nuroa', 'Spanish property search and listings platform', 'medium', true, '{"country": "ES", "type": "portal"}'),

-- Rural & Agricultural Properties
('property_websites', 'rural_agricultural', 'Agroanuncios', 'https://www.agroanuncios.com', 'Agroanuncios Fincas', 'Specialized in rural properties and agricultural land in Spain', 'medium', true, '{"country": "ES", "type": "specialized", "focus": "rural"}'),
('property_websites', 'rural_agricultural', 'Fincas Rústicas', 'https://www.fincasrusticas.org', 'Fincas Rústicas', 'Dedicated to rustic properties and countryside estates', 'medium', true, '{"country": "ES", "type": "specialized", "focus": "rural"}'),
('property_websites', 'rural_agricultural', 'Polígono y Parcela', 'https://www.poligonoyparcela.com', 'Polígono y Parcela', 'Industrial plots and land parcels in Spain', 'medium', true, '{"country": "ES", "type": "specialized", "focus": "industrial"}'),
('property_websites', 'rural_agricultural', 'Anuncio Finca', 'https://www.anunciofinca.com', 'Anuncio Finca', 'Rural property advertisements and farm listings', 'medium', true, '{"country": "ES", "type": "specialized", "focus": "rural"}'),
('property_websites', 'rural_agricultural', 'Aldeas Abandonadas', 'https://www.aldeasabandonadas.com', 'Aldeas Abandonadas', 'Unique platform for abandoned villages and restoration projects', 'medium', true, '{"country": "ES", "type": "specialized", "focus": "restoration"}'),

-- Classifieds
('property_websites', 'classifieds', 'Tablón de Anuncios', 'https://www.tablondeanuncios.com', 'Tablón de Anuncios', 'General classifieds including property listings', 'medium', true, '{"country": "ES", "type": "classifieds"}'),
('property_websites', 'classifieds', 'Milanuncios', 'https://www.milanuncios.com', 'Milanuncios', 'Popular Spanish classifieds site with property section', 'high', true, '{"country": "ES", "type": "classifieds"}'),

-- Search Aggregators
('property_websites', 'aggregators', 'TodoPisos', 'https://www.todopisos.es', 'TodoPisos.es', 'Property search aggregator covering multiple Spanish sites', 'medium', true, '{"country": "ES", "type": "aggregator"}'),
('property_websites', 'aggregators', 'Trovit', 'https://www.trovit.es', 'Trovit', 'International search engine for properties, jobs, and cars', 'high', true, '{"country": "ES", "type": "aggregator"}'),

-- International Portals (Spain focused)
('property_websites', 'international', 'ThinkSpain', 'https://www.thinkspain.com', 'ThinkSpain', 'English-language portal for properties in Spain', 'high', true, '{"country": "ES", "type": "international", "language": "en"}'),
('property_websites', 'international', 'Green-Acres', 'https://www.green-acres.es', 'Green-Acres', 'International portal with strong Spanish property presence', 'high', true, '{"country": "ES", "type": "international"}'),
('property_websites', 'international', 'Rightmove Overseas', 'https://www.rightmove.co.uk/overseas-property.html', 'Rightmove Overseas', 'UK''s leading property portal, overseas section includes Spain', 'high', true, '{"country": "UK", "type": "international", "coverage": "Spain"}'),
('property_websites', 'international', 'Zoopla Overseas', 'https://www.zoopla.co.uk/overseas/', 'Zoopla Overseas', 'Major UK property site with international listings', 'high', true, '{"country": "UK", "type": "international", "coverage": "Spain"}'),
('property_websites', 'international', 'A Place in the Sun', 'https://www.aplaceinthesun.com', 'A Place in the Sun', 'International property portal featuring Spanish homes', 'high', true, '{"country": "UK", "type": "international", "coverage": "Spain"}'),

-- European Property Portals
('property_websites', 'european', 'SeLoger', 'https://www.seloger.com', 'SeLoger', 'Leading French property portal (reference for expats)', 'high', true, '{"country": "FR", "type": "portal"}'),
('property_websites', 'european', 'Prian.ru', 'https://prian.info', 'Prian.ru', 'Russian international property portal', 'medium', true, '{"country": "RU", "type": "international"}'),
('property_websites', 'european', 'Move.ru', 'https://move.ru', 'Move.ru', 'Russian property and relocation platform', 'medium', true, '{"country": "RU", "type": "international"}'),
('property_websites', 'european', 'Finn.no', 'https://www.finn.no', 'Finn.no', 'Norway''s largest marketplace including properties', 'high', true, '{"country": "NO", "type": "portal"}'),
('property_websites', 'european', 'Hemnet', 'https://www.hemnet.se', 'Hemnet.se', 'Sweden''s leading property portal', 'high', true, '{"country": "SE", "type": "portal"}'),
('property_websites', 'european', 'Funda', 'https://www.funda.nl', 'Funda.nl', 'Netherlands'' primary property website', 'high', true, '{"country": "NL", "type": "portal"}'),
('property_websites', 'european', 'Immoweb', 'https://www.immoweb.be', 'Immoweb.be', 'Belgium''s leading property portal', 'high', true, '{"country": "BE", "type": "portal"}'),
('property_websites', 'european', 'Zimmo', 'https://www.zimmo.be', 'Zimmo.be', 'Belgian property listings platform', 'high', true, '{"country": "BE", "type": "portal"}'),
('property_websites', 'european', 'ImmoVlan', 'https://www.immovlan.be', 'ImmoVlan.be', 'Belgian property classifieds', 'high', true, '{"country": "BE", "type": "portal"}'),
('property_websites', 'european', 'ImmoScout24', 'https://www.immobilienscout24.de', 'ImmoScout24', 'Germany''s largest property portal', 'high', true, '{"country": "DE", "type": "portal"}'),
('property_websites', 'european', 'Le Figaro Properties', 'https://proprietes.lefigaro.fr', 'Le Figaro Properties', 'Premium French property listings', 'high', true, '{"country": "FR", "type": "portal"}'),

-- Luxury & Premium
('property_websites', 'luxury', 'JamesEdition', 'https://www.jamesedition.com', 'JamesEdition', 'Luxury properties, cars, and lifestyle marketplace', 'high', true, '{"type": "luxury", "international": true}'),
('property_websites', 'luxury', 'LuxuryEstate', 'https://www.luxuryestate.com', 'LuxuryEstate', 'International luxury real estate portal', 'high', true, '{"type": "luxury", "international": true}'),

-- Spanish Regional
('property_websites', 'spanish_portals', 'Expocasa', 'https://www.expocasa.com', 'Expocasa', 'Spanish property portal with nationwide coverage', 'medium', true, '{"country": "ES", "type": "portal"}'),
('property_websites', 'spanish_portals', 'VentaDePisos', 'https://www.ventadepisos.com', 'VentaDePisos', 'Spanish property sales platform', 'medium', true, '{"country": "ES", "type": "portal"}'),
('property_websites', 'spanish_portals', 'TuPiso', 'https://www.tupiso.com', 'TuPiso', 'Spanish property listings and services', 'medium', true, '{"country": "ES", "type": "portal"}'),
('property_websites', 'spanish_portals', 'Enalquiler', 'https://www.enalquiler.com', 'Enalquiler', 'Spanish rental properties platform', 'medium', true, '{"country": "ES", "type": "rentals"}'),
('property_websites', 'spanish_portals', 'Agrucasa', 'https://www.agrucasa.com', 'Agrucasa', 'Spanish property and agricultural listings', 'medium', true, '{"country": "ES", "type": "portal"}'),
('property_websites', 'spanish_portals', 'Spain Property Portal', 'https://www.spainpropertyportal.com', 'Spain Property Portal', 'Dedicated portal for Spanish property buyers', 'high', true, '{"country": "ES", "type": "international"}'),

-- Morocco Reference
('property_websites', 'international', 'Kasaz', 'https://www.kasaz.com', 'Kasaz', 'Moroccan property portal (reference for North African expats)', 'medium', true, '{"country": "MA", "type": "portal"}')

ON CONFLICT (url) DO NOTHING;