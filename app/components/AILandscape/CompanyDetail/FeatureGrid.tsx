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
  const cardHeight = 290; // Increased height to accommodate descriptions and padding
  
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {features.map(feature => (
        <a 
          key={feature.name}
          href={feature.url}
          target="_blank"
          rel="noopener"
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-full sm:w-96 hover:border-gray-300 hover:scale-105 transform cursor-pointer no-underline"
          style={{ height: `${cardHeight}px` }}
        >
          <div className="relative h-36 bg-gray-200 flex-shrink-0">
            <Image 
              src={feature.image && feature.image.startsWith("/") ? feature.image : "/images/companies/placeholder.png"} 
              alt={feature.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="p-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${textStyles.primary}`}>{feature.name}</h3>
              <p className={`${textStyles.secondary} text-sm`}>{feature.description}</p>
            </div>
            {/* Fixed height footer ensures consistent positioning */}
            <div className="h-16 flex items-end justify-end">
              <div className={`${buttonStyles.link} text-sm flex items-center group pb-4`}>
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