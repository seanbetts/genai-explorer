'use client';

import React from 'react';
import { Company, CompanyCategory } from '../types';
import CompanyCard from './CompanyCard';
import { textStyles } from '../utils/theme';
import { containerStyles, iconStyles } from '../utils/layout';
import { getLogoSize } from '../utils/logoPresets';
import brandConfig from '../../config/brand';

interface CategorySectionProps {
  category: CompanyCategory;
  title: string;
  companies: Company[];
  styleName: string;
  onCompanySelect: (companyId: string, category?: string) => void;
  layout: 'full-width' | 'half-width' | 'quarter-width';
  columns?: number;
  showModelCount?: number;
  icon?: string; // Bootstrap icon class
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  title,
  companies,
  styleName,
  onCompanySelect,
  layout,
  columns = 4,
  showModelCount, // undefined = show all, 0 = none
  icon = '',
}) => {
  // Get appropriate grid class based on layout and columns prop
  const getGridClass = () => {
    // Determine if this is a media category (image, video, audio, or other specialty)
    const isMediaCategory = ['image', 'video', 'audio', 'other'].includes(category);
    
    // Use custom column count if specified and layout is full-width
    if (layout === 'full-width' && columns === 5) {
      // Custom grid with 5 columns for frontier models
      return 'grid items-stretch grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5';
    } else if (layout === 'full-width') {
      return containerStyles.companyGridFull;
    } else if (layout === 'half-width') {
      return containerStyles.companyGridHalf; // 4 columns for Open Source Models
    } else if (isMediaCategory) {
      // Use a more compact grid for media categories
      return 'grid items-stretch grid-cols-1 sm:grid-cols-2 gap-4'; // More compact for media categories
    } else {
      return containerStyles.companyGridQuarter; // 2 columns for Enterprise category
    }
  };

  
  // Render content with consistent layout for all categories
  const renderContent = () => {
    // Use styling from our centralized theme
    
    // Determine logo size using centralized presets
    const imageSize = getLogoSize(category, layout, columns, showModelCount);
    
    return (
      <>
        <div className="mb-4">
          <div className={containerStyles.categoryTitle}>
            {icon && (
              <i className={`bi ${icon} ${iconStyles.iconLeft}`} style={{ color: brandConfig.primaryColor }}></i>
            )}
            <span style={{ 
              color: brandConfig.primaryColor,
              fontFamily: brandConfig.name === 'OMG' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' : 'monospace'
            }}>{title}</span>
          </div>
          {/* Divider line using brand-specific styles */}
          <div className="w-full border-b my-2" style={{ borderColor: brandConfig.primaryColor }}></div>
        </div>
        
        <div className={getGridClass()}>
          {companies.map(company => (
            <CompanyCard 
              key={company.id}
              company={company}
              onClick={(id, modelCategory) => onCompanySelect(id, modelCategory || category)}
              showModelCount={showModelCount}
              imageSize={imageSize}
              sectionCategory={category}
            />
          ))}
        </div>
      </>
    );
  };

  // Set the background color directly based on brand
  const containerStyle = brandConfig.name === 'OMG' 
    ? { backgroundColor: '#e5e7eb', borderColor: '#d1d5db' } // gray-200 and gray-300 equivalents 
    : {};

  return (
    <div 
      className={`${containerStyles.categorySection} ${styleName}`}
      style={containerStyle}
    >
      {renderContent()}
    </div>
  );
};

export default CategorySection;