'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Model, Benchmark, BenchmarkCategory } from '../types';
import type { BenchmarkScore } from '../types';
import { loadBenchmarkMetadata, loadBenchmarkScores, groupBenchmarksByCategory, calculateGlobalRankings, getAllScoresForModelAndBenchmark, getLatestScoreForModelAndBenchmark } from '../utils/benchmarkUtils';
import BenchmarkCategorySection from './BenchmarkCategorySection';
import { tableHoverStyles, Legend, SharedTable, TableHeader } from '../shared/TableComponents';
import { textStyles } from '../utils/theme';
import { tableStyles, iconStyles, containerStyles } from '../utils/layout';
import brandConfig from '../../config/brand';

interface BenchmarksTableProps {
  models: Model[];
  companyId: string;
}

// Component to display a single benchmark score
interface BenchmarkScoreProps {
  model: Model;
  benchmark: Benchmark;
  benchmarkScores: BenchmarkScore[];
  globalRankings?: Record<string, Record<string, { rank: number, total: number }>>;
  rankingsLoaded?: boolean;
}

// Memoize the BenchmarkScore component to prevent unnecessary re-renders
const BenchmarkScoreComponent: React.FC<BenchmarkScoreProps> = ({ 
  model, 
  benchmark, 
  benchmarkScores,
  globalRankings = {},
  rankingsLoaded = false
}) => {
  
  // Get the LATEST score for this model and benchmark - memoized for performance
  const score = useMemo(() => 
    getLatestScoreForModelAndBenchmark(benchmarkScores, model.id, benchmark.benchmark_id),
    [benchmarkScores, model.id, benchmark.benchmark_id]
  );
  
  if (!score) {
    return <span className={textStyles.tertiary}>-</span>;
  }
  
  // Format the score based on benchmark type
  const formatBenchmarkScore = (score: BenchmarkScore, benchmark: Benchmark): string => {
    const id = benchmark.benchmark_id;
    const value = score.score;
    
    // Helper to add thousands separator
    const formatWithThousands = (num: number): string => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // Integer benchmarks - no decimals
    if (id === 'codeforces' || id === 'chatbot-arena') {
      const rounded = Math.round(value);
      return formatWithThousands(rounded);
    }
    
    // AIME benchmarks - with decimal point as requested
    if (id.includes('aime')) {
      return value.toFixed(1);
    }
    
    // Dollar-based benchmarks (with $ sign)
    if (id === 'swe-lancer' || id === 'swe-lancer-ic-swe-diamond') {
      const rounded = Math.round(value);
      return `$${formatWithThousands(rounded)}`;
    }
    
    // Special benchmarks with two decimal points
    if (id === 'humanitys-last-exam' || id === 'multi-challenge') {
      return value.toFixed(2);
    }
    
    // Default formatting with 1 decimal place
    return value.toFixed(1);
  };
  
  // Get global ranking indicator
  let rankBadge = null;
  
  if (rankingsLoaded && globalRankings[benchmark.benchmark_id] && globalRankings[benchmark.benchmark_id][model.id]) {
    const globalRank = globalRankings[benchmark.benchmark_id][model.id].rank;
    const totalModels = globalRankings[benchmark.benchmark_id][model.id].total;
    
    if (globalRank === 1) {
      rankBadge = <span 
        className={`ml-1 text-xs font-semibold ${
          brandConfig.name === 'OMG' 
            ? 'text-blue-600'
            : 'text-fuchsia-500'
        }`}
        style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}
        title={`Rank #${globalRank} of ${totalModels} models`}
      >#1</span>;
    } else if (globalRank === 2) {
      rankBadge = <span 
        className={`ml-1 text-xs font-semibold ${
          brandConfig.name === 'OMG' 
            ? 'text-blue-600'
            : 'text-fuchsia-500'
        }`}
        style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}
        title={`Rank #${globalRank} of ${totalModels} models`}
      >#2</span>;
    } else if (globalRank === 3) {
      rankBadge = <span 
        className={`ml-1 text-xs font-semibold ${
          brandConfig.name === 'OMG' 
            ? 'text-blue-600'
            : 'text-fuchsia-500'
        }`}
        style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}
        title={`Rank #${globalRank} of ${totalModels} models`}
      >#3</span>;
    } else if (globalRank <= 5) {
      rankBadge = <span 
        className={`ml-1 text-xs font-semibold ${
          brandConfig.name === 'OMG' 
            ? 'text-blue-600'
            : 'text-fuchsia-500'
        }`}
        style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}
        title={`Rank #${globalRank} of ${totalModels} models`}
      >#{globalRank}</span>;
    }
  }
  
  // Create tooltip content
  const tooltipContent = (() => {
    let content = '';
    
    // Add global ranking info if available
    if (rankingsLoaded && globalRankings[benchmark.benchmark_id] && globalRankings[benchmark.benchmark_id][model.id]) {
      const globalRank = globalRankings[benchmark.benchmark_id][model.id].rank;
      const totalModels = globalRankings[benchmark.benchmark_id][model.id].total;
      
      content += `Rank: #${globalRank} of ${totalModels} models`;
    }
    
    // Add source info
    if (score.source_name) {
      content += content ? '\n' : '';
      content += `Source: ${score.source_name}`;
    }
    
    // Add notes if available
    if (score.notes) {
      content += content ? '\n' : '';
      content += `Notes: ${score.notes}`;
    }
    
    // Get all scores
    const allScores = getAllScoresForModelAndBenchmark(benchmarkScores, model.id, benchmark.benchmark_id);
    
    if (allScores.length > 1) {
      // Find scores that are different from the current one
      const currentScore = allScores[0];
      const historicalScores = allScores.slice(1).filter(historicalScore => 
        // Only include scores with different values than the current one
        historicalScore.score !== currentScore.score
      );
      
      // Only add history section if we have unique historical scores
      if (historicalScores.length > 0) {
        content += content ? '\n\n' : '';
        content += 'History:';
        
        historicalScores.forEach(historicalScore => {
          const date = new Date(historicalScore.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          
          content += `\n${formatBenchmarkScore(historicalScore, benchmark)} (${date})`;
          if (historicalScore.source_name) {
            content += ` - ${historicalScore.source_name}`;
          }
        });
      }
    }
    
    return content;
  })();
  
  return (
    <div className="flex flex-col items-center">
      {score.source ? (
        <a 
          href={score.source} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`font-medium transition-colors flex items-center ${
            brandConfig.name === 'OMG'
              ? 'font-sans text-blue-600 hover:text-blue-800'
              : 'font-mono text-cyan-400 hover:text-fuchsia-500'
          }`}
          style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
          title={tooltipContent}
        >
          {formatBenchmarkScore(score, benchmark)}{rankBadge}
        </a>
      ) : (
        <div 
          className={`font-medium flex items-center ${
            brandConfig.name === 'OMG'
              ? 'font-sans text-blue-600'
              : 'font-mono text-cyan-400'
          }`}
          style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
          title={tooltipContent}
        >
          {formatBenchmarkScore(score, benchmark)}{rankBadge}
        </div>
      )}
      {score.date && (
        <div className={`text-xs mt-1 ${
          brandConfig.name === 'OMG'
            ? 'text-gray-600 font-sans'
            : 'text-gray-400 font-mono'
        }`}>
          {new Date(score.date).toLocaleDateString('en-GB', {
            month: 'short',
            year: 'numeric'
          })}
        </div>
      )}
    </div>
  );
};

