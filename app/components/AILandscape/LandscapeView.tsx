'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CategorizedCompanies, LandscapeData, Company, CompanyCategory } from './types';
import { categoryConfig, CategoryConfigEntry } from './categoryConfig';
import CategorySection from './shared/CategorySection';
import { categoryStyles } from './utils/theme';
import { containerStyles } from './utils/layout';
import { getCompaniesByModelCategory } from './utils/landscapeUtils';

interface LandscapeViewProps {
  data: LandscapeData;
  onCompanySelect: (companyId: string) => void;
}

const LandscapeView: React.FC<LandscapeViewProps> = ({ data, onCompanySelect }) => {
  // State for animations when components mount
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Set loaded state after component mounts for animation effects
  useEffect(() => {
    // Small delay for animation effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Memoize company categorization to avoid recomputing on every render
  const categorizedCompanies = useMemo(
    () => getCompaniesByModelCategory(data.companies),
    [data.companies]
  );

  // Extract rows of categories from config
  const singleRow = categoryConfig.filter(c => c.rowType === 'single');
  const doubleRow = categoryConfig.filter(c => c.rowType === 'double');
  const quadRow = categoryConfig.filter(c => c.rowType === 'quad');
  
  // Helpers to derive styles/icons remain
  const getCategoryStyle = (category: CompanyCategory): string => categoryStyles.common.full;
  const getCategoryIcon = (category: CompanyCategory): string => categoryStyles.icons[category];
  const getCategoryShadow = (category: CompanyCategory): string => categoryStyles.common.shadow;

  return (
    <div className={`${containerStyles.landscapeContainer} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Single-row categories */}
      {singleRow.map((entry: CategoryConfigEntry) => (
        <div
          key={entry.key}
          className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <CategorySection
            category={entry.key}
            title={entry.title}
            companies={categorizedCompanies[entry.key]}
            styleName={`${getCategoryStyle(entry.key)} ${getCategoryShadow(entry.key)} ${containerStyles.categorySectionHover}`}
            onCompanySelect={onCompanySelect}
            layout={entry.layout}
            columns={entry.columns}
            icon={getCategoryIcon(entry.key)}
            showModelCount={entry.showModelCount}
          />
        </div>
      ))}
      
      {/* Two-column row */}
      <div
        className={`${containerStyles.landscapeRowTwo} transform transition-all duration-500 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        {doubleRow.map(entry => (
          <CategorySection
            key={entry.key}
            category={entry.key}
            title={entry.title}
            companies={categorizedCompanies[entry.key]}
            styleName={`${getCategoryStyle(entry.key)} ${getCategoryShadow(entry.key)} ${containerStyles.categorySectionHover}`}
            onCompanySelect={onCompanySelect}
            layout={entry.layout}
            columns={entry.columns}
            icon={getCategoryIcon(entry.key)}
            showModelCount={entry.showModelCount}
          />
        ))}
      </div>
      
      {/* Four-column row */}
      <div
        className={`${containerStyles.landscapeRowFour} transform transition-all duration-500 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        {quadRow.map(entry => (
          <CategorySection
            key={entry.key}
            category={entry.key}
            title={entry.title}
            companies={categorizedCompanies[entry.key]}
            styleName={`${getCategoryStyle(entry.key)} ${getCategoryShadow(entry.key)} ${containerStyles.categorySectionHover}`}
            onCompanySelect={onCompanySelect}
            layout={entry.layout}
            columns={entry.columns}
            icon={getCategoryIcon(entry.key)}
            showModelCount={entry.showModelCount}
          />
        ))}
      </div>
    </div>
  );
};

export default LandscapeView;