 'use client';

import React, { lazy, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ExplorerData, Company } from './types';
import ExplorerView from './ExplorerView';
// Dynamically load detail components to reduce initial bundle size
const CompanyDetail = lazy(() => import('./CompanyDetail'));
const BenchmarkDetail = lazy(() => import('./BenchmarkDetail'));
import { textStyles } from './utils/theme';
import { containerStyles } from './utils/layout';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface AIExplorerProps {
  initialData: ExplorerData;
}
const AIExplorer: React.FC<AIExplorerProps> = ({ initialData }) => {
  const data: ExplorerData = initialData;
  const searchParams = useSearchParams();
  const router = useRouter();

  // Make explorer data globally available for other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__EXPLORER_DATA__ = data;
    }
  }, [data]);

  // Derive view parameters from URL
  const companyId = searchParams.get('company');
  const benchmarkId = searchParams.get('benchmark');
  
  // Determine the current view
  const selectedCompany = companyId
    ? data.companies.find(c => c.id === companyId) || null
    : null;
    
  let currentView = 'home';
  if (selectedCompany) {
    currentView = 'company';
  } else if (benchmarkId) {
    currentView = 'benchmark';
  }

  // Handlers to update URL using Next.js shallow routing
  const handleCompanySelect = (id: string, category?: string) => {
    // Navigate to company view with appropriate tab based on category
    let url = `/?company=${id}`;
    
    // Add tab parameter for specific categories
    if (category === 'open') {
      url += '&tab=open-models';
      console.log('Opening company in Open Models tab');
    } else if (category === 'frontier') {
      url += '&tab=frontier-models';
      console.log('Opening company in Frontier Models tab');
    } else if (category === 'enterprise') {
      url += '&tab=enterprise-models';
      console.log('Opening company in Enterprise Models tab');
    } else if (category === 'image') {
      url += '&tab=image-models';
      console.log('Opening company in Image Models tab');
    } else if (category === 'video') {
      url += '&tab=video-models';
      console.log('Opening company in Video Models tab');
    } else if (category === 'music') {
      url += '&tab=audio-models';
      console.log('Opening company in Audio Models tab');
    } else if (category === 'other') {
      url += '&tab=specialised-models';
      console.log('Opening company in Specialised Models tab');
    } else {
      console.log('Category not recognized:', category);
    }
    
    router.push(url);
  };
  const handleBack = () => {
    // Navigate back to home view
    router.push('/');
  };
  
  
  return (
    <div className={containerStyles.appContainer}>
      <header className={containerStyles.header}>
        <div className={containerStyles.headerContent}>
          {/* Left section with back button and bulb image */}
          <div className="flex items-center">
            {/* Bulb image (always visible) */}
            <Image 
              src="/images/bulb.png" 
              alt="Bulb" 
              width={48}
              height={48}
              className="mr-4"
            />
            
            {/* Back button (only visible in company view) */}
            {currentView === 'company' && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer focus:ring-2 focus:ring-cyan-400 focus:ring-offset-0"
                aria-label="Go back"
              >
                <i className="bi bi-chevron-left text-lg"></i>
                <span className="font-mono text-sm">Back</span>
              </button>
            )}
          </div>
          
          {/* Centered logo (clickable home) */}
          <button
            type="button"
            className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer p-0 m-0 border-0 bg-transparent"
            onClick={handleBack}
            aria-label="Home"
          >
            <Image
              src="/images/logo.png"
              alt="Generative AI Explorer"
              width={200}
              height={56}
              priority
              className="h-14 w-auto"
            />
          </button>
          
          {/* Right section with subscribe button and date */}
          <div className="flex flex-col items-end pr-8">
            {/* Subscribe button - always visible */}
            <div className="flex justify-end">
              <a href="https://www.the-blueprint.ai" target="_blank" rel="noopener noreferrer" className="no-underline">
                <div className="flex font-mono text-[1em] font-medium w-[150px] h-[36px] bg-[#EA00D9] p-2 text-white rounded-[5px] justify-center items-center cursor-pointer hover:-translate-y-[2px] hover:scale-105 transition-all duration-200">
                  Subscribe
                </div>
              </a>
            </div>
            
            {/* Data last updated text - only on home view */}
            {currentView === 'home' && (
              <div className="text-[10px] font-mono mt-2 text-right">
                Data last updated: <span className="text-cyan-400 font-semibold">{
                  new Date().toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })
                }</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={containerStyles.mainContent}>
        {currentView === 'home' && (
          <ExplorerView data={data} onCompanySelect={handleCompanySelect} />
        )}
        
        {currentView === 'company' && selectedCompany && (
          <Suspense fallback={
            <div className="animate-pulse p-6 space-y-6">
              <div className="h-6 bg-gray-700 rounded w-32 mx-auto"></div>
              <div className="h-48 bg-gray-700 rounded"></div>
              <div className="h-48 bg-gray-700 rounded"></div>
            </div>
          }>
            <CompanyDetail
              company={selectedCompany}
              onBack={handleBack}
            />
          </Suspense>
        )}
        
        {currentView === 'benchmark' && benchmarkId && (
          <Suspense fallback={
            <div className="animate-pulse p-6 space-y-6">
              <div className="h-6 bg-gray-700 rounded w-32 mx-auto"></div>
              <div className="h-48 bg-gray-700 rounded"></div>
              <div className="h-48 bg-gray-700 rounded"></div>
            </div>
          }>
            <BenchmarkDetail
              benchmarkId={benchmarkId}
              onBack={handleBack}
            />
          </Suspense>
        )}
      </main>

    </div>
  );
};

export default AIExplorer;