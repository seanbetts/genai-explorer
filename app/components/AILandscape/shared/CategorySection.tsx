'use client';

import React from 'react';
import { Company } from '../types';
import CompanyCard from './CompanyCard';
import { textStyles, containerStyles } from '../utils/styles';

interface CategorySectionProps {
  title: string;
  companies: Company[];
  styleName: string;
  onCompanySelect: (companyId: string) => void;
  layout: 'full-width' | 'half-width' | 'quarter-width';
  columns?: number;
  showModelCount?: number;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  title, 
  companies, 
  styleName, 
  onCompanySelect,
  layout,
  columns = 4,
  showModelCount = 1
}) => {
  // Get appropriate grid class based on layout and columns
  const getGridClass = () => {
    if (layout === 'full-width') {
      return containerStyles.companyGridFull;
    } else if (layout === 'half-width') {
      return containerStyles.companyGridHalf;
    } else {
      return containerStyles.companyGridQuarter;
    }
  };

  // For full-width layout, we display the title with special formatting
  const renderContent = () => {
    if (layout === 'full-width') {
      return (
        <div className={containerStyles.flexCenter + ' mb-4'}>
          <div className={`${textStyles.primary} ${containerStyles.categoryTitleInline}`}>{title}</div>
          <div className={`flex-1 ${getGridClass()}`}>
            {companies.map(company => (
              <CompanyCard 
                key={company.id}
                company={company}
                onClick={onCompanySelect}
                showModelCount={showModelCount}
              />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className={`${containerStyles.categoryTitle} ${textStyles.primary}`}>{title}</div>
          <div className={getGridClass()}>
            {companies.map(company => (
              <CompanyCard 
                key={company.id}
                company={company}
                onClick={onCompanySelect}
                showModelCount={showModelCount}
                imageSize={layout === 'quarter-width' ? { width: 80, height: 32 } : { width: 100, height: 40 }}
              />
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <div className={containerStyles.categorySection}>
      {renderContent()}
    </div>
  );
};

export default CategorySection;