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

/**
 * Converts image sizes to responsive format for next/image component
 * 
 * @param width The maximum width of the image
 * @returns A responsive sizes string for next/image
 */
export const getResponsiveSizes = (maxWidth: number = 1200): string => {
  return `(max-width: 640px) 100vw, 
          (max-width: 768px) 80vw, 
          (max-width: 1024px) 60vw, 
          ${maxWidth}px`;
};

/**
 * Quality settings for different types of images
 */
export const imageQuality = {
  hero: 85,       // Higher quality for hero/landing images
  thumbnail: 60,  // Lower quality acceptable for thumbnails
  standard: 75,   // Standard quality for most content images
};