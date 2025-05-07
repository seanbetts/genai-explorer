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
/**
 * Maps file extensions to the corresponding webp path
 * This helps us reference the correct file format after conversion
 */
const imagePathMap: Map<string, string[]> = new Map([
  // Main logos
  ['/images/logo.png', ['/images/logo.webp']],
  ['/images/omg-logo.png', ['/images/omg-logo.webp']],
  ['/images/bulb.png', ['/images/bulb.webp']],
  ['/images/placeholder.png', ['/images/placeholder.webp', '/images/placeholder.svg']],
  
  // Common company logos and placeholders
  ['/images/companies/placeholder.png', ['/images/companies/placeholder.webp', '/images/companies/placeholder.svg']],
  ['/images/logo.svg', ['/images/logo.webp']],
]);

/**
 * Checks both the original and WebP versions of an image
 * 
 * @param imagePath The original image path
 * @returns Best available image path or placeholder
 */
export const getValidImageUrl = (imagePath: string | undefined): string => {
  // Check if path is missing, empty, or invalid
  if (!imagePath || imagePath.length <= 1) {
    return PLACEHOLDER_IMAGE;
  }
  
  try {
    // For absolute URLs, verify they're properly formatted
    if (imagePath.startsWith("http")) {
      try {
        new URL(imagePath); // Will throw if invalid URL
        return imagePath;
      } catch (e) {
        console.error("Invalid external URL:", imagePath);
        return PLACEHOLDER_IMAGE;
      }
    }
    
    // For relative paths, ensure they start with /
    if (!imagePath.startsWith("/")) {
      console.error("Invalid relative path (missing starting /)", imagePath);
      return PLACEHOLDER_IMAGE;
    }
    
    // Check if the path is directly in our map
    if (imagePathMap.has(imagePath)) {
      const alternatives = imagePathMap.get(imagePath)!;
      return alternatives[0]; // Return the first alternative
    }
    
    // If the original path already ends with .webp, .svg or other supported formats, use it directly
    if (imagePath.endsWith('.webp') || imagePath.endsWith('.svg') || imagePath.endsWith('.avif')) {
      return imagePath;
    }
    
    // Company logos special case - these are the most common references
    if (imagePath.includes('/images/companies/')) {
      if (imagePath.endsWith('.png') || imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg')) {
        const basePath = imagePath.substring(0, imagePath.lastIndexOf('.'));
        // Check if we have specifically converted this logo
        const webpPath = `${basePath}.webp`;
        
        // For company logos, use WebP version
        return webpPath;
      }
    }
    
    // General case for other images (.png, .jpg, .jpeg)
    if (imagePath.endsWith('.png') || imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg')) {
      const basePath = imagePath.substring(0, imagePath.lastIndexOf('.'));
      return `${basePath}.webp`;
    }
    
    // If we get here, just use the original path
    return imagePath;
  } catch (e) {
    // Invalid URL format or other error
    console.error("Error in getValidImageUrl:", e, "for path:", imagePath);
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