# Official Resources Management Guide

## Overview

The Official Resources system manages two types of resources:
1. **Official Government Resources** - Spanish government websites, ministries, and official services
2. **Property Websites** - Property listing portals that are actively scraped for property data

## Property Websites

### What Gets Saved During Scraping

When property websites are scraped, the system automatically saves:

#### Core Property Data
- **External ID** - Unique identifier from the source website
- **Title** - Property headline/name
- **Description** - Full property description
- **Price** - Property price in specified currency
- **Location** - City, region, or address
- **URL** - Direct link to the property listing on the source website
- **Currency** - Price currency (EUR, USD, etc.)

#### Property Details (Metadata)
- Bedrooms count
- Bathrooms count
- Property size (m²)
- Property type (apartment, house, villa, etc.)
- Additional features and amenities
- Construction year
- Energy rating

#### Visual Assets
- **Images** - Array of image URLs from the property listing
- All images are preserved with original URLs

#### Tracking Information
- **First Seen** - When the property was first discovered
- **Last Seen** - Last time the property was detected
- **Status Changed** - When the property status changed (e.g., became inactive)
- **Is Active** - Whether the property is still available

### Supported Property Websites

The system currently includes **47+ property websites** organized into categories:

#### Spanish Portals (13 sites)
Primary Spanish property listing platforms including Idealista, Fotocasa, Habitaclia, Pisos.com, Kyero, and more.

**Scraping Enabled:**
- ✅ Idealista
- ✅ Fotocasa  
- ✅ Habitaclia
- ✅ Pisos.com
- ✅ Kyero

#### Rural & Agricultural (5 sites)
Specialized in countryside properties, farms, and agricultural land.

#### Classifieds (2 sites)
General classifieds sites with property sections (Milanuncios, Tablón de Anuncios).

#### Search Aggregators (2 sites)
Meta-search engines that aggregate from multiple sources.

#### International Portals (6 sites)
English-language and international portals focusing on Spanish properties.

#### European Portals (11 sites)
Reference portals from other European countries (for expat context).

#### Luxury & Premium (2 sites)
High-end property marketplaces.

## Database Structure

### Official Resources Table
```
official_resources
├── id (UUID)
├── category (string) - e.g., "property_websites", "immigration"
├── subcategory (string) - e.g., "spanish_portals", "rural_agricultural"
├── authority (string) - Website name/authority
├── url (text) - Website URL
├── title (text) - Display title
├── description (text) - Resource description
├── trust_level (string) - "high", "medium", "low"
├── is_active (boolean) - Active status
├── metadata (jsonb) - Additional data (scraping support, country, type)
├── last_verified_at (timestamp) - Last verification date
├── created_at (timestamp)
└── updated_at (timestamp)
```

### Extracted Items Table
```
extracted_items
├── id (UUID)
├── tracked_website_id (UUID) - Link to tracked website
├── external_id (text) - Property ID from source
├── title (text)
├── description (text)
├── price (numeric)
├── currency (string)
├── location (text)
├── url (text) - Property listing URL
├── images (jsonb) - Array of image URLs
├── item_type (string)
├── metadata (jsonb) - Property details (beds, baths, size, etc.)
├── is_active (boolean)
├── first_seen_at (timestamp)
├── last_seen_at (timestamp)
├── status_changed_at (timestamp)
├── created_at (timestamp)
└── updated_at (timestamp)
```

## Admin Operations

### Viewing Resources

1. Navigate to Admin Dashboard → Official Resources
2. Use tabs to filter by category (All, Property Websites, Immigration, etc.)
3. Property Websites are organized by subcategory for easy browsing
4. Search functionality searches across title, description, category, and subcategory

### Verifying Resources

Click the ✓ icon next to a resource to mark it as verified. This updates the `last_verified_at` timestamp.

**Recommended verification frequency:**
- Government resources: Every 6 months
- Property websites: Every 3 months
- Verify after any reports of broken links or outdated information

### Enabling/Disabling Resources

- **Enable** - Makes the resource active and available for AI citations and scraping
- **Disable** - Deactivates the resource without deleting it

Use cases for disabling:
- Website is temporarily down
- Website has changed its structure (scraping needs updating)
- Resource is outdated or deprecated
- Testing new resources before full activation

### Opening Resources

Click the 🔗 icon to open the resource website in a new tab for manual verification.

## Property Scraping Workflow

### 1. Add Website to Track
Admin Dashboard → Website Tracking → Add new tracked website

### 2. Initial Scrape
System performs initial scrape and creates records in `extracted_items`

### 3. Ongoing Monitoring
- Scheduled scrapes run based on check frequency (hourly/daily/weekly)
- New properties are automatically added
- Existing properties are updated
- Removed properties are marked inactive

### 4. Data Usage
- Properties appear in user dashboards
- Clara AI can search scraped properties
- Property matching uses scraped data
- Alerts generated for matching properties

## Best Practices

### Before Adding a New Property Website

1. **Check if already exists** - Search in Official Resources
2. **Verify scraping support** - Check if extractor exists
3. **Test manually** - Visit website and verify it's active
4. **Add metadata** - Include country, type, and any special features

### Maintaining Data Quality

1. **Regular verification** - Verify resources quarterly
2. **Monitor scrape results** - Check Website Tracking tab for errors
3. **Update extractors** - When websites change structure
4. **Remove dead sites** - Disable websites that no longer exist

### Performance Optimization

1. **Disable unused resources** - Reduces database size and AI processing
2. **Prioritize high-trust sources** - Mark most reliable sources appropriately
3. **Group related resources** - Use subcategories effectively

## AI Integration

### How Clara AI Uses Resources

- **Property Search** - Queries extracted_items for matching properties
- **Official Information** - Cites government resources for relocation guidance
- **Website Recommendations** - Suggests relevant property portals to users

### Citation Tracking

The system tracks how many times AI has cited each resource via the `ai_response_citations` table. View citation counts in the stats cards.

## Troubleshooting

### Resource Not Appearing in Results

1. Check if resource is active (`is_active = true`)
2. Verify category and subcategory are correct
3. Check trust_level is appropriate
4. Search for resource using title or URL

### Scraping Errors

1. Check Website Tracking tab for error messages
2. Verify website is accessible
3. Check if website structure has changed
4. Review extractor code if needed

### Missing Property Data

1. Verify tracked_website is active
2. Check last scrape results
3. Look for errors in scrape history
4. Confirm property still exists on source website

## Future Enhancements

- Automatic scraper updates when website structure changes
- ML-based property matching improvements
- Real-time scraping triggers
- Advanced filtering and search capabilities
- Bulk import/export of resources
- API access for external integrations

---

**Last Updated:** 2025-11-01
**Version:** 1.0
