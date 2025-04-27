"use client";

import React, { useEffect, useState } from "react";
import ImagePopover from "../shared/ImagePopover";
import ImageCarousel from "../shared/ImageCarousel";
import VideoCarousel from "../shared/VideoCarousel";
import { Model } from "../types";
import { textStyles, headingStyles } from "../utils/theme";
import {
  containerStyles,
  iconStyles,
  tableStyles,
} from "../utils/layout";

// -----------------------------------------------------------------------------
// Utility helpers -------------------------------------------------------------
// -----------------------------------------------------------------------------
function formatFeatureName(key: string): string {
  const specialCases: Record<string, string> = {
    textToImage: "Text‑To‑Image",
    imageToImage: "Image‑To‑Image",
    imageToVector: "Image‑To‑Vector",
    inPainting: "In‑Painting",
    multiTurnGeneration: "Multi‑Turn Generation",
    hexCodes: "Hex Colour Codes",
    photoRealism: "Photorealism",
  };

  if (specialCases[key]) return specialCases[key];

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

function formatEndpointName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

function formatDemoName(key: string): string {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// -----------------------------------------------------------------------------
// Main gallery component -------------------------------------------------------
// -----------------------------------------------------------------------------
interface ImageModelGalleryProps {
  models: Model[];
  /** Company ID for dynamic image discovery */
  companyId: string;
}

const ImageModelGallery: React.FC<ImageModelGalleryProps> = ({ models, companyId }) => {
  // ----- state ---------------------------------------------------------------
  const [selectedModelId, setSelectedModelId] = useState<string | null>(
    models.length ? models[0].id : null,
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const selectedModel = models.find((m) => m.id === selectedModelId);

  // ----- state for image URLs fetched dynamically ---------------------------
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // ----- fetch image list when selected model or company changes ------------
  useEffect(() => {
    if (!selectedModelId) {
      setImageUrls([]);
      return;
    }
    // reset on change
    setImageUrls([]);
    
    // call our API to list images
    fetch(`/api/images/${companyId}/${selectedModelId}`)
      .then((res) => res.json())
      .then((urls: string[]) => {
        setImageUrls(urls);
      })
      .catch((err) => {
        console.error('Failed to fetch image URLs for', selectedModelId, err);
      });
  }, [companyId, selectedModelId]);

  // ---------------------------------------------------------------------------
  // Render helpers ------------------------------------------------------------
  // ---------------------------------------------------------------------------
  const renderModelTabs = () => (
    <div className="flex mb-6 overflow-x-auto scrollbar-hide pb-2">
      {models.map((model) => (
        <button
          key={model.id}
          className={`py-2 px-4 font-medium font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
            selectedModelId === model.id
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-gray-400 hover:text-white hover:border-gray-500"
          }`}
          onClick={() => {
            setSelectedModelId(model.id);
          }}
        >
          {model.name}
        </button>
      ))}
    </div>
  );

  const renderModelDetails = () => {
    if (!selectedModel) return null;

    // Determine if the model has IP Respect data
    const hasIPRespectData = selectedModel.safety && 
      (selectedModel.safety?.IPRespect !== undefined || 
       selectedModel.safety?.ipRespect !== undefined);
    
    // Determine if IP Respect is enabled
    const ipRespectEnabled = hasIPRespectData && 
      (selectedModel.safety?.IPRespect === true || 
       selectedModel.safety?.ipRespect === true);
    
    // Get C2PA documentation URL if available
    const c2paDocsUrl = selectedModel.metadata?.C2PA || 
      (typeof selectedModel.safety?.C2PA === 'string' ? selectedModel.safety.C2PA : undefined) ||
      (typeof selectedModel.safety?.c2pa === 'string' ? selectedModel.safety.c2pa : undefined);

    return (
      <div className="mb-8">
        {/* heading + release date */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-2 mb-1">
          <h2 className="text-2xl font-semibold text-fuchsia-500 mt-2 tracking-tight font-mono">
            {selectedModel.name}
          </h2>
          {selectedModel.releaseDate && (
            <div className="flex items-center text-sm text-gray-400 font-mono mt-4">
              <i className="bi bi-calendar-event text-fuchsia-500 mr-2" />
              <span>
                Released: {new Date(selectedModel.releaseDate).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          )}
        </div>

        <p className={`${textStyles.body} mb-8`}>{selectedModel.about}</p>

        {/* combined features grid: product, safety, and aspect ratios */}
        {/* Added extra bottom margin to separate from API Endpoints section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Model Features column */}
          <div>
            <h3 className={`${headingStyles.card} mb-3`}>Model Features</h3>
            <div className={`${containerStyles.card} min-h-[30.7rem] h-auto`}>
              <div className="space-y-4">
                {/* Generation Features */}
                {selectedModel.features?.generation && Object.keys(selectedModel.features.generation).length > 0 && (
                  <>
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">Generation</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedModel.features.generation)
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center h-8">
                              <i className={`${value === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                              <span className={textStyles.body}>{formatFeatureName(key)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="border-b border-gray-700 my-2"></div>
                  </>
                )}
                
                {/* Editing Features */}
                {selectedModel.features?.editing && Object.keys(selectedModel.features.editing).length > 0 && (
                  <>
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">Editing</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedModel.features.editing)
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center h-8">
                              <i className={`${value === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                              <span className={textStyles.body}>{formatFeatureName(key)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="border-b border-gray-700 my-2"></div>
                  </>
                )}
                
                {/* Enhancement Features */}
                {selectedModel.features?.enhancement && Object.keys(selectedModel.features.enhancement).length > 0 && (
                  <>
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">Enhancement</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedModel.features.enhancement)
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center h-8">
                              <i className={`${value === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                              <span className={textStyles.body}>{formatFeatureName(key)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="border-b border-gray-700 my-2"></div>
                  </>
                )}
                
                {/* Advanced Features */}
                {selectedModel.features?.advanced && Object.keys(selectedModel.features.advanced).length > 0 && (
                  <div className="mb-2">
                    <h4 className="text-sm font-semibold text-cyan-400 mb-2">Advanced</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedModel.features.advanced)
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center h-8">
                            <i className={`${value === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                            <span className={textStyles.body}>{formatFeatureName(key)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Right column: Safety Features and Aspect Ratios */}
          <div className="space-y-6">
            {/* Safety Features */}
            <div>
              <h3 className={`${headingStyles.card} mb-3`}>Safety Features</h3>
              { (Object.keys(selectedModel.safety ?? {}).length > 0 ||
                  selectedModel.termsOfService ||
                  selectedModel.usagePolicy ||
                  selectedModel.commerciallySafe !== undefined) ? (
              <div className={`${containerStyles.card} min-h-[12rem] h-auto`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {Object.entries(selectedModel.safety ?? {})
                        .filter(([key]) => 
                          key !== 'ipRespect' && 
                          key !== 'IPRespect' && 
                          key !== 'C2PA' && 
                          key !== 'c2pa'
                        )
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center h-8">
                            <i className={`${value === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                            <span className={textStyles.body}>{formatFeatureName(key)}</span>
                          </div>
                        ))}
                    </div>
                    <div className="space-y-2 flex flex-col">
                      {hasIPRespectData && (
                        <div className="flex items-center h-8">
                          <i className={`${ipRespectEnabled ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-3`} />
                          <span className={textStyles.body}>IP Respect</span>
                        </div>
                      )}
                      {selectedModel.commerciallySafe !== undefined && (
                        <div className="flex items-center h-8">
                          <i className={`${selectedModel.commerciallySafe ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-3`} />
                          <span className={textStyles.body}>{selectedModel.commerciallySafe ? 'Commercially safe' : 'Not commercially safe'}</span>
                        </div>
                      )}
                      {selectedModel.usagePolicy && (
                        <a
                          href={selectedModel.usagePolicy}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1 w-fit mt-2"
                        >
                          <i className="bi bi-shield-check mr-1" /> Usage Policy
                        </a>
                      )}
                      {selectedModel.termsOfService && (
                        <a
                          href={selectedModel.termsOfService}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1 w-fit mt-2"
                        >
                          <i className="bi bi-file-earmark-text mr-1" /> Terms of Service
                        </a>
                      )}
                      {c2paDocsUrl && (
                        <a
                          href={c2paDocsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1 w-fit mt-2"
                        >
                          <i className="bi bi-patch-check-fill mr-1" /> C2PA Documentation
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
              <div className={`${containerStyles.card} min-h-[12rem] h-auto flex items-center justify-center`}>
                  <p className={textStyles.body}>No safety features</p>
                </div>
              )}
            </div>
            
            {/* Aspect Ratios */}
            {selectedModel.aspectRatios && Object.keys(selectedModel.aspectRatios).length > 0 && (
              <div>
                <h3 className={`${headingStyles.card} mb-3`}>Aspect Ratios</h3>
                <div className={`${containerStyles.card}`}>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedModel.aspectRatios)
                      .map(([ratio, supported]) => {
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
                        
                        // Capitalize ratio label
                        const capitalizedRatio = ratio
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
                        
                        return (
                          <div key={ratio} className="flex items-center">
                            <div className={`w-16 h-10 relative mr-3 rounded border ${supported ? 'border-cyan-400' : 'border-gray-600 opacity-50'}`}>
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
                            <div className="flex items-center">
                              <i className={`${supported ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                              <span className={`${textStyles.body} text-sm font-medium`}>{capitalizedRatio}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= API ENDPOINT TABLE ================= */}
        {selectedModel.apiEndpoints && 
         Object.keys(selectedModel.apiEndpoints).length > 0 && 
         selectedModel.apiEndpoints.available === true && (
          <div className="mb-8">
            {/* API Endpoints header */}
            <h3 className={headingStyles.card}>API Endpoints</h3>
            {/* Endpoints table wrapped in a card */}
            <div className={`${containerStyles.card} mt-3`}>
              <div className="overflow-x-auto">
                <table className={`${tableStyles.table} w-full`}>
                <thead className={tableStyles.header}>
                  <tr>
                    <th className={`${tableStyles.headerCell} ${tableStyles.stickyLabelCell}`} />
                    {Object.entries(selectedModel.apiEndpoints)
                      .filter(([key]) => key !== 'available')
                      .map(([ep]) => (
                        <th key={ep} className={tableStyles.headerCellCenter}>
                          {formatEndpointName(ep)} Endpoint
                        </th>
                      ))}
                  </tr>
                </thead>

                  <tbody>
                    {/* -------- Input Formats -------- */}
                    <tr className={tableStyles.rowEven}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-arrow-up-right-square-fill text-cyan-400" />
                          <span className="font-medium">Input Formats</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const opts = data.options;
                        return (
                          <td key={`${ep}-input-formats`} className={tableStyles.cellCenter}>
                            {opts?.inputFormats && opts.inputFormats.length > 0 ? (
                              <div className="flex gap-3 justify-center">
                                {[
                                  { id: "text", icon: "bi-file-text-fill" },
                                  { id: "speech", icon: "bi-mic-fill" },
                                  { id: "image", icon: "bi-image-fill" },
                                  { id: "audio", icon: "bi-music-note-beamed" },
                                  { id: "video", icon: "bi-camera-video-fill" },
                                ].map(({ id, icon }) => (
                                  <i
                                    key={id}
                                    className={`bi ${icon} ${
                                      opts.inputFormats.includes(id)
                                        ? iconStyles.activeFormat
                                        : iconStyles.inactiveFormat
                                    }`}
                                    title={id.charAt(0).toUpperCase() + id.slice(1)}
                                  />
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* -------- Output Formats -------- */}
                    <tr className={tableStyles.rowOdd}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-arrow-down-right-square-fill text-fuchsia-500" />
                          <span className="font-medium">Output Formats</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const opts = data.options;
                        return (
                          <td key={`${ep}-output-formats`} className={tableStyles.cellCenter}>
                            {opts?.outputFormats && opts.outputFormats.length > 0 ? (
                              <div className="flex gap-3 justify-center">
                                {[
                                  { id: "text", icon: "bi-file-text-fill" },
                                  { id: "speech", icon: "bi-mic-fill" },
                                  { id: "image", icon: "bi-image-fill" },
                                  { id: "audio", icon: "bi-music-note-beamed" },
                                  { id: "video", icon: "bi-camera-video-fill" },
                                ].map(({ id, icon }) => (
                                  <i
                                    key={id}
                                    className={`bi ${icon} ${
                                      opts.outputFormats.includes(id)
                                        ? iconStyles.activeFormat
                                        : iconStyles.inactiveFormat
                                    }`}
                                    title={id.charAt(0).toUpperCase() + id.slice(1)}
                                  />
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* -------- Input File Types -------- */}
                    <tr className={tableStyles.rowEven}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-file-earmark-arrow-up text-cyan-400" />
                          <span className="font-medium">Input File Types</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const types = data.options?.inputFileTypes;
                        return (
                          <td key={`${ep}-input-file-types`} className={tableStyles.cellCenter}>
                            {types !== undefined ? (
                              Array.isArray(types) && types.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {(Array.isArray(types) ? types : [types]).map((t) => (
                                    <span key={t} className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i className={iconStyles.booleanFalse} />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* -------- Max Input Size -------- */}
                    <tr className={tableStyles.rowOdd}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-file-earmark-plus text-cyan-400" />
                          <span className="font-medium">Max Input Size</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const mis = data.options?.maxInputSize;
                        return (
                          <td key={`${ep}-max-input-size`} className={tableStyles.cellCenter}>
                            {mis !== undefined ? (
                              mis === 0 ? (
                                <i className={iconStyles.booleanFalse} />
                              ) : (
                                <span className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded">
                                  {mis.toLocaleString()} MB
                                </span>
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* -------- Moderation -------- */}
                    <tr className={tableStyles.rowEven}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-shield-check text-cyan-400" />
                          <span className="font-medium">Moderation</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const mod = data.options?.moderation;
                        return (
                          <td key={`${ep}-moderation`} className={tableStyles.cellCenter}>
                            {mod !== undefined ? (
                              Array.isArray(mod) && mod.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {(Array.isArray(mod) ? mod : [mod]).map((lvl) => (
                                    <span key={lvl} className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded capitalize">
                                      {lvl}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i className={iconStyles.booleanFalse} />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* -------- Masking Support -------- */}
                    <tr className={tableStyles.rowEven}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-brush text-cyan-400" />
                          <span className="font-medium">Masking Support</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const m = data.options?.mask;
                        return (
                          <td key={`${ep}-mask`} className={tableStyles.cellCenter}>
                            {m !== undefined ? <i className={m ? iconStyles.booleanTrue : iconStyles.booleanFalse} /> : <span className="text-gray-500">-</span>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* -------- Context Window -------- */}
                    <tr className={tableStyles.rowOdd}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-text-paragraph text-cyan-400" />
                          <span className="font-medium">Context Window</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const cw = data.options?.contextWindow;
                        return (
                          <td key={`${ep}-context-window`} className={tableStyles.cellCenter}>
                            {cw !== undefined ? 
                              <span className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded">
                                {cw.toLocaleString()} tokens
                              </span> 
                              : <span className="text-gray-500">-</span>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* -------- Structure Reference -------- */}
                    <tr className={tableStyles.rowEven}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-grid-3x3 text-cyan-400" />
                          <span className="font-medium">Structure Reference</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const sr = data.options?.structureReference;
                        return (
                          <td key={`${ep}-structure-reference`} className={tableStyles.cellCenter}>
                            {sr !== undefined ? <i className={sr ? iconStyles.booleanTrue : iconStyles.booleanFalse} /> : <span className="text-gray-500">-</span>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* -------- Negative Prompt -------- */}
                    <tr className={tableStyles.rowOdd}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-dash-circle text-cyan-400" />
                          <span className="font-medium">Negative Prompt</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const np = data.options?.negativePrompt;
                        return (
                          <td key={`${ep}-negative-prompt`} className={tableStyles.cellCenter}>
                            {np !== undefined ? <i className={np ? iconStyles.booleanTrue : iconStyles.booleanFalse} /> : <span className="text-gray-500">-</span>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* ========= OUTPUT OPTIONS ========= */}

                    {/* Output File Types */}
                    <tr className={tableStyles.rowEven}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-file-earmark-arrow-down text-fuchsia-500" />
                          <span className="font-medium">Output File Types</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const o = data.options?.outputFileTypes;
                        return (
                          <td key={`${ep}-output-file-types`} className={tableStyles.cellCenter}>
                            {o !== undefined ? (
                              Array.isArray(o) && o.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {(Array.isArray(o) ? o : [o]).map((t) => (
                                    <span key={t} className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i className={iconStyles.booleanFalse} />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Output Sizes */}
                    <tr className={tableStyles.rowOdd}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-arrows-fullscreen text-fuchsia-500" />
                          <span className="font-medium">Output Sizes</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const s = data.options?.outputSize;
                        return (
                          <td key={`${ep}-output-sizes`} className={tableStyles.cellCenter}>
                            {s !== undefined ? (
                              Array.isArray(s) && s.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center max-w-[16rem] mx-auto">
                                  {(Array.isArray(s) ? s : [s]).map((sz) => (
                                    <span key={sz} className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded">
                                      {sz}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i className={iconStyles.booleanFalse} />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Quality Levels */}
                    <tr className={tableStyles.rowEven}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-stars text-fuchsia-500" />
                          <span className="font-medium">Quality Levels</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const q = data.options?.outputQuality;
                        return (
                          <td key={`${ep}-quality-levels`} className={tableStyles.cellCenter}>
                            {q !== undefined ? (
                              Array.isArray(q) && q.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {(Array.isArray(q) ? q : [q]).map((ql) => (
                                    <span key={ql} className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded capitalize">
                                      {ql}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i className={iconStyles.booleanFalse} />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Style Options */}
                    <tr className={tableStyles.rowOdd}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-palette text-fuchsia-500" />
                          <span className="font-medium">Style Options</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const st = data.options?.outputStyle;
                        return (
                          <td key={`${ep}-style-options`} className={tableStyles.cellCenter}>
                            {st !== undefined ? (
                              Array.isArray(st) && st.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {(Array.isArray(st) ? st : [st]).map((style) => (
                                    <span key={style} className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded capitalize">
                                      {style}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i className={iconStyles.booleanFalse} />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Background */}
                    <tr className={tableStyles.rowEven}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-square text-fuchsia-500" />
                          <span className="font-medium">Background</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const bg = data.options?.background;
                        return (
                          <td key={`${ep}-background`} className={tableStyles.cellCenter}>
                            {bg !== undefined ? (
                              Array.isArray(bg) && bg.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {(Array.isArray(bg) ? bg : [bg]).map((b) => (
                                    <span key={b} className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded capitalize">
                                      {b}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i className={iconStyles.booleanFalse} />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Visual Intensity */}
                    <tr className={tableStyles.rowOdd}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-sliders text-fuchsia-500" />
                          <span className="font-medium">Visual Intensity</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const vi = data.options?.visualIntesity;
                        return (
                          <td key={`${ep}-visual-intensity`} className={tableStyles.cellCenter}>
                            {vi !== undefined ? (
                              vi === 0 ? (
                                <i className={iconStyles.booleanFalse} />
                              ) : (
                                <div className="flex items-center justify-center">
                                  <span className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded">
                                    1-{vi}
                                  </span>
                                </div>
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Tileable Output */}
                    <tr className={tableStyles.rowEven}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-grid text-fuchsia-500" />
                          <span className="font-medium">Tileable Output</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const t = data.options?.tileable;
                        return (
                          <td key={`${ep}-tileable`} className={tableStyles.cellCenter}>
                            {t !== undefined ? <i className={t ? iconStyles.booleanTrue : iconStyles.booleanFalse} /> : <span className="text-gray-500">-</span>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Placement Position */}
                    <tr className={tableStyles.rowOdd}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-bullseye text-fuchsia-500" />
                          <span className="font-medium">Placement Position</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const pp = data.options?.placementPosition;
                        return (
                          <td key={`${ep}-placement-position`} className={tableStyles.cellCenter}>
                            {pp !== undefined ? <i className={pp ? iconStyles.booleanTrue : iconStyles.booleanFalse} /> : <span className="text-gray-500">-</span>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Placement Alignment */}
                    <tr className={tableStyles.rowEven}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-layout-text-window text-fuchsia-500" />
                          <span className="font-medium">Placement Alignment</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                        const pa = data.options?.placementAlignment;
                        return (
                          <td key={`${ep}-placement-alignment`} className={tableStyles.cellCenter}>
                            {pa !== undefined ? <i className={pa ? iconStyles.booleanTrue : iconStyles.booleanFalse} /> : <span className="text-gray-500">-</span>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Max Images */}
                    <tr className={tableStyles.rowOdd}>
                      <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell}`}>
                        <div className="flex items-center gap-2">
                          <i className="bi bi-images text-fuchsia-500" />
                          <span className="font-medium">Max Images</span>
                        </div>
                      </td>
                      {Object.entries(selectedModel.apiEndpoints)
                        .filter(([key]) => key !== 'available')
                        .map(([ep, data]) => {
                          return (
                            <td key={`${ep}-max-images`} className={tableStyles.cellCenter}>
                              {data.options?.numberOfImages !== undefined ? 
                                data.options.numberOfImages : 
                                <span className="text-gray-500">-</span>}
                            </td>
                          );
                        })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Demo videos section */}
        {selectedModel.demoVideos && Object.keys(selectedModel.demoVideos).length > 0 && (
          <>
            <h3 className={`${headingStyles.card} mb-3`}>Demo Videos</h3>
            <div className="mb-8">
              <VideoCarousel 
                videos={selectedModel.demoVideos}
                title={selectedModel.name}
                formatDemoName={formatDemoName}
              />
            </div>
          </>
        )}
        
        {/* Resources section - only show if at least one resource is available */}
        {(selectedModel.releasePost || 
          selectedModel.releaseVideo || 
          selectedModel.systemCard || 
          selectedModel.modelPage || 
          selectedModel.modelGuide || 
          selectedModel.apiDocumentation) && (
          <>
            <h3 className={`${headingStyles.card} mb-3`}>Resources</h3>
            <div className={`${containerStyles.card} mb-6`}>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {selectedModel.releasePost && (
                  <a 
                    href={selectedModel.releasePost} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group"
                  >
                    <i className="bi bi-newspaper text-xl text-fuchsia-500 group-hover:text-cyan-400"></i>
                    <span>Release Post</span>
                  </a>
                )}
                {selectedModel.releaseVideo && (
                  <a 
                    href={selectedModel.releaseVideo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group"
                  >
                    <i className="bi bi-play-btn text-xl text-fuchsia-500 group-hover:text-cyan-400"></i>
                    <span>Release Video</span>
                  </a>
                )}
                {selectedModel.systemCard && (
                  <a 
                    href={selectedModel.systemCard} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group"
                  >
                    <i className="bi bi-file-earmark-text text-xl text-fuchsia-500 group-hover:text-cyan-400"></i>
                    <span>System Card</span>
                  </a>
                )}
                {selectedModel.modelPage && (
                  <a 
                    href={selectedModel.modelPage} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group"
                  >
                    <i className="bi bi-globe2 text-xl text-fuchsia-500 group-hover:text-cyan-400"></i>
                    <span>Model Page</span>
                  </a>
                )}
                {selectedModel.modelGuide && (
                  <a 
                    href={selectedModel.modelGuide} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group"
                  >
                    <i className="bi bi-book text-xl text-fuchsia-500 group-hover:text-cyan-400"></i>
                    <span>Model Guide</span>
                  </a>
                )}
                {selectedModel.apiDocumentation && (
                  <a 
                    href={selectedModel.apiDocumentation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group"
                  >
                    <i className="bi bi-code-square text-xl text-fuchsia-500 group-hover:text-cyan-400"></i>
                    <span>API Documentation</span>
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderImageGallery = () => {
    if (!selectedModel || imageUrls.length === 0) {
      return null;
    }

    return (
      <ImageCarousel 
        images={imageUrls}
        title={selectedModel.name}
        onOpenFullscreen={(imageSrc) => {
          setSelectedImage(imageSrc);
          setIsPopoverOpen(true);
        }}
      />
    );
  };

  // ---------------------------------------------------------------------------
  // Guard: no models -----------------------------------------------------------
  if (!models || models.length === 0) return null;

  // ---------------------------------------------------------------------------
  return (
    <>
      {models.length > 1 && renderModelTabs()}

      {imageUrls.length > 0 && <div className="mb-8 p-0">{renderImageGallery()}</div>}

      {renderModelDetails()}

      {selectedModel && imageUrls.length > 0 && (
        <ImagePopover
          isOpen={isPopoverOpen}
          onClose={() => setIsPopoverOpen(false)}
          imageSrc={selectedImage || ''}
          imageAlt={`Full resolution image of ${selectedModel.name}`}
        />
      )}
    </>
  );
};

export default ImageModelGallery;