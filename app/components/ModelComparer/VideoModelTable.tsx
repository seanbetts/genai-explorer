'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Model } from '../types';
import { containerStyles, tableStyles, iconStyles } from '../utils/layout';
import { textStyles } from '../utils/theme';
import { 
  SharedTable, 
  TableHeader, 
  TableColGroup,
  SectionTitle
} from '../shared/TableComponents';

interface VideoModelTableProps {
  selectedModels: Model[];
  onModelRemove: (modelId: string) => void;
  clearAllButton: React.ReactNode;
}

const VideoModelTable: React.FC<VideoModelTableProps> = ({ selectedModels, onModelRemove, clearAllButton }) => {
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const tableHeaderRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll to show/hide sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (tableHeaderRef.current) {
        const rect = tableHeaderRef.current.getBoundingClientRect();
        // Site header appears to be around 80-100px tall, so we need to account for that
        // Show sticky header when top of original header moves out of view (behind site header)
        const siteHeaderHeight = 135; // Approximate height of the site header
        const shouldShow = rect.top <= siteHeaderHeight;
        
        setShowStickyHeader(shouldShow);
      }
    };

    // Initial check after a short delay to ensure DOM is ready
    const timer = setTimeout(handleScroll, 100);
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Remove showStickyHeader from dependencies to prevent loop

  // Helper function to check if any model has a specified property
  const hasAnyModelSpec = (key: string): boolean => {
    return selectedModels.some(model => 
      model.specs && key in model.specs && model.specs[key as keyof typeof model.specs] !== undefined
    );
  };

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
    return selectedModels.some(model => 
      model.safety && Object.values(model.safety).some(value => value === true)
    );
  };

  const hasAnyEnhancementFeature = (): boolean => {
    return selectedModels.some(model => model.features?.enhancement && Object.keys(model.features.enhancement).length > 0);
  };

  const hasAnyEditingFeature = (): boolean => {
    return selectedModels.some(model => model.features?.editing && Object.keys(model.features.editing).length > 0);
  };

  const hasAnyAdvancedFeature = (): boolean => {
    return selectedModels.some(model => model.features?.advanced && Object.keys(model.features.advanced).length > 0);
  };

  const hasAnyResourceData = (): boolean => {
    return selectedModels.some(model => 
      model.modelPage || model.releasePost || model.releaseVideo || model.systemCard || model.huggingFace || model.termsOfService || model.usagePolicy
    );
  };

  // Format model items for header
  const headerItems = selectedModels.map(model => ({
    id: model.id,
    name: model.name,
    description: model.companyName,
    onRemove: () => onModelRemove(model.id)
  }));

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
      } else if (ratio.includes('(21:9)')) {
        width = 21; height = 9; // Ultrawide
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

      {/* Max Duration */}
      {hasAnyModelSpec('maxDuration') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-stopwatch ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Max Duration</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <span className={textStyles.primary}>{model.specs?.maxDuration || "-"}</span>
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Render generation features
  const renderGenerationRows = () => (
    <>
      {/* Text to Video */}
      {hasAnyModelFeature('generation', 'textToVideo') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-type ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Text-to-Video</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.textToVideo ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Image to Video */}
      {hasAnyModelFeature('generation', 'imageToVideo') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-image ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Image-to-Video</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.imageToVideo ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Video to Video */}
      {hasAnyModelFeature('generation', 'videoToVideo') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-camera-video ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Video-to-Video</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.videoToVideo ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Camera Motion */}
      {hasAnyModelFeature('generation', 'cameraMotion') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-up-right-circle ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Camera Motion</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.cameraMotion ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Resolutions */}
      {selectedModels.some(model => model.features?.generation?.resolutions && Array.isArray(model.features.generation.resolutions) && model.features.generation.resolutions.length > 0) && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-display ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Resolutions</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.resolutions && Array.isArray(model.features.generation.resolutions) && model.features.generation.resolutions.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-center">
                  {(model.features.generation.resolutions as string[]).map((resolution: string) => (
                    <span key={resolution} className="inline-block px-2 py-1 bg-gray-700 text-cyan-400 rounded border border-gray-600 text-xs">
                      {resolution}
                    </span>
                  ))}
                </div>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>
      )}

      {/* Durations */}
      {selectedModels.some(model => model.features?.generation?.durations && Array.isArray(model.features.generation.durations) && model.features.generation.durations.length > 0) && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-stopwatch ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Durations</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.durations && Array.isArray(model.features.generation.durations) && model.features.generation.durations.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-center">
                  {(model.features.generation.durations as number[]).map((duration: number) => (
                    <span key={duration} className="inline-block px-2 py-1 bg-gray-700 text-cyan-400 rounded border border-gray-600 text-xs">
                      {duration}s
                    </span>
                  ))}
                </div>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>
      )}

      {/* Number of Videos */}
      {selectedModels.some(model => model.features?.generation?.numberOfVideos && Array.isArray(model.features.generation.numberOfVideos) && model.features.generation.numberOfVideos.length > 0) && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-collection-play ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Number Of Videos</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.numberOfVideos && Array.isArray(model.features.generation.numberOfVideos) && model.features.generation.numberOfVideos.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-center">
                  {(model.features.generation.numberOfVideos as number[]).map((count: number) => (
                    <span key={count} className="inline-block px-2 py-1 bg-gray-700 text-cyan-400 rounded border border-gray-600 text-xs">
                      {count}
                    </span>
                  ))}
                </div>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>
      )}

      {/* Video Styles */}
      {selectedModels.some(model => model.features?.generation?.videoStyles && Array.isArray(model.features.generation.videoStyles) && model.features.generation.videoStyles.length > 0) && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-palette ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Video Styles</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.videoStyles && Array.isArray(model.features.generation.videoStyles) && model.features.generation.videoStyles.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-center">
                  {(model.features.generation.videoStyles as string[]).map((style: string) => (
                    <span key={style} className="inline-block px-2 py-1 bg-gray-700 text-cyan-400 rounded border border-gray-600 text-xs capitalize">
                      {style}
                    </span>
                  ))}
                </div>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>
      )}

      {/* Frame Rate */}
      {selectedModels.some(model => model.features?.generation?.frameRate) && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-film ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Frame Rate</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.frameRate ? (
                <span className="inline-block px-2 py-1 bg-gray-700 text-cyan-400 rounded border border-gray-600 text-xs">
                  {model.features.generation.frameRate} fps
                </span>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>
      )}

      {/* Negative Prompt */}
      {hasAnyModelFeature('generation', 'negativePrompt') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-dash-circle ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Negative Prompt</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.negativePrompt ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Sound Effects */}
      {hasAnyModelFeature('generation', 'soundEffects') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-volume-up ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Sound Effects</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.soundEffects ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Ambient Noise */}
      {hasAnyModelFeature('generation', 'ambientNoise') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-soundwave ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Ambient Noise</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.ambientNoise ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Dialogue */}
      {hasAnyModelFeature('generation', 'dialogue') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-chat-quote ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Dialogue</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.dialogue ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}
    </>
  );


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
        {allEnhancements.map(feature => (
          <tr key={feature} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-stars ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>{feature.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase())}</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.features?.enhancement?.[feature] ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>}
              </td>
            ))}
          </tr>
        ))}
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
                {model.features?.advanced?.[feature] ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>}
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
                <a href={model.releasePost} target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs">
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
                <a href={model.releaseVideo} target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs">
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
                <a href={model.modelPage} target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs">
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
                <a href={model.systemCard} target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs">
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
                <a href={model.termsOfService} target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs">
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
                <a href={model.usagePolicy} target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400 transition-all text-xs">
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
        <p className="text-gray-400">Select video models to compare</p>
      </div>
    );
  }

  return (
    <div>
      {/* Floating sticky header - appears when original header is out of view */}
      {showStickyHeader && (
        <div className="floating-sticky-header fixed top-32 left-1/2 transform -translate-x-1/2 z-30" style={{ 
          marginTop: '3px',
          width: '1228px',
          borderTopLeftRadius: '0.5rem',
          borderTopRightRadius: '0.5rem',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          overflow: 'hidden',
          backgroundColor: '#2d3748',
          borderBottom: '0.5px solid #EA00D9'
        }}>
          <table className="table-fixed w-full border-collapse">
            <TableColGroup items={headerItems} />
            <TableHeader items={headerItems} />
          </table>
        </div>
      )}

      {/* Clear All button */}
      <div className="flex justify-end items-center mb-4">
        {clearAllButton}
      </div>
      
      {/* Basic Information Table */}
      <div ref={tableHeaderRef} className="mb-6">
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

export default VideoModelTable;