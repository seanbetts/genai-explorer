"use client";

import React, { useEffect, useState } from "react";
import ImagePopover from "../shared/ImagePopover";
import ImageCarousel from "../shared/ImageCarousel";
import VideoCarousel from "../shared/VideoCarousel";
import { Model, ApiEndpoint } from "../types";
import { textStyles, headingStyles } from "../utils/theme";
import brandConfig from "../../config/brand";
import {
  containerStyles,
  iconStyles,
  tableStyles,
} from "../utils/layout";
import { handleTableScroll, tableHoverStyles } from "../shared/TableComponents";

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
  /** Company ID for paths to image files */
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

  // ----- state for image URLs ---------------------------
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Generate image paths based on imageExamples data
  useEffect(() => {
    if (!selectedModelId) {
      setImageUrls([]);
      return;
    }
    
    // Reset on change
    setImageUrls([]);
    
    // Find the selected model
    const selectedModelObj = models.find(m => m.id === selectedModelId);
    if (!selectedModelObj) {
      return;
    }
    
    // Base directory for this model's images
    const baseDir = `/images/companies/${companyId}/example_images/${selectedModelId}`;
    
    // Check if model has imageExamples with numberOfImages
    if (selectedModelObj.imageExamples && 
        typeof selectedModelObj.imageExamples === 'object' && 
        selectedModelObj.imageExamples.numberOfImages) {
      
      const numberOfImages = selectedModelObj.imageExamples.numberOfImages;
      const imageFormat = selectedModelObj.imageExamples.imageFormat || 'webp';
      const newImageUrls: string[] = [];
      
      // Generate sequential image paths with the specified format
      for (let i = 1; i <= numberOfImages; i++) {
        newImageUrls.push(`${baseDir}/${i}.${imageFormat}`);
      }
      
      setImageUrls(newImageUrls);
    } 
    // Fallback to previously supported formats if imageExamples isn't available
    else if (selectedModelObj.imageList && Array.isArray(selectedModelObj.imageList)) {
      // Use predefined image list if available
      setImageUrls(selectedModelObj.imageList.map(img => 
        img.startsWith('/') ? img : `${baseDir}/${img}`
      ));
    } 
    else if (selectedModelObj.exampleImages && Array.isArray(selectedModelObj.exampleImages)) {
      // Use example images if available
      setImageUrls(selectedModelObj.exampleImages.map(img => 
        img.startsWith('/') ? img : `${baseDir}/${img}`
      ));
    }
    // If no image data is available, use an empty array
    else {
      setImageUrls([]);
    }
  }, [companyId, selectedModelId, models]);

  // ---------------------------------------------------------------------------
  // Render helpers ------------------------------------------------------------
  // ---------------------------------------------------------------------------
  const renderModelTabs = () => (
    <div className="flex mb-6 overflow-x-auto scrollbar-hide pb-2">
      {models.map((model) => (
        <button
          key={model.id}
          className={`py-2 px-4 font-medium ${
            brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'
          } text-sm focus:outline-none focus-visible:outline-none ${
            selectedModelId === model.id
              ? brandConfig.name === 'OMG' 
                ? `border-[${brandConfig.secondaryColor}] text-[${brandConfig.secondaryColor}]` 
                : "border-cyan-400 text-cyan-400"
              : brandConfig.name === 'OMG'
                ? "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                : "border-transparent text-gray-400 hover:text-white hover:border-gray-500"
          }`}
          style={selectedModelId === model.id ? 
            { borderColor: brandConfig.secondaryColor, color: brandConfig.secondaryColor } : {}}
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
    
    // Get C2PA metadata URL if available
    const c2paDocsUrl = selectedModel.metadata?.C2PA || 
      (typeof selectedModel.safety?.C2PA === 'string' ? selectedModel.safety.C2PA : undefined) ||
      (typeof selectedModel.safety?.c2pa === 'string' ? selectedModel.safety.c2pa : undefined);

    return (
      <div className="mb-8">
        {/* heading + release date */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-2 mb-1">
          <h2 className={`text-2xl font-semibold mt-2 tracking-tight ${
            brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'
          }`} style={{ color: brandConfig.primaryColor }}>
            {selectedModel.name}
          </h2>
          {selectedModel.releaseDate && (
            <div className={`flex items-center text-sm ${
              brandConfig.name === 'OMG' ? 'text-gray-600 font-sans' : 'text-gray-400 font-mono'
            } mt-4`}>
              <i className="bi bi-calendar-event mr-2" style={{ color: brandConfig.primaryColor }} />
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
            <h3 className={`mb-3 ${brandConfig.name === 'OMG' ? 'text-lg font-semibold font-sans' : 'text-lg font-semibold font-mono'}`} style={{ color: brandConfig.primaryColor }}>Model Features</h3>
            <div className={`${containerStyles.card} min-h-[30.7rem] h-auto`} style={brandConfig.name === 'OMG' ? { backgroundColor: 'white' } : {}}>
              <div className="space-y-4">
                {/* Generation Features */}
                {selectedModel.features?.generation && Object.keys(selectedModel.features.generation).length > 0 && (
                  <>
                    <div className="mb-2">
                      <h4 className={`text-sm font-semibold mb-2 ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'}`} style={{ color: brandConfig.secondaryColor }}>Generation</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedModel.features.generation)
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center h-8">
                              <i 
                                className={`${value === true ? 
                                  (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                  'bi bi-x-circle-fill'} mr-2 ${brandConfig.name === 'OMG' && value === true ? 'bi bi-check-circle-fill text-lg' : ''}`}
                                style={value === true && brandConfig.name === 'OMG' ? 
                                  { color: brandConfig.secondaryColor } : 
                                  (value === false ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                              />
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
                      <h4 className={`text-sm font-semibold mb-2 ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'}`} style={{ color: brandConfig.secondaryColor }}>Editing</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedModel.features.editing)
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center h-8">
                              <i 
                                className={`${value === true ? 
                                  (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                  'bi bi-x-circle-fill'} mr-2 ${brandConfig.name === 'OMG' && value === true ? 'bi bi-check-circle-fill text-lg' : ''}`}
                                style={value === true && brandConfig.name === 'OMG' ? 
                                  { color: brandConfig.secondaryColor } : 
                                  (value === false ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                              />
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
                      <h4 className={`text-sm font-semibold mb-2 ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'}`} style={{ color: brandConfig.secondaryColor }}>Enhancement</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedModel.features.enhancement)
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center h-8">
                              <i 
                                className={`${value === true ? 
                                  (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                  'bi bi-x-circle-fill'} mr-2 ${brandConfig.name === 'OMG' && value === true ? 'bi bi-check-circle-fill text-lg' : ''}`}
                                style={value === true && brandConfig.name === 'OMG' ? 
                                  { color: brandConfig.secondaryColor } : 
                                  (value === false ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                              />
                              <span className={textStyles.body}>{formatFeatureName(key)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="border-b border-gray-700 my-2"></div>
                  </>
                )}
                
                {/* Advanced Features */}
                {(selectedModel.features?.advanced && Object.keys(selectedModel.features.advanced).length > 0) ||
                 (selectedModel.apiEndpoints?.available !== undefined) ? (
                  <div className="mb-2">
                    <h4 className={`text-sm font-semibold mb-2 ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'}`} style={{ color: brandConfig.secondaryColor }}>Advanced</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {/* API Endpoint Availability */}
                      {selectedModel.apiEndpoints?.available !== undefined && (
                        <div className="flex items-center h-8">
                          <i 
                            className={`${selectedModel.apiEndpoints.available === true ? 
                              (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                              'bi bi-x-circle-fill'} mr-2 ${brandConfig.name === 'OMG' && selectedModel.apiEndpoints.available === true ? 'bi bi-check-circle-fill text-lg' : ''}`}
                            style={selectedModel.apiEndpoints.available === true && brandConfig.name === 'OMG' ? 
                              { color: brandConfig.secondaryColor } : 
                              (selectedModel.apiEndpoints.available === false ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                          />
                          <span className={textStyles.body}>API Available</span>
                        </div>
                      )}
                      
                      {/* Advanced Features */}
                      {selectedModel.features?.advanced && Object.entries(selectedModel.features.advanced)
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center h-8">
                            <i 
                              className={`${value === true ? 
                                (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                'bi bi-x-circle-fill'} mr-2 ${brandConfig.name === 'OMG' && value === true ? 'bi bi-check-circle-fill text-lg' : ''} ${!value && brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                              style={value === true && brandConfig.name === 'OMG' ? 
                                { color: brandConfig.secondaryColor } : 
                                (!value ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                            />
                            <span className={textStyles.body}>{formatFeatureName(key)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {/* Right column: Safety Features and Aspect Ratios */}
          <div className="space-y-6">
            {/* Safety Features */}
            <div>
              <h3 className={`mb-3 ${brandConfig.name === 'OMG' ? 'text-lg font-semibold font-sans' : 'text-lg font-semibold font-mono'}`} style={{ color: brandConfig.primaryColor }}>Safety Features</h3>
              { (Object.keys(selectedModel.safety ?? {}).length > 0 ||
                  selectedModel.termsOfService ||
                  selectedModel.usagePolicy ||
                  selectedModel.commerciallySafe !== undefined) ? (
              <div className={`${containerStyles.card} min-h-[12rem] h-auto`} style={brandConfig.name === 'OMG' ? { backgroundColor: 'white' } : {}}>
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
                            <i 
                              className={`${value === true ? 
                                (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                'bi bi-x-circle-fill'} mr-2 ${brandConfig.name === 'OMG' && value === true ? 'bi bi-check-circle-fill text-lg' : ''} ${!value && brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                              style={value === true && brandConfig.name === 'OMG' ? 
                                { color: brandConfig.secondaryColor } : 
                                (!value ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                            />
                            <span className={textStyles.body}>{formatFeatureName(key)}</span>
                          </div>
                        ))}
                    </div>
                    <div className="space-y-2 flex flex-col">
                      {hasIPRespectData && (
                        <div className="flex items-center h-8">
                          <i 
                            className={`${ipRespectEnabled ? 
                              (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                              'bi bi-x-circle-fill'} mr-3 ${brandConfig.name === 'OMG' && ipRespectEnabled ? 'bi bi-check-circle-fill text-lg' : ''}`}
                            style={ipRespectEnabled && brandConfig.name === 'OMG' ? 
                              { color: brandConfig.secondaryColor } : 
                              (!ipRespectEnabled ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                          />
                          <span className={textStyles.body}>IP Respect</span>
                        </div>
                      )}
                      {selectedModel.commerciallySafe !== undefined && (
                        <div className="flex items-center h-8">
                          <i 
                            className={`${selectedModel.commerciallySafe ? 
                              (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                              'bi bi-x-circle-fill'} mr-3 ${brandConfig.name === 'OMG' && selectedModel.commerciallySafe ? 'bi bi-check-circle-fill text-lg' : ''}`}
                            style={selectedModel.commerciallySafe && brandConfig.name === 'OMG' ? 
                              { color: brandConfig.secondaryColor } : 
                              (!selectedModel.commerciallySafe ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                          />
                          <span className={textStyles.body}>{selectedModel.commerciallySafe ? 'Commercially safe' : 'Not commercially safe'}</span>
                        </div>
                      )}
                      {selectedModel.usagePolicy && (
                        <a
                          href={selectedModel.usagePolicy}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1 ${
                            brandConfig.name === 'OMG' 
                              ? 'bg-gray-200 hover:bg-gray-100 text-xs font-sans rounded transition-colors inline-flex items-center gap-1 w-fit mt-2'
                              : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1 w-fit mt-2'
                          }`}
                          style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                        >
                          <i className="bi bi-shield-check mr-1" /> Usage Policy
                        </a>
                      )}
                      {selectedModel.termsOfService && (
                        <a
                          href={selectedModel.termsOfService}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1 ${
                            brandConfig.name === 'OMG' 
                              ? 'bg-gray-200 hover:bg-gray-100 text-xs font-sans rounded transition-colors inline-flex items-center gap-1 w-fit mt-2'
                              : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1 w-fit mt-2'
                          }`}
                          style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                        >
                          <i className="bi bi-file-earmark-text mr-1" /> Terms of Service
                        </a>
                      )}
                      {c2paDocsUrl && (
                        <a
                          href={c2paDocsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1 ${
                            brandConfig.name === 'OMG' 
                              ? 'bg-gray-200 hover:bg-gray-100 text-xs font-sans rounded transition-colors inline-flex items-center gap-1 w-fit mt-2'
                              : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1 w-fit mt-2'
                          }`}
                          style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                        >
                          <i className="bi bi-patch-check-fill mr-1" /> C2PA Metadata
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
              <div className={`${containerStyles.card} min-h-[12rem] h-auto flex items-center justify-center`} style={brandConfig.name === 'OMG' ? { backgroundColor: 'white' } : {}}>
                  <p className={textStyles.body}>No safety features</p>
                </div>
              )}
            </div>
            
            {/* Aspect Ratios */}
            {selectedModel.aspectRatios && Object.keys(selectedModel.aspectRatios).length > 0 && (
              <div>
                <h3 className={`mb-3 ${brandConfig.name === 'OMG' ? 'text-lg font-semibold font-sans' : 'text-lg font-semibold font-mono'}`} style={{ color: brandConfig.primaryColor }}>Aspect Ratios</h3>
                <div className={`${containerStyles.card}`} style={brandConfig.name === 'OMG' ? { backgroundColor: 'white' } : {}}>
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
                            <div className={`w-16 h-10 relative mr-3 rounded border ${
                              supported ? 
                                (brandConfig.name === 'OMG' ? 'border-blue-600' : 'border-cyan-400') :
                                (brandConfig.name === 'OMG' ? 'border-gray-300 opacity-50' : 'border-gray-600 opacity-50')
                            }`}
                            style={supported && brandConfig.name === 'OMG' ? { borderColor: brandConfig.secondaryColor } : {}}>
                              <div className={`absolute inset-0 rounded ${
                                brandConfig.name === 'OMG' ? 'bg-gray-100' : 'bg-gray-700'
                              } flex items-center justify-center`}>
                                <svg width="100%" height="100%" viewBox="0 0 16 10">
                                  <rect
                                    x={offsetX}
                                    y={offsetY}
                                    width={scaledWidth}
                                    height={scaledHeight}
                                    fill={supported ? 
                                      (brandConfig.name === 'OMG' ? brandConfig.secondaryColor : "#D946EF") : 
                                      (brandConfig.name === 'OMG' ? "#9CA3AF" : "#6B7280")
                                    }
                                    stroke={supported ? 
                                      (brandConfig.name === 'OMG' ? "#DBEAFE" : "#F5D0FE") : 
                                      (brandConfig.name === 'OMG' ? "#E5E7EB" : "#4B5563")
                                    }
                                    strokeWidth="0.3"
                                    rx="0.3"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <i 
                                className={`${supported ? 
                                  (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                  'bi bi-x-circle-fill'} mr-2 ${brandConfig.name === 'OMG' && supported ? 'bi bi-check-circle-fill text-lg' : ''} ${!supported && brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                style={supported && brandConfig.name === 'OMG' ? 
                                  { color: brandConfig.secondaryColor } : 
                                  (!supported ? { color: brandConfig.name === 'OMG' ? '#ef4444' : brandConfig.primaryColor } : {})}
                              />
                              <span className={`${textStyles.body} text-sm font-medium ${
                                brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'
                              }`}>{capitalizedRatio}</span>
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
         'available' in selectedModel.apiEndpoints && selectedModel.apiEndpoints.available && (
          <div className="mb-8">
            {/* API Endpoints header */}
            <h3 className={`mt-6 mb-2 ${brandConfig.name === 'OMG' ? 'text-lg font-semibold font-sans' : 'text-lg font-semibold font-mono'}`} style={{ color: brandConfig.primaryColor }}>API Endpoints</h3>
            <div className="table-wrapper">
              <div className="table-scroll-container" onScroll={handleTableScroll}>
                <table className={`${tableStyles.table} divide-y ${brandConfig.name === 'OMG' ? 'divide-gray-300' : 'divide-gray-700'} hover:shadow-md transition-all duration-300 hover-highlight table-fixed`}>
                  <thead className={tableStyles.header}>
                    <tr>
                      <th className={`${tableStyles.headerCell} ${tableStyles.headerFixed} sticky-header-corner`} style={{width: '250px', minWidth: '250px'}} />
                      {Object.entries(selectedModel.apiEndpoints || {})
                        .filter(([key]) => key !== 'available')
                        .map(([ep], index, array) => (
                          <th key={ep} className={`${tableStyles.headerCellCenter} table-header-cell`} style={{ width: `${100 / array.length}%` }}>
                            <div className={`text-center ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'}`} style={{ color: brandConfig.secondaryColor }}>{formatEndpointName(ep)} Endpoint</div>
                          </th>
                        ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* Define all API endpoint rows as an array of objects */}
                    {/* Filtered to only show rows where at least one endpoint has support for the feature */}
                    {(() => {
                      // All available endpoints (excluding the 'available' property)
                      const endpoints = Object.entries(selectedModel.apiEndpoints || {})
                        .filter(([key]) => key !== 'available')
                        .map(([_, data]) => data);
                        
                      // All possible row definitions
                      const allRows = [
                      // Input-related fields (cyan icons)
                      {
                        id: 'input-formats',
                        label: 'Input Formats',
                        icon: 'bi-arrow-up-right-square-fill',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const opts = data.options;
                          return (
                            opts?.inputFormats && opts.inputFormats.length > 0 ? (
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
                                      opts.inputFormats?.includes(id)
                                        ? iconStyles.activeFormat
                                        : iconStyles.inactiveFormat
                                    }`}
                                    title={id.charAt(0).toUpperCase() + id.slice(1)}
                                  />
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          );
                        }
                      },
                      {
                        id: 'output-formats',
                        label: 'Output Formats',
                        icon: 'bi-arrow-down-right-square-fill',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const opts = data.options;
                          return (
                            opts?.outputFormats && opts.outputFormats.length > 0 ? (
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
                                      opts.outputFormats?.includes(id)
                                        ? iconStyles.activeFormat
                                        : iconStyles.inactiveFormat
                                    }`}
                                    title={id.charAt(0).toUpperCase() + id.slice(1)}
                                  />
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          );
                        }
                      },
                      {
                        id: 'max-input',
                        label: 'Max Input',
                        icon: 'bi-sign-turn-right-fill',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const cw = data.options?.contextWindow;
                          return (
                            cw !== undefined ? 
                              <span className="px-2 py-0.5 bg-gray-800 text-xs font-mono rounded">
                                {cw.toLocaleString()} tokens
                              </span> 
                              : <span className="text-gray-500">-</span>
                          );
                        }
                      },
                      {
                        id: 'input-file-types',
                        label: 'Input File Types',
                        icon: 'bi-file-earmark-arrow-up',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const types = data.options?.inputFileTypes;
                          return (
                            types !== undefined ? (
                              Array.isArray(types) && types.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {(Array.isArray(types) ? types : [types]).map((t) => (
                                    <span key={t} className="px-2 py-0.5 bg-gray-800 text-xs font-mono rounded">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i 
                                  className={`bi bi-x-circle-fill ${brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                  style={{ color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor }}
                                />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          );
                        }
                      },
                      {
                        id: 'max-input-size',
                        label: 'Max Input Size',
                        icon: 'bi-file-earmark-plus',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const mis = data.options?.maxInputSize;
                          return (
                            mis !== undefined ? (
                              mis === 0 ? (
                                <i 
                                  className={`bi bi-x-circle-fill ${brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                  style={{ color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor }}
                                />
                              ) : (
                                <span className="px-2 py-0.5 bg-gray-800 text-xs font-mono rounded">
                                  {mis.toLocaleString()} MB
                                </span>
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          );
                        }
                      },
                      {
                        id: 'moderation',
                        label: 'Moderation',
                        icon: 'bi-shield-check',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const mod = data.options?.moderation;
                          return (
                            mod !== undefined ? (
                              Array.isArray(mod) && mod.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {(Array.isArray(mod) ? mod : [mod]).map((lvl) => (
                                    <span key={lvl} className="px-2 py-0.5 bg-gray-800 text-xs font-mono rounded capitalize">
                                      {lvl}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i 
                                  className={`bi bi-x-circle-fill ${brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                  style={{ color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor }}
                                />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          );
                        }
                      },
                      {
                        id: 'masking-support',
                        label: 'Masking Support',
                        icon: 'bi-brush',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const m = data.options?.mask;
                          return (
                            m !== undefined ? 
                              <i 
                                className={`${m ? 
                                  (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                  'bi bi-x-circle-fill'} ${brandConfig.name === 'OMG' && m ? 'bi bi-check-circle-fill text-lg' : ''}`}
                                style={m && brandConfig.name === 'OMG' ? 
                                  { color: brandConfig.secondaryColor } : 
                                  (!m ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                              /> :
                              <span className="text-gray-500">-</span>
                          );
                        }
                      },
                      {
                        id: 'structure-reference',
                        label: 'Structure Reference',
                        icon: 'bi-grid-3x3',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const sr = data.options?.structureReference;
                          return (
                            sr !== undefined ? 
                              <i 
                                className={`${sr ? 
                                  (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                  'bi bi-x-circle-fill'} ${brandConfig.name === 'OMG' && sr ? 'bi bi-check-circle-fill text-lg' : ''}`}
                                style={sr && brandConfig.name === 'OMG' ? 
                                  { color: brandConfig.secondaryColor } : 
                                  (!sr ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                              /> :
                              <span className="text-gray-500">-</span>
                          );
                        }
                      },
                      {
                        id: 'negative-prompt',
                        label: 'Negative Prompt',
                        icon: 'bi-dash-circle',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const np = data.options?.negativePrompt;
                          return (
                            np !== undefined ? 
                              <i 
                                className={`${np ? 
                                  (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                  'bi bi-x-circle-fill'} ${brandConfig.name === 'OMG' && np ? 'bi bi-check-circle-fill text-lg' : ''}`}
                                style={np && brandConfig.name === 'OMG' ? 
                                  { color: brandConfig.secondaryColor } : 
                                  (!np ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                              /> :
                              <span className="text-gray-500">-</span>
                          );
                        }
                      },
                      // Output-related fields (cyan icons)
                      {
                        id: 'output-file-types',
                        label: 'Output File Types',
                        icon: 'bi-file-earmark-arrow-down',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const o = data.options?.outputFileTypes;
                          return (
                            o !== undefined ? (
                              Array.isArray(o) && o.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {(Array.isArray(o) ? o : [o]).map((t) => (
                                    <span key={t} className="px-2 py-0.5 bg-gray-800 text-xs font-mono rounded">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i 
                                  className={`bi bi-x-circle-fill ${brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                  style={{ color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor }}
                                />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          );
                        }
                      },
                      {
                        id: 'output-sizes',
                        label: 'Output Sizes',
                        icon: 'bi-arrows-fullscreen',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const s = data.options?.outputSize;
                          return (
                            s !== undefined ? (
                              Array.isArray(s) && s.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center max-w-[16rem] mx-auto">
                                  {(Array.isArray(s) ? s : [s]).map((sz) => (
                                    <span key={sz} className="px-2 py-0.5 bg-gray-800 text-xs font-mono rounded">
                                      {sz}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i 
                                  className={`bi bi-x-circle-fill ${brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                  style={{ color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor }}
                                />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          );
                        }
                      },
                      {
                        id: 'quality-levels',
                        label: 'Quality Levels',
                        icon: 'bi-stars',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const q = data.options?.outputQuality;
                          return (
                            q !== undefined ? (
                              Array.isArray(q) && q.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {(Array.isArray(q) ? q : [q]).map((ql) => (
                                    <span key={ql} className="px-2 py-0.5 bg-gray-800 text-xs font-mono rounded capitalize">
                                      {ql}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i 
                                  className={`bi bi-x-circle-fill ${brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                  style={{ color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor }}
                                />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          );
                        }
                      },
                      {
                        id: 'output-compression',
                        label: 'Output Compression',
                        icon: 'bi-file-zip',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const oc = data.options?.outputCompression;
                          return (
                            oc !== undefined ? 
                              <i 
                                className={`${oc ? 
                                  (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                  'bi bi-x-circle-fill'} ${brandConfig.name === 'OMG' && oc ? 'bi bi-check-circle-fill text-lg' : ''} ${!oc && brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                style={oc && brandConfig.name === 'OMG' ? 
                                  { color: brandConfig.secondaryColor } : 
                                  (!oc ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                              /> :
                              <span className="text-gray-500">-</span>
                          );
                        }
                      },
                      {
                        id: 'style-options',
                        label: 'Style Options',
                        icon: 'bi-palette',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const st = data.options?.outputStyle;
                          return (
                            st !== undefined ? (
                              Array.isArray(st) && st.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {(Array.isArray(st) ? st : [st]).map((style) => (
                                    <span key={style} className="px-2 py-0.5 bg-gray-800 text-xs font-mono rounded capitalize">
                                      {style}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i 
                                  className={`bi bi-x-circle-fill ${brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                  style={{ color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor }}
                                />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          );
                        }
                      },
                      {
                        id: 'background',
                        label: 'Background',
                        icon: 'bi-square',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const bg = data.options?.background;
                          return (
                            bg !== undefined ? (
                              Array.isArray(bg) && bg.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {(Array.isArray(bg) ? bg : [bg]).map((b) => (
                                    <span key={b} className="px-2 py-0.5 bg-gray-800 text-xs font-mono rounded capitalize">
                                      {b}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <i 
                                  className={`bi bi-x-circle-fill ${brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                  style={{ color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor }}
                                />
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          );
                        }
                      },
                      {
                        id: 'visual-intensity',
                        label: 'Visual Intensity',
                        icon: 'bi-sliders',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const vi = data.options?.visualIntesity;
                          return (
                            vi !== undefined ? (
                              vi === 0 ? (
                                <i 
                                  className={`bi bi-x-circle-fill ${brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                  style={{ color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor }}
                                />
                              ) : (
                                <div className="flex items-center justify-center">
                                  <span className="px-2 py-0.5 bg-gray-800 text-xs font-mono rounded">
                                    1-{vi}
                                  </span>
                                </div>
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          );
                        }
                      },
                      {
                        id: 'tileable-output',
                        label: 'Tileable Output',
                        icon: 'bi-grid',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const t = data.options?.tileable;
                          return (
                            t !== undefined ? 
                              <i 
                                className={`${t ? 
                                  (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                  'bi bi-x-circle-fill'} ${brandConfig.name === 'OMG' && t ? 'bi bi-check-circle-fill text-lg' : ''} ${!t && brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                style={t && brandConfig.name === 'OMG' ? 
                                  { color: brandConfig.secondaryColor } : 
                                  (!t ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                              /> :
                              <span className="text-gray-500">-</span>
                          );
                        }
                      },
                      {
                        id: 'placement-position',
                        label: 'Placement Position',
                        icon: 'bi-bullseye',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const pp = data.options?.placementPosition;
                          return (
                            pp !== undefined ? 
                              <i 
                                className={`${pp ? 
                                  (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                  'bi bi-x-circle-fill'} ${brandConfig.name === 'OMG' && pp ? 'bi bi-check-circle-fill text-lg' : ''} ${!pp && brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                style={pp && brandConfig.name === 'OMG' ? 
                                  { color: brandConfig.secondaryColor } : 
                                  (!pp ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                              /> :
                              <span className="text-gray-500">-</span>
                          );
                        }
                      },
                      {
                        id: 'placement-alignment',
                        label: 'Placement Alignment',
                        icon: 'bi-layout-text-window',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          const pa = data.options?.placementAlignment;
                          return (
                            pa !== undefined ? 
                              <i 
                                className={`${pa ? 
                                  (brandConfig.name === 'OMG' ? '' : iconStyles.booleanTrue) : 
                                  'bi bi-x-circle-fill'} ${brandConfig.name === 'OMG' && pa ? 'bi bi-check-circle-fill text-lg' : ''} ${!pa && brandConfig.name === 'OMG' ? 'text-lg' : ''}`}
                                style={pa && brandConfig.name === 'OMG' ? 
                                  { color: brandConfig.secondaryColor } : 
                                  (!pa ? { color: brandConfig.name === 'OMG' ? '#ef4444' /* red-500 */ : brandConfig.primaryColor } : {})}
                              /> :
                              <span className="text-gray-500">-</span>
                          );
                        }
                      },
                      {
                        id: 'max-images',
                        label: 'Max Images',
                        icon: 'bi-images',
                        iconColor: 'text-cyan-400',
                        renderCell: (data: ApiEndpoint) => {
                          return (
                            data.options?.numberOfImages !== undefined ? 
                              data.options.numberOfImages : 
                              <span className="text-gray-500">-</span>
                          );
                        }
                      }
                      ];
                      
                      // Filter rows to only include those where at least one endpoint has a non-empty/non-false value
                      const filteredRows = allRows.filter(row => {
                        return endpoints.some(endpoint => {
                          // Get the result from renderCell
                          const renderResult = row.renderCell(endpoint);
                          
                          // Check if the feature is supported by seeing if renderCell returns anything other than "-" or iconStyles.booleanFalse
                          if (React.isValidElement(renderResult)) {
                            // If it's a React element, check for text content
                            if (renderResult.type === 'span' && (renderResult.props as { className?: string })?.className === 'text-gray-500') {
                              // This is a dash "-" indicator, feature not supported
                              return false;
                            }
                            
                            // Check if it's a boolean false icon
                            if (renderResult.type === 'i' && (renderResult.props as { className?: string })?.className?.includes(iconStyles.booleanFalse)) {
                              return false;
                            }
                            
                            // Otherwise it's either a supported feature or a more complex component like a flex container
                            return true;
                          }
                          
                          // Default to showing if we can't determine
                          return true;
                        });
                      });
                      
                      // Return the filtered rows array
                      return filteredRows;
                    })().map((row, index) => (
                      <tr key={row.id} className="cursor-pointer">
                        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={brandConfig.name === 'OMG' ? { backgroundColor: 'white' } : {}}>
                          <div className={containerStyles.flexCenter}>
                            <i className={`bi ${row.icon} ${
                              // Output-related rows get cyan/secondary color, others get fuchsia/primary color
                              ['output-formats', 'output-file-types', 'output-sizes', 'output-compression', 
                               'quality-levels', 'style-options', 'background', 'max-images', 
                               'visual-intensity', 'tileable-output', 'placement-position', 
                               'placement-alignment'].includes(row.id) 
                               ? brandConfig.name === 'OMG' ? '' : 'text-cyan-400' 
                               : brandConfig.name === 'OMG' ? '' : 'text-fuchsia-500'}`} 
                              style={brandConfig.name === 'OMG' ? 
                                (['output-formats', 'output-file-types', 'output-sizes', 'output-compression', 
                                 'quality-levels', 'style-options', 'background', 'max-images', 
                                 'visual-intensity', 'tileable-output', 'placement-position', 
                                 'placement-alignment'].includes(row.id))
                                  ? { color: brandConfig.secondaryColor } 
                                  : { color: brandConfig.primaryColor }
                                : {}}
                            />
                            <span className={`${textStyles.primary} ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'}`}>{row.label}</span>
                          </div>
                        </td>
                        {Object.entries(selectedModel.apiEndpoints || {})
                          .filter(([key]) => key !== 'available')
                          .map(([ep, data]) => (
                            <td key={`${ep}-${row.id}`} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                              {row.renderCell(data)}
                            </td>
                          ))
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Demo videos section */}
        {selectedModel.demoVideos && Object.keys(selectedModel.demoVideos).length > 0 && (
          <>
            <h3 className={`mb-3 ${brandConfig.name === 'OMG' ? 'text-lg font-semibold font-sans' : 'text-lg font-semibold font-mono'}`} style={{ color: brandConfig.primaryColor }}>Demo Videos</h3>
            <div className="mb-8">
              <VideoCarousel 
                videos={selectedModel.demoVideos}
                title={selectedModel.name}
                formatDemoName={formatDemoName}
                carouselId={`${selectedModel.id}-image-demo-videos`}
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
            <h3 className={`mb-3 ${brandConfig.name === 'OMG' ? 'text-lg font-semibold font-sans' : 'text-lg font-semibold font-mono'}`} style={{ color: brandConfig.primaryColor }}>Resources</h3>
            <div className={`${containerStyles.card} mb-6`} style={brandConfig.name === 'OMG' ? { backgroundColor: 'white' } : {}}>
              <div className="flex flex-wrap justify-center gap-3">
                {selectedModel.releasePost && (
                  <a 
                    href={selectedModel.releasePost} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 ${
                      brandConfig.name === 'OMG' 
                        ? 'bg-gray-100 hover:bg-gray-50 text-sm font-sans rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-newspaper text-xl ${
                      brandConfig.name === 'OMG' ? 'group-hover:text-blue-700' : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`} style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
                    <span>Release Post</span>
                  </a>
                )}
                {selectedModel.releaseVideo && (
                  <a 
                    href={selectedModel.releaseVideo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 ${
                      brandConfig.name === 'OMG' 
                        ? 'bg-gray-100 hover:bg-gray-50 text-sm font-sans rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-play-btn text-xl ${
                      brandConfig.name === 'OMG' ? 'group-hover:text-blue-700' : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`} style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
                    <span>Release Video</span>
                  </a>
                )}
                {selectedModel.systemCard && (
                  <a 
                    href={selectedModel.systemCard} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 ${
                      brandConfig.name === 'OMG' 
                        ? 'bg-gray-100 hover:bg-gray-50 text-sm font-sans rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-file-earmark-text text-xl ${
                      brandConfig.name === 'OMG' ? 'group-hover:text-blue-700' : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`} style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
                    <span>System Card</span>
                  </a>
                )}
                {selectedModel.modelPage && (
                  <a 
                    href={selectedModel.modelPage} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 ${
                      brandConfig.name === 'OMG' 
                        ? 'bg-gray-100 hover:bg-gray-50 text-sm font-sans rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-globe2 text-xl ${
                      brandConfig.name === 'OMG' ? 'group-hover:text-blue-700' : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`} style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
                    <span>Model Page</span>
                  </a>
                )}
                {selectedModel.modelGuide && (
                  <a 
                    href={selectedModel.modelGuide} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 ${
                      brandConfig.name === 'OMG' 
                        ? 'bg-gray-100 hover:bg-gray-50 text-sm font-sans rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-book text-xl ${
                      brandConfig.name === 'OMG' ? 'group-hover:text-blue-700' : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`} style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
                    <span>Model Guide</span>
                  </a>
                )}
                {selectedModel.apiDocumentation && (
                  <a 
                    href={selectedModel.apiDocumentation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 ${
                      brandConfig.name === 'OMG' 
                        ? 'bg-gray-100 hover:bg-gray-50 text-sm font-sans rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-code-square text-xl ${
                      brandConfig.name === 'OMG' ? 'group-hover:text-blue-700' : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`} style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
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
      <style>{tableHoverStyles}</style>
      
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