import React from 'react';
import ClientOnly from '../components/utils/ClientOnly';
import BenchmarkPageClient from './page-client';
import type { Metadata } from 'next';
import { generatePageMetadata } from '../lib/metadata';

export const generateMetadata = (): Metadata => {
  return generatePageMetadata(
    'benchmarks', 
    'AI Benchmarks', 
    'Compare performance benchmarks for generative AI models across different categories including reasoning, coding, and multimodal capabilities.',
    ['AI benchmarks', 'model performance', 'MMLU', 'HumanEval', 'benchmark scores', 'AI evaluation', 'model testing', 'reasoning benchmarks', 'coding benchmarks']
  );
};

export default function BenchmarksPage() {
  return (
    <ClientOnly>
      <BenchmarkPageClient />
    </ClientOnly>
  );
}