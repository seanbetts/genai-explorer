export interface ModelRating {
  model_id: string;
  model_name: string;
  model_type: string;
  company: string;
  intelligence: number | null;
  stem: number | null;
  agentic: number | null;
  coding: number | null;
  reasoning: number | null;
  pricing_affordability: number | null;
}

export interface ModelRatingsData {
  [modelId: string]: ModelRating;
}

let modelRatingsCache: ModelRatingsData | null = null;

export async function loadModelRatings(): Promise<ModelRatingsData> {
  if (modelRatingsCache) {
    return modelRatingsCache;
  }

  try {
    const response = await fetch('/data/model_ratings.csv');
    const csvText = await response.text();
    
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    const ratings: ModelRatingsData = {};
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      
      if (values.length >= headers.length) {
        const parseRating = (value: string): number | null => {
          if (value === 'n/a' || value === '' || !value) return null;
          const parsed = parseFloat(value);
          return isNaN(parsed) ? null : parsed;
        };

        const rating: ModelRating = {
          model_id: values[0],
          model_name: values[1],
          model_type: values[2],
          company: values[3],
          intelligence: parseRating(values[4]), // General Intelligence
          stem: parseRating(values[5]), // STEM
          agentic: parseRating(values[6]), // agentic
          coding: parseRating(values[7]), // coding
          reasoning: parseRating(values[8]), // reasoning
          pricing_affordability: parseRating(values[9]) // pricing_affordability
        };
        
        ratings[rating.model_id] = rating;
      }
    }
    
    modelRatingsCache = ratings;
    return ratings;
  } catch (error) {
    console.error('Failed to load model ratings:', error);
    return {};
  }
}

export function getRatingForModel(modelId: string, ratingType: string, modelRatings: ModelRatingsData): number | null {
  const rating = modelRatings[modelId];
  if (!rating) return null;
  
  switch (ratingType) {
    case 'intelligence':
      return rating.intelligence;
    case 'stem':
      return rating.stem;
    case 'agentic':
      return rating.agentic;
    case 'coding':
      return rating.coding;
    case 'reasoning':
      return rating.reasoning;
    case 'pricing':
      return rating.pricing_affordability;
    default:
      return null;
  }
}