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
    overflowX: needsScrolling ? 'auto' : 'visible'
  };

  // Column width styles for table headers and cells
  const colStyle = {
    width: '20%',
    minWidth: '200px'
  };

  // Generate table rows
  const renderTableRows = () => (
    <>
      {/* Release Date Row */}
      <tr className={tableStyles.rowHover}>
        <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-calendar-date ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Release Date</span>
          </div>
        </td>
        {displayModels.map(model => (
          <td key={model.id} className={tableStyles.cellCenter}>
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
      <tr className={tableStyles.rowHover}>
        <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-box ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Type</span>
          </div>
        </td>
        {displayModels.map(model => (
          <td key={model.id} className={tableStyles.cellCenter}>
            <span className={`capitalize ${textStyles.primary}`}>{model.type || "-"}</span>
          </td>
        ))}
      </tr>
      
      {/* Intelligence Row */}
      {hasAnyModelCapability("intelligence") && (
        <tr className={tableStyles.rowHover}>
          <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-circle-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Intelligence</span>
            </div>
          </td>
          {displayModels.map(model => (
            <td key={model.id} className={tableStyles.cellCenter}>
              {renderRating(model, "intelligence")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Speed Row */}
      {hasAnyModelCapability("speed") && (
        <tr className={tableStyles.rowHover}>
          <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightning-charge-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Speed</span>
            </div>
          </td>
          {displayModels.map(model => (
            <td key={model.id} className={tableStyles.cellCenter}>
              {renderRating(model, "speed")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Reasoning Row */}
      {hasAnyModelCapability("reasoning") && (
        <tr className={tableStyles.rowHover}>
          <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightbulb-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Reasoning</span>
            </div>
          </td>
          {displayModels.map(model => (
            <td key={model.id} className={tableStyles.cellCenter}>
              {renderRating(model, "reasoning")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Reasoning Tokens Row */}
      {hasAnyModelSpec("reasoningTokens") && (
        <tr className={tableStyles.rowHover}>
          <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightbulb ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Reasoning Tokens</span>
            </div>
          </td>
          {displayModels.map(model => (
            <td key={model.id} className={tableStyles.cellCenter}>
              <span className={textStyles.primary}>
                {model.specs?.reasoningTokens !== undefined ? (
                  model.specs.reasoningTokens ? "Yes" : "No"
                ) : "-"}
              </span>
            </td>
          ))}
        </tr>
      )}
      
      {/* Creativity Row */}
      {hasAnyModelCapability("creativity") && (
        <tr className={tableStyles.rowHover}>
          <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-stars ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Creativity</span>
            </div>
          </td>
          {displayModels.map(model => (
            <td key={model.id} className={tableStyles.cellCenter}>
              {renderRating(model, "creativity")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Input Formats Row */}
      {hasAnyModelSpec("inputFormats") && (
        <tr className={tableStyles.rowHover}>
          <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-down-right-square-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Input Formats</span>
            </div>
          </td>
          {displayModels.map(model => (
            <td key={model.id} className={tableStyles.cellCenter}>
              <div className={iconStyles.formatContainer}>
                <i className={`bi bi-file-text-fill ${iconStyles.textLg} ${model.specs?.inputFormats?.includes("text") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Text"></i>
                <i className={`bi bi-mic-fill ${iconStyles.textLg} ${model.specs?.inputFormats?.includes("audio") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Audio"></i>
                <i className={`bi bi-image-fill ${iconStyles.textLg} ${model.specs?.inputFormats?.includes("image") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Image"></i>
                <i className={`bi bi-music-note-beamed ${iconStyles.textLg} ${model.specs?.inputFormats?.includes("music") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Music"></i>
                <i className={`bi bi-camera-video-fill ${iconStyles.textLg} ${model.specs?.inputFormats?.includes("video") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Video"></i>
              </div>
            </td>
          ))}
        </tr>
      )}
      
      {/* Output Formats Row */}
      {hasAnyModelSpec("outputFormats") && (
        <tr className={tableStyles.rowHover}>
          <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-up-right-square-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Output Formats</span>
            </div>
          </td>
          {displayModels.map(model => (
            <td key={model.id} className={tableStyles.cellCenter}>
              <div className={iconStyles.formatContainer}>
                <i className={`bi bi-file-text-fill ${iconStyles.textLg} ${model.specs?.outputFormats?.includes("text") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Text"></i>
                <i className={`bi bi-mic-fill ${iconStyles.textLg} ${model.specs?.outputFormats?.includes("audio") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Audio"></i>
                <i className={`bi bi-image-fill ${iconStyles.textLg} ${model.specs?.outputFormats?.includes("image") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Image"></i>
                <i className={`bi bi-music-note-beamed ${iconStyles.textLg} ${model.specs?.outputFormats?.includes("music") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Music"></i>
                <i className={`bi bi-camera-video-fill ${iconStyles.textLg} ${model.specs?.outputFormats?.includes("video") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Video"></i>
              </div>
            </td>
          ))}
        </tr>
      )}
      
      {/* Max Input Tokens Row */}
      {hasAnyModelSpec("maxInputTokens") && (
        <tr className={tableStyles.rowHover}>
          <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-sign-turn-right-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Max Input</span>
            </div>
          </td>
          {displayModels.map(model => (
            <td key={model.id} className={tableStyles.cellCenter}>
              {model.specs?.maxInputTokens ? (
                <span className={textStyles.primary}>{model.specs.maxInputTokens.toLocaleString()} tokens</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Max Output Tokens Row */}
      {hasAnyModelSpec("maxOutputTokens") && (
        <tr className={tableStyles.rowHover}>
          <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-sign-turn-left-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Max Output</span>
            </div>
          </td>
          {displayModels.map(model => (
            <td key={model.id} className={tableStyles.cellCenter}>
              {model.specs?.maxOutputTokens ? (
                <span className={textStyles.primary}>{model.specs.maxOutputTokens.toLocaleString()} tokens</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Knowledge Cutoff Row */}
      {hasAnyModelSpec("knowledgeCutoff") && (
        <tr className={tableStyles.rowHover}>
          <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-calendar-check-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Knowledge Cutoff</span>
            </div>
          </td>
          {displayModels.map(model => (
            <td key={model.id} className={tableStyles.cellCenter}>
              <span className={textStyles.primary}>{model.specs?.knowledgeCutoff || "-"}</span>
            </td>
          ))}
        </tr>
      )}
    </>
  );

  return (
    <div className={`${containerStyles.flexCol} transform transition-all duration-300`}>
      <div style={tableContainerStyle}>
        <div className={needsScrolling ? "overflow-x-auto" : ""}>
          <table className={`${tableStyles.table} hover:shadow-md transition-all duration-300`}>
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
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Format Icons Legend */}
      <div className={`${containerStyles.legend} transform transition-all duration-500`}>
        <div className={`${containerStyles.legendBox} hover:shadow-md transition-all duration-300 hover:border-gray-300`}>
          <span className={containerStyles.legendLabel}>Legend:</span>
          <div className={containerStyles.legendItems}>
            <div className={containerStyles.legendItem}>
              <i className={`bi bi-file-text-fill ${iconStyles.activeFormat}`}></i>
              <span className={`${textStyles.small} ${textStyles.primary}`}>Text</span>
            </div>
            <div className={containerStyles.legendItem}>
              <i className={`bi bi-mic-fill ${iconStyles.activeFormat}`}></i>
              <span className={`${textStyles.small} ${textStyles.primary}`}>Audio</span>
            </div>
            <div className={containerStyles.legendItem}>
              <i className={`bi bi-image-fill ${iconStyles.activeFormat}`}></i>
              <span className={`${textStyles.small} ${textStyles.primary}`}>Image</span>
            </div>
            <div className={containerStyles.legendItem}>
              <i className={`bi bi-music-note-beamed ${iconStyles.activeFormat}`}></i>
              <span className={`${textStyles.small} ${textStyles.primary}`}>Music</span>
            </div>
            <div className={containerStyles.legendItem}>
              <i className={`bi bi-camera-video-fill ${iconStyles.activeFormat}`}></i>
              <span className={`${textStyles.small} ${textStyles.primary}`}>Video</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTable;