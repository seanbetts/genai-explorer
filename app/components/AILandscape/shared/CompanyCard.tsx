'use client';

import React from 'react';
import Image from 'next/image';
import { Company, Model } from '../types';
import { textStyles, containerStyles } from '../utils/styles';

interface CompanyCardProps {
  company: Company;
  onClick: (companyId: string) => void;
  showModelCount?: number;
  imageSize?: { width: number; height: number };
}

const CompanyCard: React.FC<CompanyCardProps> = ({ 
  company, 
  onClick, 
  showModelCount,
  imageSize = { width: 100, height: 40 }
}) => {
  // Filter featured models and sort by release date (newest first)
  const featuredModels = company.models
    .filter(model => model.featured)
    .sort((a, b) => {
      // If release dates exist, sort by them (newest first)
      if (a.releaseDate && b.releaseDate) {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }
      // If only one has a release date, prioritize the one with date
      if (a.releaseDate) return -1;
      if (b.releaseDate) return 1;
      // Default to keeping original order
      return 0;
    });
  
  // Models to display - if showModelCount is provided, limit to that number, otherwise show all
  const modelsToDisplay = showModelCount ? featuredModels.slice(0, showModelCount) : featuredModels;
  
  // Standardize logo dimensions for more consistency
  const standardizedLogoStyle = {
    objectFit: "contain" as "contain",
    maxWidth: "90%",
    height: "auto",
    maxHeight: "100%"
  };
  
  return (
    <div 
      key={company.id} 
      className={`group ${containerStyles.companyCardContainer}`}
      onClick={() => onClick(company.id)}
      title={`${company.name} - Click to view details`}
    >
      <div className={containerStyles.companyLogo}>
        <Image 
          src={company.logo && company.logo.startsWith("/") ? company.logo : "/images/companies/placeholder.png"} 
          alt={`${company.name} logo`}
          className={containerStyles.companyLogoImage}
          width={imageSize.width}
          height={imageSize.height}
          style={standardizedLogoStyle}
        />
      </div>
      <div className={containerStyles.flexCol}>
        {modelsToDisplay.map((model, idx) => (
          <div 
            key={model.id} 
            className={containerStyles.companyModel}
            style={{ fontSize: '0.875rem' }}  // Start with default text-sm size
            ref={(el) => {
              if (el) {
                // Check if content is larger than container and reduce font size if needed
                if (el.scrollWidth > el.clientWidth) {
                  el.style.fontSize = '0.75rem';  // Reduce to text-xs size
                }
                if (el.scrollWidth > el.clientWidth) {
                  el.style.fontSize = '0.7rem';  // Further reduce if still overflowing
                }
              }
            }}
          >
            {model.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyCard;