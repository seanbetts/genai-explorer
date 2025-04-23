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

  // State for the current page of benchmarks to display
  const [currentPage, setCurrentPage] = React.useState(0);
  const benchmarksPerPage = 5;
  
  // Calculate total number of pages
  const totalPages = Math.ceil(benchmarks.length / benchmarksPerPage);
  
  // Get benchmarks for the current page
  const currentBenchmarks = benchmarks.slice(
    currentPage * benchmarksPerPage, 
    (currentPage + 1) * benchmarksPerPage
  );

  // Format model items for table header
  const headerItems = modelsToDisplay.map(model => ({
    id: model.id,
    name: model.name
  }));

  // Function to handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
    
    return (
      <div className="flex flex-col items-center">
        <div className="font-medium font-mono text-cyan-400 flex items-center">
          {score.score.toFixed(1)}{rankBadge}
        </div>
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
      
      {/* Pagination controls if needed */}
      {totalPages > 1 && (
        <div className="mt-3 flex justify-end">
          <div className="pagination-controls">
            <button 
              className="pagination-button"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              aria-label="Previous page"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <span className="pagination-info">
              {currentPage + 1} / {totalPages}
            </span>
            <button 
              className="pagination-button"
              onClick={handleNextPage} 
              disabled={currentPage >= totalPages - 1}
              aria-label="Next page"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenchmarkCategorySection;