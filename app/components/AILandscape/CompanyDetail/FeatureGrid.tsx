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
    <div className="flex flex-wrap justify-center gap-6">
      {features.map(feature => (
        <div 
          key={feature.name} 
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col w-full sm:w-96 hover:border-gray-300 hover:scale-105 transform"
        >
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
              className={`${buttonStyles.link} text-sm mt-auto no-underline hover:underline flex items-center transition-all duration-300 hover:translate-x-1 transform`}
            >
              <span>Learn more</span>
              <i className="bi bi-arrow-right ml-1"></i>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureGrid;