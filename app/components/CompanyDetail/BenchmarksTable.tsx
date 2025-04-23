'use client';

import React, { useEffect, useState } from 'react';
import { Model, Benchmark, BenchmarkScore, BenchmarkCategory } from '../types';
import { loadBenchmarkMetadata, loadBenchmarkScores, groupBenchmarksByCategory, calculateGlobalRankings, getAllScoresForModelAndBenchmark, getLatestScoreForModelAndBenchmark } from '../utils/benchmarkUtils';
import BenchmarkCategorySection from './BenchmarkCategorySection';
import { tableHoverStyles, Legend, SharedTable, TableHeader } from '../shared/TableComponents';
import { textStyles } from '../utils/theme';
import { tableStyles, iconStyles, containerStyles } from '../utils/layout';

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

const BenchmarkScore: React.FC<BenchmarkScoreProps> = ({ 
  model, 
  benchmark, 
  benchmarkScores,
  globalRankings = {},
  rankingsLoaded = false
}) => {
  
  // Get the LATEST score for this model and benchmark
  const score = getLatestScoreForModelAndBenchmark(benchmarkScores, model.id, benchmark.benchmark_id);
  
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
      rankBadge = <span className="ml-1 text-fuchsia-500 text-xs font-semibold" title={`Rank #${globalRank} of ${totalModels} models`}>#1</span>;
    } else if (globalRank === 2) {
      rankBadge = <span className="ml-1 text-fuchsia-500 text-xs font-semibold" title={`Rank #${globalRank} of ${totalModels} models`}>#2</span>;
    } else if (globalRank === 3) {
      rankBadge = <span className="ml-1 text-fuchsia-500 text-xs font-semibold" title={`Rank #${globalRank} of ${totalModels} models`}>#3</span>;
    } else if (globalRank <= 5) {
      rankBadge = <span className="ml-1 text-fuchsia-500 text-xs font-semibold" title={`Rank #${globalRank} of ${totalModels} models`}>#{globalRank}</span>;
    }
  }
  
  // Create tooltip content - include rank, source, notes, and historical scores
  let tooltipContent = '';
  
  // Add global ranking info if available
  if (rankingsLoaded && globalRankings[benchmark.benchmark_id] && globalRankings[benchmark.benchmark_id][model.id]) {
    const globalRank = globalRankings[benchmark.benchmark_id][model.id].rank;
    const totalModels = globalRankings[benchmark.benchmark_id][model.id].total;
    
    tooltipContent += `Rank: #${globalRank} of ${totalModels} models`;
  }
  
  // Add source info
  if (score.source_name) {
    tooltipContent += tooltipContent ? '\n' : '';
    tooltipContent += `Source: ${score.source_name}`;
  }
  
  // Add notes if available
  if (score.notes) {
    tooltipContent += tooltipContent ? '\n' : '';
    tooltipContent += `Notes: ${score.notes}`;
  }
  
  // Add historical scores if available
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
      tooltipContent += tooltipContent ? '\n\n' : '';
      tooltipContent += 'History:';
      
      historicalScores.forEach(historicalScore => {
        const date = new Date(historicalScore.date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        
        tooltipContent += `\n${formatBenchmarkScore(historicalScore, benchmark)} (${date})`;
        if (historicalScore.source_name) {
          tooltipContent += ` - ${historicalScore.source_name}`;
        }
      });
    }
  }
  
  return (
    <div className="flex flex-col items-center">
      {score.source ? (
        <a 
          href={score.source} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-medium font-mono text-cyan-400 hover:text-fuchsia-500 transition-colors flex items-center"
          title={tooltipContent}
        >
          {formatBenchmarkScore(score, benchmark)}{rankBadge}
        </a>
      ) : (
        <div 
          className="font-medium font-mono text-cyan-400 flex items-center"
          title={tooltipContent}
        >
          {formatBenchmarkScore(score, benchmark)}{rankBadge}
        </div>
      )}
      {score.date && (
        <div className="text-xs text-gray-400 mt-1">
          {new Date(score.date).toLocaleDateString('en-GB', {
            month: 'short',
            year: 'numeric'
          })}
        </div>
      )}
    </div>
  );
};

// Component for featured benchmarks section
interface FeaturedBenchmarksSectionProps {
  benchmarks: Benchmark[];
  models: Model[];
  benchmarkScores: BenchmarkScore[];
  companyId: string;
  globalRankings?: Record<string, Record<string, { rank: number, total: number }>>;
  rankingsLoaded?: boolean;
}

