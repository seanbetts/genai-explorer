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
  onToggleSection: (section: keyof ExpandedSections) => void;
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ 
  company, 
  expandedSections, 
  onBack, 
  onToggleSection 
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
      <button 
        onClick={onBack} 
        className={`mb-4 flex items-center ${buttonStyles.link} ${containerStyles.flexCenter} transform transition-all duration-300 hover:-translate-x-1`}
      >
        <i className="bi bi-arrow-left mr-2 text-gray-600"></i> Back to landscape
      </button>
      <div className={`${containerStyles.cardHover} transform transition-all duration-500 ${isVisible ? 'translate-y-0' : 'translate-y-4'}`}>
        <div className={containerStyles.companyDetailHeader}>
          <div className={`${containerStyles.flexCenter} flex-1`}>
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener" 
              className={containerStyles.companyLogoContainer}
              title="Visit website"
            >
              <Image 
                src={company.logo && company.logo.startsWith("/") ? company.logo : "/images/companies/placeholder.png"} 
                alt={`${company.name} logo`}
                fill
                className={containerStyles.companyLogoImage}
              />
            </a>
            <div className={containerStyles.companyDescriptionContainer}>
              <p className={`text-lg ${textStyles.primary}`}>{company.description}</p>
            </div>
          </div>
          <div className={`${textStyles.secondary} text-sm ml-4 flex-shrink-0 self-start`}>
            Last updated: {
              new Date(company.lastUpdated).toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })
            }
          </div>
        </div>
        
        <div className={`${containerStyles.section} transform transition-all duration-500 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h2 
            className={`${headingStyles.main} flex items-center cursor-pointer`}
            onClick={() => onToggleSection('models')}
          >
            <i className={`bi ${expandedSections.models ? 'bi-chevron-down' : 'bi-chevron-right'} ${iconStyles.base} transition-transform duration-300`}></i>
            <span className={textStyles.primary}>Models</span>
          </h2>
          
          {company.models && company.models.length > 0 && expandedSections.models && (
            <div className="transform transition-all duration-300">
              <ModelTable models={company.models} />
            </div>
          )}
        </div>
        
        {company.features && company.features.length > 0 && (
          <div className={`${containerStyles.section} transform transition-all duration-500 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 
              className={`${headingStyles.main} flex items-center cursor-pointer`}
              onClick={() => onToggleSection('features')}
            >
              <i className={`bi ${expandedSections.features ? 'bi-chevron-down' : 'bi-chevron-right'} ${iconStyles.base} transition-transform duration-300`}></i>
              <span className={textStyles.primary}>Features</span>
            </h2>
            {expandedSections.features && (
              <div className="transform transition-all duration-300">
                <FeatureGrid features={company.features} />
              </div>
            )}
          </div>
        )}
        
        {company.subscriptions && company.subscriptions.length > 0 && (
          <div className={`${containerStyles.section} transform transition-all duration-500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 
              className={`${headingStyles.main} flex items-center cursor-pointer`}
              onClick={() => onToggleSection('subscriptions')}
            >
              <i className={`bi ${expandedSections.subscriptions ? 'bi-chevron-down' : 'bi-chevron-right'} ${iconStyles.base} transition-transform duration-300`}></i>
              <span className={textStyles.primary}>Subscription Plans</span>
            </h2>
            {expandedSections.subscriptions && (
              <div className="transform transition-all duration-300">
                <SubscriptionGrid subscriptions={company.subscriptions} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;