'use client';

import React from 'react';
import Image from 'next/image';
import { Feature } from '../types';

interface FeatureGridProps {
  features: Feature[];
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <h3 className="text-lg font-semibold mb-1">{feature.name}</h3>
            <p className="text-gray-700 text-sm mb-3 flex-1">{feature.description}</p>
            <a 
              href={feature.url} 
              target="_blank" 
              rel="noopener"
              className="text-blue-600 hover:underline text-sm mt-auto"
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