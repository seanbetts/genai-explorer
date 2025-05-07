import React from 'react';
import { Metadata } from 'next';
import brandConfig from '../config/brand';

export const metadata: Metadata = {
  title: `Benchmark Explorer - ${brandConfig.name}`,
  description: 'Explore and compare AI benchmarks and model performance.',
};

export default function BenchmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}