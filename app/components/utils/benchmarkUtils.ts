import { Benchmark, BenchmarkScore, BenchmarkCategory, Model } from '../types';
// Use the benchmarks metadata from the public folder
// We can't import it directly since it's in public, so we'll fetch it when needed

// We'll need to parse the CSV data when importing
import Papa from 'papaparse';

// Type definition for ranking information
interface RankingInfo {
  rank: number;
  total: number;
}

// Type definition for rankings cache structure
type BenchmarkRankings = Record<string, Record<string, RankingInfo>>;

// Cache for benchmark data
let benchmarkMetaCache: Benchmark[] | null = null;
let benchmarkScoresCache: BenchmarkScore[] | null = null;
let globalRankingsCache: BenchmarkRankings = {};

/**
 * Load benchmark metadata from JSON
 */
export const loadBenchmarkMetadata = async (): Promise<Benchmark[]> => {
  if (benchmarkMetaCache) return benchmarkMetaCache;
  
  try {
    console.log("Fetching benchmark metadata from JSON...");
    
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      console.log("Using browser fetch for benchmarks-meta.json");
      const response = await fetch('/data/benchmarks-meta.json');
      if (!response.ok) {
        console.error("Failed to fetch benchmarks-meta.json:", response.status, response.statusText);
        return [];
      }
      
      benchmarkMetaCache = await response.json() as Benchmark[];
      console.log("Loaded benchmark metadata:", benchmarkMetaCache.length, "benchmarks");
      return benchmarkMetaCache;
    }
    
    // Fallback return empty array if not in browser
    console.error("Not in browser environment, can't fetch benchmark metadata");
    return [];
  } catch (error) {
    console.error('Error loading benchmark metadata:', error);
    return [];
  }
};

/**
 * Client-side function to load benchmark scores
 * Uses fetch to get the CSV file and then parses it
 */
export const loadBenchmarkScores = async (): Promise<BenchmarkScore[]> => {
  if (benchmarkScoresCache) return benchmarkScoresCache;
  
  try {
    console.log("Fetching benchmark scores from CSV...");
    const response = await fetch('/data/benchmarks.csv');
    if (!response.ok) {
      console.error("Failed to fetch benchmarks.csv:", response.status, response.statusText);
      return [];
    }
    const csvText = await response.text();
    console.log("Got CSV text, length:", csvText.length, "First 100 chars:", csvText.substring(0, 100));
    
    const parseResult = Papa.parse(csvText, {
      header: true,
      dynamicTyping: true, // Automatically convert numeric values
      skipEmptyLines: true, // Skip empty lines in the CSV
      transformHeader: (header) => header.trim(), // Trim whitespace from headers
    });
    
    console.log("Parse result:", parseResult);
    
    // Handle parse errors - log them but continue processing
    if (parseResult.errors && parseResult.errors.length > 0) {
      // Filter out row errors - these usually happen with empty lines or comments
      const criticalErrors = parseResult.errors.filter(e => 
        e.code !== 'TooFewFields' && e.code !== 'TooManyFields' && e.code !== 'UndetectableDelimiter'
      );
      
      if (criticalErrors.length > 0) {
        console.warn("CSV parsing warnings:", criticalErrors);
      }
    }
    
    // Handle the typo in the CSV header (becnhmark_id instead of benchmark_id)
    parseResult.data.forEach((row: any) => {
      if (row.becnhmark_id && !row.benchmark_id) {
        row.benchmark_id = row.becnhmark_id;
      }
    });
    
    // Validate and filter the data
    benchmarkScoresCache = parseResult.data
      .filter((row: any) => {
        // Check if row has the required fields
        if (!row.model_id || !row.benchmark_id || row.score === undefined) {
          console.warn(`Skipping row with missing required fields:`, row);
          return false;
        }
        
        // Trim whitespace from string fields to handle inconsistencies in CSV
        if (row.model_id) row.model_id = row.model_id.trim();
        if (row.company_id) row.company_id = row.company_id.trim();
        if (row.benchmark_id) row.benchmark_id = row.benchmark_id.trim();
        
        // Ensure score is a number
        if (typeof row.score !== 'number') {
          try {
            row.score = parseFloat(row.score);
          } catch (e) {
            console.warn(`Invalid score value for ${row.model_id}, ${row.benchmark_id}:`, row.score);
            return false;
          }
        }
        
        return true;
      }) as BenchmarkScore[];
    console.log("Parsed scores length:", benchmarkScoresCache.length);
    console.log("First score:", benchmarkScoresCache[0]);
    return benchmarkScoresCache;
  } catch (error) {
    console.error('Error loading benchmark scores:', error);
    return [];
  }
};

/**
 * Group benchmarks by their category
 */
