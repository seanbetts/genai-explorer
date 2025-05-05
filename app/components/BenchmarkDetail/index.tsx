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
import brandConfig from '../../config/brand';

interface BenchmarkDetailProps {
  benchmarkId: string;
  onBack: () => void;
  onLastUpdatedChange?: (date: Date | null) => void;
}

const BenchmarkDetail: React.FC<BenchmarkDetailProps> = ({ benchmarkId, onBack, onLastUpdatedChange }) => {
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
                // Add company info to the model object (using type assertion since we're adding properties)
                allModelsMap[model.id] = { 
                  ...model, 
                  // These are custom properties we're adding for display purposes
                  companyId: company.id, 
                  companyName: company.name 
                } as Model & { companyId: string; companyName: string };
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
  
  // Find the most recent score date and notify parent
  useEffect(() => {
    if (scores.length > 0 && onLastUpdatedChange) {
      // Find the most recent date among all scores
      const mostRecentDate = scores.reduce((latest, score) => {
        const scoreDate = new Date(score.date);
        return scoreDate > latest ? scoreDate : latest;
      }, new Date(0)); // Start with epoch time
      
      onLastUpdatedChange(mostRecentDate);
    } else if (onLastUpdatedChange) {
      onLastUpdatedChange(null);
    }
  }, [scores, onLastUpdatedChange]);

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

  if (error || !benchmark) {
    return (
      <div className={`rounded-lg p-4 my-4 ${
        brandConfig.name === 'OMG'
          ? 'bg-red-50 border border-red-200'
          : 'bg-red-900/30 border border-red-700'
      }`}>
        <div className="flex items-center">
          <i className={`bi bi-exclamation-triangle-fill mr-2 text-xl ${
            brandConfig.name === 'OMG'
              ? 'text-red-500'
              : 'text-red-500'
          }`}></i>
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
        }`}>{error || 'Benchmark not found'}</p>
        <button 
          onClick={onBack}
          className={`mt-4 px-4 py-2 rounded transition-colors ${
            brandConfig.name === 'OMG'
              ? 'bg-blue-600 hover:bg-blue-700 text-white font-sans'
              : 'bg-gray-800 hover:bg-gray-700 text-white font-mono'
          }`}
          style={brandConfig.name === 'OMG' ? { backgroundColor: brandConfig.primaryColor } : {}}
        >
          Back to Explorer
        </button>
      </div>
    );
  }

  // Helper function to get category descriptions
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
  
  // Get benchmark description
  const description = benchmark.benchmark_description || getBenchmarkDescription(benchmark.benchmark_id);

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Header section */}
      <div className="mb-8">
        <div className="mb-4">
          <h1 className={`text-3xl font-bold mb-2 flex items-center flex-wrap ${
            brandConfig.name === 'OMG'
              ? 'text-gray-900 font-sans'
              : 'text-white font-mono'
          }`}>
            <i className={`bi bi-graph-up-arrow mr-3 text-2xl ${
              brandConfig.name === 'OMG'
                ? 'text-blue-600'
                : 'text-fuchsia-400'
            }`}
            style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
            {benchmark.benchmark_name}
            <span 
              className={`ml-3 text-xs px-2 py-1 rounded-full uppercase font-medium cursor-pointer ${
                brandConfig.name === 'OMG'
                  ? 'bg-blue-100 text-blue-700 font-sans'
                  : 'bg-cyan-900/30 text-cyan-400 font-mono'
              }`}
              style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor, backgroundColor: '#EBF2FE' } : {}}
              title={getCategoryDescription(benchmark.benchmark_category)}
            >
              {benchmark.benchmark_category}
            </span>
            {benchmark.featured_benchmark && (
              <span 
                className={`ml-2 text-xs px-2 py-1 rounded-full uppercase font-medium cursor-pointer ${
                  brandConfig.name === 'OMG'
                    ? 'bg-blue-100 text-blue-700 font-sans'
                    : 'bg-fuchsia-900/50 text-fuchsia-400 font-mono'
                }`}
                style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor, backgroundColor: '#EBF2FE' } : {}}
                title="This benchmark is featured due to its significance in evaluating key model capabilities."
              >
                Featured Benchmark
              </span>
            )}
          </h1>
          <div className={`flex items-center justify-between mb-2 ${
            brandConfig.name === 'OMG'
              ? 'text-gray-600 font-sans'
              : 'text-gray-300 font-mono'
          }`}>
            <div className="flex items-center">
              {benchmark.benchmark_paper && (
                <a 
                  href={benchmark.benchmark_paper} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`transition-colors inline-flex items-center ${
                    brandConfig.name === 'OMG'
                      ? 'text-blue-600 hover:text-blue-800 font-sans'
                      : 'text-cyan-400 hover:text-cyan-300 font-mono'
                  }`}
                  style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                >
                  <i className="bi bi-file-earmark-text mr-1"></i>
                  View paper
                </a>
              )}
            </div>
            
            {/* Last updated date shown in the benchmark page */}
            <div className={`text-[10px] text-right ${
              brandConfig.name === 'OMG'
                ? 'font-sans'
                : 'font-mono'
            }`}>
              Benchmark data last updated: <span className={`font-semibold ${
                brandConfig.name === 'OMG'
                  ? 'text-blue-600'
                  : 'text-cyan-400'
              }`}
              style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>{
                allScores.length > 0 
                ? new Date(allScores.reduce((latest, score) => {
                    const scoreDate = new Date(score.date);
                    return scoreDate > new Date(latest) ? score.date : latest;
                  }, allScores[0].date)).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })
                : 'N/A'
              }</span>
            </div>
          </div>
          {description && (
            <p className={`mt-2 ${
              brandConfig.name === 'OMG'
                ? 'text-gray-700 font-sans'
                : 'text-gray-300 font-mono'
            }`}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Combined section with title and stats boxes in same horizontal space */}
      {sortedScores.length > 0 && (
        <div className="flex justify-between items-end mb-4">
          <h2 className={`text-xl font-semibold ${
            brandConfig.name === 'OMG'
              ? 'text-gray-900 font-sans'
              : 'text-white font-mono'
          }`}
          style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}>
            Performance Ranking
          </h2>
          <div className="flex gap-4">
            <div className={`rounded-lg p-3 border w-40 ${
              brandConfig.name === 'OMG'
                ? 'bg-gray-50 border-gray-200'
                : 'bg-gray-800/50 border-gray-700'
            }`}>
              <h3 className={`text-xs font-medium mb-1 ${
                brandConfig.name === 'OMG'
                  ? 'text-gray-600 font-sans'
                  : 'text-gray-400 font-mono'
              }`}>Models Evaluated</h3>
              <p className={`text-xl font-bold ${
                brandConfig.name === 'OMG'
                  ? 'text-gray-900 font-sans'
                  : 'text-white font-mono'
              }`}>{scores.length}</p>
            </div>
            <div className={`rounded-lg p-3 border w-40 ${
              brandConfig.name === 'OMG'
                ? 'bg-gray-50 border-gray-200'
                : 'bg-gray-800/50 border-gray-700'
            }`}>
              <h3 className={`text-xs font-medium mb-1 ${
                brandConfig.name === 'OMG'
                  ? 'text-gray-600 font-sans'
                  : 'text-gray-400 font-mono'
              }`}>Average Score</h3>
              <p className={`text-xl font-bold ${
                brandConfig.name === 'OMG'
                  ? 'text-gray-900 font-sans'
                  : 'text-white font-mono'
              }`}>
                {sortedScores.length > 0 
                  ? formatScore(
                      sortedScores.reduce((sum, score) => sum + score.score, 0) / sortedScores.length,
                      benchmark.benchmark_id
                    )
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Performance Ranking container */}
      {sortedScores.length > 0 && (() => {
        // Calculate the max scale value once
        const maxScale = (() => {
          let maxValue = 100; // Default for benchmarks out of 100
          const highestScore = sortedScores[0].score;
          
          // Special handling for SWE-Lancer benchmarks (dollar amounts)
          if (benchmark.benchmark_id === 'swe-lancer' || benchmark.benchmark_id === 'swe-lancer-ic-swe-diamond') {
            // Round to the nearest $10,000
            return Math.ceil(highestScore / 10000) * 10000;
          }
          
          // Benchmarks that we know are not out of 100
          const nonStandardScales = [
            'codeforces', 'chatbot-arena', 'mrcr'
          ];
          
          if (nonStandardScales.includes(benchmark.benchmark_id) || highestScore > 100) {
            maxValue = Math.ceil(highestScore / 100) * 100;
          }
          
          return maxValue;
        })();
        
        return (
          <div className={`mb-12 p-6 rounded-lg border ${
            brandConfig.name === 'OMG'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-gray-800/30 border-gray-700'
          }`}>
            <div className="flex items-center justify-between mb-2">
              {sortedScores.length > 15 && (
                <div className={`text-xs flex items-center ${
                  brandConfig.name === 'OMG'
                    ? 'text-gray-600 font-sans'
                    : 'text-gray-400 font-mono'
                }`}>
                  <i className="bi bi-mouse mr-1"></i>
                  <span>Scroll to see all {sortedScores.length} models</span>
                </div>
              )}
              <div className={`text-xs ${
                brandConfig.name === 'OMG'
                  ? 'text-gray-600 font-sans'
                  : 'text-gray-400 font-mono'
              }`}>
                {benchmark.benchmark_id === 'swe-lancer' || benchmark.benchmark_id === 'swe-lancer-ic-swe-diamond' ? (
                  <>Scale: $0-${maxScale.toLocaleString()}</>
                ) : (
                  <>Scale: 0-{maxScale.toLocaleString()}</>
                )}
              </div>
            </div>
            
            <div className="relative">
              <div className="space-y-3 mt-6 max-h-[600px] overflow-y-auto pr-6 custom-scrollbar">
                {sortedScores.map((score, index) => {
                  const model = allModels[score.model_id];
                  if (!model) return null;
                  
                  const company = companies[score.company_id];
                  const percentage = (score.score / maxScale) * 100;
                  
                  return (
                    <div key={`${score.model_id}-${score.date}`} className="relative">
                      <div className="flex items-center mb-1">
                        <div className={`w-8 text-sm ${
                          brandConfig.name === 'OMG'
                            ? 'text-gray-600 font-sans'
                            : 'text-gray-400 font-mono'
                        }`}>#{index + 1}</div>
                        <div className={`w-48 truncate font-medium ${
                          brandConfig.name === 'OMG'
                            ? 'text-blue-600 font-sans'
                            : 'text-cyan-400 font-mono'
                        }`}
                        style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>{model.name}</div>
                        <div className={`text-sm ${
                          brandConfig.name === 'OMG'
                            ? 'text-gray-600 font-sans'
                            : 'text-gray-400 font-mono'
                        }`}>{company?.name || 'Unknown'}</div>
                        <div className={`ml-auto ${
                          brandConfig.name === 'OMG'
                            ? 'text-gray-900 font-sans'
                            : 'text-white font-mono'
                        }`}>
                          {formatScore(score.score, benchmark.benchmark_id)}
                        </div>
                      </div>
                      <div className={`relative h-2 rounded-full overflow-hidden mt-1 ml-8 mr-4 ${
                        brandConfig.name === 'OMG'
                          ? 'bg-gray-200'
                          : 'bg-gray-700'
                      }`}>
                        <div 
                          className={`absolute top-0 left-0 h-full rounded-full ${
                            brandConfig.name === 'OMG'
                              ? 'bg-blue-600'
                              : 'bg-gradient-to-r from-cyan-500 to-fuchsia-500'
                          }`}
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: brandConfig.name === 'OMG' ? brandConfig.primaryColor : undefined
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {sortedScores.length > 15 && (
                <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t to-transparent pointer-events-none ${
                  brandConfig.name === 'OMG'
                    ? 'from-gray-50'
                    : 'from-gray-800/30'
                }`}></div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Full results table */}
      {sortedScores.length > 0 ? (
        <div className="mt-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className={`text-xl font-semibold ${
              brandConfig.name === 'OMG'
                ? 'text-gray-900 font-sans'
                : 'text-white font-mono'
            }`}
            style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}>
              All Results
            </h2>
          </div>
          <div className={`overflow-x-auto rounded-lg border ${
            brandConfig.name === 'OMG'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-gray-800/30 border-gray-700'
          }`}>
            <table className="min-w-full">
              <thead>
                <tr className={`border-b ${
                  brandConfig.name === 'OMG'
                    ? 'border-gray-200'
                    : 'border-gray-700'
                }`}>
                  <th className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                    brandConfig.name === 'OMG'
                      ? 'text-gray-600 font-sans'
                      : 'text-gray-400 font-mono'
                  }`}>Rank</th>
                  <th className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                    brandConfig.name === 'OMG'
                      ? 'text-gray-600 font-sans'
                      : 'text-gray-400 font-mono'
                  }`}>Model</th>
                  <th className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                    brandConfig.name === 'OMG'
                      ? 'text-gray-600 font-sans'
                      : 'text-gray-400 font-mono'
                  }`}>Company</th>
                  <th className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                    brandConfig.name === 'OMG'
                      ? 'text-gray-600 font-sans'
                      : 'text-gray-400 font-mono'
                  }`}>Score</th>
                  <th className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                    brandConfig.name === 'OMG'
                      ? 'text-gray-600 font-sans'
                      : 'text-gray-400 font-mono'
                  }`}>Date</th>
                  <th className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                    brandConfig.name === 'OMG'
                      ? 'text-gray-600 font-sans'
                      : 'text-gray-400 font-mono'
                  }`}>Source</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                brandConfig.name === 'OMG'
                  ? 'divide-gray-200'
                  : 'divide-gray-700'
              }`}>
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
                    <tr key={`${score.model_id}-${score.date}`} className={`transition-colors ${
                      brandConfig.name === 'OMG'
                        ? 'hover:bg-gray-50'
                        : 'hover:bg-gray-700/50'
                    }`}>
                      <td className={`py-3 px-4 text-sm ${
                        brandConfig.name === 'OMG'
                          ? 'font-sans'
                          : 'font-mono'
                      }`}>
                        <span className={`font-semibold ${
                          brandConfig.name === 'OMG'
                            ? index < 3 ? 'text-blue-600' : 'text-gray-700'
                            : index < 3 ? 'text-fuchsia-400' : 'text-gray-300'
                        }`}
                        style={brandConfig.name === 'OMG' && index < 3 ? { color: brandConfig.primaryColor } : {}}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className={`font-medium ${
                            brandConfig.name === 'OMG'
                              ? 'text-blue-600 font-sans'
                              : 'text-cyan-400 font-mono'
                          }`}
                          style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
                            {model.name}
                          </span>
                          {model.status === 'archived' && (
                            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                              brandConfig.name === 'OMG'
                                ? 'bg-gray-200 text-gray-600 font-sans'
                                : 'bg-gray-700 text-gray-400 font-mono'
                            }`}>
                              Archived
                            </span>
                          )}
                        </div>
                        {model.releaseDate && (
                          <div className={`text-xs ${
                            brandConfig.name === 'OMG'
                              ? 'text-gray-600 font-sans'
                              : 'text-gray-400 font-mono'
                          }`}>
                            Released: {new Date(model.releaseDate).toLocaleDateString('en-GB', {
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-4 text-sm ${
                        brandConfig.name === 'OMG'
                          ? 'text-gray-700 font-sans'
                          : 'text-gray-300 font-mono'
                      }`}>{company?.name || 'Unknown'}</td>
                      <td className={`py-3 px-4 ${
                        brandConfig.name === 'OMG'
                          ? 'font-sans text-gray-900'
                          : 'font-mono text-white'
                      }`}>
                        <span>
                          {formatScore(score.score, benchmark.benchmark_id)}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-sm ${
                        brandConfig.name === 'OMG'
                          ? 'text-gray-600 font-sans'
                          : 'text-gray-400 font-mono'
                      }`}>{formattedDate}</td>
                      <td className="py-3 px-4 text-sm">
                        {score.source ? (
                          <a 
                            href={score.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center transition-colors ${
                              brandConfig.name === 'OMG'
                                ? 'text-blue-600 hover:text-blue-800 font-sans'
                                : 'text-cyan-400 hover:text-cyan-300 font-mono'
                            }`}
                            style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
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
        <div className={`rounded-lg p-6 my-4 text-center border ${
          brandConfig.name === 'OMG'
            ? 'bg-gray-50 border-gray-200'
            : 'bg-gray-800/50 border-gray-700'
        }`}>
          <i className={`bi bi-exclamation-circle text-4xl mb-3 ${
            brandConfig.name === 'OMG'
              ? 'text-gray-400'
              : 'text-gray-500'
          }`}></i>
          <h3 className={`text-xl font-medium mb-2 ${
            brandConfig.name === 'OMG'
              ? 'text-gray-700 font-sans'
              : 'text-gray-300 font-mono'
          }`}>No Scores Available</h3>
          <p className={`${
            brandConfig.name === 'OMG'
              ? 'text-gray-600 font-sans'
              : 'text-gray-400 font-mono'
          }`}>
            No benchmark scores are available for {benchmark.benchmark_name}.
          </p>
        </div>
      )}

    </div>
  );
};

export default BenchmarkDetail;