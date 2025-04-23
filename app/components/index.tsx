 'use client';

import React, { lazy, Suspense, useEffect, useState, useCallback } from 'react';
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
  const [benchmarkLastUpdated, setBenchmarkLastUpdated] = useState<Date | null>(null);

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
  
  // Handler for when a benchmark's last updated date changes
  const handleBenchmarkLastUpdatedChange = useCallback((date: Date | null) => {
    setBenchmarkLastUpdated(date);
  }, []);

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
  
  // Handler to go directly to the home page
  const goToHome = useCallback(() => {
    router.push('/');
  }, [router]);
  
  // Handler for filtering by category in footer links
  const handleCategoryFilter = useCallback((category: string) => {
    const tabParam = category === 'open' ? 'open-models' :
                    category === 'frontier' ? 'frontier-models' :
                    category === 'enterprise' ? 'enterprise-models' :
                    category === 'image' ? 'image-models' :
                    category === 'video' ? 'video-models' :
                    category === 'music' ? 'audio-models' :
                    category === 'other' ? 'specialised-models' :
                    '';
    
    if (tabParam) {
      router.push(`/?tab=${tabParam}`);
    }
  }, [router]);
  
  const handleBack = () => {
    // For company pages, always go back to the landscape view
    if (currentView === 'company') {
      router.push('/');
    } 
    // For other pages (like benchmark), use browser history if possible
    else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } 
    // Fallback to home view if no history exists
    else {
      router.push('/');
    }
  };
  
  
  return (
    <div className={containerStyles.appContainer}>
      <header className={containerStyles.header}>
        <div className={containerStyles.headerContent}>
          {/* Left section with back button and bulb image */}
          <div className="flex items-center">
            {/* Bulb image (always visible and clickable) */}
            <button
              type="button"
              onClick={goToHome}
              className="p-0 m-0 border-0 bg-transparent cursor-pointer mr-4 hover:opacity-80 transition-opacity"
              aria-label="Home"
            >
              <Image 
                src="/images/bulb.png" 
                alt="Bulb" 
                width={48}
                height={48}
              />
            </button>
            
            {/* Back button (visible in company and benchmark views) */}
            {(currentView === 'company' || currentView === 'benchmark') && (
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
            className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer p-0 m-0 border-0 bg-transparent hover:opacity-80 transition-opacity"
            onClick={goToHome}
            aria-label="Home"
          >
            <Image
              src="/images/logo.png"
              alt="The Blueprint - Generative AI Explorer"
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
            
            {/* Data last updated text */}
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
            
            {/* Benchmark data last updated - only on benchmark view */}
            {currentView === 'benchmark' && benchmarkLastUpdated && (
              <div className="text-[10px] font-mono mt-2 text-right">
                Benchmark data last updated: <span className="text-cyan-400 font-semibold">{
                  benchmarkLastUpdated.toLocaleDateString('en-GB', { 
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
              onLastUpdatedChange={handleBenchmarkLastUpdatedChange}
            />
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <footer className={containerStyles.footer}>
        <div className={containerStyles.footerContent}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Popular Companies */}
            <div>
              <h3 className="text-fuchsia-500 text-sm font-semibold mb-2">Companies</h3>
              <ul className="space-y-0.5">
                <li><a href="/?company=openai" className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5">OpenAI</a></li>
                <li><a href="/?company=anthropic" className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5">Anthropic</a></li>
                <li><a href="/?company=google-deepmind" className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5">Google DeepMind</a></li>
                <li><a href="/?company=meta" className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5">Meta</a></li>
                <li><a href="/?company=microsoft" className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5">Microsoft</a></li>
                <li><a href="/?company=mistral" className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5">Mistral</a></li>
              </ul>
            </div>
            
            {/* Benchmarks */}
            <div>
              <h3 className="text-fuchsia-500 text-sm font-semibold mb-2">Benchmarks</h3>
              <ul className="space-y-0.5">
                <li><a href="/?benchmark=chatbot-arena" className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5">Chatbot Arena</a></li>
                <li><a href="/?benchmark=mt-bench" className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5">MT-Bench</a></li>
                <li><a href="/?benchmark=mmlu" className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5">MMLU</a></li>
                <li><a href="/?benchmark=gsm8k" className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5">GSM8K</a></li>
                <li><a href="/?benchmark=humaneval" className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5">HumanEval</a></li>
              </ul>
            </div>
            
            {/* About/Info */}
            <div>
              <h3 className="text-fuchsia-500 text-sm font-semibold mb-2">About</h3>
              <p className="text-gray-300 text-sm mb-4">
                The Blueprint's Generative AI Explorer helps people understand the generative AI landspace and explore companies, models, and benchmarks.
              </p>
              <div className="flex items-center gap-4 mb-4">
                <a href="https://github.com/seanbetts/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  <i className="bi bi-github text-xl"></i>
                </a>
                <a href="https://www.the-blueprint.ai" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  <i className="bi bi-newspaper text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-400">
              © {new Date().getFullYear()} The Blueprint. All rights reserved.
            </div>
            <div className="text-xs text-gray-400 flex items-center">
              Made with <i className="bi bi-heart-fill text-fuchsia-500 mx-1.5"></i> using Claude Code
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AIExplorer;