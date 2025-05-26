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
    key: 'General Intelligence',
    title: 'General Intelligence',
    layout: 'full-width',
    columns: 4,
    rowType: 'single',
    description: 'Comprehensive evaluations of overall AI intelligence and capabilities.'
  },
  {
    key: 'reasoning',
    title: 'Reasoning & Logic',
    layout: 'full-width',
    columns: 4,
    rowType: 'single',
    description: 'Benchmark tests that measure logical reasoning capabilities.'
  },
  {
    key: 'agentic',
    title: 'Agentic Capabilities',
    layout: 'full-width',
    columns: 4,
    rowType: 'single',
    description: 'Tests for models\' ability to act as agents and perform multi-step tasks.'
  },
  {
    key: 'coding',
    title: 'Coding & Programming',
    layout: 'full-width',
    columns: 4,
    rowType: 'single',
    description: 'Evaluation of code generation and software engineering capabilities.'
  },
  {
    key: 'STEM',
    title: 'STEM',
    layout: 'full-width',
    columns: 4,
    rowType: 'single',
    description: 'Benchmarks focused on science, technology, engineering, and mathematical problem-solving.'
  }
];