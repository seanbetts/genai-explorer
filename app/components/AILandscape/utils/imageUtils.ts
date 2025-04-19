/**
 * Utility functions for handling images in the application
 */

/**
 * Default placeholder image path
 */
export const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

/**
 * Function to validate an image URL and return either the valid URL
 * or the placeholder image URL if invalid
 * 
 * @param imagePath The image path to validate
 * @returns A valid image URL or the placeholder
 */
export const getValidImageUrl = (imagePath: string | undefined): string => {
  // Check if path is missing, empty, or invalid
  if (!imagePath || imagePath.length <= 1) {
    return PLACEHOLDER_IMAGE;
  }
  
  try {
    // For absolute URLs, verify they're properly formatted
    if (imagePath.startsWith("http")) {
      new URL(imagePath); // Will throw if invalid URL
      return imagePath;
    }
    
    // For relative paths, ensure they start with /
    if (!imagePath.startsWith("/")) {
      return PLACEHOLDER_IMAGE;
    }
    
    return imagePath;
  } catch (e) {
    // Invalid URL format
    return PLACEHOLDER_IMAGE;
  }
};