// Memoize the component with custom comparison
const BenchmarkScore = React.memo(BenchmarkScoreComponent, (prevProps, nextProps) => {
  // Custom comparison function to determine if component should update
  // Only re-render if any of these values have changed
  return (
    prevProps.model.id === nextProps.model.id &&
    prevProps.benchmark.benchmark_id === nextProps.benchmark.benchmark_id &&
    prevProps.benchmarkScores === nextProps.benchmarkScores &&
    prevProps.rankingsLoaded === nextProps.rankingsLoaded &&
    // Deep comparison for the specific ranking that matters for this model/benchmark
    (
      !prevProps.rankingsLoaded ||
      !prevProps.globalRankings ||
      !prevProps.globalRankings[prevProps.benchmark.benchmark_id] ||
      !prevProps.globalRankings[prevProps.benchmark.benchmark_id][prevProps.model.id] ||
      !nextProps.rankingsLoaded ||
      !nextProps.globalRankings ||
      !nextProps.globalRankings[nextProps.benchmark.benchmark_id] ||
      !nextProps.globalRankings[nextProps.benchmark.benchmark_id][nextProps.model.id] ||
      (
        prevProps.globalRankings[prevProps.benchmark.benchmark_id][prevProps.model.id].rank === 
        nextProps.globalRankings[nextProps.benchmark.benchmark_id][nextProps.model.id].rank
      )
    )
  );
});

