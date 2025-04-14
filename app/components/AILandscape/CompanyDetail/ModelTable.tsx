'use client';

import React from 'react';
import { Model } from '../types';

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
      return "-";
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
  
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto w-full">
        <div style={{ 
          width: displayModels.length > 4
            ? `${(displayModels.length + 1) * 200}px` 
            : `${Math.min(100, (displayModels.length + 1) * 20)}%`
        }}>
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b sticky left-0 bg-gray-50" style={{ width: '20%', minWidth: '160px' }}></th>
                {displayModels.map(model => (
                  <th key={model.id} className="py-3 px-4 text-center font-semibold text-gray-700 border-b" style={{ width: '20%', minWidth: '160px' }}>
                    <div className="font-semibold text-gray-900">{model.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Release Date Row */}
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b sticky left-0 bg-white">
                  <div className="flex items-center">
                    <i className="bi bi-calendar-date text-blue-600 mr-2"></i> Release Date
                  </div>
                </td>
                {displayModels.map(model => (
                  <td key={model.id} className="py-3 px-4 border-b text-center">
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
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b sticky left-0 bg-white">
                  <div className="flex items-center">
                    <i className="bi bi-box text-blue-600 mr-2"></i> Type
                  </div>
                </td>
                {displayModels.map(model => (
                  <td key={model.id} className="py-3 px-4 border-b text-center">
                    <span className="capitalize">{model.type || "-"}</span>
                  </td>
                ))}
              </tr>
              
              {/* Intelligence Row */}
              {hasAnyModelCapability("intelligence") && (
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b sticky left-0 bg-white">
                    <div className="flex items-center">
                      <i className="bi bi-circle-fill text-blue-600 mr-2"></i> Intelligence
                    </div>
                  </td>
                  {displayModels.map(model => (
                    <td key={model.id} className="py-3 px-4 border-b text-center">
                      {renderRating(model, "intelligence")}
                    </td>
                  ))}
                </tr>
              )}
              
              {/* Speed Row */}
              {hasAnyModelCapability("speed") && (
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b sticky left-0 bg-white">
                    <div className="flex items-center">
                      <i className="bi bi-lightning-charge-fill text-blue-600 mr-2"></i> Speed
                    </div>
                  </td>
                  {displayModels.map(model => (
                    <td key={model.id} className="py-3 px-4 border-b text-center">
                      {renderRating(model, "speed")}
                    </td>
                  ))}
                </tr>
              )}
              
              {/* Reasoning Row */}
              {hasAnyModelCapability("reasoning") && (
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b sticky left-0 bg-white">
                    <div className="flex items-center">
                      <i className="bi bi-lightbulb-fill text-blue-600 mr-2"></i> Reasoning
                    </div>
                  </td>
                  {displayModels.map(model => (
                    <td key={model.id} className="py-3 px-4 border-b text-center">
                      {renderRating(model, "reasoning")}
                    </td>
                  ))}
                </tr>
              )}
              
              {/* Reasoning Tokens Row */}
              {hasAnyModelSpec("reasoningTokens") && (
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b sticky left-0 bg-white">
                    <div className="flex items-center">
                      <i className="bi bi-lightbulb text-blue-600 mr-2"></i> Reasoning Tokens
                    </div>
                  </td>
                  {displayModels.map(model => (
                    <td key={model.id} className="py-3 px-4 border-b text-center">
                      {model.specs?.reasoningTokens !== undefined ? (
                        model.specs.reasoningTokens ? "Yes" : "No"
                      ) : "-"}
                    </td>
                  ))}
                </tr>
              )}
              
              {/* Creativity Row */}
              {hasAnyModelCapability("creativity") && (
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b sticky left-0 bg-white">
                    <div className="flex items-center">
                      <i className="bi bi-stars text-blue-600 mr-2"></i> Creativity
                    </div>
                  </td>
                  {displayModels.map(model => (
                    <td key={model.id} className="py-3 px-4 border-b text-center">
                      {renderRating(model, "creativity")}
                    </td>
                  ))}
                </tr>
              )}
              
              {/* Input Formats Row */}
              {hasAnyModelSpec("inputFormats") && (
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b sticky left-0 bg-white">
                    <div className="flex items-center">
                      <i className="bi bi-arrow-down-right-square-fill text-blue-600 mr-2"></i> Input Formats
                    </div>
                  </td>
                  {displayModels.map(model => (
                    <td key={model.id} className="py-3 px-4 border-b text-center">
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
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b sticky left-0 bg-white">
                    <div className="flex items-center">
                      <i className="bi bi-arrow-up-right-square-fill text-blue-600 mr-2"></i> Output Formats
                    </div>
                  </td>
                  {displayModels.map(model => (
                    <td key={model.id} className="py-3 px-4 border-b text-center">
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
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b sticky left-0 bg-white">
                    <div className="flex items-center">
                      <i className="bi bi-sign-turn-right-fill text-blue-600 mr-2"></i> Max Input
                    </div>
                  </td>
                  {displayModels.map(model => (
                    <td key={model.id} className="py-3 px-4 border-b text-center">
                      {model.specs?.maxInputTokens ? (
                        <span>{model.specs.maxInputTokens.toLocaleString()} tokens</span>
                      ) : "-"}
                    </td>
                  ))}
                </tr>
              )}

              {/* Max Output Tokens Row */}
              {hasAnyModelSpec("maxOutputTokens") && (
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b sticky left-0 bg-white">
                    <div className="flex items-center">
                      <i className="bi bi-sign-turn-left-fill text-blue-600 mr-2"></i> Max Output
                    </div>
                  </td>
                  {displayModels.map(model => (
                    <td key={model.id} className="py-3 px-4 border-b text-center">
                      {model.specs?.maxOutputTokens ? (
                        <span>{model.specs.maxOutputTokens.toLocaleString()} tokens</span>
                      ) : "-"}
                    </td>
                  ))}
                </tr>
              )}

              {/* Knowledge Cutoff Row */}
              {hasAnyModelSpec("knowledgeCutoff") && (
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b sticky left-0 bg-white">
                    <div className="flex items-center">
                      <i className="bi bi-calendar-check-fill text-blue-600 mr-2"></i> Knowledge Cutoff
                    </div>
                  </td>
                  {displayModels.map(model => (
                    <td key={model.id} className="py-3 px-4 border-b text-center">
                      {model.specs?.knowledgeCutoff || "-"}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Format Icons Legend */}
      <div className="mt-4 max-w-lg mx-auto">
        <div className="flex gap-5 items-center justify-center bg-gray-50 p-3 rounded-lg flex-wrap">
          <span className="text-sm text-gray-600">Legend:</span>
          <div className="flex items-center">
            <i className="bi bi-file-text-fill text-blue-600 mr-1"></i>
            <span className="text-sm">Text</span>
          </div>
          <div className="flex items-center">
            <i className="bi bi-mic-fill text-blue-600 mr-1"></i>
            <span className="text-sm">Audio</span>
          </div>
          <div className="flex items-center">
            <i className="bi bi-image-fill text-blue-600 mr-1"></i>
            <span className="text-sm">Image</span>
          </div>
          <div className="flex items-center">
            <i className="bi bi-music-note-beamed text-blue-600 mr-1"></i>
            <span className="text-sm">Music</span>
          </div>
          <div className="flex items-center">
            <i className="bi bi-camera-video-fill text-blue-600 mr-1"></i>
            <span className="text-sm">Video</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTable;