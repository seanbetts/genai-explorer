 'use client';

import React, { lazy, Suspense, useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ExplorerData, Company, Benchmark, BenchmarkScore } from './types';
import ExplorerView from './ExplorerView';
// Dynamically load detail components to reduce initial bundle size
const CompanyDetail = lazy(() => import('./CompanyDetail'));
const BenchmarkDetail = lazy(() => import('./BenchmarkDetail'));
const ModelComparer = lazy(() => import('./ModelComparer'));
import { textStyles, categoryStyles, colors } from './utils/theme';
import { containerStyles } from './utils/layout';
import { categoryConfig } from './categoryConfig';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Import modular Header and Footer components
import Header from './Header';
import Footer from './Footer';
// Import brand configuration
import brandConfig from '../config/brand';

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
  const activeTab = searchParams.get('tab');
  
  // Determine the current view
  const selectedCompany = companyId
    ? data.companies.find(c => c.id === companyId) || null
    : null;
  
  // We'll use a URL parameter approach to avoid hydration issues
  const compareParam = searchParams.has('compare');
  
  // Use the path parameter from the URL to determine if we're on the compare page
  const isComparePage = typeof window !== 'undefined' 
    ? window.location.pathname === '/compare'
    : false;
  
  // The currentView state should be initialized after hydration
  const [currentView, setCurrentView] = useState('home');
  
  // Update the current view after component mounts to avoid hydration issues
  useEffect(() => {
    let view = 'home';
    if (selectedCompany) {
      view = 'company';
    } else if (benchmarkId) {
      view = 'benchmark';
    } else if (isComparePage || compareParam) {
      view = 'compare';
    }
    setCurrentView(view);
  }, [selectedCompany, benchmarkId, isComparePage, compareParam]);
  
  // Convert URL tab parameter to category key for highlighting
  const getActiveCategoryFromTab = (tab: string | null): string => {
    if (!tab) return '';
    const mapping: Record<string, string> = {
      'frontier-models': 'frontier',
      'open-models': 'open',
      'enterprise-models': 'enterprise',
      'image-models': 'image',
      'video-models': 'video',
      'audio-models': 'audio',
      'specialised-models': 'other'
    };
    return mapping[tab] || '';
  };
  
  const activeCategory = getActiveCategoryFromTab(activeTab);
  
  // Handler for when a benchmark's last updated date changes
  const handleBenchmarkLastUpdatedChange = useCallback((date: Date | null) => {
    setBenchmarkLastUpdated(date);
  }, []);
  
  // Calculate top companies by model count
  const topCompanies = useMemo(() => {
    return [...data.companies]
      .sort((a, b) => (b.models?.length || 0) - (a.models?.length || 0))
      .slice(0, 5)
      .map(company => ({
        id: company.id,
        name: company.name
      }));
  }, [data.companies]);
  
  // State for benchmark data
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [benchmarkScores, setBenchmarkScores] = useState<BenchmarkScore[]>([]);
  const [benchmarksLoaded, setBenchmarksLoaded] = useState(false);
  
  // Load benchmark data for footer
  useEffect(() => {
    const loadBenchmarkData = async () => {
      try {
        // Import the loading functions locally to avoid issues with circular dependencies
        const { loadBenchmarkMetadata, loadBenchmarkScores } = await import('./utils/benchmarkUtils');
        
        // Load data in parallel
        const [benchmarkData, benchmarkScoreData] = await Promise.all([
          loadBenchmarkMetadata(),
          loadBenchmarkScores()
        ]);
        
        setBenchmarks(benchmarkData);
        setBenchmarkScores(benchmarkScoreData);
        setBenchmarksLoaded(true);
      } catch (error) {
        console.error('Error loading benchmark data for footer:', error);
      }
    };
    
    loadBenchmarkData();
  }, []);
  
  // Calculate top benchmarks by score count
  const topBenchmarks = useMemo(() => {
    if (!benchmarksLoaded) return [];
    
    // Count scores for each benchmark
    const benchmarkScoreCounts: Record<string, { id: string, name: string, count: number, featured: boolean }> = {};
    
    // Initialize counts for each benchmark
    benchmarks.forEach(benchmark => {
      benchmarkScoreCounts[benchmark.benchmark_id] = {
        id: benchmark.benchmark_id,
        name: benchmark.benchmark_name,
        count: 0,
        featured: benchmark.featured_benchmark || false
      };
    });
    
    // Count scores for each benchmark
    benchmarkScores.forEach(score => {
      if (benchmarkScoreCounts[score.benchmark_id]) {
        benchmarkScoreCounts[score.benchmark_id].count++;
      }
    });
    
    // Convert to array, filter for featured benchmarks, sort by count, and take top 5
    return Object.values(benchmarkScoreCounts)
      .filter(item => item.featured)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [benchmarks, benchmarkScores, benchmarksLoaded]);

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
      console.log('Opening company in Image Model tab');
    } else if (category === 'video') {
      url += '&tab=video-models';
      console.log('Opening company in Video Model tab');
    } else if (category === 'audio') {
      url += '&tab=audio-models';
      console.log('Opening company in Audio Model tab');
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
                    category === 'audio' ? 'audio-models' :
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
    <div className={containerStyles.appContainer + " flex flex-col min-h-screen"}>
      {/* Brand-aware Header component */}
      <Header 
        currentView={currentView} 
        goToHome={goToHome} 
        handleBack={handleBack}
      />

      {/* Features Navigation - visible on all views - sticky */}
      <div className={`${brandConfig.name === 'OMG' ? 'bg-gray-200 border-b border-gray-300' : 'bg-gray-800 border-b border-gray-700'} py-2 shadow-md sticky top-[90px] z-20`}>
        <div className="container mx-auto px-5">
          <div className="flex items-center font-mono text-xs py-1 md:pl-8 space-x-8">
            <Link 
              href="/" 
              className="transition-colors flex items-center"
              style={{ 
                color: currentView === 'home' && !searchParams.has('company') && !searchParams.has('benchmark') && !searchParams.has('compare')
                  ? brandConfig.primaryColor
                  : brandConfig.name === 'OMG' ? '#374151' : '#d1d5db',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = brandConfig.primaryColor}
              onMouseLeave={(e) => {
                if (!(currentView === 'home' && !searchParams.has('company') && !searchParams.has('benchmark') && !searchParams.has('compare'))) {
                  e.currentTarget.style.color = brandConfig.name === 'OMG' ? '#374151' : '#d1d5db'
                }
              }}
            >
              <i className="bi bi-grid mr-1.5" style={{ color: brandConfig.primaryColor }}></i>
              <span>Model Explorer</span>
            </Link>
            
            {/* Temporarily hidden Model Comparer */}
            {false && (
              <a 
                href="/compare" 
                className={`transition-colors flex items-center ${
                  currentView === 'compare'
                    ? 'text-cyan-400' 
                    : 'text-gray-300 hover:text-cyan-400'
                }`}
              >
                <i className={`bi bi-bar-chart-line mr-1.5 ${
                  currentView === 'compare'
                    ? 'text-cyan-400'
                    : 'text-fuchsia-500'
                }`}></i>
                <span>Model Comparer</span>
              </a>
            )}
            
            {/* Breadcrumb navigation - hidden for now 
            <div className="hidden ml-auto text-gray-400 md:pr-8">
              {currentView !== 'home' && (
                <>
                  <a href="/" className="text-gray-300 hover:text-cyan-400">Home</a>
                  <i className="bi bi-chevron-right mx-2 text-gray-500 text-[10px]"></i>
                  
                  {currentView === 'company' && selectedCompany && (
                    <span className="text-cyan-400">{selectedCompany.name}</span>
                  )}
                  
                  {currentView === 'benchmark' && benchmarkId && (
                    <span className="text-cyan-400">
                      {benchmarks.find(b => b.benchmark_id === benchmarkId)?.benchmark_name || 'Benchmark'}
                    </span>
                  )}
                </>
              )}
            </div>
            */}
          </div>
        </div>
      </div>

      <main className={containerStyles.mainContent + " flex-grow mb-32"}>
        {/* Use a client-side only approach with conditionals inside useEffect for content rendering */}
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
        
        {/* Temporarily hidden Model Comparer */}
        {false && (currentView === 'compare' || isComparePage || compareParam) && (
          <Suspense fallback={
            <div className="animate-pulse p-6 space-y-6">
              <div className="h-6 bg-gray-700 rounded w-32 mx-auto"></div>
              <div className="h-48 bg-gray-700 rounded"></div>
              <div className="h-48 bg-gray-700 rounded"></div>
            </div>
          }>
            <ModelComparer 
              data={data}
              onBack={handleBack}
            />
          </Suspense>
        )}
        
        {/* Show "Coming Soon" message if someone tries to access the compare page directly */}
        {(currentView === 'compare' || isComparePage || compareParam) && (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-bold mb-4" style={{ color: brandConfig.secondaryColor }}>Model Comparer</h2>
            <p className="text-gray-300 text-center max-w-md mb-8">
              This feature is coming soon! We're working on building a comprehensive model comparison tool.
            </p>
            <button
              onClick={goToHome}
              className="text-white py-2 px-6 rounded-md transition-colors hover:opacity-90"
              style={{ backgroundColor: brandConfig.primaryColor }}
            >
              Return to Explorer
            </button>
          </div>
        )}
      </main>

      {/* Brand-aware Footer component - only visible for personal brand */}
      <Footer
        currentView={currentView}
        topCompanies={topCompanies}
        topBenchmarks={topBenchmarks}
        benchmarksLoaded={benchmarksLoaded}
      />
    </div>
  );
};

export default AIExplorer;