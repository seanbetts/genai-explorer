import React from 'react';
import ClientOnly from '../components/utils/ClientOnly';
import BenchmarkPageClient from './page-client';
import type { Metadata } from 'next';
import { generatePageMetadata } from '../lib/metadata';

export const generateMetadata = (): Metadata => {
  return generatePageMetadata(
    'benchmarks', 
    'AI Benchmark Explorer', 
    'Compare performance benchmarks for generative AI models across different categories including reasoning, coding, and multimodal capabilities.'
  );
};

export default function BenchmarksPage() {
  return (
    <ClientOnly>
      <BenchmarkPageClient />
    </ClientOnly>
  );
}