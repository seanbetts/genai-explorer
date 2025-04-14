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
  // Layout configurations
  const layoutConfigs = {
    'full-width': {
      containerClass: '',
      gridClass: `grid-cols-${columns === 2 ? '2' : columns === 3 ? '3' : columns === 4 ? '4' : '4'} gap-4`,
      titleClass: 'w-1/6'
    },
    'half-width': {
      containerClass: '',
      gridClass: `grid-cols-${columns === 2 ? '2' : columns === 3 ? '3' : '3'} gap-4`,
      titleClass: ''
    },
    'quarter-width': {
      containerClass: '',
      gridClass: 'space-y-3',
      titleClass: ''
    }
  };

  const config = layoutConfigs[layout];
  
  // For full-width layout, we display the title with special formatting
  const renderContent = () => {
    if (layout === 'full-width') {
      return (
        <div className="flex items-center mb-4">
          <div className={`text-xl font-bold ${textStyles.primary} ${config.titleClass}`}>{title}</div>
          <div className={`flex-1 grid ${config.gridClass}`}>
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
          <div className={`text-xl font-bold mb-4 ${textStyles.primary}`}>{title}</div>
          <div className={layout === 'half-width' ? `grid ${config.gridClass}` : config.gridClass}>
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
    <div className={`rounded-lg border-2 ${styleName} p-4 ${config.containerClass}`}>
      {renderContent()}
    </div>
  );
};

export default CategorySection;