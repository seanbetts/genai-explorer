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
  icon?: string; // Bootstrap icon class
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  title, 
  companies, 
  styleName, 
  onCompanySelect,
  layout,
  columns = 4,
  showModelCount, // No default value to show all models
  icon
}) => {
  // Get appropriate grid class based on layout
  const getGridClass = () => {
    if (layout === 'full-width') {
      return containerStyles.companyGridFull;
    } else if (layout === 'half-width') {
      return containerStyles.companyGridHalf; // 4 columns for Open Source Models
    } else {
      return containerStyles.companyGridQuarter; // 2 columns for Enterprise and specialty categories
    }
  };

  // Render content with consistent layout for all categories
  const renderContent = () => {
    // Use consistent styling for all icons
    const iconColorClass = 'text-gray-600';
    
    // Determine image size based on layout
    const imageSize = layout === 'quarter-width' 
      ? { width: 84, height: 36 } 
      : layout === 'half-width' 
        ? { width: 100, height: 42 }
        : { width: 110, height: 46 }; // Slightly larger for full-width
    
    return (
      <>
        <div className="mb-4">
          <div className={`${containerStyles.categoryTitle} mb-2`}>
            {icon && (
              <i className={`bi ${icon} ${iconColorClass} mr-2 text-lg`}></i>
            )}
            <span className="text-gray-800 font-semibold">{title}</span>
          </div>
          {/* Light divider line below the title */}
          <div className="border-b border-gray-100 w-full"></div>
        </div>
        
        <div className={getGridClass()}>
          {companies.map(company => (
            <CompanyCard 
              key={company.id}
              company={company}
              onClick={onCompanySelect}
              showModelCount={showModelCount}
              imageSize={imageSize}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={`${containerStyles.categorySection} ${styleName}`}>
      {renderContent()}
    </div>
  );
};

export default CategorySection;