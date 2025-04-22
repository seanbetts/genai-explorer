'use client';

import React, { useEffect, useState } from 'react';
import { Model, Benchmark, BenchmarkScore, BenchmarkCategory } from '../types';
import { loadBenchmarkMetadata, loadBenchmarkScores, groupBenchmarksByCategory } from '../utils/benchmarkUtils';
import BenchmarkCategorySection from './BenchmarkCategorySection';
import { tableHoverStyles } from '../shared/TableComponents';

interface BenchmarksTableProps {
  models: Model[];
  companyId: string;
}

// Define filter and sorting types
type SortType = 'default' | 'name-asc' | 'name-desc' | 'score-high' | 'score-low' | 'date-new' | 'date-old';
type FilterRange = 'all' | 'high' | 'medium' | 'low';

const BenchmarksTable: React.FC<BenchmarksTableProps> = ({ models, companyId }) => {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [benchmarkScores, setBenchmarkScores] = useState<BenchmarkScore[]>([]);
  const [groupedBenchmarks, setGroupedBenchmarks] = useState<Record<BenchmarkCategory, Benchmark[]>>({} as Record<BenchmarkCategory, Benchmark[]>);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering and sorting state
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [scoreRange, setScoreRange] = useState<FilterRange>('all');
  const [sortType, setSortType] = useState<SortType>('default');
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [filteredGroupedBenchmarks, setFilteredGroupedBenchmarks] = useState<Record<BenchmarkCategory, Benchmark[]>>({} as Record<BenchmarkCategory, Benchmark[]>);
  
  // Load benchmark data
  useEffect(() => {
    const loadBenchmarkData = async () => {
      try {
        setLoading(true);
        
        // Load benchmark metadata and scores
        const benchmarkData = loadBenchmarkMetadata();
        const scoreData = await loadBenchmarkScores();
        
        // Filter scores to only include those for the current company's models
        const companyModelIds = models.map(model => model.id);
        const filteredScores = scoreData.filter(score => 
          score.company_id === companyId && 
          companyModelIds.includes(score.model_id)
        );
        
        // Group benchmarks by category
        const grouped = groupBenchmarksByCategory(benchmarkData);
        
        setBenchmarks(benchmarkData);
        setBenchmarkScores(filteredScores);
        setGroupedBenchmarks(grouped);
        setFilteredGroupedBenchmarks(grouped);
        setLoading(false);
      } catch (err) {
        console.error('Error loading benchmark data:', err);
        setError('Failed to load benchmark data. Please try again later.');
        setLoading(false);
      }
    };
    
    loadBenchmarkData();
  }, [companyId, models]);
  
  // Apply filters and sorting
  useEffect(() => {
    if (loading || !Object.keys(groupedBenchmarks).length) return;
    
    let filteredBenchmarks: Record<BenchmarkCategory, Benchmark[]> = {} as Record<BenchmarkCategory, Benchmark[]>;
    
    // Filter by category
    if (selectedCategory === 'all') {
      filteredBenchmarks = { ...groupedBenchmarks };
    } else {
      const category = selectedCategory as BenchmarkCategory;
      if (groupedBenchmarks[category]) {
        filteredBenchmarks[category] = [...groupedBenchmarks[category]];
      }
    }
    
    // Filter by score range if needed
    if (scoreRange !== 'all') {
      Object.keys(filteredBenchmarks).forEach(category => {
        filteredBenchmarks[category as BenchmarkCategory] = filteredBenchmarks[category as BenchmarkCategory].filter(benchmark => {
          // Check if any model has a score in the desired range
          const anyScoreInRange = models.some(model => {
            const score = benchmarkScores.find(
              s => s.model_id === model.id && s.benchmark_id === benchmark.benchmark_id
            );
            
            if (!score) return false;
            
            if (scoreRange === 'high') return score.score >= 80;
            if (scoreRange === 'medium') return score.score >= 50 && score.score < 80;
            if (scoreRange === 'low') return score.score < 50;
            
            return true;
          });
          
          return anyScoreInRange;
        });
      });
    }
    
    // Filter by date range if needed
    if (dateRange) {
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      
      if (startDate || endDate) {
        Object.keys(filteredBenchmarks).forEach(category => {
          filteredBenchmarks[category as BenchmarkCategory] = filteredBenchmarks[category as BenchmarkCategory].filter(benchmark => {
            // Check if any model has a score in the desired date range
            const anyScoreInDateRange = models.some(model => {
              const score = benchmarkScores.find(
                s => s.model_id === model.id && s.benchmark_id === benchmark.benchmark_id
              );
              
              if (!score || !score.date) return false;
              
              const scoreDate = new Date(score.date);
              
              if (startDate && endDate) {
                return scoreDate >= startDate && scoreDate <= endDate;
              } else if (startDate) {
                return scoreDate >= startDate;
              } else if (endDate) {
                return scoreDate <= endDate;
              }
              
              return true;
            });
            
            return anyScoreInDateRange;
          });
        });
      }
    }
    
    // Sort benchmarks if needed
    if (sortType !== 'default') {
      Object.keys(filteredBenchmarks).forEach(category => {
        let sorted = [...filteredBenchmarks[category as BenchmarkCategory]];
        
        switch (sortType) {
          case 'name-asc':
            sorted.sort((a, b) => a.benchmark_name.localeCompare(b.benchmark_name));
            break;
          case 'name-desc':
            sorted.sort((a, b) => b.benchmark_name.localeCompare(a.benchmark_name));
            break;
          case 'score-high':
            // Sort by highest average score across all models
            sorted.sort((a, b) => {
              const aScores = models.map(model => 
                benchmarkScores.find(s => s.model_id === model.id && s.benchmark_id === a.benchmark_id)?.score || 0
              );
              const bScores = models.map(model => 
                benchmarkScores.find(s => s.model_id === model.id && s.benchmark_id === b.benchmark_id)?.score || 0
              );
              
              const aAvg = aScores.length ? aScores.reduce((sum, s) => sum + s, 0) / aScores.length : 0;
              const bAvg = bScores.length ? bScores.reduce((sum, s) => sum + s, 0) / bScores.length : 0;
              
              return bAvg - aAvg;
            });
            break;
          case 'score-low':
            // Sort by lowest average score across all models
            sorted.sort((a, b) => {
              const aScores = models.map(model => 
                benchmarkScores.find(s => s.model_id === model.id && s.benchmark_id === a.benchmark_id)?.score || 0
              );
              const bScores = models.map(model => 
                benchmarkScores.find(s => s.model_id === model.id && s.benchmark_id === b.benchmark_id)?.score || 0
              );
              
              const aAvg = aScores.length ? aScores.reduce((sum, s) => sum + s, 0) / aScores.length : 0;
              const bAvg = bScores.length ? bScores.reduce((sum, s) => sum + s, 0) / bScores.length : 0;
              
              return aAvg - bAvg;
            });
            break;
          case 'date-new':
            // Sort by newest benchmark date
            sorted.sort((a, b) => {
              const aLatestDate = models.reduce((latest, model) => {
                const score = benchmarkScores.find(s => s.model_id === model.id && s.benchmark_id === a.benchmark_id);
                if (score?.date && (!latest || new Date(score.date) > new Date(latest))) {
                  return score.date;
                }
                return latest;
              }, '');
              
              const bLatestDate = models.reduce((latest, model) => {
                const score = benchmarkScores.find(s => s.model_id === model.id && s.benchmark_id === b.benchmark_id);
                if (score?.date && (!latest || new Date(score.date) > new Date(latest))) {
                  return score.date;
                }
                return latest;
              }, '');
              
              if (!aLatestDate) return 1;
              if (!bLatestDate) return -1;
              
              return new Date(bLatestDate).getTime() - new Date(aLatestDate).getTime();
            });
            break;
          case 'date-old':
            // Sort by oldest benchmark date
            sorted.sort((a, b) => {
              const aLatestDate = models.reduce((latest, model) => {
                const score = benchmarkScores.find(s => s.model_id === model.id && s.benchmark_id === a.benchmark_id);
                if (score?.date && (!latest || new Date(score.date) > new Date(latest))) {
                  return score.date;
                }
                return latest;
              }, '');
              
              const bLatestDate = models.reduce((latest, model) => {
                const score = benchmarkScores.find(s => s.model_id === model.id && s.benchmark_id === b.benchmark_id);
                if (score?.date && (!latest || new Date(score.date) > new Date(latest))) {
                  return score.date;
                }
                return latest;
              }, '');
              
              if (!aLatestDate) return 1;
              if (!bLatestDate) return -1;
              
              return new Date(aLatestDate).getTime() - new Date(bLatestDate).getTime();
            });
            break;
        }
        
        filteredBenchmarks[category as BenchmarkCategory] = sorted;
      });
    }
    
    setFilteredGroupedBenchmarks(filteredBenchmarks);
  }, [groupedBenchmarks, selectedCategory, scoreRange, sortType, dateRange, benchmarkScores, models, loading]);
  
  // Sort models to prioritize frontier models first, then by release date
  const sortedModels = [...models].sort((a, b) => {
    // First sort by category (frontier before others)
    if (a.category === 'frontier' && b.category !== 'frontier') {
      return -1;
    }
    if (a.category !== 'frontier' && b.category === 'frontier') {
      return 1;
    }
    
    // Then sort by release date (newest first)
    const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
    const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
    return dateB - dateA;
  });
  
  // Check if there are any scores for this company
  const hasScores = benchmarkScores.length > 0;
  
  // Handle filter and sort changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as string | 'all');
  };
  
  const handleScoreRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScoreRange(e.target.value as FilterRange);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value as SortType);
  };
  
  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    setDateRange(prev => {
      if (!prev) return { start: type === 'start' ? value : '', end: type === 'end' ? value : '' };
      return { ...prev, [type]: value };
    });
  };
  
  const resetFilters = () => {
    setSelectedCategory('all');
    setScoreRange('all');
    setSortType('default');
    setDateRange(null);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-700 rounded mb-4"></div>
          <div className="h-48 w-full bg-gray-800 rounded"></div>
          <div className="mt-4 text-gray-400">Loading benchmark data...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 my-4">
        <div className="flex items-center">
          <i className="bi bi-exclamation-triangle-fill text-red-500 mr-2 text-xl"></i>
          <h3 className="text-lg font-medium text-red-400">Error</h3>
        </div>
        <p className="mt-2 text-gray-300">{error}</p>
      </div>
    );
  }
  
  if (!hasScores) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 my-4 text-center">
        <i className="bi bi-graph-up text-gray-500 text-4xl mb-3"></i>
        <h3 className="text-xl font-medium text-gray-300 mb-2">No Benchmark Data Available</h3>
        <p className="text-gray-400">
          No benchmark scores are available for {models.length > 1 ? 'these models' : 'this model'} yet.
        </p>
      </div>
    );
  }
  
  // Check if no benchmarks match the current filters
  const hasFilteredBenchmarks = Object.values(filteredGroupedBenchmarks).some(benchmarks => benchmarks.length > 0);
  
  return (
    <div className="transform transition-opacity duration-300">
      <style>{tableHoverStyles}</style>
      
      {/* Info box at the top explaining benchmarks */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <i className="bi bi-info-circle-fill text-cyan-500 text-xl mt-0.5"></i>
          <div>
            <h3 className="text-lg font-medium text-cyan-400 mb-1">About Benchmarks</h3>
            <p className="text-gray-300 text-sm">
              Benchmarks provide standardized tests to compare model capabilities across different dimensions. 
              Scores are normalized on a 0-100 scale where higher is better. The rankings show how models compare to others on the same benchmark.
            </p>
          </div>
        </div>
      </div>
      
      {/* Filter and sort controls */}
      <div className="mb-6 p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Category filter */}
          <div className="flex flex-col gap-1">
            <label htmlFor="category-filter" className="text-sm text-gray-300">Benchmark Category</label>
            <select 
              id="category-filter"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="bg-gray-800 border border-gray-600 text-white py-2 px-3 rounded hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {Object.keys(groupedBenchmarks).map(category => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Score range filter */}
          <div className="flex flex-col gap-1">
            <label htmlFor="score-filter" className="text-sm text-gray-300">Score Range</label>
            <select 
              id="score-filter"
              value={scoreRange}
              onChange={handleScoreRangeChange}
              className="bg-gray-800 border border-gray-600 text-white py-2 px-3 rounded hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
            >
              <option value="all">All Scores</option>
              <option value="high">High Scores (80-100)</option>
              <option value="medium">Medium Scores (50-79)</option>
              <option value="low">Low Scores (0-49)</option>
            </select>
          </div>
          
          {/* Sort options */}
          <div className="flex flex-col gap-1">
            <label htmlFor="sort-options" className="text-sm text-gray-300">Sort By</label>
            <select 
              id="sort-options"
              value={sortType}
              onChange={handleSortChange}
              className="bg-gray-800 border border-gray-600 text-white py-2 px-3 rounded hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
            >
              <option value="default">Default Order</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="score-high">Highest Scores First</option>
              <option value="score-low">Lowest Scores First</option>
              <option value="date-new">Newest First</option>
              <option value="date-old">Oldest First</option>
            </select>
          </div>
          
          {/* Reset button */}
          <button
            onClick={resetFilters}
            className="bg-gray-700 border border-gray-600 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 ml-auto"
          >
            <i className="bi bi-arrow-repeat mr-1"></i> Reset
          </button>
        </div>
      </div>
      
      {/* No results message */}
      {!hasFilteredBenchmarks && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 my-4 text-center">
          <i className="bi bi-filter text-gray-500 text-4xl mb-3"></i>
          <h3 className="text-xl font-medium text-gray-300 mb-2">No Results Found</h3>
          <p className="text-gray-400">
            No benchmark scores match your current filter settings.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 bg-gray-700 border border-gray-600 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <i className="bi bi-arrow-repeat mr-1"></i> Reset Filters
          </button>
        </div>
      )}
      
      {/* Render each benchmark category section */}
      {hasFilteredBenchmarks && Object.entries(filteredGroupedBenchmarks).map(([category, categoryBenchmarks]) => 
        categoryBenchmarks.length > 0 ? (
          <BenchmarkCategorySection
            key={category}
            category={category}
            benchmarks={categoryBenchmarks}
            models={sortedModels}
            benchmarkScores={benchmarkScores}
            companyId={companyId}
          />
        ) : null
      )}
      
      {/* Sources and methodology footer */}
      <div className="mt-8 text-sm text-gray-400 border-t border-gray-700 pt-4">
        <p className="mb-2">
          <strong className="text-gray-300">Methodology:</strong> Benchmark scores are normalized to a 0-100 scale to make them comparable.
          Rankings are calculated based on all models that have scores for a given benchmark.
        </p>
        <p>
          <strong className="text-gray-300">Sources:</strong> Benchmark data is collected from research papers, model provider documentation, and published evaluations.
          For detailed methodology, click the paper links next to each benchmark.
        </p>
      </div>
    </div>
  );
};

export default BenchmarksTable;