import { CompanyCategory, Model } from '../types';

/**
 * Determines the category of a model based on its properties
 * @param model The model object with potential missing category
 * @returns The appropriate category for the model
 */
export const deriveModelCategory = (model: Partial<Model>): CompanyCategory => {
  // Check model properties to derive category
  if (model.specs?.openSource) {
    return 'open';
  }
  
  // Add more rules based on model characteristics
  if (model.type === 'image' || model.specs?.outputFormats?.includes('image')) {
    return 'image';
  }
  
  if (model.type === 'video' || model.specs?.outputFormats?.includes('video')) {
    return 'video';
  }
  
  if (model.type === 'music' || model.specs?.outputFormats?.includes('audio')) {
    return 'music';
  }
  
  // Default to frontier for leading models or enterprise as fallback
  if (model.capabilities?.intelligence && model.capabilities.intelligence >= 4) {
    return 'frontier';
  }
  
  return 'enterprise';
};

/**
 * Checks if a model should show Together.ai pricing
 * @param model The model to check
 * @returns True if the model should show Together.ai pricing
 */
export const shouldShowTogetherPricing = (model: Model): boolean => {
  // Check if model is explicitly open source
  if (model.specs?.openSource) {
    return true;
  }
  
  // Check if model category is 'open'
  if (model.category === 'open') {
    return true;
  }
  
  return false;
};