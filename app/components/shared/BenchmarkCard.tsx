'use client';

import React, { useState } from 'react';
import { Benchmark } from '../types';
import { containerStyles } from '../utils/layout';
import brandConfig from '../../config/brand';

interface BenchmarkCardProps {
  benchmark: Benchmark;
  scoreCount: number;
  onClick: () => void;
}

const BenchmarkCard: React.FC<BenchmarkCardProps> = ({
  benchmark,
  scoreCount,
  onClick,
}) => {
  // State for hover
  const [isHovered, setIsHovered] = useState(false);
  
  // Border color for hover
  const hoverStyle = brandConfig.name === 'OMG' && isHovered 
    ? { borderColor: brandConfig.primaryColor } 
    : {};

  return (
    <div
      key={benchmark.benchmark_id}
      role="button"
      tabIndex={0}
      className={`benchmark-card group ${containerStyles.companyCardContainer} ${benchmark.featured_benchmark ? 'border-2' : ''}`}
      style={{
        ...hoverStyle,
        ...(benchmark.featured_benchmark ? { borderColor: brandConfig.secondaryColor } : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${benchmark.benchmark_name} - Click to view details`}
      title={`${benchmark.benchmark_name} - Click to view details`}
    >
      <div className="flex flex-col h-full">
        <div className="text-center mb-2">
          <h3 
            className="font-medium text-md"
            style={{ 
              fontFamily: brandConfig.name === 'OMG' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'monospace',
              color: isHovered ? brandConfig.primaryColor : 'rgb(31, 41, 55)'
            }}
          >
            {benchmark.benchmark_name}
          </h3>
          {benchmark.featured_benchmark && (
            <div className="mt-1">
              <span className="text-xs px-1.5 py-0.5 rounded inline-block" style={{ 
                backgroundColor: brandConfig.secondaryColor,
                color: 'white'
              }}>
                Featured
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-grow text-sm px-2 text-center" style={{ 
          color: brandConfig.name === 'OMG' ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)' 
        }}>
          {benchmark.benchmark_description || "No description available."}
        </div>
        
        <div className="mt-3 flex justify-between items-center px-2">
          <div className="text-xs" style={{ 
            color: brandConfig.name === 'OMG' ? 'rgb(107, 114, 128)' : 'rgb(156, 163, 175)' 
          }}>
            {scoreCount} model{scoreCount !== 1 ? 's' : ''} ranked
          </div>
          
          {benchmark.benchmark_paper && (
            <a 
              href={benchmark.benchmark_paper} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs flex items-center transition-all"
              style={{ color: brandConfig.primaryColor }}
              onClick={(e) => {
                e.stopPropagation();  // Prevent card click when clicking the link
              }}
            >
              <i className="bi bi-file-earmark-text mr-1"></i>
              Paper
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenchmarkCard;