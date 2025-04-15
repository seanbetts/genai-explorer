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
      <div className={`${containerStyles.flexBetween} mb-6`}>
        <button 
          onClick={onBack} 
          className={`${buttonStyles.secondary} ${buttonStyles.withLeftIcon} hover:-translate-x-1`}
        >
          <i className={`bi bi-chevron-left ${iconStyles.primary} ${iconStyles.lg}`}></i> 
          <span>Back</span>
        </button>
        <div className={`${textStyles.secondary} ${textStyles.xs}`}>
          Company data last updated: {
            new Date(company.lastUpdated).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })
          }
        </div>
      </div>
      
      <div className={containerStyles.flexCol}>
        <div className={`${containerStyles.detailHeader} transform transition-all duration-500 ${isVisible ? 'translate-y-0' : 'translate-y-4'}`}>
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
              style={{ objectFit: "contain" }}
            />
          </a>
          <div className={containerStyles.companyDescriptionContainer}>
            <p className={textStyles.body}>{company.description}</p>
          </div>
        </div>
        
        <div className={`${containerStyles.section} transform transition-all duration-500 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h2 className={headingStyles.section}>
            <span>Models</span>
          </h2>
          
          {company.models && company.models.length > 0 && (
            <div className={containerStyles.companyDetailSection}>
              <ModelTable models={company.models} />
            </div>
          )}
        </div>
        
        {company.features && company.features.length > 0 && (
          <div className={`${containerStyles.section} transform transition-all duration-500 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className={headingStyles.section}>
              <span>Features</span>
            </h2>
            <div className={containerStyles.companyDetailSection}>
              <FeatureGrid features={company.features} />
            </div>
          </div>
        )}
        
        {company.subscriptions && company.subscriptions.length > 0 && (
          <div className={`${containerStyles.section} transform transition-all duration-500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className={headingStyles.section}>
              <span>Subscription Plans</span>
            </h2>
            <div className={containerStyles.companyDetailSection}>
              <SubscriptionGrid subscriptions={company.subscriptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;