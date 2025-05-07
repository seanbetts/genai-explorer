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
  
  // Border colors
  const borderStyle = benchmark.featured_benchmark 
    ? { borderColor: brandConfig.secondaryColor } 
    : brandConfig.name === 'OMG' 
      ? { borderColor: isHovered ? brandConfig.primaryColor : '#e5e7eb' } 
      : { borderColor: isHovered ? brandConfig.primaryColor : '#374151' };

  return (
    <div
      key={benchmark.benchmark_id}
      role="button"
      tabIndex={0}
      className={`benchmark-card group ${containerStyles.companyCardContainer} ${benchmark.featured_benchmark ? 'border-2' : 'border'} shadow-md hover:shadow-lg transition-all duration-200 overflow-visible`}
      style={{
        ...borderStyle,
        background: brandConfig.name === 'OMG' ? '#ffffff' : '#f9fafb', // Light background for both versions
        transform: isHovered ? 'translateY(-2px)' : 'none'
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
      <div className="flex flex-col h-full relative">
        {benchmark.featured_benchmark && (
          <i 
            className="bi bi-star-fill text-3xl absolute"
            style={{ 
              color: brandConfig.secondaryColor,
              filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
              top: '-12px',
              right: '-8px',
              zIndex: 1 // Ensure star appears above other elements
            }}
            title="Featured Benchmark"
          ></i>
        )}
        <div className="text-center mb-2">
          <h3 
            className="font-semibold text-lg mb-1"
            style={{ 
              fontFamily: brandConfig.name === 'OMG' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'monospace',
              color: isHovered ? brandConfig.primaryColor : 'rgb(31, 41, 55)', // Dark text for both versions
              textShadow: 'none'
            }}
          >
            {benchmark.benchmark_name}
          </h3>
        </div>
        
        <div className="flex-grow text-sm px-2 text-center" style={{ 
          color: brandConfig.name === 'OMG' ? 'rgb(75, 85, 99)' : 'rgb(17, 24, 39)' // Updated to near-black for personal version
        }}>
          {benchmark.benchmark_description || "No description available."}
        </div>
        
        <div className="mt-3 flex justify-between items-center px-2">
          <div className="text-xs font-medium" style={{ 
            color: brandConfig.name === 'OMG' ? 'rgb(107, 114, 128)' : 'rgb(75, 85, 99)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <i className="bi bi-bar-chart-line mr-1" style={{ color: brandConfig.primaryColor }}></i>
            {scoreCount} model{scoreCount !== 1 ? 's' : ''} ranked
          </div>
          
          {benchmark.benchmark_paper && (
            <a 
              href={benchmark.benchmark_paper} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-medium flex items-center transition-all px-2 py-1 rounded"
              style={{ 
                color: 'white',
                backgroundColor: brandConfig.secondaryColor,
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
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