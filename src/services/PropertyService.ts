
import { propertyCore } from './property/propertyCore';
import { propertySearch } from './property/propertySearch';
import { propertyUser } from './property/propertyUser';

// Main PropertyService that combines all property-related services
export const PropertyService = {
  ...propertyCore,
  ...propertySearch,
  ...propertyUser
};
