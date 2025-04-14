'use client';

import React from 'react';
import Image from 'next/image';
import { Feature } from '../types';
import { textStyles, containerStyles, buttonStyles } from '../utils/styles';

interface FeatureGridProps {
  features: Feature[];
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  return (
    <div className={containerStyles.grid3col}>
      {features.map(feature => (
        <div key={feature.name} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
          <div className="relative h-36 bg-gray-200">
            <Image 
              src={feature.image && feature.image.startsWith("/") ? feature.image : "/images/companies/placeholder.png"} 
              alt={feature.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="p-3 flex-1 flex flex-col">
            <h3 className={`text-lg font-semibold mb-1 ${textStyles.primary}`}>{feature.name}</h3>
            <p className={`${textStyles.secondary} text-sm mb-3 flex-1`}>{feature.description}</p>
            <a 
              href={feature.url} 
              target="_blank" 
              rel="noopener"
              className={`${buttonStyles.link} text-sm mt-auto no-underline hover:underline`}
            >
              Learn more →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureGrid;