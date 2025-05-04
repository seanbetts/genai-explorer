"use client";

import React, { useEffect, useState } from "react";
import VideoCarousel from "../shared/VideoCarousel";
import { Model } from "../types";
import { textStyles, headingStyles } from "../utils/theme";
import {
  containerStyles,
  iconStyles,
} from "../utils/layout";

// -----------------------------------------------------------------------------
// Utility helpers -------------------------------------------------------------
// -----------------------------------------------------------------------------
function formatFeatureName(key: string): string {
  const specialCases: Record<string, string> = {
    textToVideo: "Text‑To‑Video",
    imageToVideo: "Image‑To‑Video",
    videoToVideo: "Video‑To‑Video",
    generativeExpand: "Generative Expand",
    generativeExtend: "Generative Extend",
    photoRealism: "Photorealism",
    characterConsistency: "Character Consistency",
    dataRetrieval: "Data Retrieval",
    realTimeData: "Real-Time Data",
    sourceAttribution: "Source Attribution",
    memoryCapacity: "Memory Capacity",
  };

  if (specialCases[key]) return specialCases[key];

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
interface SpecialisedModelGalleryProps {
  models: Model[];
  /** Company ID for dynamic discovery */
  companyId: string;
}

const SpecialisedModelGallery: React.FC<SpecialisedModelGalleryProps> = ({ models, companyId }) => {
  // ----- state ---------------------------------------------------------------
  const [selectedModelId, setSelectedModelId] = useState<string | null>(
    models.length ? models[0].id : null,
  );

  const selectedModel = models.find((m) => m.id === selectedModelId);

  // ---------------------------------------------------------------------------
  // Render helpers ------------------------------------------------------------
  // ---------------------------------------------------------------------------
  const renderModelTabs = () => (
    <div className="flex mb-6 overflow-x-auto scrollbar-hide pb-2">
      {models.map((model) => (
        <button
          key={model.id}
          className={`py-2 px-4 font-medium font-mono text-sm focus:outline-none focus-visible:outline-none ${
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

        <p className={`${textStyles.body} mb-8`}>{selectedModel.about || selectedModel.description}</p>

        {/* Combined features grid: product, safety, and aspect ratios */}
        {/* Added extra bottom margin to separate from other sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Model Features column */}
          <div>
            <h3 className={`${headingStyles.card} mb-3`}>Model Features</h3>
            <div className={`${containerStyles.card} min-h-[30.7rem] h-auto`}>
              <div className="space-y-4">
                {/* Specs section - display model capabilities */}
                {selectedModel.specs && (
                  <>
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">Capabilities</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Boolean features */}
                        {Object.entries(selectedModel.specs)
                          .filter(([key, value]) => typeof value === 'boolean' && !["openSource", "commercialUseAllowed"].includes(key))
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center h-8">
                              <i className={`${value === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                              <span className={textStyles.body}>{formatFeatureName(key)}</span>
                            </div>
                          ))}
                      </div>
                      
                      {/* Array features */}
                      {Object.entries(selectedModel.specs || {})
                        .filter(([key, value]) => 
                          Array.isArray(value) && 
                          value.length > 0 &&
                          !["techniques", "genres", "styles", "integrated"].includes(key)
                        )
                        .map(([key, values]) => (
                          <div key={key} className="mt-4 mb-4">
                            <h5 className="text-xs font-medium text-gray-300 mb-2">{formatFeatureName(key)}</h5>
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(values) && (values as Array<string | number>).map((value, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded">
                                  {value}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                      {/* Token limits */}
                      {(selectedModel.specs?.maxInputTokens || selectedModel.specs?.maxOutputTokens) && (
                        <div className="mt-4 mb-4">
                          <h5 className="text-xs font-medium text-gray-300 mb-2">Token Limits</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedModel.specs?.maxInputTokens && (
                              <div className="flex items-center h-8">
                                <i className="bi bi-arrow-right text-fuchsia-500 mr-2" />
                                <span className={textStyles.body}>
                                  Max Input: {selectedModel.specs.maxInputTokens.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {selectedModel.specs?.maxOutputTokens && (
                              <div className="flex items-center h-8">
                                <i className="bi bi-arrow-left text-fuchsia-500 mr-2" />
                                <span className={textStyles.body}>
                                  Max Output: {selectedModel.specs.maxOutputTokens.toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Knowledge cutoff */}
                      {selectedModel.specs?.knowledgeCutoff && (
                        <div className="mt-4 mb-4">
                          <div className="flex items-center h-8">
                            <i className="bi bi-calendar-check text-fuchsia-500 mr-2" />
                            <span className={textStyles.body}>
                              Knowledge Cutoff: {selectedModel.specs.knowledgeCutoff}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border-b border-gray-700 my-2"></div>
                  </>
                )}
                
                {/* Basic metadata */}
                <div className="mb-2">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">Model Info</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedModel.parameterCount && (
                      <div className="flex items-center h-8">
                        <i className="bi bi-cpu text-fuchsia-500 mr-2" />
                        <span className={textStyles.body}>Parameters: {selectedModel.parameterCount} billion</span>
                      </div>
                    )}
                    {selectedModel.contextLength && (
                      <div className="flex items-center h-8">
                        <i className="bi bi-text-paragraph text-fuchsia-500 mr-2" />
                        <span className={textStyles.body}>Context Length: {selectedModel.contextLength.toLocaleString()} tokens</span>
                      </div>
                    )}
                    {selectedModel.license && (
                      <div className="flex items-center h-8">
                        <i className="bi bi-shield-check text-fuchsia-500 mr-2" />
                        <span className={textStyles.body}>License: {selectedModel.license}</span>
                      </div>
                    )}
                    {selectedModel.specs?.openSource !== undefined && (
                      <div className="flex items-center h-8">
                        <i className={`${selectedModel.specs.openSource ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                        <span className={textStyles.body}>Open Source</span>
                      </div>
                    )}
                    {selectedModel.specs?.commercialUseAllowed !== undefined && (
                      <div className="flex items-center h-8">
                        <i className={`${selectedModel.specs.commercialUseAllowed ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                        <span className={textStyles.body}>Commercial Use Allowed</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* If there are any specialized techniques */}
                {selectedModel.specs?.techniques && selectedModel.specs.techniques.length > 0 && (
                  <>
                    <div className="border-b border-gray-700 my-2"></div>
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">Techniques</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedModel.specs.techniques.map((technique, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded">
                            {technique}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column: Integrations and Access */}
          <div className="space-y-6">
            {/* Integrations */}
            <div>
              <h3 className={`${headingStyles.card} mb-3`}>Integrations & Formats</h3>
              <div className={`${containerStyles.card} min-h-[12rem] h-auto`}>
                {/* Input/Output formats */}
                {(selectedModel.specs?.inputFormats?.length || selectedModel.specs?.outputFormats?.length) && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-cyan-400 mb-3">Formats</h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      {selectedModel.specs?.inputFormats && selectedModel.specs.inputFormats.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-300 mb-2">Input Formats</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedModel.specs.inputFormats.map((format, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded">
                                {format}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedModel.specs?.outputFormats && selectedModel.specs.outputFormats.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-300 mb-2">Output Formats</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedModel.specs.outputFormats.map((format, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded">
                                {format}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Integrations */}
                {selectedModel.specs?.integrated && selectedModel.specs.integrated.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-cyan-400 mb-3">Integrations</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedModel.specs.integrated.map((integration, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded">
                          {integration}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Access section */}
            <div>
              <h3 className={`${headingStyles.card} mb-3`}>Access</h3>
              <div className={`${containerStyles.card} h-auto`}>
                {/* API availability */}
                {selectedModel.apiEndpoints?.available !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center h-8">
                      <i className={`${selectedModel.apiEndpoints.available ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                      <span className={textStyles.body}>API Available</span>
                    </div>
                  </div>
                )}

                {/* Access types */}
                {selectedModel.access && selectedModel.access.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-cyan-400 mb-2">Access Methods</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedModel.access.map((accessType, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded">
                          {accessType}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing details */}
                {(selectedModel.specs?.pricingInputPerM !== undefined || 
                  selectedModel.specs?.pricingOutputPerM !== undefined) && (
                  <div className="mb-2">
                    <h4 className="text-sm font-semibold text-cyan-400 mb-2">Pricing (per 1M tokens)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedModel.specs?.pricingInputPerM !== undefined && (
                        <div className="flex items-center h-8">
                          <i className="bi bi-arrow-right text-fuchsia-500 mr-2" />
                          <span className={textStyles.body}>
                            Input: ${selectedModel.specs.pricingInputPerM.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {selectedModel.specs?.pricingOutputPerM !== undefined && (
                        <div className="flex items-center h-8">
                          <i className="bi bi-arrow-left text-fuchsia-500 mr-2" />
                          <span className={textStyles.body}>
                            Output: ${selectedModel.specs.pricingOutputPerM.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {selectedModel.specs?.pricingCachedInputPerM !== undefined && (
                        <div className="flex items-center h-8">
                          <i className="bi bi-clock-history text-fuchsia-500 mr-2" />
                          <span className={textStyles.body}>
                            Cached Input: ${selectedModel.specs.pricingCachedInputPerM.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Demo videos section */}
        {selectedModel.demoVideos && Object.keys(selectedModel.demoVideos).length > 0 && (
          <>
            <h3 className={`${headingStyles.card} mb-3`}>Demo Videos</h3>
            <div className="mb-8">
              <VideoCarousel 
                videos={selectedModel.demoVideos as Record<string, string>}
                title={selectedModel.name}
                formatDemoName={formatDemoName}
                carouselId={`${selectedModel.id}-demo-videos`}
              />
            </div>
          </>
        )}
        
        {/* Resources section - only show if at least one resource is available */}
        {(selectedModel.releasePost || 
          selectedModel.releaseVideo || 
          selectedModel.systemCard || 
          selectedModel.modelPage || 
          selectedModel.apiDocumentation ||
          selectedModel.licenceLink) && (
          <>
            <h3 className={`${headingStyles.card} mb-3`}>Resources</h3>
            <div className={`${containerStyles.card} mb-6`}>
              <div className="flex flex-wrap justify-center gap-3">
                {selectedModel.releasePost && (
                  <a 
                    href={selectedModel.releasePost} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]"
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
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]"
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
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]"
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
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]"
                  >
                    <i className="bi bi-globe2 text-xl text-fuchsia-500 group-hover:text-cyan-400"></i>
                    <span>Model Page</span>
                  </a>
                )}
                {selectedModel.apiDocumentation && (
                  <a 
                    href={selectedModel.apiDocumentation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]"
                  >
                    <i className="bi bi-code-square text-xl text-fuchsia-500 group-hover:text-cyan-400"></i>
                    <span>API Documentation</span>
                  </a>
                )}
                {selectedModel.licenceLink && (
                  <a 
                    href={selectedModel.licenceLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]"
                  >
                    <i className="bi bi-shield-check text-xl text-fuchsia-500 group-hover:text-cyan-400"></i>
                    <span>License</span>
                  </a>
                )}
                {selectedModel.huggingFace && (
                  <a 
                    href={selectedModel.huggingFace} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]"
                  >
                    <span className="text-xl text-fuchsia-500 group-hover:text-cyan-400">🤗</span>
                    <span>Hugging Face</span>
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Render the hero video carousel at the top
  const renderHeroVideo = () => {
    if (!selectedModel || !selectedModel.heroVideo || 
        (typeof selectedModel.heroVideo === 'object' && Object.keys(selectedModel.heroVideo).length === 0)) {
      return null;
    }

    return (
      <div className="mb-8 p-0">
        <VideoCarousel 
          videos={
            typeof selectedModel.heroVideo === 'object' 
              ? selectedModel.heroVideo as Record<string, string>
              : { "hero": selectedModel.heroVideo as string }
          }
          title={selectedModel.name}
          carouselId={`${selectedModel.id}-hero-video`}
          formatDemoName={formatDemoName}
        />
      </div>
    );
  };

  // Guard: no models 
  if (!models || models.length === 0) return null;

  return (
    <>
      {models.length > 1 && renderModelTabs()}
      {selectedModel && selectedModel.heroVideo && renderHeroVideo()}
      {renderModelDetails()}
    </>
  );
};

export default SpecialisedModelGallery;