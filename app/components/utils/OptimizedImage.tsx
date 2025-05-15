import React from 'react';
import Image from 'next/image';
import { imageQuality } from './imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  sizes?: string;
  quality?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
  onError?: () => void;
  onLoad?: () => void;
}

/**
 * OptimizedImage component for better image loading and SEO
 * - Handles WebP conversion and fallbacks
 * - Implements proper loading attributes
 * - Ensures accessible alt text
 * - Handles errors with appropriate fallbacks
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = imageQuality.standard,
  style,
  onClick,
  onError,
  onLoad,
}) => {
  // Ensure we have a valid src with webp prioritization
  const imageSrc = React.useMemo(() => {
    // If src is external URL, use it directly
    if (src.startsWith('http')) return src;
    
    // Check if it's a local path
    if (src && src.startsWith('/')) {
      // Prioritize webp format if available
      return src.endsWith('.webp') 
        ? src 
        : src.replace(/\.(png|jpg|jpeg)$/, '.webp');
    }
    
    // Fallback to placeholder if no valid src
    return '/images/placeholder.webp';
  }, [src]);
  
  // Error handling function
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Try original format if WebP fails
    if (e.currentTarget.src.endsWith('.webp') && src && !src.endsWith('.webp')) {
      console.warn(`WebP image failed to load, falling back to original: ${src}`);
      e.currentTarget.src = src;
    } else {
      // Ultimate fallback to placeholder
      console.error(`Image failed to load: ${src}`);
      e.currentTarget.src = '/images/placeholder.webp';
    }
    
    // Call onError callback if provided
    if (onError) {
      onError();
    }
  };
  
  // Handle successful load
  const handleLoad = () => {
    // Call onLoad callback if provided
    if (onLoad) {
      onLoad();
    }
  };

  return (
    <Image
      src={imageSrc}
      alt={alt || 'Image'} // Ensure we always have alt text
      width={fill ? undefined : width || 100}
      height={fill ? undefined : height || 100}
      fill={fill}
      className={className}
      priority={priority}
      loading={priority ? 'eager' : loading}
      sizes={sizes}
      quality={quality}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
      onClick={onClick}
      // Add SEO-friendly attributes
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
};

export default OptimizedImage;