export const groupBenchmarksByCategory = async (benchmarks: Benchmark[]): Promise<Record<BenchmarkCategory, Benchmark[]>> => {
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
 * Get benchmark metadata by ID
 */
export const getBenchmarkById = async (benchmarkId: string): Promise<Benchmark | undefined> => {
  const benchmarks = await loadBenchmarkMetadata();
  return benchmarks.find(b => b.benchmark_id === benchmarkId);
};

/**
 * Get benchmark description based on metadata 
 */
export const getBenchmarkDescription = (benchmarkId: string): string => {
  const descriptions: Record<string, string> = {
    'mmlu': 'Tests knowledge across 57 subjects like mathematics, history, law, and medicine.',
    'mmlu-pro': 'Professional-level knowledge test covering medical, legal, and financial expertise.',
    'human-eval': 'Evaluates code generation ability on 164 hand-written programming problems.',
    'gsm8k': 'Tests mathematical reasoning with grade school math word problems.',
    'math': 'Tests mathematical problem-solving ability across different difficulty levels.',
    'chatbot-arena': 'Human preference ratings from head-to-head comparisons between models.',
    'arc': 'AI Research Challenge with general reasoning problems.',
    'hellaswag': 'Tests common sense understanding and situation modeling.',
    'swe-bench-verified': 'Evaluates ability to solve real software engineering tasks in open-source repositories.',
    'codeforces': 'Measures ability to solve competitive programming problems.',
    'loft': 'Tests long-context understanding and retrieval (128k tokens).',
    'mrcr': 'Tests million-token context retrieval ability.',
    'browse-comp': 'Evaluates web browsing capabilities of AI assistants.',
    'swe-lancer': 'Measures the economic value of generated code based on real-world freelance rates.'
  };
  
  return descriptions[benchmarkId] || '';
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
 * Get all scores for a specific model and benchmark, sorted by date (newest first)
 */
export const getAllScoresForModelAndBenchmark = (
  scores: BenchmarkScore[],
  modelId: string,
  benchmarkId: string
): BenchmarkScore[] => {
  const filteredScores = scores.filter(
    score => score.model_id === modelId && score.benchmark_id === benchmarkId
  );
  
  // Sort by date (newest first)
  return filteredScores.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
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
 * Calculate ranking of a model for a specific benchmark within the given scores
 * This is used for company-specific rankings
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
 * Calculate global rankings for all benchmarks
 * This builds a cache of rankings for all benchmarks and models
 */
export const calculateGlobalRankings = async (): Promise<BenchmarkRankings> => {
  // If we already have cached rankings, return them
  if (Object.keys(globalRankingsCache).length > 0) {
    return globalRankingsCache;
  }
  
  try {
    // Load all benchmark scores and metadata in parallel
    const [allScores, _] = await Promise.all([
      loadBenchmarkScores(),
      loadBenchmarkMetadata() // We load this to ensure the metadata is cached
    ]);
    
    // Group by benchmark
    const benchmarkScores: Record<string, BenchmarkScore[]> = {};
    
    allScores.forEach(score => {
      if (!benchmarkScores[score.benchmark_id]) {
        benchmarkScores[score.benchmark_id] = [];
      }
      benchmarkScores[score.benchmark_id].push(score);
    });
    
    // For each benchmark, calculate rankings for all models
    const rankings: BenchmarkRankings = {};
    
    Object.entries(benchmarkScores).forEach(([benchmarkId, scores]) => {
      // Get latest score for each model
      const latestScores: Record<string, BenchmarkScore> = {};
      
      scores.forEach(score => {
        const currentLatest = latestScores[score.model_id];
        if (!currentLatest || new Date(score.date) > new Date(currentLatest.date)) {
          latestScores[score.model_id] = score;
        }
      });
      
      // Sort scores by value (descending)
      const sortedScores = Object.values(latestScores).sort((a, b) => b.score - a.score);
      const totalModels = sortedScores.length;
      
      // Initialize benchmark rankings
      rankings[benchmarkId] = {};
      
      // Calculate rank for each model
      sortedScores.forEach((score, index) => {
        rankings[benchmarkId][score.model_id] = {
          rank: index + 1,
          total: totalModels
        };
      });
    });
    
    // Cache the results
    globalRankingsCache = rankings;
    return rankings;
    
  } catch (error) {
    console.error('Error calculating global rankings:', error);
    return {};
  }
};

/**
 * Get the global ranking for a specific model and benchmark
 * This uses the global rankings cache or calculates it if needed
 */
export const getGlobalModelRanking = async (
  modelId: string,
  benchmarkId: string
): Promise<{ rank: number, total: number } | null> => {
  // If rankings are not cached, calculate them
  if (Object.keys(globalRankingsCache).length === 0) {
    await calculateGlobalRankings();
  }
  
  // Check if we have rankings for this benchmark
  if (!globalRankingsCache[benchmarkId]) {
    return null;
  }
  
  // Check if we have a ranking for this model
  if (!globalRankingsCache[benchmarkId][modelId]) {
    return null;
  }
  
  return globalRankingsCache[benchmarkId][modelId];
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

/**
 * Check if a company has any benchmark data available in our CSV
 * This is a client-side function to determine if the Benchmarks tab should be shown
 */
export const companyHasBenchmarkData = async (companyId: string): Promise<boolean> => {
  try {
    const scores = await loadBenchmarkScores();
    return scores.some(score => score.company_id === companyId);
  } catch (error) {
    console.error('Error checking benchmark data availability:', error);
    return false;
  }
};

/**
 * Get a filtered list of benchmark scores that includes only the most recent score for each model
 * This is used for ranking and displaying the top model and score for each benchmark
 */
export const getUniqueModelScores = (
  scores: BenchmarkScore[], 
  benchmarkId: string
): BenchmarkScore[] => {
  const benchmarkScores = scores.filter(score => score.benchmark_id.trim() === benchmarkId.trim());
  
  // Get unique model IDs
  const uniqueModelIds = Array.from(new Set(benchmarkScores.map(score => score.model_id.trim())));
  
  // For each model ID, get the most recent score
  const uniqueScores: BenchmarkScore[] = [];
  uniqueModelIds.forEach(modelId => {
    const latestScore = getLatestScoreForModelAndBenchmark(benchmarkScores, modelId, benchmarkId);
    if (latestScore) {
      uniqueScores.push(latestScore);
    }
  });
  
  return uniqueScores;
};