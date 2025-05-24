'use client';

import React from 'react';
import { Model } from '../types';
import { containerStyles, tableStyles, iconStyles } from '../utils/layout';
import { textStyles } from '../utils/theme';
import { 
  SharedTable, 
  TableHeader, 
  TableColGroup,
  SectionTitle
} from '../shared/TableComponents';

interface ImageModelTableProps {
  selectedModels: Model[];
  onModelRemove: (modelId: string) => void;
  clearAllButton: React.ReactNode;
}

const ImageModelTable: React.FC<ImageModelTableProps> = ({ selectedModels, onModelRemove, clearAllButton }) => {
  

  const hasAnyModelFeature = (category: string, key: string): boolean => {
    return selectedModels.some(model => 
      model.features && 
      model.features[category as keyof typeof model.features] && 
      key in (model.features[category as keyof typeof model.features] as any)
    );
  };

  const hasAnyAspectRatio = (): boolean => {
    return selectedModels.some(model => model.aspectRatios && Object.keys(model.aspectRatios).length > 0);
  };

  const hasAnySafetyFeature = (): boolean => {
    return selectedModels.some(model => model.safety && Object.keys(model.safety).length > 0);
  };

  const hasAnyEnhancementFeature = (): boolean => {
    return selectedModels.some(model => model.features?.enhancement && Object.keys(model.features.enhancement).length > 0);
  };

  const hasAnyEditingFeature = (): boolean => {
    return selectedModels.some(model => model.features?.editing && Object.keys(model.features.editing).length > 0);
  };

  const hasAnyResourceData = (): boolean => {
    return selectedModels.some(model => 
      model.modelPage || model.releasePost || model.releaseVideo || model.systemCard || model.huggingFace || model.termsOfService || model.usagePolicy
    );
  };

  const hasAnyAdvancedFeature = (): boolean => {
    return selectedModels.some(model => model.features?.advanced && Object.keys(model.features.advanced).length > 0);
  };

  // Format model items for header
  const headerItems = selectedModels.map(model => ({
    id: model.id,
    name: model.name,
    description: model.companyName,
    onRemove: () => onModelRemove(model.id)
  }));

  // Render basic model info
  const renderBasicRows = () => (
    <>
      {/* Release Date */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-calendar-date ${iconStyles.tableRowIcon}`}></i> 
            <span className={textStyles.primary}>Release Date</span>
          </div>
        </td>
        {selectedModels.map(model => (
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

      {/* Commercial Use */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-briefcase ${iconStyles.tableRowIcon}`}></i> 
            <span className={textStyles.primary}>Commercial Use</span>
          </div>
        </td>
        {selectedModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            {model.commerciallySafe !== undefined ? (
              model.commerciallySafe ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>
            ) : <span className={textStyles.primary}>-</span>}
          </td>
        ))}
      </tr>

      {/* API Available */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-cloud ${iconStyles.tableRowIcon}`}></i> 
            <span className={textStyles.primary}>API Available</span>
          </div>
        </td>
        {selectedModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            {model.apiEndpoints?.available !== undefined ? (
              model.apiEndpoints.available ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>
            ) : <span className={textStyles.primary}>-</span>}
          </td>
        ))}
      </tr>
    </>
  );

  // Render generation features
  const renderGenerationRows = () => (
    <>
      {/* Text to Image */}
      {hasAnyModelFeature('generation', 'textToImage') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-type ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Text-to-Image</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.textToImage ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Image to Image */}
      {hasAnyModelFeature('generation', 'imageToImage') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-repeat ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Image-to-Image</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.imageToImage ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Inpainting */}
      {hasAnyModelFeature('generation', 'inpainting') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-brush ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Inpainting</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.inpainting ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Outpainting */}
      {hasAnyModelFeature('generation', 'outpainting') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrows-expand ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Outpainting</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.outpainting ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

    </>
  );

  // Render editing features
  const renderEditingRows = () => {
    if (!hasAnyEditingFeature()) return null;

    const allEditingFeatures = Array.from(new Set(
      selectedModels.flatMap(model => 
        model.features?.editing ? Object.keys(model.features.editing) : []
      )
    )).sort();

    return (
      <>
        {allEditingFeatures.map(feature => (
          <tr key={feature} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-pencil-square ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>{feature.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase())}</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.features?.editing?.[feature] ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>}
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  };

  // Render enhancement features
  const renderEnhancementRows = () => {
    if (!hasAnyEnhancementFeature()) return null;

    const allEnhancements = Array.from(new Set(
      selectedModels.flatMap(model => 
        model.features?.enhancement ? Object.keys(model.features.enhancement) : []
      )
    )).sort();

    return (
      <>
        {allEnhancements.map(enhancement => (
          <tr key={enhancement} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-magic ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>{enhancement.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase())}</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.features?.enhancement?.[enhancement] ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>}
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  };

  // Helper function to create aspect ratio SVG
  const createAspectRatioSVG = (ratio: string, supported: boolean) => {
    // Extract exact aspect ratio from the label
    let width = 4, height = 3; // Default to 4:3
    
    // Extract the ratio values from parentheses, e.g. "(4:3)" -> [4, 3]
    const ratioMatch = ratio.match(/\((\d+):(\d+)\)/);
    if (ratioMatch && ratioMatch.length === 3) {
      width = parseInt(ratioMatch[1], 10);
      height = parseInt(ratioMatch[2], 10);
    } else {
      // Fallback to predefined values if regex fails
      if (ratio.includes('(4:3)')) {
        width = 4; height = 3; // Landscape
      } else if (ratio.includes('(3:4)')) {
        width = 3; height = 4; // Portrait
      } else if (ratio.includes('(1:1)')) {
        width = 1; height = 1; // Square
      } else if (ratio.includes('(16:9)')) {
        width = 16; height = 9; // Widescreen
      } else if (ratio.includes('(9:16)')) {
        width = 9; height = 16; // Vertical
      }
    }
    
    // Normalize to fit within our display box with padding
    const viewBoxWidth = 16; 
    const viewBoxHeight = 10;
    const padding = 1.5; // Add padding on all sides
    
    const availableWidth = viewBoxWidth - (padding * 2);
    const availableHeight = viewBoxHeight - (padding * 2);
    
    // Determine which dimension (width or height) is the limiting factor
    const widthRatio = availableWidth / width;
    const heightRatio = availableHeight / height;
    const scale = Math.min(widthRatio, heightRatio);
    
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    
    // Calculate position to center the shape
    const offsetX = (viewBoxWidth - scaledWidth) / 2;
    const offsetY = (viewBoxHeight - scaledHeight) / 2;
    
    return (
      <div className={`w-12 h-8 relative rounded border ${
        supported ? 'border-cyan-400' : 'border-gray-600 opacity-50'
      }`}>
        <div className="absolute inset-0 rounded bg-gray-700 flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 16 10">
            <rect
              x={offsetX}
              y={offsetY}
              width={scaledWidth}
              height={scaledHeight}
              fill={supported ? "#D946EF" : "#6B7280"}
              stroke={supported ? "#F5D0FE" : "#4B5563"}
              strokeWidth="0.3"
              rx="0.3"
            />
          </svg>
        </div>
      </div>
    );
  };

  // Render aspect ratios
  const renderAspectRatioRows = () => {
    if (!hasAnyAspectRatio()) return null;

    const allRatios = Array.from(new Set(
      selectedModels.flatMap(model => 
        model.aspectRatios ? Object.keys(model.aspectRatios) : []
      )
    )).sort();

    return (
      <>
        {allRatios.map(ratio => (
          <tr key={ratio} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-aspect-ratio ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>{ratio.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase())}</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                <div className="flex justify-center">
                  {createAspectRatioSVG(ratio, model.aspectRatios?.[ratio] || false)}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  };

  // Render resources rows
  const renderResourcesRows = () => {
    if (!hasAnyResourceData()) return null;
    
    return (
      <>
        {/* Release Post */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-newspaper ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Release Post</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.releasePost ? (
                <a 
                  href={model.releasePost} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs"
                >
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* Release Video */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-play-circle ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Release Video</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.releaseVideo ? (
                <a 
                  href={model.releaseVideo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs"
                >
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* Model Page */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-globe ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Model Page</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.modelPage ? (
                <a 
                  href={model.modelPage} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs"
                >
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* System Card */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-file-text ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>System Card</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.systemCard ? (
                <a 
                  href={model.systemCard} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs"
                >
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* Terms of Service */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-file-earmark-text ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Terms of Service</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.termsOfService ? (
                <a 
                  href={model.termsOfService} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs"
                >
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* Usage Policy */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-file-earmark-check ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Usage Policy</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.usagePolicy ? (
                <a 
                  href={model.usagePolicy} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs"
                >
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

      </>
    );
  };

  // Render advanced features
  const renderAdvancedRows = () => {
    if (!hasAnyAdvancedFeature()) return null;

    const allAdvancedFeatures = Array.from(new Set(
      selectedModels.flatMap(model => 
        model.features?.advanced ? Object.keys(model.features.advanced) : []
      )
    )).sort();

    return (
      <>
        {allAdvancedFeatures.map(feature => (
          <tr key={feature} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-gear ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>{feature.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase())}</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {(() => {
                  const value = model.features?.advanced?.[feature];
                  
                  // Handle cameraControls object specially
                  if (feature === 'cameraControls' && typeof value === 'object') {
                    const hasControls = value && Object.keys(value).length > 0;
                    return hasControls ? 
                      <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                      <i className={iconStyles.booleanFalse} title="No"></i>;
                  }
                  
                  // Handle boolean values
                  if (typeof value === 'boolean') {
                    return value ? 
                      <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                      <i className={iconStyles.booleanFalse} title="No"></i>;
                  }
                  
                  // Fallback for undefined/null
                  return <i className={iconStyles.booleanFalse} title="No"></i>;
                })()}
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  };

  // Render safety features
  const renderSafetyRows = () => {
    if (!hasAnySafetyFeature()) return null;

    const allSafetyFeatures = Array.from(new Set(
      selectedModels.flatMap(model => 
        model.safety ? Object.keys(model.safety) : []
      )
    )).sort();

    return (
      <>
        {allSafetyFeatures.map(feature => (
          <tr key={feature} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-shield-check ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>{feature.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase())}</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.safety?.[feature] ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>}
              </td>
            ))}
          </tr>
        ))}
        
        {/* Metadata */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-info-circle ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Metadata</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.metadata && Object.keys(model.metadata).length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-center">
                  {Object.entries(model.metadata).map(([key, value]) => (
                    <a 
                      key={key}
                      href={value} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs"
                    >
                      <i className="bi bi-link-45deg text-xs"></i>
                      {key}
                    </a>
                  ))}
                </div>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>
      </>
    );
  };

  if (selectedModels.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">Select image models to compare</p>
      </div>
    );
  }

  return (
    <div>
      {/* Clear All button */}
      <div className="flex justify-end items-center mb-4">
        {clearAllButton}
      </div>
      
      {/* Basic Information Table */}
      <div className="mb-6">
        <SharedTable>
          <TableColGroup items={headerItems} />
          <TableHeader items={headerItems} />
          <tbody>
            {renderBasicRows()}
          </tbody>
        </SharedTable>
      </div>
      
      {/* Generation Features Table */}
      <div className="mb-6">
        <SectionTitle>Generation Features</SectionTitle>
        <SharedTable>
          <TableColGroup items={headerItems} />
          <tbody>
            {renderGenerationRows()}
          </tbody>
        </SharedTable>
      </div>
      
      {/* Aspect Ratios Table */}
      {hasAnyAspectRatio() && (
        <div className="mb-6">
          <SectionTitle>Supported Aspect Ratios</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderAspectRatioRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Editing Features Table */}
      {hasAnyEditingFeature() && (
        <div className="mb-6">
          <SectionTitle>Editing Features</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderEditingRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Enhancement Features Table */}
      {hasAnyEnhancementFeature() && (
        <div className="mb-6">
          <SectionTitle>Enhancement Features</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderEnhancementRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Advanced Features Table */}
      {hasAnyAdvancedFeature() && (
        <div className="mb-6">
          <SectionTitle>Advanced Features</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderAdvancedRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Safety Features Table */}
      {hasAnySafetyFeature() && (
        <div className="mb-6">
          <SectionTitle>Safety Features</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderSafetyRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Resources Table */}
      {hasAnyResourceData() && (
        <div className="mb-6">
          <SectionTitle>Resources</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderResourcesRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
    </div>
  );
};

export default ImageModelTable;