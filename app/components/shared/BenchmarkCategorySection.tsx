'use client';

import React from 'react';
import { Benchmark, BenchmarkCategory, BenchmarkScore } from '../types';
import BenchmarkCard from './BenchmarkCard';
import { textStyles } from '../utils/theme';
import { containerStyles, iconStyles } from '../utils/layout';
import brandConfig from '../../config/brand';

interface BenchmarkCategorySectionProps {
  category: BenchmarkCategory;
  title: string;
  description?: string;
  benchmarks: Benchmark[];
  scores: BenchmarkScore[];
  styleName: string;
  onBenchmarkSelect: (benchmarkId: string) => void;
  layout: 'full-width' | 'half-width' | 'quarter-width';
  columns?: number;
  icon?: string; // Bootstrap icon class
}

const BenchmarkCategorySection: React.FC<BenchmarkCategorySectionProps> = ({
  category,
  title,
  description,
  benchmarks,
  scores,
  styleName,
  onBenchmarkSelect,
  layout,
  columns = 4,
  icon = '',
}) => {
  // All benchmark categories use the same full-width grid layout
  const getGridClass = () => {
    return 'grid items-stretch grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5';
  };

  // Sort benchmarks to show featured ones first
  const sortedBenchmarks = [...benchmarks].sort((a, b) => {
    // First sort by featured status (featured benchmarks first)
    if (a.featured_benchmark && !b.featured_benchmark) return -1;
    if (!a.featured_benchmark && b.featured_benchmark) return 1;
    
    // Then sort by name
    return a.benchmark_name.localeCompare(b.benchmark_name);
  });
  
  // Render content with consistent layout for all categories
  const renderContent = () => {
    // Calculate unique model count for each benchmark
    const benchmarkModelCounts = scores.reduce((counts, score) => {
      const id = score.benchmark_id;
      
      if (!counts[id]) {
        counts[id] = new Set();
      }
      
      // Add this model_id to the set of unique models for this benchmark
      counts[id].add(score.model_id);
      
      return counts;
    }, {} as Record<string, Set<string>>);
    
    // Convert sets to counts
    const benchmarkScoreCounts = Object.entries(benchmarkModelCounts).reduce((counts, [benchmarkId, modelSet]) => {
      counts[benchmarkId] = modelSet.size;
      return counts;
    }, {} as Record<string, number>);
    
    return (
      <>
        <div className="mb-4">
          <div className={containerStyles.categoryTitle}>
            {icon && (
              <i className={`bi ${icon} ${iconStyles.iconLeft}`} style={{ color: brandConfig.primaryColor }}></i>
            )}
            <span style={{ 
              color: brandConfig.primaryColor,
              fontFamily: brandConfig.name === 'OMG' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' : 'monospace'
            }}>{title}</span>
          </div>
          {description && (
            <div className={`text-sm ${brandConfig.name === 'OMG' ? 'font-sans text-gray-600' : 'font-mono text-gray-400'} mt-1 mb-2`}>
              {description}
            </div>
          )}
          {/* Divider line using brand-specific styles */}
          <div className="w-full border-b my-2" style={{ borderColor: brandConfig.primaryColor }}></div>
        </div>
        
        {sortedBenchmarks.length > 0 ? (
          <div className={getGridClass()}>
            {sortedBenchmarks.map(benchmark => (
              <BenchmarkCard 
                key={benchmark.benchmark_id}
                benchmark={benchmark}
                scoreCount={benchmarkScoreCounts[benchmark.benchmark_id] || 0}
                onClick={() => onBenchmarkSelect(benchmark.benchmark_id)}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-4 ${brandConfig.name === 'OMG' ? 'text-gray-600' : 'text-gray-400'}`}>
            No benchmarks available in this category.
          </div>
        )}
      </>
    );
  };

  // Set the background color directly based on brand
  const containerStyle = brandConfig.name === 'OMG' 
    ? { backgroundColor: '#e5e7eb', borderColor: '#d1d5db' } // gray-200 and gray-300 equivalents 
    : {};

  return (
    <div 
      className={`${containerStyles.categorySection} ${styleName}`}
      style={containerStyle}
    >
      {renderContent()}
    </div>
  );
};

export default BenchmarkCategorySection;