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
  const featuredModels = company.models.filter(model => model.featured);
  
  // Models to display - if showModelCount is provided, limit to that number, otherwise show all
  const modelsToDisplay = showModelCount ? featuredModels.slice(0, showModelCount) : featuredModels;
  
  return (
    <div 
      key={company.id} 
      className={containerStyles.companyCardContainer}
      onClick={() => onClick(company.id)}
      title={`${company.name} - Click to view details`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div className={containerStyles.companyLogo}>
        <Image 
          src={company.logo && company.logo.startsWith("/") ? company.logo : "/images/companies/placeholder.png"} 
          alt={`${company.name} logo`}
          className={`${containerStyles.companyLogoImage} transition-all duration-300`}
          width={imageSize.width}
          height={imageSize.height}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="text-center w-full">
        {modelsToDisplay.map((model, idx) => (
          <div key={model.id} className={containerStyles.companyModel}>
            {model.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyCard;