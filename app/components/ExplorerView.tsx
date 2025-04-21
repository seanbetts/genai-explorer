'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CategorizedCompanies, ExplorerData, Company, CompanyCategory } from './types';
import { categoryConfig, CategoryConfigEntry } from './categoryConfig';
import CategorySection from './shared/CategorySection';
import { categoryStyles } from './utils/theme';
import { containerStyles } from './utils/layout';
import { getCompaniesByModelCategory } from './utils/explorerUtils';

interface ExplorerViewProps {
  data: ExplorerData;
  onCompanySelect: (companyId: string) => void;
}

const ExplorerView: React.FC<ExplorerViewProps> = ({ data, onCompanySelect }) => {
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
  // Ref for the two-column (open/enterprise) row
  const twoColRef = useRef<HTMLDivElement>(null);

  // Equalize heights of open & enterprise cards after load
  useEffect(() => {
    if (!isLoaded || !twoColRef.current) return;
    const container = twoColRef.current;
    const cards: HTMLElement[] = Array.from(
      container.querySelectorAll('.company-card')
    );
    if (cards.length === 0) return;
    const adjustHeights = () => {
      cards.forEach(card => { card.style.height = 'auto'; });
      const maxH = cards.reduce(
        (max, card) => Math.max(max, card.getBoundingClientRect().height),
        0
      );
      cards.forEach(card => { card.style.height = `${maxH}px`; });
    };
    adjustHeights();
    window.addEventListener('resize', adjustHeights);
    return () => { window.removeEventListener('resize', adjustHeights); };
  }, [isLoaded]);
  
  // Helpers to derive styles/icons remain
  const getCategoryStyle = (category: CompanyCategory): string => categoryStyles.common.full;
  const getCategoryIcon = (category: CompanyCategory): string => categoryStyles.icons[category];
  const getCategoryShadow = (category: CompanyCategory): string => categoryStyles.common.shadow;

  // Skeleton loaders while loading
  if (!isLoaded) {
    return (
      <div className={`${containerStyles.explorerContainer} animate-pulse`}>  
        {/* Single-row skeletons */}
        {singleRow.map(entry => (
          <div key={`skeleton-${entry.key}`} className="mb-6">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {Array(entry.columns ?? 4).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        ))}
        {/* Two-column row skeletons */}
        <div className={`${containerStyles.explorerRowTwo} mb-6`}>  
          {doubleRow.map(entry => (
            <div key={`skeleton-double-${entry.key}`} className="mb-6 flex flex-col">
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-[5fr_3fr] gap-5">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-24 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Four-column row skeletons */}
        <div className={containerStyles.explorerRowFour}>
          {quadRow.map(entry => (
            <div key={`skeleton-quad-${entry.key}`} className="mb-6 flex flex-col">
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-24 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  /* Adjusting heights logic is now handled above to keep hook ordering consistent */
  
  // Main content after load
  return (
    <div className={`${containerStyles.explorerContainer} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
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
      
      {/* Two-column row (open & enterprise) */}
      <div
        ref={twoColRef}
        className={`${containerStyles.explorerRowTwo} transform transition-all duration-500 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
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
        className={`${containerStyles.explorerRowFour} transform transition-all duration-500 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
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

export default ExplorerView;