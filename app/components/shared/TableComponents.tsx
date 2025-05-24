'use client';

import React from 'react';
import { textStyles } from '../utils/theme';
import { tableStyles, containerStyles } from '../utils/layout';
import brandConfig from '../../config/brand';

// Shared table component for consistent table layout across different table types
interface SharedTableProps {
  children: React.ReactNode;
  className?: string;
}

export const SharedTable: React.FC<SharedTableProps> = ({ children, className = '' }) => {
  return (
    <div className="table-wrapper">
      <div 
        className={`table-scroll-container ${className}`}
        onScroll={handleTableScroll}
      >
        <table
          className={`${tableStyles.table} divide-y divide-gray-700 hover:shadow-md transition-all duration-300 hover-highlight table-fixed`}
        >
          {children}
        </table>
      </div>
    </div>
  );
};

// Legend component for format icons and other indicators
interface LegendProps {
  items: {
    icon: React.ReactNode;
    label: string;
  }[];
}

export const Legend: React.FC<LegendProps> = ({ items }) => {
  return (
    <div className="flex justify-center w-full my-2">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 px-4 legend-container">
        <div className="flex flex-wrap justify-center gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 py-1">
              {item.icon}
              <span className="text-sm text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Reusable table header component with consistent sizing and styling
interface TableHeaderProps {
  items: { 
    id: string; 
    name: string; 
    description?: string;
    releaseDate?: string;
    onRemove?: () => void; // Optional remove handler for comparison view
  }[];
  cornerContent?: React.ReactNode;
  showReleaseDates?: boolean; // Control whether to show release dates
}

export const TableHeader: React.FC<TableHeaderProps> = ({ 
  items, 
  cornerContent,
  showReleaseDates = false // Default to not showing release dates
}) => {
  const columnWidth = items.length > 0 ? `${100 / items.length}%` : 'auto';
  
  return (
    <thead>
      <tr className={tableStyles.header}>
        <th className={`${tableStyles.headerCell} ${tableStyles.headerFixed} sticky-header-corner`} 
            style={{width: '300px', minWidth: '300px'}}>
          {cornerContent}
        </th>
        {items.map(item => (
          <th 
            key={item.id} 
            className={`${tableStyles.headerCellCenter} table-header-cell relative`}
            style={{width: columnWidth}}
            title={item.description}
          >
            {showReleaseDates ? (
              <div className="flex flex-col items-center justify-between h-16 py-0">
                <div className="flex items-center mt-0">
                  <div className={`text-center`} style={{ color: brandConfig.secondaryColor }}>{item.name}</div>
                </div>
                <div className="text-xs text-gray-400 font-normal">
                  {item.releaseDate 
                    ? new Date(item.releaseDate).toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric'
                      })
                    : '-'
                  }
                </div>
              </div>
            ) : (
              <div className="group pr-6">
                <div className={`text-center`} style={{ color: brandConfig.secondaryColor }}>{item.name}</div>
                {item.description && (
                  <div className="text-xs text-gray-400 text-center mt-0.5">
                    {item.description}
                  </div>
                )}
              </div>
            )}
            {/* Remove button - always visible if onRemove is provided - positioned relative to th */}
            {item.onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.onRemove?.();
                }}
                className="absolute top-2 right-2 h-5 w-5 flex items-center justify-center bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-full text-fuchsia-500 hover:text-fuchsia-400 z-20 cursor-pointer"
                aria-label={`Remove ${item.name} from comparison`}
                title={`Remove ${item.name} from comparison`}
              >
                <i className="bi bi-x text-xs"></i>
              </button>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

// Reusable column group component for consistent column widths
interface TableColGroupProps {
  items: { id: string }[];
}

export const TableColGroup: React.FC<TableColGroupProps> = ({ items }) => {
  const columnWidth = items.length > 0 ? `${100 / items.length}%` : 'auto';
  return (
    <colgroup>
      <col style={{width: '300px'}} />
      {items.map((item, index) => (
        <col key={`col-${item.id}`} style={{width: columnWidth}} />
      ))}
    </colgroup>
  );
};

// Pagination controls component
interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  showNavigation?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({ 
  currentPage, 
  totalPages, 
  onNextPage, 
  onPrevPage,
  showNavigation = true
}) => {
  if (!showNavigation) return null;
  
  return (
    <div className="pagination-controls">
      <button 
        className="pagination-button"
        onClick={onPrevPage}
        disabled={currentPage === 0}
        aria-label="Previous page"
      >
        <i className="bi bi-chevron-left"></i>
      </button>
      <span className="pagination-info">
        {currentPage + 1} / {totalPages}
      </span>
      <button 
        className="pagination-button"
        onClick={onNextPage} 
        disabled={currentPage >= totalPages - 1}
        aria-label="Next page"
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
};

// Section title component for consistent section headings
interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  return (
    <h3 className={`text-lg font-semibold mt-6 mb-2 ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'}`} style={{ color: brandConfig.secondaryColor }}>
      {children}
    </h3>
  );
};

// Function to handle synchronous scrolling of all tables
export const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const scrollLeft = e.currentTarget.scrollLeft;
  
  // Apply the same scrollLeft to all tables with the scrollContainerRef class
  document.querySelectorAll('.table-scroll-container').forEach((container) => {
    if (container !== e.currentTarget && container instanceof HTMLElement) {
      container.scrollLeft = scrollLeft;
    }
  });
};

// Shared styling for tables
export const tableHoverStyles = `
  /* Define brand colors as CSS variables for use in the styles */
  :root {
    --brand-primary: ${brandConfig.primaryColor};
    --brand-secondary: ${brandConfig.secondaryColor};
  }
  /* Table layout and scrolling */
  .table-scroll-container {
    overflow-x: auto;
    position: relative;
    scrollbar-width: thin;
    border-radius: 0.5rem;
    border: 1px solid #101828; /* Original border color */
    margin-bottom: 0.5rem;
  }
  
  .table-wrapper {
    position: relative;
    width: 100%;
  }
  
  .model-table, .table-fixed {
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
  }
  
  /* Set brand-specific background for labels, headers, and legend */
  .sticky-label, thead th {
    background-color: ${brandConfig.name === 'OMG' ? 'white' : '#2d3748'}; /* White for OMG, dark blue-gray for Blueprint */
  }
  
  /* Brand-specific legend background */
  .legend-container {
    background-color: ${brandConfig.name === 'OMG' ? 'white' : '#2d3748'}; /* White for OMG, dark blue-gray for Blueprint */
  }
  
  /* For OMG theme, legend uses white background (added via jsx classes) */
  /* This is overridden in ModelTable.tsx with containerStyles.legendBox for OMG */
  
  /* Make first column sticky */
  .sticky-label {
    position: sticky;
    left: 0;
    z-index: 10;
    width: 250px;
    background-color: #2d3748;
    box-shadow: 4px 0 4px -2px rgba(0, 0, 0, 0.3);
  }
  
  /* Make header sticky */
  .table-header-cell {
    position: sticky;
    top: 0;
    z-index: 9;
  }
  
  /* Sticky header corner cell (top left) */
  .sticky-header-corner {
    position: sticky;
    left: 0;
    z-index: 11;
    background-color: ${brandConfig.name === 'OMG' ? 'white' : '#2d3748'};
  }
  
  /* Reset any default hover behaviors */
  .hover-highlight tr td, .hover-highlight tr th {
    transition: background-color 0.15s ease-in-out;
  }
  
  /* Simple row hover effect that changes the entire row */
  .hover-highlight tbody tr:hover td {
    background-color: ${brandConfig.name === 'OMG' ? '#F3F4F6' : '#374151'} !important; /* Brand-specific hover color */
    cursor: pointer;
  }
  
  /* Keep sticky label styling consistent on hover */
  .hover-highlight tbody tr:hover td.sticky-label {
    background-color: ${brandConfig.name === 'OMG' ? '#F3F4F6' : '#374151'} !important; /* Match the row hover color with brand-specific shade */
  }
  
  /* Ensure icons remain visible on hover */
  .hover-highlight tbody tr:hover .text-gray-600.bi {
    color: #4a5568 !important; /* Make inactive icons more visible on hover */
  }
  
  /* Remove hover effect from column headers */
  .hover-highlight thead tr th {
    background-color: ${brandConfig.name === 'OMG' ? 'white' : '#2d3748'} !important; /* Keep headers at their brand-specific color */
  }
  
  /* Ensure headers don't show cursor pointer */
  .hover-highlight thead tr th {
    cursor: default;
  }
  
  /* Remove border from the last row of each table */
  .hover-highlight tbody tr:last-child td {
    border-bottom: none !important;
  }
  
  /* Also ensure the border stays removed on hover */
  .hover-highlight tbody tr:last-child:hover td {
    border-bottom: none !important;
  }
  
  /* Header area with legend and pagination */
  .header-area {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    width: 100%;
    position: relative;
  }
  
  /* Pagination controls */
  .pagination-controls {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.25rem;
  }
  
  .pagination-button {
    background-color: #2d3748;
    color: white;
    border: 1px solid #4a5568;
    border-radius: 0.375rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
  }
  
  .pagination-button:hover:not(:disabled) {
    border-color: ${brandConfig.secondaryColor}; /* secondary brand color */
    background-color: ${brandConfig.name === 'OMG' ? '#f8fafc' : '#374151'};
  }
  
  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-info {
    color: ${brandConfig.primaryColor}; /* Use brand primary color */
    font-size: 0.75rem;
    margin: 0 0.25rem;
    font-weight: 600;
  }
`;

// Create score visualization components
interface ScoreBarProps {
  score: number;
  maxScore?: number;
  colorScale?: 'green-red' | 'blue-purple';
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ 
  score, 
  maxScore = 100, 
  colorScale = 'blue-purple' 
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  
  // Determine color based on percentage and colorScale
  let barColor = '';
  if (colorScale === 'green-red') {
    if (percentage >= 80) barColor = 'bg-green-500';
    else if (percentage >= 60) barColor = 'bg-green-400';
    else if (percentage >= 40) barColor = 'bg-yellow-400';
    else if (percentage >= 20) barColor = 'bg-orange-400';
    else barColor = 'bg-red-500';
  } else {
    if (percentage >= 80) barColor = 'bg-fuchsia-500';
    else if (percentage >= 60) barColor = 'bg-fuchsia-400';
    else if (percentage >= 40) barColor = 'bg-blue-400';
    else if (percentage >= 20) barColor = 'bg-blue-500';
    else barColor = 'bg-gray-600';
  }
  
  return (
    <div className="w-full h-4 bg-gray-700 rounded overflow-hidden">
      <div 
        className={`h-full ${barColor} transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

interface RankIndicatorProps {
  rank: number;
  total: number;
}

export const RankIndicator: React.FC<RankIndicatorProps> = ({ rank, total }) => {
  // Determine badge color based on ranking
  let badgeColor = '';
  let textColor = 'text-white';
  
  if (rank === 1) {
    badgeColor = 'bg-yellow-500'; // Gold for 1st
  } else if (rank === 2) {
    badgeColor = 'bg-gray-400'; // Silver for 2nd
  } else if (rank === 3) {
    badgeColor = 'bg-yellow-700'; // Bronze for 3rd
  } else if (rank <= total * 0.2) {
    badgeColor = 'bg-green-600'; // Top 20%
  } else if (rank <= total * 0.5) {
    badgeColor = 'bg-blue-600'; // Top 50%
  } else {
    badgeColor = 'bg-gray-600'; // Bottom 50%
  }
  
  return (
    <div className={`px-2 py-1 rounded inline-flex items-center justify-center ${badgeColor} ${textColor} font-mono text-xs font-medium`}>
      {rank === 1 && <span className="mr-1">🥇</span>}
      {rank === 2 && <span className="mr-1">🥈</span>}
      {rank === 3 && <span className="mr-1">🥉</span>}
      {rank} of {total}
    </div>
  );
};

interface ScoreChangeProps {
  currentScore: number;
  previousScore: number;
}

export const ScoreChange: React.FC<ScoreChangeProps> = ({ currentScore, previousScore }) => {
  const difference = currentScore - previousScore;
  const percentChange = (difference / previousScore) * 100;
  
  // Determine color based on whether it improved or not
  const changeColor = difference > 0 ? 'text-green-400' : difference < 0 ? 'text-red-400' : 'text-gray-400';
  const changeIcon = difference > 0 ? 'bi-arrow-up-right' : difference < 0 ? 'bi-arrow-down-right' : 'bi-dash';
  
  return (
    <div className="flex items-center justify-center">
      <span className={`${changeColor} font-mono text-xs flex items-center`}>
        <i className={`bi ${changeIcon} mr-1`}></i>
        {Math.abs(percentChange).toFixed(1)}%
      </span>
    </div>
  );
};