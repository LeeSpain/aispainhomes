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

export function extractFotocasa(document: any, baseUrl: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];

  // Fotocasa specific selectors
  const propertyElements = document.querySelectorAll(
    '.re-CardPackAdvance, .re-CardPackMinimal, .re-SearchResult'
  );

  propertyElements.forEach((element: any, index: number) => {
    try {
      // Title
      const titleEl = element.querySelector('.re-CardTitle, h3 a, .re-Card-title a');
      const title = titleEl?.textContent?.trim() || `Property ${index + 1}`;

      // Price
      const priceEl = element.querySelector('.re-CardPrice, .re-Card-price');
      const priceText = priceEl?.textContent?.trim();
      const price = extractPrice(priceText);

      // Location
      const locationEl = element.querySelector('.re-CardFeaturesWithIcons-feature--location, .re-CardLocation');
      const location = locationEl?.textContent?.trim();

      // Description
      const descEl = element.querySelector('.re-CardDescription');
      const description = descEl?.textContent?.trim();

      // URL
      const linkEl = element.querySelector('a.re-Card-link, a[href*="/inmueble/"]');
      const relativeUrl = linkEl?.getAttribute('href');
      const url = relativeUrl ? new URL(relativeUrl, baseUrl).href : undefined;

      // Images
      const imageEl = element.querySelector('img.re-CardMedia-img, picture img');
      const imageSrc = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src');
      const images = imageSrc ? [imageSrc] : [];

      // Property features
      const featuresEls = element.querySelectorAll('.re-CardFeaturesWithIcons-feature');
      const features = Array.from(featuresEls).map((el: any) => el.textContent?.trim()).filter(Boolean);

      // Extract rooms, bathrooms, size
      const roomsMatch = features.find((f: string) => f.includes('hab'))?.match(/(\d+)/);
      const bathroomsMatch = features.find((f: string) => f.includes('baño'))?.match(/(\d+)/);
      const sizeMatch = features.find((f: string) => f.includes('m²'))?.match(/([\d.]+)/);

      // Generate external_id from URL
      const externalId = relativeUrl 
        ? relativeUrl.split('/').filter(Boolean).pop()?.split('?')[0] || `fotocasa-${index}`
        : `fotocasa-${index}`;

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
          source: 'fotocasa',
          rooms: roomsMatch ? parseInt(roomsMatch[1]) : undefined,
          bathrooms: bathroomsMatch ? parseInt(bathroomsMatch[1]) : undefined,
          size_m2: sizeMatch ? parseFloat(sizeMatch[1]) : undefined,
          raw_price_text: priceText,
          features,
        },
      });
    } catch (error) {
      console.error(`Error extracting Fotocasa property ${index}:`, error);
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
