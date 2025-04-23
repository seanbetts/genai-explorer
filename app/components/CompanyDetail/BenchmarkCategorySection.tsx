'use client';

import React, { useState, useEffect } from 'react';
import { Benchmark, BenchmarkScore, Model } from '../types';
import { textStyles } from '../utils/theme';
import { tableStyles, iconStyles, containerStyles } from '../utils/layout';
import { 
  SharedTable, 
  TableHeader
} from '../shared/TableComponents';
import { 
  getLatestScoreForModelAndBenchmark,
  getAllScoresForModelAndBenchmark,
  getBenchmarkDescription,
  calculateGlobalRankings
} from '../utils/benchmarkUtils';

interface BenchmarkCategorySectionProps {
  category: string;
  benchmarks: Benchmark[];
  models: Model[];
  benchmarkScores: BenchmarkScore[];
  companyId: string;
  showHeader?: boolean;
  globalRankings?: Record<string, Record<string, { rank: number, total: number }>>;
  rankingsLoaded?: boolean;
}

const BenchmarkCategorySection: React.FC<BenchmarkCategorySectionProps> = ({
  category,
  benchmarks,
  models,
  benchmarkScores,
  companyId,
  showHeader = true,
  globalRankings = {},
  rankingsLoaded = false
}) => {
  // Check if ANY models have scores for this category
  const hasScoresForCategory = benchmarks.some(benchmark => {
    return models.some(model => {
      const hasScore = benchmarkScores.some(score => 
        score.model_id === model.id && 
        score.benchmark_id === benchmark.benchmark_id
      );
      if (hasScore) {
        console.log(`Found score for model ${model.id} on benchmark ${benchmark.benchmark_id}`);
      }
      return hasScore;
    });
  });

  console.log(`Category ${category}: Has scores: ${hasScoresForCategory}`);
  console.log(`Category ${category}: Benchmarks in this category: ${benchmarks.map(b => b.benchmark_name).join(', ')}`);
  console.log(`Category ${category}: Models: ${models.map(m => m.id).join(', ')}`);
  
  // Count how many scores we have for this category
  let scoreCount = 0;
  benchmarks.forEach(benchmark => {
    models.forEach(model => {
      const matchingScores = benchmarkScores.filter(score => 
        score.model_id === model.id && 
        score.benchmark_id === benchmark.benchmark_id
      );
      scoreCount += matchingScores.length;
    });
  });
  console.log(`Category ${category}: Total scores: ${scoreCount}`);

  // Skip rendering if no models have scores for this category
  if (!hasScoresForCategory) {
    return null;
  }
  
  // Use all models to maintain consistency across categories
  const modelsToDisplay = models;

  // Use all benchmarks rather than paginating
  const currentBenchmarks = benchmarks;
  
  // Get description for benchmark categories
  const getCategoryDescription = (category: string): string => {
    const descriptions: Record<string, string> = {
      'usability': 'Tests general knowledge, helpfulness, instruction-following, and human-like interaction qualities through human preference ratings.',
      'agentic': 'Measures the ability to act autonomously to complete complex real-world tasks involving multiple steps, tool use, and web browsing.',
      'coding': 'Evaluates code generation, editing, debugging, and software engineering capabilities across various programming tasks and languages.',
      'factuality': 'Assesses accuracy of information retrieval and generation, especially with long contexts, and resistance to hallucination.',
      'maths': 'Evaluates mathematical problem-solving from grade school to competition-level problems, including complex reasoning and multi-step calculations.',
      'multimodal': 'Tests capabilities across multiple modalities including text, images, documents, audio, and video understanding and generation.',
      'reasoning': 'Measures logical reasoning, common sense understanding, step-by-step problem-solving, and situation modeling abilities.',
      'research': 'Evaluates ability to conduct, understand, and analyze academic research and complex scholarly information.',
      'science': 'Tests scientific knowledge and understanding across disciplines like physics, chemistry, biology, and applied sciences.'
    };
    
    return descriptions[category.toLowerCase()] || '';
  };
  
  // Helper to format raw score for display
  const formatRawScore = (value: number): string => {
    // Format with thousands separator
    const formatWithThousands = (num: number): string => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    if (value >= 1000000) {
      return `${formatWithThousands(Math.round(value))} (${(value / 1000000).toFixed(2)}M)`;
    }
    
    if (value >= 1000) {
      return `${formatWithThousands(Math.round(value))} (${(value / 1000).toFixed(1)}K)`;
    }
    
    return value.toString();
  };
  
  // Special formatting for specific benchmarks
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
    
    // Dollar-based benchmarks (without $ sign)
    if (id === 'swe-lancer' || id === 'swe-lancer-ic-swe-diamond') {
      const rounded = Math.round(value);
      return `$${formatWithThousands(rounded)}`;
    }
    
    // Pricing benchmarks (with $ sign)
    if (id.includes('pricing') || id.includes('cost')) {
      // Format with 2 decimal places for dollar amounts under 10
      if (value < 10) {
        return `$${value.toFixed(3)}`;
      }
      // Format with 2 decimal places for other dollar amounts
      return `$${value.toFixed(2)}`;
    }
    
    // Token count benchmarks - simplified formatting as requested (removing tokens suffix for LOFT)
    if (id === 'mrcr' || id.includes('input') || id.includes('output') || id.includes('token')) {
      const rounded = Math.round(value);
      if (value >= 1000000) {
        return `${(rounded / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(rounded / 1000).toFixed(0)}K`;
      }
      return `${rounded}`;
    }
    
    // LOFT benchmark - use simple thousands separators (no tokens suffix)
    if (id === 'loft') {
      const rounded = Math.round(value);
      return formatWithThousands(rounded);
    }
    
    // Percentage-based benchmarks - removing % signs as requested
    if (id.includes('accuracy') || id.includes('rate') || id.includes('score') ||
        id === 'mmlu' || id === 'mmlu-pro' || id === 'multilingual-mmlu' || 
        id === 'math' || id === 'gsm8k' || id === 'mgsm' || id.includes('bench') ||
        id.includes('eval') || id === 'hellaswag' || id === 'arc') {
      // Convert to percentage if value is between 0 and 1
      if (value > 0 && value <= 1) {
        return (value * 100).toFixed(1);
      }
      // If already percentage (>1 but <=100)
      if (value > 1 && value <= 100) {
        return value.toFixed(1);
      }
    }
    
    // Special benchmarks with two decimal points
    if (id === 'humanitys-last-exam' || id === 'multi-challenge') {
      return value.toFixed(2);
    }
    
    // Time-based benchmarks (seconds, minutes)
    if (id.includes('time') || id.includes('latency') || id.includes('speed')) {
      if (value >= 60) {
        const minutes = Math.floor(value / 60);
        const seconds = Math.round(value % 60);
        return `${minutes}m ${seconds}s`;
      }
      // Under a minute, show as seconds with 1 decimal place
      return `${value.toFixed(1)}s`;
    }
    
    // Score benchmarks with very small values (like BLEU scores)
    if (value < 0.1 && value > 0) {
      return value.toFixed(3);
    }
    
    // Default formatting with 1 decimal place
    return value.toFixed(1);
  };

  // Format model items for table header
  const headerItems = modelsToDisplay.map(model => ({
    id: model.id,
    name: model.name,
    description: model.description || model.name,
    releaseDate: model.releaseDate
  }));

  // Function to render a benchmark score for a model
  const renderBenchmarkScore = (model: Model, benchmark: Benchmark) => {
    const score = getLatestScoreForModelAndBenchmark(benchmarkScores, model.id, benchmark.benchmark_id);
    if (!score) {
      return <span className={textStyles.tertiary}>-</span>;
    }
    
    // Get global ranking if available, otherwise show a loading state
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

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-fuchsia-500 mb-2 font-mono capitalize">
        {category} Benchmarks
      </h3>
      <p className="text-sm text-gray-400 mb-3">
        {getCategoryDescription(category)}
      </p>
      
      <SharedTable>
        {showHeader && <TableHeader items={headerItems} showReleaseDates={true} />}
        <tbody>
          {currentBenchmarks.map(benchmark => (
            <tr key={benchmark.benchmark_id} className="cursor-pointer">
              <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
                <div className={containerStyles.flexCenter}>
                  <i className={`bi bi-graph-up ${iconStyles.tableRowIcon}`}></i>
                  <div className="flex flex-col">
                    <a 
                      href={`/?benchmark=${benchmark.benchmark_id}`}
                      className="text-cyan-400 hover:text-fuchsia-500 transition-colors"
                      title={`View all data for ${benchmark.benchmark_name}`}
                    >
                      {benchmark.benchmark_name}
                    </a>
                    {benchmark.benchmark_paper && (
                      <a 
                        href={benchmark.benchmark_paper} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-gray-400 hover:text-gray-300 transition-colors mt-1"
                        title={`View ${benchmark.benchmark_name} paper`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="bi bi-file-earmark-text mr-1"></i>
                        View paper
                      </a>
                    )}
                  </div>
                </div>
              </td>
              {modelsToDisplay.map(model => (
                <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                  {renderBenchmarkScore(model, benchmark)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </SharedTable>
      
    </div>
  );
};

export default BenchmarkCategorySection;