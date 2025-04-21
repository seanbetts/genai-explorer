'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Feature } from '../types';
import { textStyles } from '../utils/theme';
import { containerStyles, buttonStyles } from '../utils/layout';
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
  

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-wrap justify-center gap-6">
        {features.map(feature => (
          <div key={feature.name} className="flex-shrink-0 w-80 mb-6">
            <div
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;