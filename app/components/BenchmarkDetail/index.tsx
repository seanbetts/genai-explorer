'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Benchmark, BenchmarkScore, Model } from '../types';
import { 
  loadBenchmarkMetadata, 
  loadBenchmarkScores, 
  getBenchmarkById, 
  calculateGlobalRankings,
  getBenchmarkDescription 
} from '../utils/benchmarkUtils';
import { tableStyles, containerStyles } from '../utils/layout';
import { textStyles } from '../utils/theme';
import { SharedTable, TableHeader } from '../shared/TableComponents';

interface BenchmarkDetailProps {
  benchmarkId: string;
  onBack: () => void;
}

const BenchmarkDetail: React.FC<BenchmarkDetailProps> = ({ benchmarkId, onBack }) => {
  const [benchmark, setBenchmark] = useState<Benchmark | null>(null);
  const [scores, setScores] = useState<BenchmarkScore[]>([]);
  const [allScores, setAllScores] = useState<BenchmarkScore[]>([]);
  const [allModels, setAllModels] = useState<Record<string, Model>>({});
  const [companies, setCompanies] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rankings, setRankings] = useState<Record<string, Record<string, {rank: number, total: number}>>>({});

  // Load benchmark data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Load benchmark metadata and scores
        const [allBenchmarks, allScoresData, globalRankings] = await Promise.all([
          loadBenchmarkMetadata(),
          loadBenchmarkScores(),
          calculateGlobalRankings(),
        ]);
        
        // Get the specific benchmark
        const benchmarkData = allBenchmarks.find(b => b.benchmark_id === benchmarkId);
        if (!benchmarkData) {
          setError(`Benchmark with ID "${benchmarkId}" not found.`);
          setLoading(false);
          return;
        }
        
        // Get all scores for this benchmark
        const filteredScores = allScoresData.filter(score => 
          score.benchmark_id === benchmarkId
        );
        
        if (filteredScores.length === 0) {
          setError(`No scores found for benchmark "${benchmarkData.benchmark_name}".`);
        }
        
        // Get latest score for each model
        const latestScores: Record<string, BenchmarkScore> = {};
        filteredScores.forEach(score => {
          const key = score.model_id;
          if (!latestScores[key] || new Date(score.date) > new Date(latestScores[key].date)) {
            latestScores[key] = score;
          }
        });
        
        // Fetch all models and companies data from the window object
        // This assumes the data is loaded in the parent component
        const appData = (window as any).__EXPLORER_DATA__ || {};
        const allModelsMap: Record<string, Model> = {};
        const companiesMap: Record<string, any> = {};
        
        if (appData.companies) {
          appData.companies.forEach((company: any) => {
            companiesMap[company.id] = company;
            if (company.models) {
              company.models.forEach((model: Model) => {
                allModelsMap[model.id] = { ...model, companyId: company.id, companyName: company.name };
              });
            }
          });
        }
        
        // Set state with all the gathered data
        setBenchmark(benchmarkData);
        setAllScores(filteredScores);
        setScores(Object.values(latestScores));
        setAllModels(allModelsMap);
        setCompanies(companiesMap);
        setRankings(globalRankings);
        setLoading(false);
      } catch (error) {
        console.error('Error loading benchmark data:', error);
        setError('Failed to load benchmark data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [benchmarkId]);

  // Sort scores by value (highest first)
  const sortedScores = useMemo(() => {
    return [...scores].sort((a, b) => b.score - a.score);
  }, [scores]);

  // Helper to format score based on benchmark type
  const formatScore = (score: number, benchmarkId: string): string => {
    // Helper to add thousands separator
    const formatWithThousands = (num: number): string => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // Integer benchmarks - no decimals
    if (benchmarkId === 'codeforces' || benchmarkId === 'chatbot-arena') {
      const rounded = Math.round(score);
      return formatWithThousands(rounded);
    }
    
    // AIME benchmarks - with decimal point as requested
    if (benchmarkId.includes('aime')) {
      return score.toFixed(1);
    }
    
    // Dollar-based benchmarks (with $ sign)
    if (benchmarkId === 'swe-lancer' || benchmarkId === 'swe-lancer-ic-swe-diamond') {
      const rounded = Math.round(score);
      return `$${formatWithThousands(rounded)}`;
    }
    
    // Special benchmarks with two decimal points
    if (benchmarkId === 'humanitys-last-exam' || benchmarkId === 'multi-challenge') {
      return score.toFixed(2);
    }
    
    // Default formatting with 1 decimal place
    return score.toFixed(1);
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

  if (error || !benchmark) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 my-4">
        <div className="flex items-center">
          <i className="bi bi-exclamation-triangle-fill text-red-500 mr-2 text-xl"></i>
          <h3 className="text-lg font-medium text-red-400">Error</h3>
        </div>
        <p className="mt-2 text-gray-300">{error || 'Benchmark not found'}</p>
        <button 
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition-colors"
        >
          Back to Explorer
        </button>
      </div>
    );
  }

  // Get benchmark description
  const description = benchmark.benchmark_description || getBenchmarkDescription(benchmark.benchmark_id);

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Header section */}
      <div className="mb-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <i className="bi bi-graph-up-arrow text-fuchsia-400 mr-3 text-2xl"></i>
            {benchmark.benchmark_name}
            {benchmark.featured_benchmark && (
              <span className="ml-3 bg-fuchsia-900/50 text-fuchsia-400 text-xs px-2 py-1 rounded-full uppercase font-medium">
                Featured Benchmark
              </span>
            )}
          </h1>
          <div className="text-gray-300 mb-2">
            <span className="px-2 py-1 bg-gray-800 rounded text-sm font-mono text-cyan-400 mr-2">
              {benchmark.benchmark_category}
            </span>
            {benchmark.benchmark_paper && (
              <a 
                href={benchmark.benchmark_paper} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center ml-2"
              >
                <i className="bi bi-file-earmark-text mr-1"></i>
                View paper
              </a>
            )}
          </div>
          {description && (
            <p className="text-gray-300 mt-2 max-w-3xl">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Models Evaluated</h3>
          <p className="text-2xl font-bold text-white">{scores.length}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Average Score</h3>
          <p className="text-2xl font-bold text-white">
            {sortedScores.length > 0 
              ? formatScore(
                  sortedScores.reduce((sum, score) => sum + score.score, 0) / sortedScores.length,
                  benchmark.benchmark_id
                )
              : '-'}
          </p>
        </div>
      </div>

      {/* Visualization - simple bar chart */}
      {sortedScores.length > 0 && (
        <div className="mb-12 bg-gray-800/30 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Performance Ranking</h2>
          <div className="space-y-3 mt-6 max-h-[600px] overflow-y-auto pr-2">
            {sortedScores.map((score, index) => {
              const model = allModels[score.model_id];
              if (!model) return null;
              
              const company = companies[score.company_id];
              const percentage = (score.score / sortedScores[0].score) * 100;
              
              return (
                <div key={score.model_id} className="relative">
                  <div className="flex items-center mb-1">
                    <div className="w-8 text-sm text-gray-400 font-mono">#{index + 1}</div>
                    <div className="w-48 truncate font-medium text-cyan-400">{model.name}</div>
                    <div className="text-sm text-gray-400">{company?.name || 'Unknown'}</div>
                    <div className="ml-auto font-mono text-white">
                      {formatScore(score.score, benchmark.benchmark_id)}
                    </div>
                  </div>
                  <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden mt-1 ml-8">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full results table */}
      {sortedScores.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">All Results</h2>
          <div className="overflow-x-auto bg-gray-800/30 rounded-lg border border-gray-700">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Model</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedScores.map((score, index) => {
                  const model = allModels[score.model_id];
                  if (!model) return null;
                  
                  const company = companies[score.company_id];
                  const formattedDate = new Date(score.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });
                  
                  return (
                    <tr key={`${score.model_id}-${score.date}`} className="hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-mono">
                        <span className={`font-semibold ${index < 3 ? 'text-fuchsia-400' : 'text-gray-300'}`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="font-medium text-cyan-400">{model.name}</span>
                          {model.archived && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-700 text-gray-400 rounded">
                              Archived
                            </span>
                          )}
                        </div>
                        {model.releaseDate && (
                          <div className="text-xs text-gray-400">
                            Released: {new Date(model.releaseDate).toLocaleDateString('en-GB', {
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">{company?.name || 'Unknown'}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-white">
                          {formatScore(score.score, benchmark.benchmark_id)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400">{formattedDate}</td>
                      <td className="py-3 px-4 text-sm">
                        {score.source ? (
                          <a 
                            href={score.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 inline-flex items-center"
                          >
                            <i className="bi bi-link-45deg mr-1"></i>
                            {score.source_name || 'Source'}
                          </a>
                        ) : score.source_name || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 my-4 text-center">
          <i className="bi bi-exclamation-circle text-gray-500 text-4xl mb-3"></i>
          <h3 className="text-xl font-medium text-gray-300 mb-2">No Scores Available</h3>
          <p className="text-gray-400">
            No benchmark scores are available for {benchmark.benchmark_name}.
          </p>
        </div>
      )}

      {/* Historical data section */}
      {allScores.length > scores.length && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-white mb-4">Historical Data</h2>
          <p className="text-gray-300 mb-4">
            This benchmark has {allScores.length} total data points across {scores.length} models,
            including historical measurements.
          </p>
          {/* Could add a time-series chart here if we want */}
        </div>
      )}
    </div>
  );
};

export default BenchmarkDetail;