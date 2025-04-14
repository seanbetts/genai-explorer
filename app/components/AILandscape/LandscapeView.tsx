'use client';

import React from 'react';
import { CategorizedCompanies, LandscapeData, Company, CategoryMap, CompanyCategory } from './types';
import CategorySection from './shared/CategorySection';

interface LandscapeViewProps {
  data: LandscapeData;
  onCompanySelect: (companyId: string) => void;
}

const LandscapeView: React.FC<LandscapeViewProps> = ({ data, onCompanySelect }) => {
  // Helper to filter companies with at least one featured model
  const hasFeaturedModel = (company: Company): boolean => {
    return company.models && company.models.some(model => model.featured);
  };

  // Group companies by category (only include those with featured models)
  const categorizedCompanies: CategorizedCompanies = {
    frontier: data.companies.filter(company => company.category === 'frontier' && hasFeaturedModel(company)),
    open: data.companies.filter(company => company.category === 'open' && hasFeaturedModel(company)),
    enterprise: data.companies.filter(company => company.category === 'enterprise' && hasFeaturedModel(company)),
    image: data.companies.filter(company => company.category === 'image' && hasFeaturedModel(company)),
    video: data.companies.filter(company => company.category === 'video' && hasFeaturedModel(company)),
    music: data.companies.filter(company => company.category === 'music' && hasFeaturedModel(company)),
    other: data.companies.filter(company => company.category === 'other' && hasFeaturedModel(company))
  };

  // Category styling
  const categoryStyles: CategoryMap = {
    frontier: { bgClass: 'bg-blue-50', borderClass: 'border-blue-200' },
    open: { bgClass: 'bg-green-50', borderClass: 'border-green-200' },
    enterprise: { bgClass: 'bg-purple-50', borderClass: 'border-purple-200' },
    image: { bgClass: 'bg-yellow-50', borderClass: 'border-yellow-200' },
    video: { bgClass: 'bg-red-50', borderClass: 'border-red-200' },
    music: { bgClass: 'bg-pink-50', borderClass: 'border-pink-200' },
    other: { bgClass: 'bg-gray-50', borderClass: 'border-gray-200' }
  };

  // Category labels
  const categoryLabels = {
    frontier: 'FRONTIER MODELS',
    open: 'OPEN MODELS',
    enterprise: 'ENTERPRISE PLATFORMS',
    image: 'IMAGE',
    video: 'VIDEO',
    music: 'MUSIC',
    other: 'OTHER'
  };
  
  // Generate the style name for a category
  const getCategoryStyle = (category: CompanyCategory): string => {
    return `${categoryStyles[category].bgClass} ${categoryStyles[category].borderClass}`;
  };

  return (
    <div className="space-y-6">
      {/* Frontier Models Section */}
      <CategorySection
        title={categoryLabels.frontier}
        companies={categorizedCompanies.frontier}
        styleName={getCategoryStyle('frontier')}
        onCompanySelect={onCompanySelect}
        layout="full-width"
        columns={4}
        showModelCount={2}
      />
      
      {/* Two-column layout for Open Models and Enterprise Platforms */}
      <div className="grid grid-cols-2 gap-6">
        {/* Open Models */}
        <CategorySection
          title={categoryLabels.open}
          companies={categorizedCompanies.open}
          styleName={getCategoryStyle('open')}
          onCompanySelect={onCompanySelect}
          layout="half-width"
          columns={3}
          showModelCount={1}
        />
        
        {/* Enterprise Platforms */}
        <CategorySection
          title={categoryLabels.enterprise}
          companies={categorizedCompanies.enterprise}
          styleName={getCategoryStyle('enterprise')}
          onCompanySelect={onCompanySelect}
          layout="half-width"
          columns={2}
          showModelCount={1}
        />
      </div>
      
      {/* Four-column layout for specialized categories */}
      <div className="grid grid-cols-4 gap-6">
        {/* Image */}
        <CategorySection
          title={categoryLabels.image}
          companies={categorizedCompanies.image}
          styleName={getCategoryStyle('image')}
          onCompanySelect={onCompanySelect}
          layout="quarter-width"
          showModelCount={1}
        />
        
        {/* Video */}
        <CategorySection
          title={categoryLabels.video}
          companies={categorizedCompanies.video}
          styleName={getCategoryStyle('video')}
          onCompanySelect={onCompanySelect}
          layout="quarter-width"
          showModelCount={1}
        />
        
        {/* Music */}
        <CategorySection
          title={categoryLabels.music}
          companies={categorizedCompanies.music}
          styleName={getCategoryStyle('music')}
          onCompanySelect={onCompanySelect}
          layout="quarter-width"
          showModelCount={1}
        />
        
        {/* Other */}
        <CategorySection
          title={categoryLabels.other}
          companies={categorizedCompanies.other}
          styleName={getCategoryStyle('other')}
          onCompanySelect={onCompanySelect}
          layout="quarter-width"
          showModelCount={1}
        />
      </div>
    </div>
  );
};

export default LandscapeView;