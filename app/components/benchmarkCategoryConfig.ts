import type { BenchmarkCategory } from './types';

// Configuration for how each benchmark category should be rendered
export interface BenchmarkCategoryConfigEntry {
  key: BenchmarkCategory;
  title: string;
  layout: 'full-width' | 'half-width' | 'quarter-width';
  columns?: number;
  rowType: 'single' | 'double' | 'quad';
  description?: string;
}

export const benchmarkCategoryConfig: BenchmarkCategoryConfigEntry[] = [
  {
    key: 'usability',
    title: 'Usability & General Performance',
    layout: 'full-width',
    columns: 4,
    rowType: 'single',
    description: 'Tests focusing on overall model performance and user satisfaction.'
  },
  {
    key: 'reasoning',
    title: 'Reasoning & Logic',
    layout: 'half-width',
    columns: 3,
    rowType: 'double',
    description: 'Benchmark tests that measure logical reasoning capabilities.'
  },
  {
    key: 'coding',
    title: 'Coding & Programming',
    layout: 'half-width',
    columns: 3,
    rowType: 'double',
    description: 'Evaluation of code generation and software engineering capabilities.'
  },
  {
    key: 'factuality',
    title: 'Factuality & Knowledge',
    layout: 'quarter-width',
    rowType: 'quad',
    description: 'Tests that measure models\' factual accuracy and knowledge retrieval.'
  },
  {
    key: 'maths',
    title: 'Mathematics',
    layout: 'quarter-width',
    rowType: 'quad',
    description: 'Benchmarks focused on mathematical problem-solving abilities.'
  },
  {
    key: 'multimodal',
    title: 'Multimodal',
    layout: 'quarter-width',
    rowType: 'quad',
    description: 'Tests for models that process multiple modalities like vision and text.'
  },
  {
    key: 'science',
    title: 'Scientific Knowledge',
    layout: 'quarter-width',
    rowType: 'quad',
    description: 'Benchmarks focused on scientific domain knowledge and problem-solving.'
  },
  {
    key: 'agentic',
    title: 'Agentic Capabilities',
    layout: 'full-width',
    columns: 4,
    rowType: 'single',
    description: 'Tests for models\' ability to act as agents and perform multi-step tasks.'
  }
];