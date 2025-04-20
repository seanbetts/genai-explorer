'use client';

import React from 'react';
import { Model } from '../types';
import { textStyles, tableStyles, iconStyles, containerStyles } from '../utils/styles';
import { shouldShowTogetherPricing } from '../utils/modelUtils';

interface ModelTableProps {
  models: Model[];
}

const ModelTable: React.FC<ModelTableProps> = ({ models }) => {
  // Filter out archived models, then sort by status (primary first, then secondary) and then by release date (newest first)
  const displayModels = [...models]
    .filter(model => model.status !== 'archived') // Filter out archived models
    .sort((a, b) => {
      // First sort by status (primary before secondary)
      const statusA = a.status || 'primary'; // Default to primary if not specified
      const statusB = b.status || 'primary'; // Default to primary if not specified
      
      if (statusA !== statusB) {
        // 'primary' should come before 'secondary'
        return statusA === 'primary' ? -1 : 1;
      }
      
      // Then sort by release date (newest first)
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return dateB - dateA;
    });
    
  // State for the current page of models to display
  const [currentPage, setCurrentPage] = React.useState(0);
  const modelsPerPage = 4;
  
  // Calculate total number of pages
  const totalPages = Math.ceil(displayModels.length / modelsPerPage);
  
  // Get models for the current page
  const currentModels = displayModels.slice(
    currentPage * modelsPerPage, 
    (currentPage + 1) * modelsPerPage
  );
  
  // Helper to check if any model has a specific capability or spec - checking all models, not just current page
  const hasAnyModelCapability = (key: string): boolean => {
    return displayModels.some(model => 
      model.capabilities && key in model.capabilities && model.capabilities[key as keyof typeof model.capabilities]
    );
  };
  
  const hasAnyModelSpec = (key: string): boolean => {
    return displayModels.some(model => 
      model.specs && key in model.specs && model.specs[key as keyof typeof model.specs] !== undefined
    );
  };

  // Render the rating indicators (circles, lightning, etc)
  const renderRating = (model: Model, type: string) => {
    // Check if capabilities exist for this model
    if (!model.capabilities || !(type in model.capabilities)) {
      return <span className={textStyles.primary}>-</span>;
    }
    
    const value = model.capabilities[type as keyof typeof model.capabilities] as number;
    
    // Get icons based on the capability type
    let icon = "";
    let filledIcon = "";
    
    switch (type) {
      case "intelligence":
        icon = "bi-circle";
        filledIcon = "bi-circle-fill";
        break;
      case "speed":
        icon = "bi-lightning-charge";
        filledIcon = "bi-lightning-charge-fill";
        break;
      case "reasoning":
        icon = "bi-lightbulb";
        filledIcon = "bi-lightbulb-fill";
        break;
      case "creativity":
        icon = "bi-star";
        filledIcon = "bi-stars";
        break;
      default:
        icon = "bi-circle";
        filledIcon = "bi-circle-fill";
    }
    
    // Always render the icons, even if value is 0
    return (
      <div className={iconStyles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`${i < value ? filledIcon : icon} ${iconStyles.iconSpacing} ${i < value ? iconStyles.activeFormat : iconStyles.inactiveFormat}`}
          ></i>
        ))}
      </div>
    );
  };
  
  // Define a shared ref to control scroll position of all tables
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Function to handle scrolling all tables together
  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    
    // Apply the same scrollLeft to all tables with the scrollContainerRef class
    document.querySelectorAll('.table-scroll-container').forEach((container) => {
      if (container !== e.currentTarget && container instanceof HTMLElement) {
        container.scrollLeft = scrollLeft;
      }
    });
  };
  
  // Function to handle navigation
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Check if we need navigation controls
  const showNavigation = displayModels.length > modelsPerPage;

  // Generate main table rows - Capabilities and Formats
  const renderCapabilitiesRows = () => (
    <>
      {/* Release Date Row */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-calendar-date ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Release Date</span>
          </div>
        </td>
        {currentModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            {model.releaseDate ? (
              new Date(model.releaseDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            ) : "-"}
          </td>
        ))}
      </tr>

      {/* Type Row */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-box ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Type</span>
          </div>
        </td>
        {currentModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            <span className={`capitalize ${textStyles.primary}`}>{model.type || "-"}</span>
          </td>
        ))}
      </tr>
      
      {/* Intelligence Row */}
      {hasAnyModelCapability("intelligence") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-circle-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Intelligence</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "intelligence")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Speed Row */}
      {hasAnyModelCapability("speed") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightning-charge-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Speed</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "speed")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Reasoning Row */}
      {hasAnyModelCapability("reasoning") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightbulb-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Reasoning</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "reasoning")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Reasoning Tokens Row */}
      {hasAnyModelSpec("reasoningTokens") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightbulb ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Reasoning Tokens</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.reasoningTokens !== undefined ? (
                model.specs.reasoningTokens ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}
      
      {/* Input Formats Row */}
      {hasAnyModelSpec("inputFormats") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-up-right-square-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Input Formats</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <div className={iconStyles.formatContainer}>
                <i className={`bi bi-file-text-fill ${iconStyles.lg} ${model.specs?.inputFormats?.includes("text") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Text"></i>
                <i className={`bi bi-mic-fill ${iconStyles.lg} ${model.specs?.inputFormats?.includes("speech") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Speech"></i>
                <i className={`bi bi-image-fill ${iconStyles.lg} ${model.specs?.inputFormats?.includes("image") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Image"></i>
                <i className={`bi bi-music-note-beamed ${iconStyles.lg} ${model.specs?.inputFormats?.includes("audio") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Audio"></i>
                <i className={`bi bi-camera-video-fill ${iconStyles.lg} ${model.specs?.inputFormats?.includes("video") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Video"></i>
              </div>
            </td>
          ))}
        </tr>
      )}
      
      {/* Output Formats Row */}
      {hasAnyModelSpec("outputFormats") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-down-right-square-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Output Formats</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <div className={iconStyles.formatContainer}>
                <i className={`bi bi-file-text-fill ${iconStyles.lg} ${model.specs?.outputFormats?.includes("text") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Text"></i>
                <i className={`bi bi-mic-fill ${iconStyles.lg} ${model.specs?.outputFormats?.includes("speech") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Speech"></i>
                <i className={`bi bi-image-fill ${iconStyles.lg} ${model.specs?.outputFormats?.includes("image") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Image"></i>
                <i className={`bi bi-music-note-beamed ${iconStyles.lg} ${model.specs?.outputFormats?.includes("audio") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Audio"></i>
                <i className={`bi bi-camera-video-fill ${iconStyles.lg} ${model.specs?.outputFormats?.includes("video") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Video"></i>
              </div>
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Generate context table rows - Max Input/Output and Knowledge Cutoff
  const renderContextRows = () => (
    <>
      {/* Max Input Tokens Row */}
      {hasAnyModelSpec("maxInputTokens") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-sign-turn-right-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Max Input</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.maxInputTokens ? (
                <span className={textStyles.primary}>{model.specs.maxInputTokens.toLocaleString()} tokens</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Max Output Tokens Row */}
      {hasAnyModelSpec("maxOutputTokens") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-sign-turn-left-fill ${iconStyles.tableRowIcon} transform rotate-180`}></i> <span className={textStyles.primary}>Max Output</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.maxOutputTokens ? (
                <span className={textStyles.primary}>{model.specs.maxOutputTokens.toLocaleString()} tokens</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Knowledge Cutoff Row */}
      {hasAnyModelSpec("knowledgeCutoff") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-calendar-check-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Knowledge Cutoff</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <span className={textStyles.primary}>{model.specs?.knowledgeCutoff || "-"}</span>
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Generate pricing table rows
  const renderPricingRows = () => (
    <>
      {/* Input Price Row */}
      {hasAnyModelSpec("pricingInputPerM") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-currency-dollar ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Input</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.pricingInputPerM !== undefined && model.specs?.pricingInputPerM !== null ? (
                <span className={shouldShowTogetherPricing(model) ? 'text-cyan-400 font-medium tabular-nums font-mono' : tableStyles.metric}>
                  ${model.specs.pricingInputPerM.toFixed(2)}
                </span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Cached Input Price Row */}
      {hasAnyModelSpec("pricingCachedInputPerM") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-clock-history ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Cached Input</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.pricingCachedInputPerM !== undefined && model.specs?.pricingCachedInputPerM !== null ? (
                <span className={shouldShowTogetherPricing(model) ? 'text-cyan-400 font-medium tabular-nums font-mono' : tableStyles.metric}>
                  ${model.specs.pricingCachedInputPerM.toFixed(2)}
                </span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Output Price Row */}
      {hasAnyModelSpec("pricingOutputPerM") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-cash-stack ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Output</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.pricingOutputPerM !== undefined && model.specs?.pricingOutputPerM !== null ? (
                <span className={shouldShowTogetherPricing(model) ? 'text-cyan-400 font-medium tabular-nums font-mono' : tableStyles.metric}>
                  ${model.specs.pricingOutputPerM.toFixed(2)}
                </span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Add custom CSS for table hover behavior with cyberpunk styling and consistent column widths
  const tableHoverStyles = `
    /* Table layout and scrolling */
    .table-scroll-container {
      overflow-x: auto;
      position: relative;
      scrollbar-width: thin;
      border-radius: 0.5rem;
      border: 0.2px solid #101828;
      margin-bottom: 0.5rem;
    }
    
    .table-wrapper {
      position: relative;
      width: 100%;
    }
    
    .model-table {
      table-layout: fixed;
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
    }
    
    /* Set consistent background for labels, headers, and legend */
    .sticky-label, thead th, .legend-container {
      background-color: #2d3748; /* Dark blue-gray for labels and headers */
    }
    
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
      background-color: #2d3748;
    }
    
    /* Reset any default hover behaviors */
    .hover-highlight tr td, .hover-highlight tr th {
      transition: background-color 0.15s ease-in-out;
    }
    
    /* Simple row hover effect that changes the entire row */
    .hover-highlight tbody tr:hover td {
      background-color: #374151 !important; /* Slightly lighter gray on hover */
      cursor: pointer;
    }
    
    /* Keep sticky label styling consistent on hover */
    .hover-highlight tbody tr:hover td.sticky-label {
      background-color: #374151 !important; /* Match the row hover color */
    }
    
    /* Ensure icons remain visible on hover */
    .hover-highlight tbody tr:hover .text-gray-600.bi {
      color: #4a5568 !important; /* Make inactive icons more visible on hover */
    }
    
    /* Remove hover effect from column headers */
    .hover-highlight thead tr th {
      background-color: #2d3748 !important; /* Keep headers at their normal color */
    }
    
    /* Ensure headers don't show cursor pointer */
    .hover-highlight thead tr th {
      cursor: default;
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
      border-color: #f0abfc; /* fuchsia-400 */
      background-color: #374151;
    }
    
    .pagination-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .pagination-info {
      color: #a0aec0; /* gray-400 */
      font-size: 0.75rem;
      margin: 0 0.25rem;
    }
  `;

  // Check if we need to show each table section
  const hasContextData = hasAnyModelSpec("maxInputTokens") || hasAnyModelSpec("maxOutputTokens") || hasAnyModelSpec("knowledgeCutoff");
  const hasPricingData = hasAnyModelSpec("pricingInputPerM") || hasAnyModelSpec("pricingCachedInputPerM") || hasAnyModelSpec("pricingOutputPerM");
  
  // Section titles with consistent styling
  const sectionTitle = "text-lg font-semibold text-fuchsia-500 mt-6 mb-2 font-mono";

  // Table header component for the main table
  const TableHeader = () => (
    <thead>
      <tr className={tableStyles.header}>
        <th className={`${tableStyles.headerCell} ${tableStyles.headerFixed} sticky-header-corner`} 
           style={{width: '250px', minWidth: '250px'}}>
        </th>
        {currentModels.map(model => (
          <th key={model.id} className={`${tableStyles.headerCellCenter} table-header-cell`}>
            <div className={tableStyles.modelName}>{model.name}</div>
          </th>
        ))}
      </tr>
    </thead>
  );
  
  // Pagination controls
  const PaginationControls = () => {
    if (!showNavigation) return null;
    
    return (
      <div className="pagination-controls">
        <button 
          className="pagination-button"
          onClick={handlePrevPage}
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
          onClick={handleNextPage} 
          disabled={currentPage >= totalPages - 1}
          aria-label="Next page"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    );
  };
  
  return (
    <div className={`${containerStyles.flexCol} transform transition-all duration-300`}>
      <style>{tableHoverStyles}</style>

      <div className="header-area">
        {/* Format Icons Legend (centered) */}
        <div className={`${containerStyles.legend} transform transition-all duration-500 mb-3`}>
          <div className={`${containerStyles.legendBox} hover:shadow-md transition-all duration-300 hover:border-fuchsia-700 legend-container`}>
            <div className={containerStyles.legendItems}>
              <div className={containerStyles.legendItem}>
                <i className={`bi bi-file-text-fill ${iconStyles.activeFormat}`}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Text</span>
              </div>
              <div className={containerStyles.legendItem}>
                <i className={`bi bi-mic-fill ${iconStyles.activeFormat}`}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Speech</span>
              </div>
              <div className={containerStyles.legendItem}>
                <i className={`bi bi-image-fill ${iconStyles.activeFormat}`}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Image</span>
              </div>
              <div className={containerStyles.legendItem}>
                <i className={`bi bi-music-note-beamed ${iconStyles.activeFormat}`}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Audio</span>
              </div>
              <div className={containerStyles.legendItem}>
                <i className={`bi bi-camera-video-fill ${iconStyles.activeFormat}`}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Video</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pagination controls (positioned to the right and vertically centered) */}
        {showNavigation && (
          <div className="absolute top-1/2 right-8 -translate-y-1/2">
            <PaginationControls />
          </div>
        )}
      </div>
      
      {/* Main Capabilities and Formats Table */}
      <div className="mb-6">
        <div className="table-wrapper">
          <div 
            className="table-scroll-container" 
            ref={scrollContainerRef}
            onScroll={handleTableScroll}
          >
            <table
              className={`${tableStyles.table} divide-y divide-gray-700 hover:shadow-md transition-all duration-300 hover-highlight`}
            >
              <TableHeader />
              <tbody>
                {renderCapabilitiesRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Context Table (Max Input/Output and Knowledge Cutoff) */}
      {hasContextData && (
        <div className="mb-6">
          <h3 className={sectionTitle}>Context & Limits</h3>
          <div className="table-wrapper">
            <div 
              className="table-scroll-container" 
              onScroll={handleTableScroll}
            >
              <table
                className={`${tableStyles.table} divide-y divide-gray-700 hover:shadow-md transition-all duration-300 hover-highlight`}
              >
                <tbody>
                  {renderContextRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Table */}
      {hasPricingData && (
        <div className="mb-6">
          <h3 className={sectionTitle}>
            Pricing
            <span className="text-xs text-gray-400 ml-2 font-normal">
              (per 1M tokens direct or on <a 
                href="https://www.together.ai/pricing#inference"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-fuchsia-500 transition-colors"
              >Together.ai</a>)
            </span>
          </h3>
          <div className="table-wrapper">
            <div 
              className="table-scroll-container" 
              onScroll={handleTableScroll}
            >
              <table
                className={`${tableStyles.table} divide-y divide-gray-700 hover:shadow-md transition-all duration-300 hover-highlight`}
              >
                <tbody>
                  {renderPricingRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Resources Table - New table for external links */}
      {displayModels.some(model => model.modelPage || model.releasePost || model.releaseVideo || model.systemCard || model.licenceType || model.huggingFace) && (
        <div className="mb-6">
          <h3 className={sectionTitle}>Resources</h3>
          <div className="table-wrapper">
            <div 
              className="table-scroll-container" 
              onScroll={handleTableScroll}
            >
              <table
                className={`${tableStyles.table} divide-y divide-gray-700 hover:shadow-md transition-all duration-300 hover-highlight`}
              >
                <tbody>
                  {/* Release Post Row */}
                  {displayModels.some(model => model.releasePost) && (
                    <tr className="cursor-pointer">
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
                        <div className={containerStyles.flexCenter}>
                          <i className={`bi bi-newspaper ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Release Post</span>
                        </div>
                      </td>
                      {currentModels.map(model => (
                        <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                          {model.releasePost ? (
                            <a 
                              href={model.releasePost} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1"
                              title="Read release post"
                            >
                              🔗 Link
                            </a>
                          ) : (
                            <span className={textStyles.tertiary}>-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                  
                  {/* Release Video Row */}
                  {displayModels.some(model => model.releaseVideo) && (
                    <tr className="cursor-pointer">
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
                        <div className={containerStyles.flexCenter}>
                          <i className={`bi bi-play-btn ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Release Video</span>
                        </div>
                      </td>
                      {currentModels.map(model => (
                        <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                          {model.releaseVideo ? (
                            <a 
                              href={model.releaseVideo} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1"
                              title="Watch release video"
                            >
                              🔗 Link
                            </a>
                          ) : (
                            <span className={textStyles.tertiary}>-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                  
                  {/* Model Page Row */}
                  {displayModels.some(model => model.modelPage) && (
                    <tr className="cursor-pointer">
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
                        <div className={containerStyles.flexCenter}>
                          <i className={`bi bi-globe2 ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Model Page</span>
                        </div>
                      </td>
                      {currentModels.map(model => (
                        <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                          {model.modelPage ? (
                            <a 
                              href={model.modelPage} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1"
                              title="Visit model page"
                            >
                              🔗 Link
                            </a>
                          ) : (
                            <span className={textStyles.tertiary}>-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                  
                  {/* System Card Row */}
                  {displayModels.some(model => model.systemCard) && (
                    <tr className="cursor-pointer">
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
                        <div className={containerStyles.flexCenter}>
                          <i className={`bi bi-file-earmark-text ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>System Card</span>
                        </div>
                      </td>
                      {currentModels.map(model => (
                        <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                          {model.systemCard ? (
                            <a 
                              href={model.systemCard} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1"
                              title="View system card"
                            >
                              🔗 Link
                            </a>
                          ) : (
                            <span className={textStyles.tertiary}>-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                  
                  {/* Licence Row */}
                  {displayModels.some(model => model.licenceType) && (
                    <tr className="cursor-pointer">
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
                        <div className={containerStyles.flexCenter}>
                          <i className={`bi bi-shield-check ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Licence</span>
                        </div>
                      </td>
                      {currentModels.map(model => (
                        <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                          {model.licenceType ? (
                            <div className="flex items-center justify-center">
                              {model.licenceLink ? (
                                <a 
                                  href={model.licenceLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1"
                                  title={`${model.licenceType} licence details`}
                                >
                                  🔗 {model.licenceType}
                                </a>
                              ) : (
                                <span className="px-3 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded inline-block">
                                  {model.licenceType}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className={textStyles.tertiary}>-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                  
                  {/* Hugging Face Row */}
                  {displayModels.some(model => model.huggingFace) && (
                    <tr className="cursor-pointer">
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
                        <div className={containerStyles.flexCenter}>
                          <span className={iconStyles.tableRowIcon}>🤗</span> <span className={textStyles.primary}>Hugging Face</span>
                        </div>
                      </td>
                      {currentModels.map(model => (
                        <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                          {model.huggingFace ? (
                            <a 
                              href={model.huggingFace} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1"
                              title="View on Hugging Face"
                            >
                              🔗 Link
                            </a>
                          ) : (
                            <span className={textStyles.tertiary}>-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelTable;