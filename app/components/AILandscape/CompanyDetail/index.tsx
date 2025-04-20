'use client';

import React from 'react';
import Image from 'next/image';
import { Company, ExpandedSections } from '../types';
import ModelTable from './ModelTable';
import ProductGrid from './ProductGrid';
import FeatureGrid from './FeatureGrid';
import SubscriptionGrid from './SubscriptionGrid';
import { textStyles, containerStyles, headingStyles, buttonStyles, iconStyles } from '../utils/styles';
import { getModelTabName } from '../utils/modelUtils';

interface CompanyDetailProps {
  company: Company;
  expandedSections: ExpandedSections;
  onBack: () => void;
  // onToggleSection no longer needed as sections are not collapsible
}

// Define tab types for the tabbed interface
type TabType = 'models' | 'products' | 'features' | 'subscriptions';

const CompanyDetail: React.FC<CompanyDetailProps> = ({ 
  company, 
  expandedSections, 
  onBack
}) => {
  // Animation related hooks
  const [isVisible, setIsVisible] = React.useState(false);
  
  // Set initial active tab, defaulting to 'models' if available, otherwise to the first available tab
  const getInitialTab = (): TabType => {
    if (company.models && company.models.length > 0) return 'models';
    if (company.products && company.products.length > 0) return 'products';
    if (company.features && company.features.length > 0) return 'features';
    return 'subscriptions';
  };
  const [activeTab, setActiveTab] = React.useState<TabType>(getInitialTab());
  
  React.useEffect(() => {
    // Small delay for animation effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      <div className={`${containerStyles.flexCol} space-y-10`}>
        <div className={`${containerStyles.companyDetailHeader} transform transition-all duration-500 ${isVisible ? 'translate-y-0' : 'translate-y-4'} relative`}>
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
          
          {/* Last updated date in bottom right corner */}
          <div className="absolute bottom-2 right-3 text-xs font-mono text-gray-400">
            Last updated: <span className="text-fuchsia-500 font-semibold">{
              new Date(company.lastUpdated).toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })
            }</span>
          </div>
        </div>
        
        {/* Tabs Navigation - Moved outside of the container */}
        <div className={`flex border-b border-gray-700 mb-6 transform transition-all duration-500 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {/* Show a placeholder tab when no data is available */}
          {(!company.models || company.models.length === 0) && 
           (!company.products || company.products.length === 0) && 
           (!company.features || company.features.length === 0) && 
           (!company.subscriptions || company.subscriptions.length === 0) && (
            <button className="py-3 px-6 font-medium font-mono text-base border-b-2 border-cyan-400 text-cyan-400 cursor-default">
              Info
            </button>
          )}
          
          {/* Only render Models tab if company has models */}
          {company.models && company.models.length > 0 && (
            <button
              className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:ring-2 focus:ring-cyan-400 ${
                activeTab === 'models' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => setActiveTab('models')}
            >
              {getModelTabName(company.models)}
            </button>
          )}
          
          {/* Only render Products tab if company has products */}
          {company.products && company.products.length > 0 && (
            <button
          className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:ring-2 focus:ring-cyan-400 ${
                activeTab === 'products' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
          )}
          
          {/* Only render Features tab if company has features */}
          {company.features && company.features.length > 0 && (
            <button
          className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:ring-2 focus:ring-cyan-400 ${
                activeTab === 'features' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => setActiveTab('features')}
            >
              Features
            </button>
          )}
          
          {/* Only render Subscriptions tab if company has subscriptions */}
          {company.subscriptions && company.subscriptions.length > 0 && (
            <button
          className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:ring-2 focus:ring-cyan-400 ${
                activeTab === 'subscriptions' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => setActiveTab('subscriptions')}
            >
              Subscriptions
            </button>
          )}
        </div>
        
        {/* Content container with reduced top padding */}
        <div className={`bg-gray-800 rounded-lg px-8 pt-3 pb-7 border border-gray-700 transform transition-all duration-500 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          
          {/* Tab Content */}
          <div className={containerStyles.companyDetailSection}>
            {/* Fallback Content - show when no data is available */}
            {(!company.models || company.models.length === 0) && 
             (!company.products || company.products.length === 0) && 
             (!company.features || company.features.length === 0) && 
             (!company.subscriptions || company.subscriptions.length === 0) && (
              <div className="transform transition-opacity duration-300 py-10 text-center">
                <p className={textStyles.bodyLarge}>No detailed information available for this company yet.</p>
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block mt-4 px-4 py-2 bg-fuchsia-700 hover:bg-fuchsia-600 text-white font-medium rounded transition-colors duration-150"
                >
                  Visit Website
                </a>
              </div>
            )}
            
            {/* Models Tab */}
            {activeTab === 'models' && company.models && company.models.length > 0 && (
              <div className="transform transition-opacity duration-300">
                <ModelTable models={company.models} />
              </div>
            )}
            
            {/* Products Tab */}
            {activeTab === 'products' && company.products && company.products.length > 0 && (
              <div className="transform transition-opacity duration-300">
                <ProductGrid products={company.products} />
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