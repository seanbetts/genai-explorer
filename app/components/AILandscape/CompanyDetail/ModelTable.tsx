'use client';

import React from 'react';
import { Model } from '../types';
import { textStyles, tableStyles, iconStyles } from '../utils/styles';

interface ModelTableProps {
  models: Model[];
}

const ModelTable: React.FC<ModelTableProps> = ({ models }) => {
  // We'll show up to 4 models
  const displayModels = models.slice(0, 4);
  
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
      <div className="flex items-center justify-center text-blue-600">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={i < value ? `${filledIcon} mx-0.5` : `${icon} mx-0.5`}
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

  // Generate table rows
  const renderTableRows = () => (
    <>
      {/* Release Date Row */}
      <tr className={tableStyles.rowHover}>
        <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
          <div className="flex items-center">
            <i className={`bi bi-calendar-date ${iconStyles.base}`}></i> <span className={textStyles.primary}>Release Date</span>
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
          <div className="flex items-center">
            <i className={`bi bi-box ${iconStyles.base}`}></i> <span className={textStyles.primary}>Type</span>
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
            <div className="flex items-center">
              <i className={`bi bi-circle-fill ${iconStyles.base}`}></i> <span className={textStyles.primary}>Intelligence</span>
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
            <div className="flex items-center">
              <i className={`bi bi-lightning-charge-fill ${iconStyles.base}`}></i> <span className={textStyles.primary}>Speed</span>
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
            <div className="flex items-center">
              <i className={`bi bi-lightbulb-fill ${iconStyles.base}`}></i> <span className={textStyles.primary}>Reasoning</span>
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
            <div className="flex items-center">
              <i className={`bi bi-lightbulb ${iconStyles.base}`}></i> <span className={textStyles.primary}>Reasoning Tokens</span>
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
            <div className="flex items-center">
              <i className={`bi bi-stars ${iconStyles.base}`}></i> <span className={textStyles.primary}>Creativity</span>
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
            <div className="flex items-center">
              <i className={`bi bi-arrow-down-right-square-fill ${iconStyles.base}`}></i> <span className={textStyles.primary}>Input Formats</span>
            </div>
          </td>
          {displayModels.map(model => (
            <td key={model.id} className={tableStyles.cellCenter}>
              <div className="flex gap-3 justify-center">
                <i className={`bi bi-file-text-fill text-lg ${model.specs?.inputFormats?.includes("text") ? "text-blue-600" : "text-gray-300"}`} title="Text"></i>
                <i className={`bi bi-mic-fill text-lg ${model.specs?.inputFormats?.includes("audio") ? "text-blue-600" : "text-gray-300"}`} title="Audio"></i>
                <i className={`bi bi-image-fill text-lg ${model.specs?.inputFormats?.includes("image") ? "text-blue-600" : "text-gray-300"}`} title="Image"></i>
                <i className={`bi bi-music-note-beamed text-lg ${model.specs?.inputFormats?.includes("music") ? "text-blue-600" : "text-gray-300"}`} title="Music"></i>
                <i className={`bi bi-camera-video-fill text-lg ${model.specs?.inputFormats?.includes("video") ? "text-blue-600" : "text-gray-300"}`} title="Video"></i>
              </div>
            </td>
          ))}
        </tr>
      )}
      
      {/* Output Formats Row */}
      {hasAnyModelSpec("outputFormats") && (
        <tr className={tableStyles.rowHover}>
          <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
            <div className="flex items-center">
              <i className={`bi bi-arrow-up-right-square-fill ${iconStyles.base}`}></i> <span className={textStyles.primary}>Output Formats</span>
            </div>
          </td>
          {displayModels.map(model => (
            <td key={model.id} className={tableStyles.cellCenter}>
              <div className="flex gap-3 justify-center">
                <i className={`bi bi-file-text-fill text-lg ${model.specs?.outputFormats?.includes("text") ? "text-blue-600" : "text-gray-300"}`} title="Text"></i>
                <i className={`bi bi-mic-fill text-lg ${model.specs?.outputFormats?.includes("audio") ? "text-blue-600" : "text-gray-300"}`} title="Audio"></i>
                <i className={`bi bi-image-fill text-lg ${model.specs?.outputFormats?.includes("image") ? "text-blue-600" : "text-gray-300"}`} title="Image"></i>
                <i className={`bi bi-music-note-beamed text-lg ${model.specs?.outputFormats?.includes("music") ? "text-blue-600" : "text-gray-300"}`} title="Music"></i>
                <i className={`bi bi-camera-video-fill text-lg ${model.specs?.outputFormats?.includes("video") ? "text-blue-600" : "text-gray-300"}`} title="Video"></i>
              </div>
            </td>
          ))}
        </tr>
      )}
      
      {/* Max Input Tokens Row */}
      {hasAnyModelSpec("maxInputTokens") && (
        <tr className={tableStyles.rowHover}>
          <td className={`${tableStyles.cell} ${tableStyles.stickyCell}`}>
            <div className="flex items-center">
              <i className={`bi bi-sign-turn-right-fill ${iconStyles.base}`}></i> <span className={textStyles.primary}>Max Input</span>
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
            <div className="flex items-center">
              <i className={`bi bi-sign-turn-left-fill ${iconStyles.base}`}></i> <span className={textStyles.primary}>Max Output</span>
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
            <div className="flex items-center">
              <i className={`bi bi-calendar-check-fill ${iconStyles.base}`}></i> <span className={textStyles.primary}>Knowledge Cutoff</span>
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
    <div className="flex flex-col">
      <div style={tableContainerStyle}>
        <div className={needsScrolling ? "overflow-x-auto" : ""}>
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className={`${tableStyles.headerCell} sticky left-0 bg-gray-50`} 
                   style={{ width: '20%', minWidth: '200px' }}></th>
                {displayModels.map(model => (
                  <th key={model.id} className={tableStyles.headerCellCenter} 
                     style={{ width: '20%', minWidth: '200px' }}>
                    <div className="font-semibold text-gray-900">{model.name}</div>
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
      <div className="mt-4 max-w-lg mx-auto">
        <div className="flex gap-5 items-center justify-center bg-gray-50 p-3 rounded-lg flex-wrap">
          <span className={`text-sm ${textStyles.secondary}`}>Legend:</span>
          <div className="flex items-center">
            <i className="bi bi-file-text-fill text-blue-600 mr-1"></i>
            <span className={`text-sm ${textStyles.primary}`}>Text</span>
          </div>
          <div className="flex items-center">
            <i className="bi bi-mic-fill text-blue-600 mr-1"></i>
            <span className={`text-sm ${textStyles.primary}`}>Audio</span>
          </div>
          <div className="flex items-center">
            <i className="bi bi-image-fill text-blue-600 mr-1"></i>
            <span className={`text-sm ${textStyles.primary}`}>Image</span>
          </div>
          <div className="flex items-center">
            <i className="bi bi-music-note-beamed text-blue-600 mr-1"></i>
            <span className={`text-sm ${textStyles.primary}`}>Music</span>
          </div>
          <div className="flex items-center">
            <i className="bi bi-camera-video-fill text-blue-600 mr-1"></i>
            <span className={`text-sm ${textStyles.primary}`}>Video</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTable;