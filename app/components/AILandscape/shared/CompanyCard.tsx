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
  showModelCount = undefined,
  imageSize = { width: 100, height: 40 },
}) => {
  // Filter primary models and sort by release date (newest first)
  const primaryModels = company.models
    .filter(model => model.status === 'primary')
    .sort((a, b) => {
      
      // Then sort by release date (newest first)
      if (a.releaseDate && b.releaseDate) {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }
      // If only one has a release date, prioritize the one with date
      if (a.releaseDate) return -1;
      if (b.releaseDate) return 1;
      // Default to keeping original order
      return 0;
    });
  
  // Models to display:
  // - If showModelCount is 0, display none
  // - If showModelCount is a positive number, limit to that number
  // - If showModelCount is undefined, show all
  const modelsToDisplay = showModelCount === 0 ? [] : 
                          showModelCount ? primaryModels.slice(0, showModelCount) : 
                          primaryModels;
  
  // Standardize logo dimensions for more consistency
  const standardizedLogoStyle = {
    objectFit: "contain" as "contain",
    maxWidth: "90%",
    height: "auto",
    maxHeight: "100%"
  };
  
  // Determine if we should show models or just the logo
  const showLogoOnly = modelsToDisplay.length === 0;

  // Determine if this is a media company (image, video, audio, or specialty)
  const isMediaCompany = company.models.some(model => 
    ['image', 'video', 'music', 'other'].includes(model.category)
  );

  // Use different card styles based on company type
  const cardClassName = showLogoOnly 
    ? isMediaCompany 
      ? containerStyles.companyCardLogoOnlyMedia  // Media category with logo only
      : containerStyles.companyCardLogoOnly       // Regular logo-only card
    : containerStyles.companyCardContainer;       // Card with models

  return (
    <div
      key={company.id}
      role="button"
      tabIndex={0}
      className={`group ${cardClassName}`}
      onClick={() => onClick(company.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(company.id);
        }
      }}
      aria-label={`${company.name} - Click to view details`}
      title={`${company.name} - Click to view details`}
    >
      <div className={showLogoOnly ? containerStyles.companyLogoLarge : containerStyles.companyLogo}>
        <Image 
          src={company.logo && company.logo.startsWith("/") ? company.logo : "/images/companies/placeholder.png"} 
          alt={`${company.name} logo`}
          className={containerStyles.companyLogoImage}
          width={imageSize.width}
          height={imageSize.height}
          style={standardizedLogoStyle}
        />
      </div>
      {!showLogoOnly && (
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
      )}
    </div>
  );
};

export default CompanyCard;