// Component for featured benchmarks section
interface FeaturedBenchmarksSectionProps {
  benchmarks: Benchmark[];
  models: Model[];
  benchmarkScores: BenchmarkScore[];
  companyId: string;
  globalRankings?: Record<string, Record<string, { rank: number, total: number }>>;
  rankingsLoaded?: boolean;
}

// Base component for featured benchmarks section
const FeaturedBenchmarksSectionComponent: React.FC<FeaturedBenchmarksSectionProps> = ({
  benchmarks,
  models,
  benchmarkScores,
  companyId,
  globalRankings = {},
  rankingsLoaded = false
}) => {
  // Format model items for table header - memoized to avoid recalculation on re-renders
  const headerItems = useMemo(() => models.map(model => ({
    id: model.id,
    name: model.name,
    description: model.description || model.name,
    releaseDate: model.releaseDate
  })), [models]);
  
  // Memoized cell rendering function to avoid unnecessary re-renders
  const renderBenchmarkCell = useCallback((model: Model, benchmark: Benchmark) => {
    return (
      <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
        <BenchmarkScore 
          model={model} 
          benchmark={benchmark} 
          benchmarkScores={benchmarkScores}
          globalRankings={globalRankings}
          rankingsLoaded={rankingsLoaded}
        />
      </td>
    );
  }, [benchmarkScores, globalRankings, rankingsLoaded]);
  
  return (
    <SharedTable>
      <TableHeader items={headerItems} showReleaseDates={true} />
      <tbody>
        {benchmarks.map(benchmark => (
          <tr key={benchmark.benchmark_id} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={brandConfig.name === 'OMG' ? { backgroundColor: 'white' } : {}}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-graph-up-arrow ${iconStyles.tableRowIcon} ${
                  brandConfig.name === 'OMG'
                    ? 'text-blue-500'
                    : 'text-fuchsia-400'
                }`}
                style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}></i>
                <div className="flex flex-col">
                  <a 
                    href={`/?benchmark=${benchmark.benchmark_id}`}
                    className={`transition-colors ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-600 hover:text-blue-800 font-sans'
                        : 'text-cyan-400 hover:text-fuchsia-500 font-mono'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                    title={`View all data for ${benchmark.benchmark_name}`}
                  >
                    {benchmark.benchmark_name}
                  </a>
                  <span className={`text-xs mt-1 ${
                    brandConfig.name === 'OMG'
                      ? 'text-gray-600 font-sans'
                      : 'text-gray-400 font-mono'
                  }`}>
                    {benchmark.benchmark_category}
                  </span>
                </div>
              </div>
            </td>
            {models.map(model => renderBenchmarkCell(model, benchmark))}
          </tr>
        ))}
      </tbody>
    </SharedTable>
  );
};

// Memoize the component with custom comparison
const FeaturedBenchmarksSection = React.memo(FeaturedBenchmarksSectionComponent, (prevProps, nextProps) => {
  // Only re-render if one of these key props has changed
  return (
    prevProps.benchmarks === nextProps.benchmarks &&
    prevProps.models === nextProps.models &&
    prevProps.benchmarkScores === nextProps.benchmarkScores &&
    prevProps.globalRankings === nextProps.globalRankings &&
    prevProps.rankingsLoaded === nextProps.rankingsLoaded
  );
});

