// Define types based on the JSON structure
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
  capabilities?: Capabilities;
  specs?: Specs;
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

export type CompanyCategory = 'frontier' | 'open' | 'enterprise' | 'image' | 'video' | 'music' | 'other';

export type CategorizedCompanies = Record<CompanyCategory, Company[]>;