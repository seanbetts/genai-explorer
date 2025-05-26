// Define types based on the JSON structure

// Benchmark related interfaces
export interface Benchmark {
  benchmark_id: string;
  benchmark_name: string;
  benchmark_category: string;
  featured_benchmark?: boolean;
  benchmark_description?: string | null;
  benchmark_paper: string | null;
}

export interface BenchmarkScore {
  model_id: string;
  company_id: string;
  benchmark_id: string;
  score: number;
  date: string;
  notes?: string;
  source_name?: string;
  source?: string;
}

export type BenchmarkCategory = 'agentic' | 'coding' | 'reasoning' | 'General Intelligence' | 'STEM';
export interface Feature {
  name: string;
  description: string;
  image: string;
  url: string;
}

export interface Product {
  name: string;
  description: string;
  image: string;
  url: string;
}

export interface DataPrivacy {
  usesCustomerDataForTraining?: boolean;
  dataRetentionPolicy?: string[];
  documentation?: string;
  termsOfUse?: string;
}

export interface SecurityFeatures {
  [key: string]: boolean;
}

export interface Specs {
  reasoningTokens?: boolean;
  inputFormats?: string[];
  outputFormats?: string[];
  maxInputTokens?: number;
  maxOutputTokens?: number;
  knowledgeCutoff?: string;
  openSource?: boolean;
  techniques?: string[];
  commercialUseAllowed?: boolean;
  genres?: string[];
  styles?: string[];
  integrated?: string[];
  maxDuration?: string;
  voiceCloning?: boolean;
  emotionControl?: boolean;
  languageSupport?: string[];
  personalityCustomization?: boolean;
  voiceCapabilities?: boolean;
  memoryCapacity?: string;
  realTimeData?: boolean;
  sourceAttribution?: boolean;
  dataRetrieval?: string;
  groundingSources?: string[];
  integrations?: string[];
  dataPrivacy?: DataPrivacy;
  securityFeatures?: SecurityFeatures;
  
  // Pricing data (dollars per 1 million tokens)
  pricingInputPerM?: number;
  pricingCachedInputPerM?: number;
  pricingOutputPerM?: number;
}

export interface Capabilities {
  intelligence?: number;
  speed?: number;
  reasoning?: number;
  creativity?: number;
  personality?: number;
  naturalness?: number;
  accuracy?: number;
  codeQuality?: number;
}

export type ModelStatus = 'primary' | 'secondary' | 'archived';

export interface Model {
  id: string;
  name: string;
  status?: ModelStatus;
  type?: string;
  category: CompanyCategory; // Required category field
  releaseDate?: string;
  modelVersion?: string;
  modelPage?: string;
  releasePost?: string;
  releaseVideo?: string;
  releaseNotes?: string;
  systemCard?: string;
  licenceType?: string;
  licenceLink?: string;
  huggingFace?: string;
  securityDetails?: string;
  capabilities?: Capabilities;
  specs?: Specs;
  benchmarkScores?: BenchmarkScore[]; // Benchmark scores for this model
  description?: string; // Added for display purposes (not in the source data)
  
  // Additional fields for comparison
  parameterCount?: number; // In billions
  contextLength?: number; // In tokens
  license?: string; // License type
  trainingCutoff?: string; // Training data cutoff date
  access?: string[]; // API, Chat interface, etc.
  
  // For display in comparison view
  companyId?: string;
  companyName?: string;
  
  // New fields for image models
  about?: string; // Detailed description for the model
  exampleImages?: string[]; // Array of image paths
  imageList?: string[]; // Explicit list of image paths to use for static export
  imageExamples?: {
    numberOfImages: number;
    imageFormat?: string;
  }; // Structured data for image examples
  demoVideos?: Record<string, string | string[]>; // Key-value pairs of demo names and video URLs or [videoURL, thumbnailURL]
  modelGuide?: string; // URL to model guide documentation
  apiDocumentation?: string; // URL to API documentation
  termsOfService?: string; // URL to terms of service
  usagePolicy?: string; // URL to usage policy
  commerciallySafe?: boolean; // Whether the model is safe for commercial use
  metadata?: Record<string, string>; // Key-value pairs of metadata
  apiEndpoints?: {
    available?: boolean;
    endpoints?: Record<string, ApiEndpoint>;
    [key: string]: any;
  }; // API endpoint definitions and availability
  features?: {
    generation?: Record<string, boolean | number[] | string[]>;
    editing?: Record<string, boolean | object>;
    enhancement?: Record<string, boolean | object>;
    advanced?: Record<string, boolean | object>;
    other?: Record<string, boolean | object | string[]>;
  }; // Features supported by the model, organized by category
  safety?: Record<string, any>; // Safety features of the model (can contain boolean values or strings for URLs)
  aspectRatios?: Record<string, boolean>; // Supported aspect ratios for image generation
  videoExamples?: string[] | Record<string, string>; // Example videos for video models
  heroVideo?: string | Record<string, string>; // Hero video for specialized models
  audioExamples?: string[] | Record<string, string> | {
    files: string[];
    embeds: Record<string, string>;
  }; // Example audio clips for audio models
  audioList?: Record<string, string>; // Explicit list of audio paths to use for static export
}

export interface ApiEndpointOptions {
  inputFormats?: string[];
  outputFormats?: string[];
  inputFileTypes?: string[];
  outputFileTypes?: string[];
  maxInputSize?: number;
  contextWindow?: number;
  moderation?: string[];
  mask?: boolean;
  structureReference?: boolean;
  negativePrompt?: boolean;
  outputSize?: string[];
  outputQuality?: string[];
  outputCompression?: boolean;
  outputStyle?: string[];
  background?: string[];
  visualIntesity?: number;
  tileable?: boolean;
  placementPosition?: boolean;
  placementAlignment?: boolean;
  numberOfImages?: number;
}

export interface ApiEndpoint {
  available?: boolean;
  url?: string;
  description?: string;
  documentation?: string;
  options?: ApiEndpointOptions;
}

export interface Subscription {
  tier: string;
  type: string;
  price: number | null;
  billingCycle: string;
  perUser?: boolean;
  features: string[];
  url?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  lastUpdated: string;
  features?: Feature[];
  products?: Product[];
  models: Model[];
  subscriptions?: Subscription[];
}

export interface ExplorerData {
  companies: Company[];
}


export interface CategoryStyle {
  bgClass: string;
  borderClass: string;
}

export type CategoryMap = Record<string, CategoryStyle>;

export type CompanyCategory = 'frontier' | 'open' | 'enterprise' | 'image' | 'video' | 'audio' | 'other';

export type CategorizedCompanies = Record<CompanyCategory, Company[]>;