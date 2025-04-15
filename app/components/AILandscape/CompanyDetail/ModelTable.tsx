'use client';

import React from 'react';
import { Model } from '../types';
import { textStyles, tableStyles, iconStyles, containerStyles } from '../utils/styles';

interface ModelTableProps {
  models: Model[];
}

const ModelTable: React.FC<ModelTableProps> = ({ models }) => {
  // Sort models by release date (newest first) and show up to 4 models
  const displayModels = [...models]
    .sort((a, b) => {
      // Convert dates to timestamps for comparison
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      // Sort descending (newest first)
      return dateB - dateA;
    })
    .slice(0, 4);
  
  // Helper to check if any model has a specific capability or spec
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
    if (!model.capabilities || !(type in model.capabilities) || !model.capabilities[type as keyof typeof model.capabilities]) {
      return <span className={textStyles.primary}>-</span>;
    }
    
    const value = model.capabilities[type as keyof typeof model.capabilities] as number;
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
    
    return (
      <div className={iconStyles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={i < value ? `${filledIcon} ${iconStyles.iconSpacing}` : `${icon} ${iconStyles.iconSpacing}`}
          ></i>
        ))}
      </div>
    );
  };
  
  // Calculate table width as a percentage based on number of columns (20% per column)
  const totalColumns = 1 + displayModels.length; // Label column + model columns
  const tableWidthPercent = Math.min(totalColumns * 20, 100); // 20% per column, max 100%
  
  // Determine if we need horizontal scrolling (when more than 5 columns)
  const needsScrolling = totalColumns > 5;
  
  // Table container styling
  const tableContainerStyle = {
    width: `${tableWidthPercent}%`,
    margin: tableWidthPercent < 100 ? '0 auto' : '0', // Center if less than 100% width
    overflowX: needsScrolling ? 'auto' : 'visible' as const
  } as React.CSSProperties;

  // Column width styles for table headers and cells
  const colStyle = {
    width: '20%',
    minWidth: '200px'
  } as React.CSSProperties;

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
        {displayModels.map(model => (
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
        {displayModels.map(model => (
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
          {displayModels.map(model => (
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
          {displayModels.map(model => (
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
          {displayModels.map(model => (
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
          {displayModels.map(model => (
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
          {displayModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <div className={iconStyles.formatContainer}>
                <i className={`bi bi-file-text-fill ${iconStyles.lg} ${model.specs?.inputFormats?.includes("text") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Text"></i>
                <i className={`bi bi-mic-fill ${iconStyles.lg} ${model.specs?.inputFormats?.includes("audio") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Audio"></i>
                <i className={`bi bi-image-fill ${iconStyles.lg} ${model.specs?.inputFormats?.includes("image") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Image"></i>
                <i className={`bi bi-music-note-beamed ${iconStyles.lg} ${model.specs?.inputFormats?.includes("music") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Music"></i>
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
          {displayModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <div className={iconStyles.formatContainer}>
                <i className={`bi bi-file-text-fill ${iconStyles.lg} ${model.specs?.outputFormats?.includes("text") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Text"></i>
                <i className={`bi bi-mic-fill ${iconStyles.lg} ${model.specs?.outputFormats?.includes("audio") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Audio"></i>
                <i className={`bi bi-image-fill ${iconStyles.lg} ${model.specs?.outputFormats?.includes("image") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Image"></i>
                <i className={`bi bi-music-note-beamed ${iconStyles.lg} ${model.specs?.outputFormats?.includes("music") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Music"></i>
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
          {displayModels.map(model => (
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
          {displayModels.map(model => (
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
          {displayModels.map(model => (
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
          {displayModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.pricingInputPerM !== undefined ? (
                <span className={tableStyles.metric}>${model.specs.pricingInputPerM.toFixed(2)}</span>
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
          {displayModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.pricingCachedInputPerM !== undefined ? (
                <span className={tableStyles.metric}>${model.specs.pricingCachedInputPerM.toFixed(2)}</span>
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
          {displayModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.pricingOutputPerM !== undefined ? (
                <span className={tableStyles.metric}>${model.specs.pricingOutputPerM.toFixed(2)}</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Add custom CSS for table hover behavior with cyberpunk styling
  const tableHoverStyles = `
    /* Set consistent background for labels, headers, and legend */
    .sticky-label, thead th, .legend-container {
      background-color: #2d3748; /* Dark blue-gray for labels and headers */
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
  `;

  // Check if we need to show each table section
  const hasContextData = hasAnyModelSpec("maxInputTokens") || hasAnyModelSpec("maxOutputTokens") || hasAnyModelSpec("knowledgeCutoff");
  const hasPricingData = hasAnyModelSpec("pricingInputPerM") || hasAnyModelSpec("pricingCachedInputPerM") || hasAnyModelSpec("pricingOutputPerM");
  
  // Section titles with consistent styling
  const sectionTitle = "text-lg font-semibold text-fuchsia-500 mt-6 mb-2 font-mono";

  // Common table header component
  const TableHeader = () => (
    <thead>
      <tr className={tableStyles.header}>
        <th className={`${tableStyles.headerCell} ${tableStyles.headerFixed}`} 
           style={colStyle}></th>
        {displayModels.map(model => (
          <th key={model.id} className={tableStyles.headerCellCenter} 
             style={colStyle}>
            <div className={tableStyles.modelName}>{model.name}</div>
          </th>
        ))}
      </tr>
    </thead>
  );
  
  return (
    <div className={`${containerStyles.flexCol} transform transition-all duration-300`}>
      <style>{tableHoverStyles}</style>

      {/* Main Capabilities and Formats Table */}
      <div style={tableContainerStyle}>
        <div className={needsScrolling ? tableStyles.comparison : ""}>
          <table className={`${tableStyles.table} hover:shadow-md transition-all duration-300 hover-highlight`}>
            <TableHeader />
            <tbody>
              {renderCapabilitiesRows()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Context Table (Max Input/Output and Knowledge Cutoff) */}
      {hasContextData && (
        <div className="mt-6">
          <h3 className={sectionTitle}>Context & Limits</h3>
          <div style={tableContainerStyle}>
            <div className={needsScrolling ? tableStyles.comparison : ""}>
              <table className={`${tableStyles.table} hover:shadow-md transition-all duration-300 hover-highlight`}>
                <TableHeader />
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
        <div className="mt-6">
          <h3 className={sectionTitle}>
            Pricing
            <span className="text-xs text-gray-400 ml-2 font-normal">(per 1M tokens)</span>
          </h3>
          <div style={tableContainerStyle}>
            <div className={needsScrolling ? tableStyles.comparison : ""}>
              <table className={`${tableStyles.table} hover:shadow-md transition-all duration-300 hover-highlight`}>
                <TableHeader />
                <tbody>
                  {renderPricingRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Format Icons Legend */}
      <div className={`${containerStyles.legend} transform transition-all duration-500 mt-6`}>
        <div className={`${containerStyles.legendBox} hover:shadow-md transition-all duration-300 hover:border-fuchsia-700 legend-container`}>
          <span className={containerStyles.legendLabel}>Legend:</span>
          <div className={containerStyles.legendItems}>
            <div className={containerStyles.legendItem}>
              <i className={`bi bi-file-text-fill ${iconStyles.activeFormat}`}></i>
              <span className={`${textStyles.sm} ${textStyles.primary}`}>Text</span>
            </div>
            <div className={containerStyles.legendItem}>
              <i className={`bi bi-mic-fill ${iconStyles.activeFormat}`}></i>
              <span className={`${textStyles.sm} ${textStyles.primary}`}>Audio</span>
            </div>
            <div className={containerStyles.legendItem}>
              <i className={`bi bi-image-fill ${iconStyles.activeFormat}`}></i>
              <span className={`${textStyles.sm} ${textStyles.primary}`}>Image</span>
            </div>
            <div className={containerStyles.legendItem}>
              <i className={`bi bi-music-note-beamed ${iconStyles.activeFormat}`}></i>
              <span className={`${textStyles.sm} ${textStyles.primary}`}>Music</span>
            </div>
            <div className={containerStyles.legendItem}>
              <i className={`bi bi-camera-video-fill ${iconStyles.activeFormat}`}></i>
              <span className={`${textStyles.sm} ${textStyles.primary}`}>Video</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTable;