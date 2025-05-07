/**
 * Utility functions for handling images in the application
 */

/**
 * Default placeholder image path
 */
export const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

/**
 * Preferred image formats in order of preference
 */
export const IMAGE_FORMATS = ['webp', 'avif', 'png', 'jpg', 'jpeg'];

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
    
    // WebP conversion check
    if (imagePath.endsWith('.png') || imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg')) {
      // Check if WebP version exists
      const webpPath = `${imagePath.substring(0, imagePath.lastIndexOf('.'))}.webp`;
      
      // In a real app, you'd check if the WebP version exists, but for now
      // we'll just prefer the WebP extension if we've converted the images
      const webpExists = true; // Placeholder for file existence check
      
      if (webpExists) {
        return webpPath;
      }
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

/**
 * Determines optimal image dimensions based on display size
 * 
 * @param containerWidth The width of the container in pixels
 * @param aspectRatio The aspect ratio of the image (width/height)
 * @returns Object with width and height properties
 */
export const getOptimalDimensions = (
  containerWidth: number, 
  aspectRatio: number = 16/9 // Default aspect ratio
): { width: number; height: number } => {
  // Round to nearest width in the configured sizes
  const breakpoints = [640, 750, 828, 1080, 1200, 1920];
  let width = containerWidth;
  
  // Find the smallest width that is larger than the container
  for (const bp of breakpoints) {
    if (bp >= containerWidth) {
      width = bp;
      break;
    }
  }
  
  // If none are larger, use the largest available
  if (width === containerWidth && breakpoints.length > 0) {
    width = breakpoints[breakpoints.length - 1];
  }
  
  // Calculate height based on aspect ratio
  const height = Math.round(width / aspectRatio);
  
  return { width, height };
};

/**
 * Generates srcset attribute values for responsive images
 * 
 * @param basePath The base path of the image (without extension)
 * @param extension The file extension of the image
 * @param widths Array of widths to generate srcset for
 * @returns A string representing the srcset attribute value
 */
export const generateSrcSet = (
  basePath: string,
  extension: string = 'webp',
  widths: number[] = [640, 750, 828, 1080, 1200, 1920]
): string => {
  return widths
    .map(w => `${basePath}-${w}.${extension} ${w}w`)
    .join(', ');
};

/**
 * Determines if WebP is supported by the browser
 * Used for client-side feature detection
 */
export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return true; // Default to true for server-side
  
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    // WebP support detection
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  
  return false;
};