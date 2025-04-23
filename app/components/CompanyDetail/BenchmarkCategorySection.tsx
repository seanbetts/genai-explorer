'use client';

import React from 'react';
import { Benchmark, BenchmarkScore, Model } from '../types';
import { textStyles } from '../utils/theme';
import { tableStyles, iconStyles, containerStyles } from '../utils/layout';
import { 
  SharedTable, 
  TableHeader
} from '../shared/TableComponents';
import { calculateModelRanking, getLatestScoreForModelAndBenchmark } from '../utils/benchmarkUtils';

interface BenchmarkCategorySectionProps {
  category: string;
  benchmarks: Benchmark[];
  models: Model[];
  benchmarkScores: BenchmarkScore[];
  companyId: string;
  showHeader?: boolean;
}

const BenchmarkCategorySection: React.FC<BenchmarkCategorySectionProps> = ({
  category,
  benchmarks,
  models,
  benchmarkScores,
  companyId,
  showHeader = true
}) => {
  // Check if ANY models have scores for this category
  const hasScoresForCategory = benchmarks.some(benchmark => {
    return models.some(model => {
      return benchmarkScores.some(score => 
        score.model_id === model.id && 
        score.benchmark_id === benchmark.benchmark_id
      );
    });
  });

  console.log(`Category ${category}: Has scores: ${hasScoresForCategory}`);
  console.log(`Category ${category}: Benchmarks in this category: ${benchmarks.map(b => b.benchmark_name).join(', ')}`);

  // Skip rendering if no models have scores for this category
  if (!hasScoresForCategory) {
    return null;
  }
  
  // Use all models to maintain consistency across categories
  const modelsToDisplay = models;

  // Use all benchmarks rather than paginating
  const currentBenchmarks = benchmarks;
  
  // Special formatting for specific benchmarks
  const formatBenchmarkScore = (score: BenchmarkScore, benchmark: Benchmark): string => {
    const id = benchmark.benchmark_id;
    
    // No decimal points for Codeforces
    if (id === 'codeforces') {
      return Math.round(score.score).toString();
    }
    
    // No decimal points for Chatbot Arena
    if (id === 'chatbot-arena') {
      return Math.round(score.score).toString();
    }
    
    // Format SWE Lancer and SWE-Lancer: IC SWE Diamond as dollars without decimal
    if (id === 'swe-lancer' || id === 'swe-lancer-ic-swe-diamond') {
      return `$${Math.round(score.score)}`;
    }
    
    // Default formatting with 1 decimal place
    return score.score.toFixed(1);
  };

  // Format model items for table header
  const headerItems = modelsToDisplay.map(model => ({
    id: model.id,
    name: model.name
  }));

  // Function to render a benchmark score for a model
  const renderBenchmarkScore = (model: Model, benchmark: Benchmark) => {
    const score = getLatestScoreForModelAndBenchmark(benchmarkScores, model.id, benchmark.benchmark_id);
    if (!score) {
      return <span className={textStyles.tertiary}>-</span>;
    }

    const ranking = calculateModelRanking(benchmarkScores, model.id, benchmark.benchmark_id);
    let rankBadge = null;
    
    if (ranking) {
      if (ranking.rank === 1) {
        rankBadge = <span className="ml-1 text-yellow-500">🥇</span>;
      } else if (ranking.rank === 2) {
        rankBadge = <span className="ml-1 text-gray-300">🥈</span>;
      } else if (ranking.rank === 3) {
        rankBadge = <span className="ml-1 text-amber-700">🥉</span>;
      }
    }
    
    // Create tooltip content
    let tooltipContent = '';
    if (score.source_name) {
      tooltipContent += `Source: ${score.source_name}`;
    }
    if (score.notes) {
      tooltipContent += tooltipContent ? '\n' : '';
      tooltipContent += `Notes: ${score.notes}`;
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
      <h3 className="text-lg font-semibold text-fuchsia-500 mb-3 font-mono capitalize">
        {category} Benchmarks
      </h3>
      
      <SharedTable>
        {showHeader && <TableHeader items={headerItems} />}
        <tbody>
          {currentBenchmarks.map(benchmark => (
            <tr key={benchmark.benchmark_id} className="cursor-pointer">
              <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
                <div className={containerStyles.flexCenter}>
                  <i className={`bi bi-graph-up ${iconStyles.tableRowIcon}`}></i>
                  {benchmark.benchmark_paper ? (
                    <a 
                      href={benchmark.benchmark_paper} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-cyan-400 hover:text-fuchsia-500 transition-colors"
                      title="View benchmark paper"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {benchmark.benchmark_name}
                    </a>
                  ) : (
                    <span className={textStyles.primary}>{benchmark.benchmark_name}</span>
                  )}
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