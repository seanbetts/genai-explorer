'use client';

import React from 'react';
import Image from 'next/image';
import { Company, ExpandedSections } from '../types';
import ModelTable from './ModelTable';
import FeatureGrid from './FeatureGrid';
import SubscriptionGrid from './SubscriptionGrid';
import { textStyles, containerStyles, headingStyles, buttonStyles, iconStyles } from '../utils/styles';

interface CompanyDetailProps {
  company: Company;
  expandedSections: ExpandedSections;
  onBack: () => void;
  // onToggleSection no longer needed as sections are not collapsible
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ 
  company, 
  expandedSections, 
  onBack
}) => {
  // Animation related hooks
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    // Small delay for animation effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 hover:-translate-x-1 transform transition-all duration-300 shadow-sm cursor-pointer"
        >
          <i className="bi bi-chevron-left text-blue-500 text-lg"></i> 
          <span>Back</span>
        </button>
        <div className={`${textStyles.secondary} text-xs pr-1`}>
          Company data last updated: {
            new Date(company.lastUpdated).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })
          }
        </div>
      </div>
      
      <div className="space-y-8">
        <div className={`flex items-center p-5 bg-gray-50 rounded-lg transform transition-all duration-500 ${isVisible ? 'translate-y-0' : 'translate-y-4'}`}>
          <a 
            href={company.website} 
            target="_blank" 
            rel="noopener" 
            className="relative block h-24 w-48 hover:opacity-90 transition-opacity mr-8 flex-shrink-0"
            title="Visit website"
          >
            <Image 
              src={company.logo && company.logo.startsWith("/") ? company.logo : "/images/companies/placeholder.png"} 
              alt={`${company.name} logo`}
              fill
              style={{ objectFit: "contain" }}
            />
          </a>
          <div className="flex-1 flex items-center">
            <p className={`text-base ${textStyles.primary} leading-snug`}>{company.description}</p>
          </div>
        </div>
        
        <div className={`${containerStyles.section} transform transition-all duration-500 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h2 className="text-2xl font-semibold text-gray-800 py-2">
            <span>Models</span>
          </h2>
          
          {company.models && company.models.length > 0 && (
            <div className="transform transition-all duration-300 pb-4 mt-2">
              <ModelTable models={company.models} />
            </div>
          )}
        </div>
        
        {company.features && company.features.length > 0 && (
          <div className={`${containerStyles.section} transform transition-all duration-500 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className="text-2xl font-semibold text-gray-800 py-2">
              <span>Features</span>
            </h2>
            <div className="transform transition-all duration-300 pb-4 mt-2">
              <FeatureGrid features={company.features} />
            </div>
          </div>
        )}
        
        {company.subscriptions && company.subscriptions.length > 0 && (
          <div className={`${containerStyles.section} transform transition-all duration-500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className="text-2xl font-semibold text-gray-800 py-2">
              <span>Subscription Plans</span>
            </h2>
            <div className="transform transition-all duration-300 pb-4 mt-2">
              <SubscriptionGrid subscriptions={company.subscriptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;