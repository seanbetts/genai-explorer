'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import { Company } from '../types';
// Dynamically import heavy components per tab
const ModelTable = React.lazy(() => import('./ModelTable'));
const ProductGrid = React.lazy(() => import('./ProductGrid'));
const FeatureGrid = React.lazy(() => import('./FeatureGrid'));
const SubscriptionGrid = React.lazy(() => import('./SubscriptionGrid'));
const BenchmarksTable = React.lazy(() => import('./BenchmarksTable'));
const ImageModelGallery = React.lazy(() => import('./ImageModelGallery'));
const VideoModelGallery = React.lazy(() => import('./VideoModelGallery'));
const AudioModelGallery = React.lazy(() => import('./AudioModelGallery'));
import { textStyles, headingStyles } from '../utils/theme';
import { containerStyles, buttonStyles, iconStyles } from '../utils/layout';
import { getModelTabName } from '../utils/modelUtils';
import { companyHasBenchmarkData } from '../utils/benchmarkUtils';

interface CompanyDetailProps {
  company: Company;
  onBack: () => void;
}

// Define tab types for the tabbed interface
type TabType = 'frontier-models' | 'open-models' | 'enterprise-models' | 'image-models' | 'video-models' | 'audio-models' | 'specialised-models' | 'products' | 'features' | 'subscriptions' | 'benchmarks';

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

  const hasEnterpriseModels = (): boolean => {
    return company.models && company.models.some(model => 
      model.category === 'enterprise' && model.status !== 'archived'
    );
  };

  const hasImageModels = (): boolean => {
    return company.models && company.models.some(model => 
      model.category === 'image' && model.status !== 'archived'
    );
  };

  const hasVideoModels = (): boolean => {
    return company.models && company.models.some(model => 
      model.category === 'video' && model.status !== 'archived'
    );
  };

  const hasAudioModels = (): boolean => {
    return company.models && company.models.some(model => 
      model.category === 'audio' && model.status !== 'archived'
    );
  };

  const hasSpecialisedModels = (): boolean => {
    return company.models && company.models.some(model => 
      model.category === 'other' && model.status !== 'archived'
    );
  };
  
  // State to track if the company has benchmark data
  const [hasBenchmarkData, setHasBenchmarkData] = React.useState(false);
  
  const hasBenchmarkScores = (): boolean => {
    return hasBenchmarkData && company.models && company.models.length > 0;
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
    
    // If URL contains a valid tab parameter, use it - but validate benchmarks tab
    if (tabParam && ['frontier-models', 'open-models', 'enterprise-models', 'image-models', 'video-models', 'audio-models', 'specialised-models', 'products', 'features', 'subscriptions', 'benchmarks'].includes(tabParam)) {
      // Special handling for benchmarks tab - only set if benchmark scores exist
      if (tabParam === 'benchmarks' && !hasBenchmarkScores()) {
        console.log('Benchmarks tab requested but no benchmark scores available, falling back to default tab selection');
      } else {
        console.log('Setting tab from URL:', tabParam);
        setActiveTab(tabParam as TabType);
        return;
      }
    }
    
    // Handle legacy 'models' parameter
    if (tabParam === 'models') {
      if (hasFrontierModels()) {
        setActiveTab('frontier-models');
        return;
      }
      if (hasEnterpriseModels()) {
        setActiveTab('enterprise-models');
        return;
      }
      if (hasOpenModels()) {
        setActiveTab('open-models');
        return;
      }
      if (hasImageModels()) {
        setActiveTab('image-models');
        return;
      }
      if (hasVideoModels()) {
        setActiveTab('video-models');
        return;
      }
      if (hasAudioModels()) {
        setActiveTab('audio-models');
        return;
      }
      if (hasSpecialisedModels()) {
        setActiveTab('specialised-models');
        return;
      }
    }
    
    // Fallback to default order if no tab parameter or invalid value
    if (hasFrontierModels()) {
      setActiveTab('frontier-models');
    } else if (hasEnterpriseModels()) {
      setActiveTab('enterprise-models');
    } else if (hasOpenModels()) {
      // Open Models now come BEFORE image and video models
      setActiveTab('open-models');
    } else if (hasImageModels()) {
      setActiveTab('image-models');
    } else if (hasVideoModels()) {
      setActiveTab('video-models');
    } else if (hasAudioModels()) {
      setActiveTab('audio-models');
    } else if (hasSpecialisedModels()) {
      setActiveTab('specialised-models');
    } else if (company.products && company.products.length > 0) {
      setActiveTab('products');
    } else if (company.features && company.features.length > 0) {
      setActiveTab('features');
    } else {
      setActiveTab('subscriptions');
    }
  }, [
    hasFrontierModels, hasEnterpriseModels, hasOpenModels, 
    hasImageModels, hasVideoModels, hasAudioModels, 
    hasSpecialisedModels, hasBenchmarkScores,
    company.products, company.features, setActiveTab
  ]);
  
  // Utility to update query params without reload
  const updateQuery = React.useCallback((key: string, value?: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.pushState({}, '', newUrl);
  }, []);
  
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
  }, [activeTab, updateQuery]);
  
  // Reset initialRender ref when component unmounts
  React.useEffect(() => {
    return () => {
      initialRender.current = true;
      initialLoad.current = true;
    };
  }, []);
  
  // Check if this company has benchmark data
  React.useEffect(() => {
    const checkBenchmarkData = async () => {
      try {
        // Only check if company has models
        if (company.models && company.models.length > 0) {
          const hasBenchmarks = await companyHasBenchmarkData(company.id);
          console.log(`Company ${company.name} has benchmark data:`, hasBenchmarks);
          setHasBenchmarkData(hasBenchmarks);
        }
      } catch (error) {
        console.error('Error checking benchmark data:', error);
      }
    };
    
    checkBenchmarkData();
  }, [company.id, company.models, company.name, setHasBenchmarkData]);
  
  React.useEffect(() => {
    // Small delay for animation effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [setIsVisible]);
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
              className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:outline-none ${
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
          
          {/* Only render Enterprise Models tab if company has enterprise models */}
          {hasEnterpriseModels() && (
            <button
              className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:outline-none ${
                activeTab === 'enterprise-models' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => {
                // Enable URL updates on user click
                initialRender.current = false;
                setActiveTab('enterprise-models');
              }}
            >
              Enterprise Models
            </button>
          )}
          
          {/* Only render Open Models tab if company has open models - moved BEFORE image and video model tabs */}
          {hasOpenModels() && (
            <button
              className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:outline-none ${
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
          
          {/* Only render Image Models tab if company has image models */}
          {hasImageModels() && (
            <button
              className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:outline-none ${
                activeTab === 'image-models' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => {
                // Enable URL updates on user click
                initialRender.current = false;
                setActiveTab('image-models');
              }}
            >
              Image Model
            </button>
          )}
          
          {/* Only render Video Models tab if company has video models */}
          {hasVideoModels() && (
            <button
              className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:outline-none ${
                activeTab === 'video-models' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => {
                // Enable URL updates on user click
                initialRender.current = false;
                setActiveTab('video-models');
              }}
            >
              Video Model
            </button>
          )}
          
          {/* Only render Audio Models tab if company has audio models */}
          {hasAudioModels() && (
            <button
              className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:outline-none ${
                activeTab === 'audio-models' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => {
                // Enable URL updates on user click
                initialRender.current = false;
                setActiveTab('audio-models');
              }}
            >
              Audio Model
            </button>
          )}
          
          {/* Only render Specialised Models tab if company has specialised models */}
          {hasSpecialisedModels() && (
            <button
              className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:outline-none ${
                activeTab === 'specialised-models' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => {
                // Enable URL updates on user click
                initialRender.current = false;
                setActiveTab('specialised-models');
              }}
            >
              Specialised Models
            </button>
          )}
          
          {/* Benchmarks Tab - Show only if company has models with benchmark scores */}
          {hasBenchmarkScores() && (
            <button
              className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:outline-none ${
                activeTab === 'benchmarks' 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              onClick={() => {
                // Enable URL updates on user click
                initialRender.current = false;
                setActiveTab('benchmarks');
              }}
            >
              Benchmarks
            </button>
          )}
          
          {/* Only render Products tab if company has products */}
          {company.products && company.products.length > 0 && (
            <button
          className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:outline-none ${
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
          className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:outline-none ${
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
          className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:outline-none ${
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
            
            {/* Enterprise Models Tab */}
            {activeTab === 'enterprise-models' && hasEnterpriseModels() && (
              <div className="transform transition-opacity duration-300">
                <Suspense fallback={<div className="text-center py-4">Loading enterprise models...</div>}>
                  <ModelTable 
                    models={company.models.filter(model => 
                      model.category === 'enterprise' && model.status !== 'archived'
                    )} 
                  />
                </Suspense>
              </div>
            )}
            
            {/* Image Models Tab */}
            {activeTab === 'image-models' && hasImageModels() && (
              <div className="transform transition-opacity duration-300">
                <Suspense fallback={<div className="text-center py-4">Loading image models...</div>}>
                  <ImageModelGallery 
                    companyId={company.id}
                    models={company.models.filter(model => 
                      model.category === 'image' && model.status !== 'archived'
                    )} 
                  />
                </Suspense>
              </div>
            )}
            
            {/* Video Models Tab */}
            {activeTab === 'video-models' && hasVideoModels() && (
              <div className="transform transition-opacity duration-300">
                <Suspense fallback={<div className="text-center py-4">Loading video models...</div>}>
                  <VideoModelGallery 
                    models={company.models.filter(model => 
                      model.category === 'video' && model.status !== 'archived'
                    )}
                    companyId={company.id}
                  />
                </Suspense>
              </div>
            )}
            
            {/* Audio Models Tab */}
            {activeTab === 'audio-models' && hasAudioModels() && (
              <div className="transform transition-opacity duration-300">
                <Suspense fallback={<div className="text-center py-4">Loading audio models...</div>}>
                  <AudioModelGallery 
                    models={company.models.filter(model => 
                      model.category === 'audio' && model.status !== 'archived'
                    )}
                    companyId={company.id}
                  />
                </Suspense>
              </div>
            )}
            
            {/* Specialised Models Tab */}
            {activeTab === 'specialised-models' && hasSpecialisedModels() && (
              <div className="transform transition-opacity duration-300">
                <Suspense fallback={<div className="text-center py-4">Loading specialised models...</div>}>
                  <ModelTable 
                    models={company.models.filter(model => 
                      model.category === 'other' && model.status !== 'archived'
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
            
            {/* Benchmarks Tab */}
            {activeTab === 'benchmarks' && hasBenchmarkScores() && (
              <div className="transform transition-opacity duration-300">
                <Suspense fallback={<div className="text-center py-4">Loading benchmarks...</div>}>
                  <BenchmarksTable 
                    models={company.models} 
                    companyId={company.id}
                  />
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