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

export function extractIdealista(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];

  // Idealista specific selectors
  const propertyElements = document.querySelectorAll('article.item, .item-info-container');

  propertyElements.forEach((element: any, index: number) => {
    try {
      // Title
      const titleEl = element.querySelector('.item-link, a.item-link');
      const title = titleEl?.textContent?.trim() || `Property ${index + 1}`;

      // Price
      const priceEl = element.querySelector('.item-price, .price-row .item-price');
      const priceText = priceEl?.textContent?.trim();
      const price = extractPrice(priceText);

      // Location
      const locationEl = element.querySelector('.item-detail-char:first-child, .item-detail');
      const location = locationEl?.textContent?.trim();

      // Description
      const descEl = element.querySelector('.item-description, p');
      const description = descEl?.textContent?.trim();

      // URL
      const linkEl = element.querySelector('a.item-link');
      const relativeUrl = linkEl?.getAttribute('href');
      const url = relativeUrl ? new URL(relativeUrl, baseUrl).href : undefined;

      // Images
      const imageEl = element.querySelector('img.item-multimedia, picture img');
      const imageSrc = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src');
      const images = imageSrc ? [imageSrc] : [];

      // Property details
      const detailsEls = element.querySelectorAll('.item-detail');
      const details = Array.from(detailsEls).map((el: any) => el.textContent?.trim()).filter(Boolean);

      // Extract bedrooms, bathrooms, size
      const bedroomsMatch = details.find((d: string) => d.includes('hab'))?.match(/(\d+)/);
      const bathroomsMatch = details.find((d: string) => d.includes('baño'))?.match(/(\d+)/);
      const sizeMatch = details.find((d: string) => d.includes('m²'))?.match(/([\d.]+)/);

      // Generate external_id from URL
      const externalId = relativeUrl 
        ? relativeUrl.split('/').filter(Boolean).pop() || `idealista-${index}`
        : `idealista-${index}`;

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
          source: 'idealista',
          bedrooms: bedroomsMatch ? parseInt(bedroomsMatch[1]) : undefined,
          bathrooms: bathroomsMatch ? parseInt(bathroomsMatch[1]) : undefined,
          size_m2: sizeMatch ? parseFloat(sizeMatch[1]) : undefined,
          raw_price_text: priceText,
          details,
        },
      });
    } catch (error) {
      console.error(`Error extracting Idealista property ${index}:`, error);
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
