'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Feature } from '../types';
import { textStyles, containerStyles, buttonStyles } from '../utils/styles';
import { getValidImageUrl, PLACEHOLDER_IMAGE } from '../utils/imageUtils';

// Component to handle image loading with fallback
const ImageWithFallback = ({ src, alt, ...props }: {
  src: string;
  alt: string;
  [key: string]: any;
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [imgError, setImgError] = useState(false);
  
  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      quality={imgError ? 100 : 85} // Higher quality for placeholder
      unoptimized={imgError} // Skip optimization for placeholder
      onError={() => {
        setImgSrc(PLACEHOLDER_IMAGE);
        setImgError(true);
      }}
    />
  );
};


interface FeatureGridProps {
  features: Feature[];
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  // Card heights will be automatically equalized by CSS Grid
  
  // Using the shared utility function from imageUtils.ts
  
  // Calculate grid layout based on number of items
  const itemCount = features.length;
  
  // For 1 item: single column at all screen sizes
  // For 2 items: single column on mobile, 2 columns on larger screens
  // For 3+ items: responsive grid with max 3 columns
  const gridCols = itemCount === 1 ? 'grid-cols-1' : 
                  itemCount === 2 ? 'grid-cols-1 sm:grid-cols-2' : 
                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  
  // Control max width based on number of items
  // This ensures the grid doesn't stretch too wide with few items
  const maxWidthClass = itemCount === 1 ? 'max-w-md' : 
                      itemCount === 2 ? 'max-w-2xl' : 
                      'max-w-6xl';
                      
  // We use a consistent gap for all layouts
  const gapClass = 'gap-6';

  return (
    <div className="w-full flex justify-center">
      <div className={`${gridCols} ${gapClass} auto-rows-fr grid ${maxWidthClass} w-full`}>
      {features.map(feature => (
        <div 
          key={feature.name}
          className={`${containerStyles.featureCard} ${feature.url ? 'group cursor-pointer' : ''}`}
          onClick={feature.url ? () => window.open(feature.url, '_blank', 'noopener') : undefined}
        >
          <div className={containerStyles.featureImage}>
            <ImageWithFallback 
              src={getValidImageUrl(feature.image)} 
              alt={feature.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={containerStyles.featureContent}>
            <div className="flex-1">
              <h3 className={containerStyles.featureTitle}>{feature.name}</h3>
              <div className="flex-1 min-h-[80px] overflow-auto">
                <p className={containerStyles.featureDescription}>{feature.description}</p>
              </div>
            </div>
            {/* Absolute positioning ensures consistent footer placement - only shown if URL exists */}
            {feature.url && (
              <div className="absolute bottom-0 right-0 left-0 px-5 pb-4 flex justify-end">
                <div className={containerStyles.featureLink}>
                  <span>Learn more</span>
                  <i className="bi bi-arrow-right ml-1 group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default FeatureGrid;