const FeaturedBenchmarksSection: React.FC<FeaturedBenchmarksSectionProps> = ({
  benchmarks,
  models,
  benchmarkScores,
  companyId,
  globalRankings = {},
  rankingsLoaded = false
}) => {
  // Format model items for table header
  const headerItems = models.map(model => ({
    id: model.id,
    name: model.name,
    description: model.description || model.name,
    releaseDate: model.releaseDate
  }));
  
  // Import the renderBenchmarkScore function from BenchmarkCategorySection
  const renderBenchmarkCell = (model: Model, benchmark: Benchmark) => {
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
  };
  
  return (
    <SharedTable>
      <TableHeader items={headerItems} showReleaseDates={true} />
      <tbody>
        {benchmarks.map(benchmark => (
          <tr key={benchmark.benchmark_id} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-graph-up-arrow ${iconStyles.tableRowIcon} text-fuchsia-400`}></i>
                <div className="flex flex-col">
                  {benchmark.benchmark_paper ? (
                    <a 
                      href={benchmark.benchmark_paper} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-cyan-400 hover:text-fuchsia-500 transition-colors"
                      title={benchmark.benchmark_description || `View ${benchmark.benchmark_name} benchmark details`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {benchmark.benchmark_name}
                    </a>
                  ) : (
                    <span 
                      className={textStyles.primary}
                      title={benchmark.benchmark_description || ""}
                    >
                      {benchmark.benchmark_name}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 mt-1">
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

const BenchmarksTable: React.FC<BenchmarksTableProps> = ({ models, companyId }) => {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [benchmarkScores, setBenchmarkScores] = useState<BenchmarkScore[]>([]);
  const [groupedBenchmarks, setGroupedBenchmarks] = useState<Record<BenchmarkCategory, Benchmark[]>>({} as Record<BenchmarkCategory, Benchmark[]>);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Global rankings for use by all benchmark score components
  const [globalRankings, setGlobalRankings] = useState<Record<string, Record<string, { rank: number, total: number }>>>({});
  const [rankingsLoaded, setRankingsLoaded] = useState(false);
  
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
  
  // Enrich models with additional display information
  const enrichModels = (models: Model[]): Model[] => {
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
      
      // Add the description to the model object
      model.description = modelDescription;
      return model;
    });
  };
  
  // Sort models to prioritize frontier models first, then by release date
  const sortedModels = enrichModels([...models]).sort((a, b) => {
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
  
  // Filter benchmarks to get only featured ones
  const featuredBenchmarks = benchmarks.filter(benchmark => benchmark.featured_benchmark);
  console.log("Featured benchmarks:", featuredBenchmarks.length, featuredBenchmarks.map(b => b.benchmark_name));
  
  return (
    <div className="transform transition-opacity duration-300">
      <style>{tableHoverStyles}</style>
      
      {/* Featured Benchmarks Section - only shown if there are any featured benchmarks */}
      {featuredBenchmarks.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-fuchsia-500 mb-2 font-mono">
            Featured Benchmarks
          </h3>
          <p className="text-sm text-gray-400 mb-3">
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
        // Filter to only categories that have scores for this company
        const filteredCategories = Object.entries(groupedBenchmarks)
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

        // Render each category, with showHeader=true only for the first category displayed
        // This means that if featured benchmarks are shown, no category will show headers
        // If no featured benchmarks are shown, only the first category will show headers
        const showHeadersInCategories = featuredBenchmarks.length === 0;
        
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
      <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <i className="bi bi-info-circle-fill text-cyan-500 text-xl mt-0.5"></i>
          <div className="w-full">
            <h3 className="text-lg font-medium text-cyan-400 mb-2">About Benchmarks</h3>
            <p className="text-gray-300 text-sm mb-3">
              Benchmarks provide standardized tests to compare model capabilities across different dimensions. 
              Scores shown are raw benchmark scores reported by the model providers.
              Models with the top 5 scores across all models in our database for each benchmark are marked with their rank (#1, #2, #3, etc.).
              Note that rankings are only computed based on models included in our database, not all models that exist.
            </p>
            
            <div className="text-sm text-gray-400 border-t border-gray-700 pt-3 mt-2">
              <p className="mb-2">
                <strong className="text-gray-300">Sources:</strong> Benchmark data is collected from research papers, model provider documentation, and published evaluations.
                Click on a benchmark name to view its paper, or click on a score to see the source of the benchmark result.
              </p>
              <p>
                <strong className="text-gray-300">Tooltips:</strong> Hover over benchmark names to see descriptions of what each benchmark measures.
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