'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Benchmark, BenchmarkCategory, BenchmarkScore } from './types';
import { benchmarkCategoryConfig, BenchmarkCategoryConfigEntry } from './benchmarkCategoryConfig';
import { containerStyles } from './utils/layout';
import { categoryStyles } from './utils/theme';
import brandConfig from '../config/brand';
import { loadBenchmarkMetadata, loadBenchmarkScores, groupBenchmarksByCategory } from './utils/benchmarkUtils';
import BenchmarkCategorySection from './shared/BenchmarkCategorySection';

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
  
  // Extract rows of categories from config
  const singleRow = benchmarkCategoryConfig.filter(c => c.rowType === 'single');
  const doubleRow = benchmarkCategoryConfig.filter(c => c.rowType === 'double');
  const quadRow = benchmarkCategoryConfig.filter(c => c.rowType === 'quad');
  
  // Ref for the two-column row
  const twoColRef = useRef<HTMLDivElement>(null);

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
      'multimodal': 'bi-image-text',
      'science': 'bi-flask',
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
        {/* Single-row skeletons */}
        {singleRow.map(entry => (
          <div key={`skeleton-${entry.key}`} className="mb-6">
            <div className="h-6 rounded w-1/4 mb-4" style={{ backgroundColor: brandConfig.name === 'OMG' ? '#d1d5db' : '#374151' }}></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array(entry.columns ?? 4).fill(0).map((_, i) => (
                <div key={i} className="h-24 rounded" style={{ backgroundColor: brandConfig.name === 'OMG' ? '#d1d5db' : '#374151' }}></div>
              ))}
            </div>
          </div>
        ))}
        {/* Two-column row skeletons */}
        <div className={`${containerStyles.explorerRowTwo} mb-6`}>  
          {doubleRow.map(entry => (
            <div key={`skeleton-double-${entry.key}`} className="mb-6 flex flex-col">
              <div className="h-6 rounded w-1/4 mb-4" style={{ backgroundColor: brandConfig.name === 'OMG' ? '#d1d5db' : '#374151' }}></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-24 rounded" style={{ backgroundColor: brandConfig.name === 'OMG' ? '#d1d5db' : '#374151' }}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Four-column row skeletons */}
        <div className={containerStyles.explorerRowFour}>
          {quadRow.map(entry => (
            <div key={`skeleton-quad-${entry.key}`} className="mb-6 flex flex-col">
              <div className="h-6 rounded w-1/4 mb-4" style={{ backgroundColor: brandConfig.name === 'OMG' ? '#d1d5db' : '#374151' }}></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-24 rounded" style={{ backgroundColor: brandConfig.name === 'OMG' ? '#d1d5db' : '#374151' }}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Main content after load
  return (
    <div className={`${containerStyles.explorerContainer} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Single-row categories */}
      {singleRow.map((entry: BenchmarkCategoryConfigEntry) => (
        <div
          key={entry.key}
          className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
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
      
      {/* Two-column row */}
      <div
        ref={twoColRef}
        className={`${containerStyles.explorerRowTwo} transform transition-all duration-500 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        {doubleRow.map(entry => (
          <BenchmarkCategorySection
            key={entry.key}
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
        ))}
      </div>
      
      {/* Four-column row */}
      <div
        className={`${containerStyles.explorerRowFour} transform transition-all duration-500 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        {quadRow.map(entry => (
          <BenchmarkCategorySection
            key={entry.key}
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
        ))}
      </div>
    </div>
  );
};

export default BenchmarkExplorerView;