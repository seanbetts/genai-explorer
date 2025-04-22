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

const BenchmarksTable: React.FC<BenchmarksTableProps> = ({ models, companyId }) => {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [benchmarkScores, setBenchmarkScores] = useState<BenchmarkScore[]>([]);
  const [groupedBenchmarks, setGroupedBenchmarks] = useState<Record<BenchmarkCategory, Benchmark[]>>({} as Record<BenchmarkCategory, Benchmark[]>);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load benchmark data
  useEffect(() => {
    const loadBenchmarkData = async () => {
      try {
        setLoading(true);
        
        // Load benchmark metadata and scores
        const benchmarkData = loadBenchmarkMetadata();
        console.log("Loaded benchmark metadata:", benchmarkData.length, "benchmarks");
        
        const scoreData = await loadBenchmarkScores();
        console.log("Loaded benchmark scores:", scoreData.length, "scores");
        
        // Filter scores to only include those for the current company's models
        const companyModelIds = models.map(model => model.id);
        console.log("Company model IDs:", companyModelIds);
        console.log("Company ID:", companyId);
        
        const filteredScores = scoreData.filter(score => 
          score.company_id === companyId && 
          companyModelIds.includes(score.model_id)
        );
        console.log("Filtered scores for this company:", filteredScores.length);
        
        // Group benchmarks by category
        const grouped = groupBenchmarksByCategory(benchmarkData);
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
  
  return (
    <div className="transform transition-opacity duration-300">
      <style>{tableHoverStyles}</style>
      
      {/* Benchmarks legend and info box at the top */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <i className="bi bi-info-circle-fill text-cyan-500 text-xl mt-0.5"></i>
          <div className="w-full">
            <h3 className="text-lg font-medium text-cyan-400 mb-2">About Benchmarks</h3>
            <p className="text-gray-300 text-sm mb-3">
              Benchmarks provide standardized tests to compare model capabilities across different dimensions. 
              Scores shown are raw benchmark scores reported by the model providers.
            </p>
            
            <div className="border-t border-gray-700 pt-3 mt-2">
              <div className="text-gray-300 text-sm font-medium mb-2">Ranking Indicators:</div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">🥇</span>
                  <span className="text-gray-300 text-sm">1st place</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-300 text-lg">🥈</span>
                  <span className="text-gray-300 text-sm">2nd place</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-amber-700 text-lg">🥉</span>
                  <span className="text-gray-300 text-sm">3rd place</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Render each benchmark category section */}
      {Object.entries(groupedBenchmarks).map(([category, categoryBenchmarks]) => (
        <BenchmarkCategorySection
          key={category}
          category={category}
          benchmarks={categoryBenchmarks}
          models={sortedModels}
          benchmarkScores={benchmarkScores}
          companyId={companyId}
        />
      ))}
      
      {/* Sources and methodology footer */}
      <div className="mt-8 text-sm text-gray-400 border-t border-gray-700 pt-4">
        <p className="mb-2">
          <strong className="text-gray-300">Sources:</strong> Benchmark data is collected from research papers, model provider documentation, and published evaluations.
          For detailed methodology, click the paper links next to each benchmark.
        </p>
      </div>
    </div>
  );
};

export default BenchmarksTable;