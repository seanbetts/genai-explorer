'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import { Company } from '../types';
// Dynamically import heavy components per tab
const ModelTable = React.lazy(() => import('./ModelTable'));
const ProductGrid = React.lazy(() => import('./ProductGrid'));
const FeatureGrid = React.lazy(() => import('./FeatureGrid'));
const SubscriptionGrid = React.lazy(() => import('./SubscriptionGrid'));
import { textStyles, headingStyles } from '../utils/theme';
import { containerStyles, buttonStyles, iconStyles } from '../utils/layout';
import { getModelTabName } from '../utils/modelUtils';

interface CompanyDetailProps {
  company: Company;
  onBack: () => void;
}

// Define tab types for the tabbed interface
type TabType = 'frontier-models' | 'open-models' | 'products' | 'features' | 'subscriptions';

const CompanyDetail: React.FC<CompanyDetailProps> = ({
  company,
  onBack,
}) => {
  // Animation related hooks
  const [isVisible, setIsVisible] = React.useState(false);
  
  // Helper functions to check for model types
  const hasFrontierModels = (): boolean => {
    return company.models && company.models.some(model => 
      model.category === 'frontier' && model.status !== 'archived'
    );
  };

  const hasOpenModels = (): boolean => {
    return company.models && company.models.some(model => 
      model.category === 'open' && model.status !== 'archived'
    );
  };

  // Initialize with a fallback value, we'll set it properly in useEffect
  const [activeTab, setActiveTab] = React.useState<TabType>('frontier-models');
  
  // On mount, properly set the active tab based on URL or company data
  React.useEffect(() => {
    // First check if URL has a tab parameter
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    
    // Force disable URL updates during initialization
    initialRender.current = true;
    
    // If URL contains a valid tab parameter, use it
    if (tabParam && ['frontier-models', 'open-models', 'products', 'features', 'subscriptions'].includes(tabParam)) {
      console.log('Setting tab from URL:', tabParam);
      setActiveTab(tabParam as TabType);
      return;
    }
    
    // Handle legacy 'models' parameter
    if (tabParam === 'models') {
      if (hasFrontierModels()) {
        setActiveTab('frontier-models');
        return;
      }
      if (hasOpenModels()) {
        setActiveTab('open-models');
        return;
      }
    }
    
    // Fallback to default order if no tab parameter or invalid value
    if (hasFrontierModels()) {
      setActiveTab('frontier-models');
    } else if (hasOpenModels()) {
      setActiveTab('open-models');
    } else if (company.products && company.products.length > 0) {
      setActiveTab('products');
    } else if (company.features && company.features.length > 0) {
      setActiveTab('features');
    } else {
      setActiveTab('subscriptions');
    }
  }, []);
  
  // Utility to update query params without reload
  const updateQuery = (key: string, value?: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.pushState({}, '', newUrl);
  };
  
  // Persist activeTab in URL, but only after deliberate user interaction
  const initialRender = React.useRef(true);
  const initialLoad = React.useRef(true);
  
  React.useEffect(() => {
    if (initialLoad.current) {
      // Skip completely on first render of the component
      initialLoad.current = false;
      return;
    }
    
    // This ensures we only update the URL when the tab is changed by user interaction
    // not during initial loading or parameter setting
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    console.log('Updating URL to tab:', activeTab);
    updateQuery('tab', activeTab);
  }, [activeTab]);
  
  // Reset initialRender ref when component unmounts
  React.useEffect(() => {
    return () => {
      initialRender.current = true;
      initialLoad.current = true;
    };
  }, []);
  
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
          
          {/* Only render Frontier Models tab if company has frontier models */}
          {hasFrontierModels() && (
            <button
              className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                activeTab === 'frontier-models' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => {
                // Enable URL updates on user click
                initialRender.current = false;
                setActiveTab('frontier-models');
              }}
            >
              Frontier Models
            </button>
          )}
          
          {/* Only render Open Models tab if company has open models */}
          {hasOpenModels() && (
            <button
              className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                activeTab === 'open-models' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => {
                // Enable URL updates on user click
                initialRender.current = false;
                setActiveTab('open-models');
              }}
            >
              Open Models
            </button>
          )}
          
          {/* Only render Products tab if company has products */}
          {company.products && company.products.length > 0 && (
            <button
          className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                activeTab === 'products' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => {
                // Enable URL updates on user click
                initialRender.current = false;
                setActiveTab('products');
              }}
            >
              Products
            </button>
          )}
          
          {/* Only render Features tab if company has features */}
          {company.features && company.features.length > 0 && (
            <button
          className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                activeTab === 'features' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => {
                // Enable URL updates on user click
                initialRender.current = false;
                setActiveTab('features');
              }}
            >
              Features
            </button>
          )}
          
          {/* Only render Subscriptions tab if company has subscriptions */}
          {company.subscriptions && company.subscriptions.length > 0 && (
            <button
          className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                activeTab === 'subscriptions' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => {
                // Enable URL updates on user click
                initialRender.current = false;
                setActiveTab('subscriptions');
              }}
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
            
            {/* Frontier Models Tab */}
            {activeTab === 'frontier-models' && hasFrontierModels() && (
              <div className="transform transition-opacity duration-300">
                <Suspense fallback={<div className="text-center py-4">Loading frontier models...</div>}>
                  <ModelTable 
                    models={company.models.filter(model => 
                      model.category === 'frontier' && model.status !== 'archived'
                    )} 
                  />
                </Suspense>
              </div>
            )}
            
            {/* Open Models Tab */}
            {activeTab === 'open-models' && hasOpenModels() && (
              <div className="transform transition-opacity duration-300">
                <Suspense fallback={<div className="text-center py-4">Loading open models...</div>}>
                  <ModelTable 
                    models={company.models.filter(model => 
                      model.category === 'open' && model.status !== 'archived'
                    )} 
                  />
                </Suspense>
              </div>
            )}
            
            {/* Products Tab */}
            {activeTab === 'products' && company.products && company.products.length > 0 && (
              <div className="transform transition-opacity duration-300">
                <Suspense fallback={<div className="text-center py-4">Loading products...</div>}>
                  <ProductGrid products={company.products} />
                </Suspense>
              </div>
            )}
            
            {/* Features Tab */}
            {activeTab === 'features' && company.features && company.features.length > 0 && (
              <div className="transform transition-opacity duration-300">
                <Suspense fallback={<div className="text-center py-4">Loading features...</div>}>
                  <FeatureGrid features={company.features} />
                </Suspense>
              </div>
            )}
            
            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && company.subscriptions && company.subscriptions.length > 0 && (
              <div className="transform transition-opacity duration-300">
                <Suspense fallback={<div className="text-center py-4">Loading subscriptions...</div>}>
                  <SubscriptionGrid subscriptions={company.subscriptions} />
                </Suspense>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;