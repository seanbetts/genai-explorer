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
  benchmarkPageContent?: React.ReactNode;
}
const AIExplorer: React.FC<AIExplorerProps> = ({ initialData, benchmarkPageContent }) => {
  const data: ExplorerData = initialData;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [benchmarkLastUpdated, setBenchmarkLastUpdated] = useState<Date | null>(null);
  
  // Find the most recent lastUpdated date from all companies
  const mostRecentUpdateDate = useMemo(() => {
    if (!data.companies || data.companies.length === 0) return null;
    
    return data.companies.reduce((latestDate, company) => {
      if (!company.lastUpdated) return latestDate;
      
      const companyDate = new Date(company.lastUpdated);
      return !latestDate || companyDate > latestDate ? companyDate : latestDate;
    }, null as Date | null);
  }, [data.companies]);
  
  const lastUpdatedString = useMemo(() => 
    mostRecentUpdateDate ? mostRecentUpdateDate.toISOString().split('T')[0] : undefined
  , [mostRecentUpdateDate]);

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
  
  // Track if we're in model selection phase (vs type selection)
  const [isInModelSelection, setIsInModelSelection] = useState(false);
  
  // Track when we need to reset the ModelComparer to type selection
  const [resetModelComparer, setResetModelComparer] = useState(false);
  
  // Update the current view after component mounts to avoid hydration issues
  useEffect(() => {
    let view = 'home';
    if (selectedCompany) {
      view = 'company';
    } else if (benchmarkId) {
      view = 'benchmark';
    } else if (isComparePage || compareParam) {
      view = 'compare';
    } else if (benchmarkPageContent) {
      view = 'benchmarks';
    }
    setCurrentView(view);
  }, [selectedCompany, benchmarkId, isComparePage, compareParam, benchmarkPageContent]);
  
  // Reset the ModelComparer reset flag after it's been processed
  useEffect(() => {
    if (resetModelComparer) {
      // Reset the flag after a brief delay to ensure the ModelComparer has processed it
      const timer = setTimeout(() => {
        setResetModelComparer(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [resetModelComparer]);
  
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
    // For compare pages in model selection phase, go back to type selection
    else if (currentView === 'compare' && isInModelSelection) {
      setIsInModelSelection(false);
      setResetModelComparer(true);
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
        lastUpdated={lastUpdatedString}
        isInModelSelection={isInModelSelection}
      />

      {/* Features Navigation - visible on all views - sticky */}
      <div className={`${brandConfig.name === 'OMG' ? 'bg-gray-200 border-b border-gray-300' : 'bg-gray-800 border-b border-gray-700'} py-2 shadow-md sticky top-[90px] z-20`}>
        <div className="container mx-auto px-5">
          <div className={`flex items-center ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} text-xs py-1 md:pl-8 space-x-8`}>
            <Link 
              href="/" 
              className="transition-colors flex items-center"
              style={{ 
                color: currentView === 'home' && !searchParams.has('company') && !searchParams.has('benchmark') && !searchParams.has('compare')
                  ? brandConfig.name === 'OMG' ? '#000000' : '#FFFFFF' // Black for OMG, white for personal
                  : brandConfig.name === 'OMG' ? '#4B5563' : '#d1d5db', // Using consistent gray color
              }}
              onMouseEnter={(e) => {
                // Always use secondary color on hover for both brands
                e.currentTarget.style.color = brandConfig.secondaryColor;
                // Also change the icon color
                const icon = e.currentTarget.querySelector('i');
                if (icon) icon.style.color = brandConfig.secondaryColor;
              }}
              onMouseLeave={(e) => {
                // Reset icon color first
                const icon = e.currentTarget.querySelector('i');
                if (icon) icon.style.color = brandConfig.primaryColor;
                
                // Then reset text color
                if (currentView === 'home' && !searchParams.has('company') && !searchParams.has('benchmark') && !searchParams.has('compare')) {
                  // If active, return to black for OMG or white for personal
                  e.currentTarget.style.color = brandConfig.name === 'OMG' ? '#000000' : '#FFFFFF';
                } else {
                  // If not active, return to default text color for the brand
                  e.currentTarget.style.color = brandConfig.name === 'OMG' ? '#4B5563' : '#d1d5db';
                }
              }}
            >
              <i 
                className="bi bi-grid mr-1.5" 
                style={{ color: brandConfig.primaryColor }}
              ></i>
              <span>Model Explorer</span>
            </Link>
            
            {/* Benchmark Explorer Link */}
            <Link 
              href="/benchmarks" 
              className="transition-colors flex items-center"
              style={{ 
                color: currentView === 'benchmarks'
                  ? brandConfig.name === 'OMG' ? '#000000' : '#FFFFFF'  // Black for OMG, white for personal
                  : brandConfig.name === 'OMG' ? '#4B5563' : '#d1d5db', // Using consistent gray color
              }}
              onMouseEnter={(e) => {
                // Always use secondary color on hover for both brands
                e.currentTarget.style.color = brandConfig.secondaryColor;
                // Also change the icon color
                const icon = e.currentTarget.querySelector('i');
                if (icon) icon.style.color = brandConfig.secondaryColor;
              }}
              onMouseLeave={(e) => {
                // Reset icon color first
                const icon = e.currentTarget.querySelector('i');
                if (icon) icon.style.color = brandConfig.primaryColor;
                
                // Then reset text color
                if (currentView === 'benchmarks') {
                  // If active, return to black for OMG or white for personal
                  e.currentTarget.style.color = brandConfig.name === 'OMG' ? '#000000' : '#FFFFFF';
                } else {
                  // If not active, return to default text color for the brand
                  e.currentTarget.style.color = brandConfig.name === 'OMG' ? '#4B5563' : '#d1d5db';
                }
              }}
            >
              <i 
                className="bi bi-award mr-1.5" 
                style={{ color: brandConfig.primaryColor }}
              ></i>
              <span>Benchmark Explorer</span>
            </Link>
            
            {/* Model Comparer Link */}
            <Link 
              href="/compare" 
              className="transition-colors flex items-center"
              style={{ 
                color: currentView === 'compare'
                  ? brandConfig.name === 'OMG' ? '#000000' : '#FFFFFF'  // Black for OMG, white for personal
                  : brandConfig.name === 'OMG' ? '#4B5563' : '#d1d5db', // Using consistent gray color
              }}
              onMouseEnter={(e) => {
                // Always use secondary color on hover for both brands
                e.currentTarget.style.color = brandConfig.secondaryColor;
                // Also change the icon color
                const icon = e.currentTarget.querySelector('i');
                if (icon) icon.style.color = brandConfig.secondaryColor;
              }}
              onMouseLeave={(e) => {
                // Reset icon color first
                const icon = e.currentTarget.querySelector('i');
                if (icon) icon.style.color = brandConfig.primaryColor;
                
                // Then reset text color
                if (currentView === 'compare') {
                  // If active, return to black for OMG or white for personal
                  e.currentTarget.style.color = brandConfig.name === 'OMG' ? '#000000' : '#FFFFFF';
                } else {
                  // If not active, return to default text color for the brand
                  e.currentTarget.style.color = brandConfig.name === 'OMG' ? '#4B5563' : '#d1d5db';
                }
              }}
            >
              <i 
                className="bi bi-table mr-1.5" 
                style={{ color: brandConfig.primaryColor }}
              ></i>
              <span>Model Comparer</span>
            </Link>
            
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
        
        {/* Benchmark Explorer page content */}
        {currentView === 'benchmarks' && benchmarkPageContent && (
          <div className="container mx-auto px-5">
            {benchmarkPageContent}
          </div>
        )}
        
        {/* Model Comparer */}
        {(currentView === 'compare' || isComparePage || compareParam) && (
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
              onTypeSelected={() => setIsInModelSelection(true)}
              resetToTypeSelection={resetModelComparer}
            />
          </Suspense>
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