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
  pricing_cost: number | null;
  speed: number | null;
}

export interface ModelRatingsData {
  [modelId: string]: ModelRating;
}

import companiesData from '../../../data/data.json';

interface CompaniesData {
  companies: Array<{
    id: string;
    name: string;
    models?: Array<{
      id: string;
      name: string;
      type: string;
      ratings?: {
        intelligence?: number;
        stem?: number;
        agentic?: number;
        coding?: number;
        reasoning?: number;
        pricing_cost?: number;
        speed?: number;
      };
    }>;
  }>;
}

let modelRatingsCache: ModelRatingsData | null = null;

export async function loadModelRatings(): Promise<ModelRatingsData> {
  if (modelRatingsCache) {
    return modelRatingsCache;
  }

  try {
    const data = companiesData as CompaniesData;
    
    const ratings: ModelRatingsData = {};
    
    for (const company of data.companies) {
      if (!company.models) continue;
      
      for (const model of company.models) {
        const modelRatings = model.ratings || {};
        
        const rating: ModelRating = {
          model_id: model.id,
          model_name: model.name,
          model_type: model.type,
          company: company.name,
          intelligence: modelRatings.intelligence ?? null,
          stem: modelRatings.stem ?? null,
          agentic: modelRatings.agentic ?? null,
          coding: modelRatings.coding ?? null,
          reasoning: modelRatings.reasoning ?? null,
          pricing_cost: modelRatings.pricing_cost ?? null,
          speed: modelRatings.speed ?? null
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
      return rating.pricing_cost;
    case 'speed':
      return rating.speed;
    default:
      return null;
  }
}