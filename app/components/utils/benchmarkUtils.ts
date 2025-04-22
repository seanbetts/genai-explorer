import { Benchmark, BenchmarkScore, BenchmarkCategory, Model } from '../types';
import benchmarksMetaData from '../../../data/benchmarks-meta.json';

// We'll need to parse the CSV data when importing
import Papa from 'papaparse';

// Cache for benchmark data
let benchmarkScoresCache: BenchmarkScore[] | null = null;

/**
 * Load benchmark metadata from JSON
 */
export const loadBenchmarkMetadata = (): Benchmark[] => {
  return benchmarksMetaData as Benchmark[];
};

/**
 * Client-side function to load benchmark scores
 * Uses fetch to get the CSV file and then parses it
 */
export const loadBenchmarkScores = async (): Promise<BenchmarkScore[]> => {
  if (benchmarkScoresCache) return benchmarkScoresCache;
  
  try {
    const response = await fetch('/data/benchmarks.csv');
    const csvText = await response.text();
    
    const parseResult = Papa.parse(csvText, {
      header: true,
      dynamicTyping: true, // Automatically convert numeric values
    });
    
    benchmarkScoresCache = parseResult.data as BenchmarkScore[];
    return benchmarkScoresCache;
  } catch (error) {
    console.error('Error loading benchmark scores:', error);
    return [];
  }
};

/**
 * Group benchmarks by their category
 */
export const groupBenchmarksByCategory = (benchmarks: Benchmark[]): Record<BenchmarkCategory, Benchmark[]> => {
  const grouped: Partial<Record<BenchmarkCategory, Benchmark[]>> = {};
  
  benchmarks.forEach(benchmark => {
    const category = benchmark.benchmark_category as BenchmarkCategory;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category]!.push(benchmark);
  });
  
  // Sort benchmarks alphabetically by name within each category
  Object.keys(grouped).forEach(category => {
    grouped[category as BenchmarkCategory]!.sort((a, b) => 
      a.benchmark_name.localeCompare(b.benchmark_name)
    );
  });
  
  return grouped as Record<BenchmarkCategory, Benchmark[]>;
};

/**
 * Get all benchmark scores for a specific model
 */
export const getBenchmarkScoresForModel = (scores: BenchmarkScore[], modelId: string): BenchmarkScore[] => {
  return scores.filter(score => score.model_id === modelId);
};

/**
 * Get all benchmark scores for a company's models
 */
export const getBenchmarkScoresForCompany = (scores: BenchmarkScore[], companyId: string): BenchmarkScore[] => {
  return scores.filter(score => score.company_id === companyId);
};

/**
 * Get the latest score for a specific model and benchmark
 */
export const getLatestScoreForModelAndBenchmark = (
  scores: BenchmarkScore[],
  modelId: string,
  benchmarkId: string
): BenchmarkScore | null => {
  const filteredScores = scores.filter(
    score => score.model_id === modelId && score.benchmark_id === benchmarkId
  );
  
  if (filteredScores.length === 0) return null;
  
  // Sort by date (newest first) and return the first one
  return filteredScores.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
};

/**
 * Get all models that have scores for a specific benchmark
 */
export const getModelsWithBenchmarkScores = (
  scores: BenchmarkScore[],
  benchmarkId: string,
  models: Model[]
): Model[] => {
  const modelIds = new Set(
    scores
      .filter(score => score.benchmark_id === benchmarkId)
      .map(score => score.model_id)
  );
  
  return models.filter(model => modelIds.has(model.id));
};

/**
 * Calculate ranking of a model for a specific benchmark
 * Returns the position (1 = first place) and the total number of models
 */
export const calculateModelRanking = (
  scores: BenchmarkScore[],
  modelId: string,
  benchmarkId: string
): { rank: number, total: number } | null => {
  // Get all scores for this benchmark
  const benchmarkScores = scores.filter(score => score.benchmark_id === benchmarkId);
  
  if (benchmarkScores.length === 0) return null;
  
  // Get latest score for each model
  const latestScores: Record<string, BenchmarkScore> = {};
  
  benchmarkScores.forEach(score => {
    const currentLatest = latestScores[score.model_id];
    if (!currentLatest || new Date(score.date) > new Date(currentLatest.date)) {
      latestScores[score.model_id] = score;
    }
  });
  
  // Convert to array and sort by score (descending)
  const sortedScores = Object.values(latestScores).sort((a, b) => b.score - a.score);
  
  // Find our model's position
  const modelScore = latestScores[modelId];
  if (!modelScore) return null;
  
  const rank = sortedScores.findIndex(score => score.model_id === modelId) + 1;
  return { rank, total: sortedScores.length };
};

/**
 * Get the average score for each benchmark across all models
 */
export const getAverageBenchmarkScores = (scores: BenchmarkScore[]): Record<string, number> => {
  const scoresByBenchmark: Record<string, number[]> = {};
  
  // Get latest scores for each model and benchmark
  scores.forEach(score => {
    if (!scoresByBenchmark[score.benchmark_id]) {
      scoresByBenchmark[score.benchmark_id] = [];
    }
    scoresByBenchmark[score.benchmark_id].push(score.score);
  });
  
  // Calculate averages
  const averages: Record<string, number> = {};
  Object.entries(scoresByBenchmark).forEach(([benchmarkId, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    averages[benchmarkId] = sum / scores.length;
  });
  
  return averages;
};

/**
 * Associate benchmark scores with models 
 * This modifies the models array in place
 */
export const associateBenchmarkScoresWithModels = (
  models: Model[],
  scores: BenchmarkScore[]
): void => {
  models.forEach(model => {
    const modelScores = getBenchmarkScoresForModel(scores, model.id);
    if (modelScores.length > 0) {
      model.benchmarkScores = modelScores;
    }
  });
};