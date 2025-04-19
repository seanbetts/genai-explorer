'use client';

import React from 'react';
import { Company } from '../types';
import CompanyCard from './CompanyCard';
import { textStyles, containerStyles, iconStyles } from '../utils/styles';

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
  // Get appropriate grid class based on layout and columns prop
  const getGridClass = () => {
    // Use custom column count if specified and layout is full-width
    if (layout === 'full-width' && columns === 5) {
      // Custom grid with 5 columns for frontier models
      return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5';
    } else if (layout === 'full-width') {
      return containerStyles.companyGridFull;
    } else if (layout === 'half-width') {
      return containerStyles.companyGridHalf; // 4 columns for Open Source Models
    } else {
      return containerStyles.companyGridQuarter; // 2 columns for Enterprise and specialty categories
    }
  };

  // Render content with consistent layout for all categories
  const renderContent = () => {
    // Use styling from our centralized theme
    
    // Determine image size based on layout, column count, and whether models will be shown
    const baseImageSize = layout === 'quarter-width' 
      ? { width: 100, height: 42 } // Make Enterprise cards use same image size as Open Models
      : layout === 'half-width' 
        ? { width: 100, height: 42 }
        // For full-width with 5 columns, make logos a bit smaller
        : columns === 5
          ? { width: 100, height: 42 }
          : { width: 110, height: 46 }; // Default size for full-width
        
    // For categories where showModelCount is 0, use larger logo sizes
    const imageSize = showModelCount === 0
      ? { width: baseImageSize.width * 1.2, height: baseImageSize.height * 1.2 }
      : baseImageSize;
    
    return (
      <>
        <div className="mb-4">
          <div className={containerStyles.categoryTitle}>
            {icon && (
              <i className={`bi ${icon} ${textStyles.accent} ${iconStyles.iconLeft}`}></i>
            )}
            <span className={textStyles.primary}>{title}</span>
          </div>
          {/* Divider line using centralized styles */}
          <div className="w-full border-b border-fuchsia-800 my-2"></div>
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