const BenchmarksTable: React.FC<BenchmarksTableProps> = ({ models, companyId }) => {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [benchmarkScores, setBenchmarkScores] = useState<BenchmarkScore[]>([]);
  const [groupedBenchmarks, setGroupedBenchmarks] = useState<Record<BenchmarkCategory, Benchmark[]>>({} as Record<BenchmarkCategory, Benchmark[]>);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Global rankings for use by all benchmark score components
  const [globalRankings, setGlobalRankings] = useState<Record<string, Record<string, { rank: number, total: number }>>>({});
  const [rankingsLoaded, setRankingsLoaded] = useState(false);
  
  // Enrich models with additional display information - memoized to avoid recalculation on re-renders
  const enrichModels = useCallback((models: Model[]): Model[] => {
    return models.map(model => {
      // Generate a formatted description for tooltips
      let modelDescription = `${model.name}`;
      
      if (model.releaseDate) {
        const releaseDate = new Date(model.releaseDate);
        modelDescription += ` (Released: ${releaseDate.toLocaleDateString('en-GB', {
          month: 'short',
          year: 'numeric'
        })})`;
      }
      
      if (model.modelVersion) {
        modelDescription += `\nVersion: ${model.modelVersion}`;
      }
      
      if (model.type) {
        modelDescription += `\nType: ${model.type}`;
      }
      
      // Create a new object to avoid mutating the original
      return {
        ...model,
        description: modelDescription
      };
    });
  }, []);
  
  // Filter for only frontier and open models, then sort - memoized for performance
  const sortedModels = useMemo(() => {
    // Filter for only frontier and open models, excluding archived models
    const filteredModels = [...models].filter(model => 
      (model.category === 'frontier' || model.category === 'open') && model.status !== 'archived'
    );
    
    return enrichModels(filteredModels).sort((a, b) => {
      // First sort by category (frontier before open)
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
  }, [models, enrichModels]);
  
  // Filter benchmarks to get only featured ones - memoized to avoid filtering on every render
  const featuredBenchmarks = useMemo(() => {
    return benchmarks.filter(benchmark => benchmark.featured_benchmark);
  }, [benchmarks]);
  
  // Filter and sort categories - memoized to avoid recomputation on every render
  const filteredCategories = useMemo(() => {
    return Object.entries(groupedBenchmarks)
      .filter(([category, categoryBenchmarks]) => {
        return categoryBenchmarks.some(benchmark => {
          return sortedModels.some(model => {
            return benchmarkScores.some(score => 
              score.model_id === model.id && 
              score.benchmark_id === benchmark.benchmark_id
            );
          });
        });
      })
      // Sort categories to ensure usability is first, then alphabetical
      .sort(([categoryA], [categoryB]) => {
        // If categoryA is usability, it should come first
        if (categoryA === 'usability') return -1;
        // If categoryB is usability, it should come first
        if (categoryB === 'usability') return 1;
        // Otherwise sort alphabetically
        return categoryA.localeCompare(categoryB);
      });
  }, [groupedBenchmarks, sortedModels, benchmarkScores]);

  // Determine if headers should be shown - memoized based on featured benchmarks
  const showHeadersInCategories = useMemo(() => 
    featuredBenchmarks.length === 0, 
    [featuredBenchmarks]
  );
  
  // Check if there are any scores for this company
  const hasScores = benchmarkScores.length > 0;
  
  // Load benchmark data and global rankings
  useEffect(() => {
    const loadBenchmarkData = async () => {
      try {
        setLoading(true);
        
        // Load benchmark metadata, scores, and rankings in parallel
        const [benchmarkData, scoreData, rankings] = await Promise.all([
          loadBenchmarkMetadata(),
          loadBenchmarkScores(),
          calculateGlobalRankings()
        ]);
        
        // Store global rankings for use by all score components
        setGlobalRankings(rankings);
        setRankingsLoaded(true);
        
        console.log("Loaded benchmark metadata:", benchmarkData.length, "benchmarks");
        console.log("Loaded benchmark scores:", scoreData.length, "scores");
        console.log("Loaded global rankings for", Object.keys(rankings).length, "benchmarks");
        
        // Log sample data to verify format
        if (benchmarkData.length > 0) {
          console.log("Sample benchmark metadata:", benchmarkData[0]);
        }
        if (scoreData.length > 0) {
          console.log("Sample score data:", scoreData[0]);
        }
        
        // Filter scores to only include those for the current company's models
        const companyModelIds = models.map(model => model.id);
        console.log("Company model IDs:", companyModelIds);
        console.log("Company ID:", companyId);
        
        const filteredScores = scoreData.filter(score => 
          score.company_id === companyId && 
          companyModelIds.includes(score.model_id)
        );
        console.log("Filtered scores for this company:", filteredScores.length);
        if (filteredScores.length > 0) {
          console.log("Sample filtered score:", filteredScores[0]);
        } else {
          console.warn("No scores found for this company and its models!");
          console.log("Company ID:", companyId);
          console.log("Model IDs:", companyModelIds);
          
          // Check if we have any scores for this company at all
          const companyScores = scoreData.filter(score => score.company_id === companyId);
          console.log("Scores for company (regardless of model):", companyScores.length);
          
          // Check if we have scores for these models at all
          const modelScores = scoreData.filter(score => companyModelIds.includes(score.model_id));
          console.log("Scores for models (regardless of company):", modelScores.length);
        }
        
        // Group benchmarks by category
        const grouped = await groupBenchmarksByCategory(benchmarkData);
        console.log("Grouped benchmarks by category:", Object.keys(grouped));
        
        setBenchmarks(benchmarkData);
        setBenchmarkScores(filteredScores);
        setGroupedBenchmarks(grouped);
        setLoading(false);
      } catch (err) {
        console.error('Error loading benchmark data:', err);
        setError('Failed to load benchmark data. Please try again later.');
        setLoading(false);
      }
    };
    
    loadBenchmarkData();
  }, [companyId, models]);
  
  // Logging only when featuredBenchmarks changes
  useEffect(() => {
    console.log("Featured benchmarks:", featuredBenchmarks.length, featuredBenchmarks.map(b => b.benchmark_name));
  }, [featuredBenchmarks]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className={`h-8 w-64 rounded mb-4 ${
            brandConfig.name === 'OMG'
              ? 'bg-gray-200'
              : 'bg-gray-700'
          }`}></div>
          <div className={`h-48 w-full rounded ${
            brandConfig.name === 'OMG'
              ? 'bg-gray-100'
              : 'bg-gray-800'
          }`}></div>
          <div className={`mt-4 ${
            brandConfig.name === 'OMG'
              ? 'text-gray-600 font-sans'
              : 'text-gray-400 font-mono'
          }`}>Loading benchmark data...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`rounded-lg p-4 my-4 ${
        brandConfig.name === 'OMG'
          ? 'bg-red-50 border border-red-200'
          : 'bg-red-900/30 border border-red-700'
      }`}>
        <div className="flex items-center">
          <i className="bi bi-exclamation-triangle-fill text-red-500 mr-2 text-xl"></i>
          <h3 className={`text-lg font-medium ${
            brandConfig.name === 'OMG'
              ? 'text-red-600 font-sans'
              : 'text-red-400 font-mono'
          }`}>Error</h3>
        </div>
        <p className={`mt-2 ${
          brandConfig.name === 'OMG'
            ? 'text-gray-700 font-sans'
            : 'text-gray-300 font-mono'
        }`}>{error}</p>
      </div>
    );
  }
  
  if (!hasScores) {
    return (
      <div className={`rounded-lg p-6 my-4 text-center ${
        brandConfig.name === 'OMG'
          ? 'bg-gray-100 border border-gray-300'
          : 'bg-gray-800/50 border border-gray-700'
      }`}>
        <i className={`bi bi-graph-up text-4xl mb-3 ${
          brandConfig.name === 'OMG'
            ? 'text-gray-400'
            : 'text-gray-500'
        }`}></i>
        <h3 className={`text-xl font-medium mb-2 ${
          brandConfig.name === 'OMG'
            ? 'text-gray-700 font-sans'
            : 'text-gray-300 font-mono'
        }`}>No Benchmark Data Available</h3>
        <p className={`${
          brandConfig.name === 'OMG'
            ? 'text-gray-600 font-sans'
            : 'text-gray-400 font-mono'
        }`}>
          No benchmark scores are available for the frontier and open models from this company.
        </p>
        <p className={`text-sm mt-2 ${
          brandConfig.name === 'OMG'
            ? 'text-gray-500 font-sans'
            : 'text-gray-500 font-mono'
        }`}>
          <i className="bi bi-info-circle mr-1"></i>
          Note: Benchmark data is only shown for frontier and open models.
        </p>
      </div>
    );
  }
  
  return (
    <div className="transform transition-opacity duration-300">
      <style>{tableHoverStyles}</style>
      
      {/* Featured Benchmarks Section - only shown if there are any featured benchmarks */}
      {featuredBenchmarks.length > 0 && (
        <div className="mb-10">
          <h3 className={`text-lg font-semibold mb-2 ${
            brandConfig.name === 'OMG'
              ? 'font-sans'
              : 'text-fuchsia-500 font-mono'
          }`}
          style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}>
            Featured Benchmarks
          </h3>
          <p className={`text-sm mb-3 ${
            brandConfig.name === 'OMG'
              ? 'text-gray-600 font-sans'
              : 'text-gray-400 font-mono'
          }`}>
            Key benchmarks that provide the most representative evaluation of model capabilities
          </p>
          
          <FeaturedBenchmarksSection
            benchmarks={featuredBenchmarks}
            models={sortedModels}
            benchmarkScores={benchmarkScores}
            companyId={companyId}
            globalRankings={globalRankings}
            rankingsLoaded={rankingsLoaded}
          />
        </div>
      )}
      
      {/* Render each benchmark category section */}
      {(() => {
        return filteredCategories.map(([category, categoryBenchmarks], index) => (
          <BenchmarkCategorySection
            key={category}
            category={category}
            benchmarks={categoryBenchmarks}
            models={sortedModels}
            benchmarkScores={benchmarkScores}
            companyId={companyId}
            showHeader={showHeadersInCategories && index === 0} 
            globalRankings={globalRankings}
            rankingsLoaded={rankingsLoaded}
          />
        ));
      })()}
      
      {/* About Benchmarks and Sources - moved to bottom */}
      <div className={`mt-8 rounded-lg p-4 ${
        brandConfig.name === 'OMG'
          ? 'bg-gray-100 border border-gray-300'
          : 'bg-gray-800/50 border border-gray-700'
      }`}>
        <div className="flex items-start gap-3">
          <i className={`bi bi-info-circle-fill text-xl mt-0.5 ${
            brandConfig.name === 'OMG'
              ? 'text-blue-600'
              : 'text-cyan-500'
          }`}
          style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}></i>
          <div className="w-full">
            <h3 className={`text-lg font-medium mb-2 ${
              brandConfig.name === 'OMG'
                ? 'text-blue-600 font-sans'
                : 'text-cyan-400 font-mono'
            }`}
            style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>About Benchmarks</h3>
            <p className={`text-sm mb-3 ${
              brandConfig.name === 'OMG'
                ? 'text-gray-700 font-sans'
                : 'text-gray-300 font-mono'
            }`}>
              Benchmarks provide standardized tests to compare model capabilities across different dimensions. 
              Scores shown are raw benchmark scores reported by the model providers.
              Only frontier and open models are included in benchmark comparisons.
              Models with the top 5 scores across all models in our database for each benchmark are marked with their rank (#1, #2, #3, etc.).
              Note that rankings are only computed based on models included in our database, not all models that exist.
            </p>
            
            <div className={`text-sm pt-3 mt-2 ${
              brandConfig.name === 'OMG'
                ? 'text-gray-600 border-t border-gray-300 font-sans'
                : 'text-gray-400 border-t border-gray-700 font-mono'
            }`}>
              <p className="mb-2">
                <strong className={brandConfig.name === 'OMG' ? 'text-gray-700' : 'text-gray-300'}>Sources:</strong> Benchmark data is collected from research papers, model provider documentation, and published evaluations.
                Click on a benchmark name to view its paper, or click on a score to see the source of the benchmark result.
              </p>
              <p>
                <strong className={brandConfig.name === 'OMG' ? 'text-gray-700' : 'text-gray-300'}>Tooltips:</strong> Hover over benchmark names to see descriptions of what each benchmark measures.
                Hover over scores to view ranking information, data sources, and any notes about the specific result.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarksTable;