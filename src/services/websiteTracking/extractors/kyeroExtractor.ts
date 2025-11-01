interface ExtractedItem {
  external_id: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  location?: string;
  url?: string;
  images?: string[];
  item_type?: string;
  metadata?: Record<string, any>;
}

export function extractKyero(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];

  // Kyero specific selectors
  const propertyElements = document.querySelectorAll('.listing-item, .property-card, article.property');

  propertyElements.forEach((element: any, index: number) => {
    try {
      // Title
      const titleEl = element.querySelector('.listing-title, h2 a, h3 a');
      const title = titleEl?.textContent?.trim() || `Property ${index + 1}`;

      // Price
      const priceEl = element.querySelector('.listing-price, .price');
      const priceText = priceEl?.textContent?.trim();
      const price = extractPrice(priceText);

      // Location
      const locationEl = element.querySelector('.listing-location, .location');
      const location = locationEl?.textContent?.trim();

      // Description
      const descEl = element.querySelector('.listing-description, .description');
      const description = descEl?.textContent?.trim();

      // URL
      const linkEl = element.querySelector('a[href*="/property/"]');
      const relativeUrl = linkEl?.getAttribute('href');
      const url = relativeUrl ? new URL(relativeUrl, baseUrl).href : undefined;

      // Images
      const imageEl = element.querySelector('img');
      const imageSrc = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src');
      const images = imageSrc ? [imageSrc] : [];

      // Property details
      const detailsEls = element.querySelectorAll('.listing-details span, .property-details li');
      const details = Array.from(detailsEls).map((el: any) => el.textContent?.trim()).filter(Boolean);

      // Extract bedrooms, bathrooms, size
      const bedroomsMatch = details.find((d: string) => d.toLowerCase().includes('bed'))?.match(/(\d+)/);
      const bathroomsMatch = details.find((d: string) => d.toLowerCase().includes('bath'))?.match(/(\d+)/);
      const sizeMatch = details.find((d: string) => d.includes('m²') || d.includes('m2'))?.match(/([\d.]+)/);

      // Generate external_id from URL or ID attribute
      const idAttr = element.getAttribute('data-property-id') || element.getAttribute('data-id');
      const externalId = idAttr || (relativeUrl 
        ? relativeUrl.split('/').filter(Boolean).pop() || `kyero-${index}`
        : `kyero-${index}`);

      items.push({
        external_id: externalId,
        title,
        description,
        price,
        currency: 'EUR',
        location,
        url,
        images,
        item_type: 'property',
        metadata: {
          source: 'kyero',
          bedrooms: bedroomsMatch ? parseInt(bedroomsMatch[1]) : undefined,
          bathrooms: bathroomsMatch ? parseInt(bathroomsMatch[1]) : undefined,
          size_m2: sizeMatch ? parseFloat(sizeMatch[1]) : undefined,
          raw_price_text: priceText,
          details,
        },
      });
    } catch (error) {
      console.error(`Error extracting Kyero property ${index}:`, error);
    }
  });

  return items;
}

function extractPrice(priceText?: string): number | undefined {
  if (!priceText) return undefined;
  
  // Remove currency symbols, spaces, and extract numbers
  const cleaned = priceText.replace(/[€$£\s]/g, '').replace(/\./g, '').replace(/,/g, '.');
  const match = cleaned.match(/[\d.]+/);
  
  return match ? parseFloat(match[0]) : undefined;
}
