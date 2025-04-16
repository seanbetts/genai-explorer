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

// Define tab types for the tabbed interface
type TabType = 'models' | 'features' | 'subscriptions';

const CompanyDetail: React.FC<CompanyDetailProps> = ({ 
  company, 
  expandedSections, 
  onBack
}) => {
  // Animation related hooks
  const [isVisible, setIsVisible] = React.useState(false);
  
  // Tab state - default to 'models' tab
  const [activeTab, setActiveTab] = React.useState<TabType>('models');
  
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
          className={`${buttonStyles.secondary} ${buttonStyles.withLeftIcon} hover:-translate-x-1 cursor-pointer transition-all duration-300`}
        >
          <i className={`bi bi-chevron-left ${iconStyles.primary} ${iconStyles.lg}`}></i> 
          <span>Back</span>
        </button>
        <div className="text-xs font-mono pr-4">
          Company data last updated: <span className="text-fuchsia-500 font-semibold">{
            new Date(company.lastUpdated).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })
          }</span>
        </div>
      </div>
      
      <div className={`${containerStyles.flexCol} space-y-10`}>
        <div className={`${containerStyles.companyDetailHeader} transform transition-all duration-500 ${isVisible ? 'translate-y-0' : 'translate-y-4'}`}>
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
              width={120}
              height={60}
              className={containerStyles.companyLogoImage}
              style={{ objectFit: "contain", maxWidth: "90%", height: "auto", maxHeight: "100%" }}
            />
          </a>
          <div className={containerStyles.companyDescriptionContainer}>
            <p className={containerStyles.companyDescription}>{company.description}</p>
          </div>
        </div>
        
        {/* Tabs Navigation - Moved outside of the container */}
        <div className={`flex border-b border-gray-700 mb-6 transform transition-all duration-500 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button
            className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors focus:outline-none cursor-pointer ${
              activeTab === 'models' 
                ? 'border-cyan-400 text-cyan-400' 
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
            }`}
            onClick={() => setActiveTab('models')}
            disabled={!company.models || company.models.length === 0}
          >
            Models
          </button>
          
          <button
            className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors focus:outline-none cursor-pointer ${
              activeTab === 'features' 
                ? 'border-cyan-400 text-cyan-400' 
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
            }`}
            onClick={() => setActiveTab('features')}
            disabled={!company.features || company.features.length === 0}
          >
            Features
          </button>
          
          <button
            className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors focus:outline-none cursor-pointer ${
              activeTab === 'subscriptions' 
                ? 'border-cyan-400 text-cyan-400' 
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
            }`}
            onClick={() => setActiveTab('subscriptions')}
            disabled={!company.subscriptions || company.subscriptions.length === 0}
          >
            Subscription Plans
          </button>
        </div>
        
        {/* Content container */}
        <div className={`${containerStyles.section} transform transition-all duration-500 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          
          {/* Tab Content */}
          <div className={containerStyles.companyDetailSection}>
            {/* Models Tab */}
            {activeTab === 'models' && company.models && company.models.length > 0 && (
              <div className="transform transition-opacity duration-300">
                <ModelTable models={company.models} />
              </div>
            )}
            
            {/* Features Tab */}
            {activeTab === 'features' && company.features && company.features.length > 0 && (
              <div className="transform transition-opacity duration-300">
                <FeatureGrid features={company.features} />
              </div>
            )}
            
            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && company.subscriptions && company.subscriptions.length > 0 && (
              <div className="transform transition-opacity duration-300">
                <SubscriptionGrid subscriptions={company.subscriptions} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;