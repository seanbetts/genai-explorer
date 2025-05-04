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
          {/* Product Features column */}
          <div>
            <h3 className={`${headingStyles.card} mb-3`}>Product Features</h3>
            <div className={`${containerStyles.card} min-h-[15rem] h-auto`}>
              <div className="space-y-4">
                {/* Dynamic feature categories from model.features object */}
                {selectedModel.features && Object.keys(selectedModel.features).length > 0 && (
                  <>
                    {/* Map over each feature section (section_1, section_2, etc.) */}
                    {Object.entries(selectedModel.features).map(([sectionKey, features], index, featuresArray) => {
                      if (!features || Object.keys(features).length === 0) return null;
                      
                      // Format section name (convert section_1 to Section 1, etc.)
                      const sectionName = sectionKey.startsWith('section_') 
                        ? `Section ${sectionKey.split('_')[1]}`
                        : formatFeatureName(sectionKey);
                      
                      // Determine if this is the last feature section to add API availability
                      const isLastSection = index === featuresArray.length - 1;
                      
                      return (
                        <React.Fragment key={sectionKey}>
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-cyan-400 mb-2">{sectionName}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {/* Boolean features */}
                              {Object.entries(features)
                                .filter(([_, value]) => typeof value === 'boolean')
                                .map(([key, value]) => (
                                  <div key={key} className="flex items-center h-8">
                                    <i className={`${value === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                                    <span className={textStyles.body}>{formatFeatureName(key)}</span>
                                  </div>
                                ))}
                              
                              {/* Add API availability to the last section */}
                              {isLastSection && selectedModel.apiEndpoints?.available !== undefined && (
                                <div className="flex items-center h-8">
                                  <i className={`${selectedModel.apiEndpoints.available === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                                  <span className={textStyles.body}>API Available</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Array features */}
                            {Object.entries(features)
                              .filter(([_, value]) => Array.isArray(value) && value.length > 0)
                              .map(([key, values]) => (
                                <div key={key} className="mt-4 mb-4">
                                  <h5 className="text-xs font-medium text-gray-300 mb-2">{formatFeatureName(key)}</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {Array.isArray(values) && (values as Array<string | number>).map((value, index) => (
                                      <span key={index} className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded">
                                        {typeof value === 'number' ? `${value}s` : value}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              
                            {/* Object features */}
                            {Object.entries(features)
                              .filter(([_, value]) => typeof value === 'object' && value !== null && !Array.isArray(value))
                              .map(([key, value]) => (
                                <div key={key} className="mt-4">
                                  <h5 className="text-xs font-medium text-gray-300 mb-2">{formatFeatureName(key)}</h5>
                                  <div className="pl-4">
                                    {Object.entries(value as Record<string, any>).map(([subKey, subValue]) => {
                                      if (typeof subValue === 'boolean') {
                                        return (
                                          <div key={subKey} className="flex items-center h-8">
                                            <i className={`${subValue === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                                            <span className={textStyles.body}>{formatFeatureName(subKey)}</span>
                                          </div>
                                        );
                                      } else if (Array.isArray(subValue) && subValue.length > 0) {
                                        return (
                                          <div key={subKey} className="mt-2 mb-3">
                                            <h6 className="text-xs font-medium text-gray-400 mb-1">{formatFeatureName(subKey)}</h6>
                                            <div className="flex flex-wrap gap-1">
                                              {subValue.map((item, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded">
                                                  {item}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })}
                                  </div>
                                </div>
                              ))}
                          </div>
                          
                          {/* Add divider if not the last section */}
                          {index < featuresArray.length - 1 && (
                            <div className="border-b border-gray-700 my-4"></div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </>
                )}
                
              </div>
            </div>
          </div>
          
          {/* Right column: Safety Features */}
          <div className="space-y-6">
            {/* Safety Features */}
            <div>
              <h3 className={`${headingStyles.card} mb-3`}>Safety Features</h3>
              { (Object.keys(selectedModel.safety ?? {}).length > 0 ||
                  selectedModel.termsOfService ||
                  selectedModel.usagePolicy ||
                  selectedModel.commerciallySafe !== undefined) ? (
              <div className={`${containerStyles.card} min-h-[15rem] h-auto`}>
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
                      {/* IP Respect */}
                      {(selectedModel.safety?.IPRespect !== undefined || selectedModel.safety?.ipRespect !== undefined) && (
                        <div className="flex items-center h-8">
                          <i className={`${(selectedModel.safety?.IPRespect === true || selectedModel.safety?.ipRespect === true) ? 
                            iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-3`} />
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
                    </div>
                  </div>
                </div>
              ) : (
              <div className={`${containerStyles.card} min-h-[30.7rem] h-auto flex items-center justify-center`}>
                  <p className={textStyles.body}>No safety features</p>
                </div>
              )}
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