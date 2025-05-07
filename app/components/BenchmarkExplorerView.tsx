'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Benchmark, BenchmarkCategory, BenchmarkScore } from './types';
import { benchmarkCategoryConfig, BenchmarkCategoryConfigEntry } from './benchmarkCategoryConfig';
import { containerStyles } from './utils/layout';
import { categoryStyles } from './utils/theme';
import brandConfig from '../config/brand';
import { loadBenchmarkMetadata, loadBenchmarkScores, groupBenchmarksByCategory, getLatestScoreForModelAndBenchmark, getUniqueModelScores } from './utils/benchmarkUtils';
import BenchmarkCategorySection from './shared/BenchmarkCategorySection';
import BenchmarkCard from './shared/BenchmarkCard';

interface BenchmarkExplorerViewProps {
  onBenchmarkSelect: (benchmarkId: string) => void;
}

const BenchmarkExplorerView: React.FC<BenchmarkExplorerViewProps> = ({ onBenchmarkSelect }) => {
  // State for animations when components mount
  const [isLoaded, setIsLoaded] = useState(false);
  
  // State for benchmark data
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [benchmarkScores, setBenchmarkScores] = useState<BenchmarkScore[]>([]);
  const [categorizedBenchmarks, setCategorizedBenchmarks] = useState<Record<BenchmarkCategory, Benchmark[]>>({} as Record<BenchmarkCategory, Benchmark[]>);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Load benchmark data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load data in parallel
        const [benchmarkData, benchmarkScoreData] = await Promise.all([
          loadBenchmarkMetadata(),
          loadBenchmarkScores()
        ]);
        
        setBenchmarks(benchmarkData);
        setBenchmarkScores(benchmarkScoreData);
        
        // Group benchmarks by category
        const grouped = await groupBenchmarksByCategory(benchmarkData);
        setCategorizedBenchmarks(grouped);
        
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading benchmark data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Set loaded state after component mounts for animation effects
  useEffect(() => {
    // Only show animations after data is loaded
    if (dataLoaded) {
      // Small delay for animation effect
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [dataLoaded]);
  
  // All categories in a single array
  const allCategories = benchmarkCategoryConfig;
  
  // Ref for the two-column row
  const twoColRef = useRef<HTMLDivElement>(null);
  
  // Helper function to get the top model for a benchmark
  const getBenchmarkTopModel = (benchmarkId: string) => {
    if (!dataLoaded) return null;
    
    // Get uniqueModelScores for this benchmark (only most recent score for each model)
    const uniqueScores = getUniqueModelScores(benchmarkScores, benchmarkId);
    
    if (uniqueScores.length === 0) return null;
    
    // Sort by score (highest first)
    const sortedScores = [...uniqueScores].sort((a, b) => b.score - a.score);
    const topScore = sortedScores[0];
    
    // Get model and company names
    // Clean the IDs by trimming whitespace which might exist in some benchmark entries
    const cleanCompanyId = topScore.company_id.trim();
    const cleanModelId = topScore.model_id.trim();
    
    // Get model and company names from global data if available
    let modelName = cleanModelId;
    let companyName = cleanCompanyId;
    
    if (typeof window !== 'undefined') {
      const explorerData = (window as any).__EXPLORER_DATA__;
      if (explorerData && explorerData.companies) {
        // Find company
        const company = explorerData.companies.find((c: any) => c.id === cleanCompanyId);
        if (company) {
          companyName = company.name;
          
          // Find model
          const model = company.models.find((m: any) => m.id === cleanModelId);
          if (model) {
            modelName = model.name;
          }
        }
      }
    }
    
    return {
      name: modelName,
      score: topScore.score,
      company: companyName
    };
  };

  // Equalize heights of cards in two-column row after load
  useEffect(() => {
    if (!isLoaded || !twoColRef.current) return;
    const container = twoColRef.current;
    const cards: HTMLElement[] = Array.from(
      container.querySelectorAll('.benchmark-card')
    );
    if (cards.length === 0) return;
    const adjustHeights = () => {
      cards.forEach(card => { card.style.height = 'auto'; });
      const maxH = cards.reduce(
        (max, card) => Math.max(max, card.getBoundingClientRect().height),
        0
      );
      cards.forEach(card => { card.style.height = `${maxH}px`; });
    };
    adjustHeights();
    window.addEventListener('resize', adjustHeights);
    return () => { window.removeEventListener('resize', adjustHeights); };
  }, [isLoaded]);
  
  // Helpers to derive styles/icons
  const getCategoryStyle = (category: BenchmarkCategory): string => categoryStyles.common.full;
  const getCategoryIcon = (category: BenchmarkCategory): string => {
    const iconMap: Record<BenchmarkCategory, string> = {
      'usability': 'bi-chat-dots',
      'reasoning': 'bi-lightbulb',
      'coding': 'bi-code-square',
      'factuality': 'bi-check-circle',
      'maths': 'bi-calculator',
      'multimodal': 'bi-camera-video', // Updated icon for multimodal
      'science': 'bi-journal-richtext', // Updated icon for scientific knowledge
      'agentic': 'bi-robot',
      'research': 'bi-journal-text'
    };
    return iconMap[category] || 'bi-trophy';
  };
  const getCategoryShadow = (category: BenchmarkCategory): string => categoryStyles.common.shadow;

  // Skeleton loaders while loading
  if (!isLoaded) {
    return (
      <div className={`${containerStyles.explorerContainer} animate-pulse`}>  
        {/* Category skeletons */}
        {allCategories.map(entry => (
          <div key={`skeleton-${entry.key}`} className="mb-6">
            <div className="h-6 rounded w-1/4 mb-4" style={{ backgroundColor: brandConfig.name === 'OMG' ? '#d1d5db' : '#374151' }}></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array(entry.columns ?? 4).fill(0).map((_, i) => (
                <div key={i} className="h-24 rounded" style={{ backgroundColor: brandConfig.name === 'OMG' ? '#d1d5db' : '#374151' }}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Function to gather all featured benchmarks
  const getFeaturedBenchmarks = () => {
    // Collect all benchmarks from each category
    const allBenchmarks = Object.values(categorizedBenchmarks).flat();
    // Filter for only featured benchmarks
    return allBenchmarks.filter(benchmark => benchmark.featured_benchmark);
  };
  
  // Get featured benchmarks
  const featuredBenchmarks = getFeaturedBenchmarks();
  
  // Main content after load
  return (
    <div className={`${containerStyles.explorerContainer} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Featured Benchmarks Section - shown only if there are featured benchmarks */}
      {featuredBenchmarks.length > 0 && (
        <div
          className={`transform transition-all duration-500 delay-100 mb-10 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <div className={containerStyles.categorySection} style={{ 
            backgroundColor: brandConfig.name === 'OMG' ? '#e5e7eb' : '#1a1a2e', // Same grey as other categories for OMG
            borderColor: brandConfig.secondaryColor,
            borderWidth: '2px'
          }}>
            <div className="mb-4">
              <div className={containerStyles.categoryTitle}>
                <i className="bi bi-star-fill mr-2" style={{ color: brandConfig.secondaryColor }}></i>
                <span style={{ 
                  color: brandConfig.secondaryColor,
                  fontFamily: brandConfig.name === 'OMG' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' : 'monospace'
                }}>Featured Benchmarks</span>
              </div>
              <div className={`text-sm ${brandConfig.name === 'OMG' ? 'font-sans text-gray-600' : 'font-mono text-gray-400'} mt-1 mb-2`}>
                Top benchmarks that provide the most relevant insights into model capabilities
              </div>
              {/* Divider line using brand-specific styles */}
              <div className="w-full border-b my-2" style={{ borderColor: brandConfig.secondaryColor }}></div>
            </div>
            
            <div className="grid items-stretch grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredBenchmarks.map(benchmark => (
                <BenchmarkCard 
                  key={`featured-${benchmark.benchmark_id}`}
                  benchmark={{
                    ...benchmark,
                    // Don't show the star in the featured section
                    featured_benchmark: false
                  }}
                  scoreCount={benchmarkScores.filter(score => score.benchmark_id === benchmark.benchmark_id)
                    .reduce((acc, score) => {
                      acc.add(score.model_id);
                      return acc;
                    }, new Set()).size}
                  onClick={() => onBenchmarkSelect(benchmark.benchmark_id)}
                  topModel={getBenchmarkTopModel(benchmark.benchmark_id) || undefined}
                  // Add category icon
                  categoryIcon={getCategoryIcon(benchmark.benchmark_category as BenchmarkCategory)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* All categories in a vertical list */}
      {allCategories.map((entry: BenchmarkCategoryConfigEntry, index) => (
        <div
          key={entry.key}
          className={`transform transition-all duration-500 mb-8 delay-${Math.min((index + 1) * 50, 350)} ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <BenchmarkCategorySection
            category={entry.key}
            title={entry.title}
            description={entry.description}
            benchmarks={categorizedBenchmarks[entry.key] || []}
            scores={benchmarkScores}
            styleName={`${getCategoryStyle(entry.key)} ${getCategoryShadow(entry.key)} ${containerStyles.categorySectionHover}`}
            onBenchmarkSelect={onBenchmarkSelect}
            layout={entry.layout}
            columns={entry.columns}
            icon={getCategoryIcon(entry.key)}
          />
        </div>
      ))}
    </div>
  );
};

export default BenchmarkExplorerView;