"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "../utils/imageUtils";

interface ImageWithFallbackProps extends React.ComponentPropsWithoutRef<typeof Image> {
  src: string;
  alt: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  quality = 75, // Default quality for optimization
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Try to load the image with different extensions when the src changes
  useEffect(() => {
    setIsLoading(true);
    
    // For numerically named images, try to load with different extensions
    if (src && /\/\d+$/.test(src)) {
      // Check each extension in sequence (ordered by likelihood)
      const extensions = ['.png', '.jpg', '.webp', '.jpeg'];
      let extensionIndex = 0;
      
      const tryNextExtension = () => {
        if (extensionIndex >= extensions.length) {
          // If none of the extensions worked, use placeholder
          setImgSrc(PLACEHOLDER_IMAGE);
          setIsLoading(false);
          return;
        }
        
        const fullSrc = `${src}${extensions[extensionIndex]}`;
        // Use the browser's native Image constructor (window.Image), not Next.js Image
        const img = new window.Image();
        
        img.onload = () => {
          // This extension works
          setImgSrc(fullSrc);
          setIsLoading(false);
        };
        
        img.onerror = () => {
          // Try the next extension
          extensionIndex++;
          tryNextExtension();
        };
        
        // Start loading image
        img.src = fullSrc;
      };
      
      // Start trying extensions
      tryNextExtension();
    } else {
      // For URLs that already include extensions, use them directly
      setImgSrc(src);
      setIsLoading(false);
    }
  }, [src]);

  // Show placeholder while trying extensions
  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <Image
      {...props}
      src={imgSrc || PLACEHOLDER_IMAGE}
      alt={alt}
      quality={quality}
      onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
    />
  );
};

export default ImageWithFallback;