'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import brandConfig from '../config/brand';
import { containerStyles } from './utils/layout';
import { Company, Benchmark } from './types';

interface FooterProps {
  currentView: string;
  topCompanies: Array<{ id: string; name: string }>;
  topBenchmarks: Array<{ id: string; name: string; count: number; featured: boolean }>;
  benchmarksLoaded: boolean;
}

const Footer: React.FC<FooterProps> = ({ 
  currentView, 
  topCompanies, 
  topBenchmarks, 
  benchmarksLoaded 
}) => {
  const searchParams = useSearchParams();
  
  // Hide footer for OMG version
  if (!brandConfig.showFooter) {
    return null;
  }
  
  return (
    <footer className={containerStyles.footer + " mt-auto"}>
      <div className={containerStyles.footerContent}>
        <div className="flex flex-col md:flex-row">
          {/* Left half - navigation lists equally spaced */}
          <div className="md:w-3/6 flex flex-col md:flex-row md:space-x-22 mb-6 md:mb-0 md:pl-8">
            {/* Features */}
            <div className="mb-4 md:mb-0 md:w-1/3">
              <h3 className="text-fuchsia-500 text-sm font-semibold mb-2">Features</h3>
              <ul className="space-y-0.5">
                <li>
                  <Link 
                    href="/" 
                    className="transition-colors text-xs leading-tight py-0.5 flex items-center"
                    style={{ 
                      color: currentView === 'home' && !searchParams.has('company') && !searchParams.has('benchmark') && !searchParams.has('compare')
                        ? '#FFFFFF' 
                        : '#d1d5db'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = brandConfig.secondaryColor;
                      // Also change the icon color
                      const icon = e.currentTarget.querySelector('i');
                      if (icon) icon.style.color = brandConfig.secondaryColor;
                    }}
                    onMouseLeave={(e) => {
                      // Reset icon color first
                      const icon = e.currentTarget.querySelector('i');
                      if (icon) icon.style.color = brandConfig.primaryColor;
                      
                      if (currentView === 'home' && !searchParams.has('company') && !searchParams.has('benchmark') && !searchParams.has('compare')) {
                        e.currentTarget.style.color = '#FFFFFF';
                      } else {
                        e.currentTarget.style.color = '#d1d5db';
                      }
                    }}
                  >
                    <i className="bi bi-grid mr-1.5" style={{ color: brandConfig.primaryColor }}></i>
                    <span>Model Explorer</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/benchmarks" 
                    className="transition-colors text-xs leading-tight py-0.5 flex items-center"
                    style={{ 
                      color: currentView === 'benchmarks'
                        ? '#FFFFFF' 
                        : '#d1d5db'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = brandConfig.secondaryColor;
                      // Also change the icon color
                      const icon = e.currentTarget.querySelector('i');
                      if (icon) icon.style.color = brandConfig.secondaryColor;
                    }}
                    onMouseLeave={(e) => {
                      // Reset icon color first
                      const icon = e.currentTarget.querySelector('i');
                      if (icon) icon.style.color = brandConfig.primaryColor;
                      
                      if (currentView === 'benchmarks') {
                        e.currentTarget.style.color = '#FFFFFF';
                      } else {
                        e.currentTarget.style.color = '#d1d5db';
                      }
                    }}
                  >
                    <i className="bi bi-trophy mr-1.5" style={{ color: brandConfig.primaryColor }}></i>
                    <span>Benchmark Explorer</span>
                  </Link>
                </li>
                {/* Temporarily hidden Model Comparer */}
                {false && (
                  <li>
                    <a 
                      href="/compare" 
                      className={`transition-colors text-xs leading-tight py-0.5 flex items-center ${
                        currentView === 'compare'
                          ? 'text-cyan-400' 
                          : 'text-gray-300 hover:text-cyan-400'
                      }`}
                    >
                      <i className={`bi bi-bar-chart-line mr-1.5 ${
                        currentView === 'compare'
                          ? 'text-cyan-400'
                          : 'text-fuchsia-500'
                      }`}></i>
                      <span>Model Comparer</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
            
            {/* Popular Companies */}
            <div className="mb-4 md:mb-0 md:w-1/3">
              <h3 className="text-fuchsia-500 text-sm font-semibold mb-2">AI Companies</h3>
              <ul className="space-y-0.5">
                {topCompanies.map(company => (
                  <li key={company.id}>
                    <a 
                      href={`/?company=${company.id}`} 
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5"
                    >
                      {company.name}
                    </a>
                  </li>
                ))}
                {/* Fallback when no companies are loaded yet */}
                {topCompanies.length === 0 && (
                  <li className="text-gray-500 text-xs leading-tight py-0.5">Loading companies...</li>
                )}
              </ul>
            </div>
            
            {/* Benchmarks */}
            <div className="md:w-1/3">
              <h3 className="text-fuchsia-500 text-sm font-semibold mb-2">Top Benchmarks</h3>
              <ul className="space-y-0.5">
                {topBenchmarks.map(benchmark => (
                  <li key={benchmark.id}>
                    <a 
                      href={`/?benchmark=${benchmark.id}`} 
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-xs leading-tight block py-0.5"
                    >
                      {benchmark.name}
                    </a>
                  </li>
                ))}
                {/* Fallback when benchmark data is still loading */}
                {topBenchmarks.length === 0 && !benchmarksLoaded && (
                  <li className="text-gray-500 text-xs leading-tight py-0.5">Loading benchmarks...</li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Middle empty space */}
          <div className="md:flex-grow hidden md:block"></div>
          
          {/* Right third - About section - aligned to the right */}
          <div className="md:w-1/3 md:flex-shrink-0">
            <h3 className="text-fuchsia-500 text-sm font-semibold mb-2">About</h3>
            <p className="text-gray-300 text-sm mb-4">
              The Blueprint's Generative AI Explorer helps people understand the generative AI landscape and explore companies, models, and benchmarks.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <a href="https://github.com/seanbetts/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                <i className="bi bi-github text-xl"></i>
              </a>
              <a href="https://www.the-blueprint.ai" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                <i className="bi bi-newspaper text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} The Blueprint. All rights reserved.
          </div>
          <div className="text-xs text-gray-400 flex items-center">
            Made with <i className="bi bi-heart-fill text-fuchsia-500 mx-1.5"></i> using&nbsp;<a href="https://www.anthropic.com/claude-code" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">Claude Code</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;