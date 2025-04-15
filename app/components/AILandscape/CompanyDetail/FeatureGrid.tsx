'use client';

import React from 'react';
import Image from 'next/image';
import { Feature } from '../types';
import { textStyles, containerStyles, buttonStyles } from '../utils/styles';

interface FeatureGridProps {
  features: Feature[];
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  // Set a fixed height that's tall enough for feature cards
  const cardHeight = 320; // Increased height to ensure consistent sizing
  
  return (
    <div className={containerStyles.featureGrid}>
      {features.map(feature => (
        <a 
          key={feature.name}
          href={feature.url}
          target="_blank"
          rel="noopener"
          className={`${containerStyles.featureCard} group`}
          style={{ height: `${cardHeight}px` }}
        >
          <div className={containerStyles.featureImage}>
            <Image 
              src={feature.image && feature.image.startsWith("/") ? feature.image : "/images/companies/placeholder.png"} 
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
            {/* Absolute positioning ensures consistent footer placement */}
            <div className="absolute bottom-0 right-0 left-0 px-5 pb-4 flex justify-end">
              <div className={containerStyles.featureLink}>
                <span>Learn more</span>
                <i className="bi bi-arrow-right ml-1 group-hover:translate-x-1 transition-transform duration-300"></i>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default FeatureGrid;