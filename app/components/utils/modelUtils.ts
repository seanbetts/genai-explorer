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

/**
 * Gets the appropriate tab name based on model categories
 * @param models The models to check
 * @returns The appropriate tab name (e.g., "Frontier", "Open", "Enterprise")
 */
export const getModelTabName = (models: Model[]): string => {
  // If there are no models, default to "Models"
  if (!models || models.length === 0) {
    return "Models";
  }
  
  // Create a counter for each category
  const categoryCounts: Record<string, number> = {};
  
  // Count models in each category
  models.forEach(model => {
    if (model.category) {
      categoryCounts[model.category] = (categoryCounts[model.category] || 0) + 1;
    }
  });
  
  // Find the most common category
  let primaryCategory = 'frontier';
  let maxCount = 0;
  
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count;
      primaryCategory = category;
    }
  });
  
  // Map category to tab name
  const categoryLabels: Record<string, string> = {
    'frontier': 'Frontier Models',
    'open': 'Open Models',
    'enterprise': 'Enterprise Models',
    'image': 'Image Model',
    'video': 'Video Model',
    'music': 'Audio Models',
    'other': 'Specialty Models'
  };
  
  return categoryLabels[primaryCategory] || "Models";
};