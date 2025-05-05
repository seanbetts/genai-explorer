"use client";

import React, { useEffect, useState } from "react";
import VideoCarousel from "../shared/VideoCarousel";
import { Model } from "../types";
import { textStyles, headingStyles } from "../utils/theme";
import {
  containerStyles,
  iconStyles,
} from "../utils/layout";
import brandConfig from "../../config/brand";

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
interface VideoModelGalleryProps {
  models: Model[];
  /** Company ID for dynamic video discovery */
  companyId: string;
}

const VideoModelGallery: React.FC<VideoModelGalleryProps> = ({ models, companyId }) => {
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
          className={`py-2 px-4 font-medium ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} text-sm focus:outline-none focus-visible:outline-none ${
            selectedModelId === model.id
              ? brandConfig.name === 'OMG'
                ? "border-blue-500 text-blue-600" 
                : "border-cyan-400 text-cyan-400"
              : brandConfig.name === 'OMG'
                ? "border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-400"
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
    
    // Get C2PA metadata URL if available
    const c2paDocsUrl = selectedModel.metadata?.C2PA || 
      (typeof selectedModel.safety?.C2PA === 'string' ? selectedModel.safety.C2PA : undefined) ||
      (typeof selectedModel.safety?.c2pa === 'string' ? selectedModel.safety.c2pa : undefined);

    return (
      <div className="mb-8">
        {/* heading + release date */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-2 mb-1">
          <h2 className={`text-2xl font-semibold mt-2 tracking-tight ${
            brandConfig.name === 'OMG'
              ? 'text-blue-700 font-sans'
              : 'text-fuchsia-500 font-mono'
            }`}
            style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}
          >
            {selectedModel.name}
          </h2>
          {selectedModel.releaseDate && (
            <div className={`flex items-center text-sm ${
              brandConfig.name === 'OMG'
                ? 'text-gray-600 font-sans'
                : 'text-gray-400 font-mono'
              } mt-4`}>
              <i className={`bi bi-calendar-event mr-2 ${
                brandConfig.name === 'OMG' ? '' : 'text-fuchsia-500'
              }`} 
              style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}} />
              <span>
                Released: {new Date(selectedModel.releaseDate).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          )}
        </div>

        <p className={`${textStyles.body} mb-8`}>{selectedModel.about}</p>

        {/* Combined features grid: product, safety, and aspect ratios */}
        {/* Added extra bottom margin to separate from other sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Model Features column */}
          <div>
            <h3 className={`mb-3 ${
              brandConfig.name === 'OMG'
                ? 'text-lg font-semibold text-gray-800 font-sans'
                : headingStyles.card
            }`}
            style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}>
              Model Features
            </h3>
            <div className={`${containerStyles.card} min-h-[30.7rem] h-auto`}>
              <div className="space-y-4">
                {/* Generation Features */}
                {selectedModel.features?.generation && Object.keys(selectedModel.features.generation).length > 0 && (
                  <>
                    <div className="mb-2">
                      <h4 className={`text-sm font-semibold mb-2 ${
                        brandConfig.name === 'OMG'
                          ? 'text-blue-600 font-sans'
                          : 'text-cyan-400 font-mono'
                      }`}
                      style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
                        Generation
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Boolean features */}
                        {Object.entries(selectedModel.features.generation)
                          .filter(([_, value]) => typeof value === 'boolean')
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center h-8">
                              <i className={`${
                                value === true 
                                  ? iconStyles.booleanTrue 
                                  : brandConfig.name === 'OMG'
                                    ? 'bi bi-x-circle-fill text-red-500'
                                    : 'bi bi-x-circle-fill text-fuchsia-500'
                              } mr-2`} />
                              <span className={`${
                                brandConfig.name === 'OMG'
                                  ? 'text-gray-800 font-sans'
                                  : textStyles.body
                              }`}>
                                {formatFeatureName(key)}
                              </span>
                            </div>
                          ))}
                      </div>
                      
                      {/* Array features with special formatting */}
                      {/* Handle resolutions, durations, and numberOfVideos specially on a single line */}
                      {selectedModel.features.generation?.resolutions || 
                       selectedModel.features.generation?.durations || 
                       selectedModel.features.generation?.numberOfVideos ? (
                        <div className="mt-4 flex flex-row justify-between space-x-2">
                          {/* Resolutions */}
                          {selectedModel.features.generation?.resolutions && 
                           Array.isArray(selectedModel.features.generation.resolutions) && 
                           selectedModel.features.generation.resolutions.length > 0 && (
                            <div className="flex-1">
                              <h5 className={`text-xs font-medium mb-2 ${
                                brandConfig.name === 'OMG'
                                  ? 'text-gray-600 font-sans'
                                  : 'text-gray-300 font-mono'
                              }`}>Resolutions</h5>
                              <div className="flex flex-wrap gap-2">
                                {(selectedModel.features.generation.resolutions as string[]).map((value, index) => (
                                  <span key={index} className={`px-2 py-1 text-xs rounded ${
                                    brandConfig.name === 'OMG'
                                      ? 'bg-gray-200 text-gray-800 border border-gray-300 font-sans'
                                      : 'bg-gray-700 text-cyan-400 font-mono'
                                  }`}>
                                    {value}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Durations */}
                          {selectedModel.features.generation?.durations && 
                           Array.isArray(selectedModel.features.generation.durations) && 
                           selectedModel.features.generation.durations.length > 0 && (
                            <div className="flex-1">
                              <h5 className={`text-xs font-medium mb-2 ${
                                brandConfig.name === 'OMG'
                                  ? 'text-gray-600 font-sans'
                                  : 'text-gray-300 font-mono'
                              }`}>Durations</h5>
                              <div className="flex flex-wrap gap-2">
                                {(selectedModel.features.generation.durations as Array<string | number>).map((value, index) => (
                                  <span key={index} className={`px-2 py-1 text-xs rounded ${
                                    brandConfig.name === 'OMG'
                                      ? 'bg-gray-200 text-gray-800 border border-gray-300 font-sans'
                                      : 'bg-gray-700 text-cyan-400 font-mono'
                                  }`}>
                                    {typeof value === 'number' ? `${value}s` : value}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Number of Videos */}
                          {selectedModel.features.generation?.numberOfVideos && 
                           Array.isArray(selectedModel.features.generation.numberOfVideos) && 
                           selectedModel.features.generation.numberOfVideos.length > 0 && (
                            <div className="flex-1">
                              <h5 className={`text-xs font-medium mb-2 ${
                                brandConfig.name === 'OMG'
                                  ? 'text-gray-600 font-sans'
                                  : 'text-gray-300 font-mono'
                              }`}>Video Count</h5>
                              <div className="flex flex-wrap gap-2">
                                {(selectedModel.features.generation.numberOfVideos as Array<string | number>).map((value, index) => (
                                  <span key={index} className={`px-2 py-1 text-xs rounded ${
                                    brandConfig.name === 'OMG'
                                      ? 'bg-gray-200 text-gray-800 border border-gray-300 font-sans'
                                      : 'bg-gray-700 text-cyan-400 font-mono'
                                  }`}>
                                    {value}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}
                      
                      {/* Handle other array features (like videoStyles) */}
                      {Object.entries(selectedModel.features.generation || {})
                        .filter(([key, value]) => 
                          Array.isArray(value) && 
                          value.length > 0 && 
                          key !== 'resolutions' && 
                          key !== 'durations' && 
                          key !== 'numberOfVideos'
                        )
                        .map(([key, values]) => (
                          <div key={key} className="mt-4 mb-4">
                            <h5 className={`text-xs font-medium mb-2 ${
                              brandConfig.name === 'OMG'
                                ? 'text-gray-600 font-sans'
                                : 'text-gray-300 font-mono'
                            }`}>{formatFeatureName(key)}</h5>
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(values) && (values as Array<string | number>).map((value, index) => (
                                <span key={index} className={`px-2 py-1 text-xs rounded ${
                                  brandConfig.name === 'OMG'
                                    ? 'bg-gray-200 text-gray-800 border border-gray-300 font-sans'
                                    : 'bg-gray-700 text-cyan-400 font-mono'
                                }`}>
                                  {value}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className={`border-b my-2 ${
                      brandConfig.name === 'OMG'
                        ? 'border-gray-200'
                        : 'border-gray-700'
                    }`}></div>
                  </>
                )}
                
                {/* Editing Features */}
                {selectedModel.features?.editing && Object.keys(selectedModel.features.editing).length > 0 && (
                  <>
                    <div className="mb-2">
                      <h4 className={`text-sm font-semibold mb-2 ${
                        brandConfig.name === 'OMG'
                          ? 'text-blue-600 font-sans'
                          : 'text-cyan-400 font-mono'
                      }`}
                      style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
                        Editing
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedModel.features.editing)
                          .filter(([_, value]) => typeof value === 'boolean')
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center h-8">
                              <i className={`${
                                value === true 
                                  ? iconStyles.booleanTrue 
                                  : brandConfig.name === 'OMG'
                                    ? 'bi bi-x-circle-fill text-red-500'
                                    : 'bi bi-x-circle-fill text-fuchsia-500'
                              } mr-2`} />
                              <span className={`${
                                brandConfig.name === 'OMG'
                                  ? 'text-gray-800 font-sans'
                                  : textStyles.body
                              }`}>
                                {formatFeatureName(key)}
                              </span>
                            </div>
                          ))}
                      </div>
                      
                      {/* Object features */}
                      {Object.entries(selectedModel.features.editing)
                        .filter(([_, value]) => typeof value === 'object' && value !== null && !Array.isArray(value))
                        .map(([key, value]) => (
                          <div key={key} className="mt-4">
                            <h4 className={`text-sm font-semibold mb-2 ${
                              brandConfig.name === 'OMG'
                                ? 'text-blue-600 font-sans'
                                : 'text-cyan-400 font-mono'
                            }`}
                            style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
                              {formatFeatureName(key)}
                            </h4>
                            <div className="pl-4">
                              {Object.entries(value as Record<string, any>).map(([subKey, subValue]) => (
                                <div key={subKey} className="flex items-center h-8">
                                  <i className={`${
                                    subValue === true 
                                      ? iconStyles.booleanTrue 
                                      : brandConfig.name === 'OMG'
                                        ? 'bi bi-x-circle-fill text-red-500'
                                        : 'bi bi-x-circle-fill text-fuchsia-500'
                                  } mr-2`} />
                                  <span className={`${
                                    brandConfig.name === 'OMG'
                                      ? 'text-gray-800 font-sans'
                                      : textStyles.body
                                  }`}>
                                    {formatFeatureName(subKey)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className={`border-b my-2 ${
                      brandConfig.name === 'OMG'
                        ? 'border-gray-200'
                        : 'border-gray-700'
                    }`}></div>
                  </>
                )}
                
                {/* Enhancement Features */}
                {selectedModel.features?.enhancement && Object.keys(selectedModel.features.enhancement).length > 0 && (
                  <>
                    <div className="mb-2">
                      <h4 className={`text-sm font-semibold mb-2 ${
                        brandConfig.name === 'OMG'
                          ? 'text-blue-600 font-sans'
                          : 'text-cyan-400 font-mono'
                      }`}
                      style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
                        Enhancement
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedModel.features.enhancement)
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center h-8">
                              <i className={`${
                                value === true 
                                  ? iconStyles.booleanTrue 
                                  : brandConfig.name === 'OMG'
                                    ? 'bi bi-x-circle-fill text-red-500'
                                    : 'bi bi-x-circle-fill text-fuchsia-500'
                              } mr-2`} />
                              <span className={`${
                                brandConfig.name === 'OMG'
                                  ? 'text-gray-800 font-sans'
                                  : textStyles.body
                              }`}>
                                {formatFeatureName(key)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className={`border-b my-2 ${
                      brandConfig.name === 'OMG'
                        ? 'border-gray-200'
                        : 'border-gray-700'
                    }`}></div>
                  </>
                )}
                
                {/* Advanced Features */}
                {(selectedModel.features?.advanced && Object.keys(selectedModel.features.advanced).length > 0) ||
                 (selectedModel.apiEndpoints?.available !== undefined) ? (
                  <div className="mb-2">
                    <h4 className={`text-sm font-semibold mb-2 ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-600 font-sans'
                        : 'text-cyan-400 font-mono'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
                      Advanced
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {/* API Endpoint Availability */}
                      {selectedModel.apiEndpoints?.available !== undefined && (
                        <div className="flex items-center h-8">
                          <i className={`${
                            selectedModel.apiEndpoints.available === true 
                              ? iconStyles.booleanTrue 
                              : brandConfig.name === 'OMG'
                                ? 'bi bi-x-circle-fill text-red-500'
                                : 'bi bi-x-circle-fill text-fuchsia-500'
                          } mr-2`} />
                          <span className={`${
                            brandConfig.name === 'OMG'
                              ? 'text-gray-800 font-sans'
                              : textStyles.body
                          }`}>
                            API Available
                          </span>
                        </div>
                      )}
                    
                      {/* Advanced boolean features */}
                      {selectedModel.features?.advanced && Object.entries(selectedModel.features.advanced)
                        .filter(([_, value]) => typeof value === 'boolean')
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center h-8">
                            <i className={`${
                            value === true 
                              ? iconStyles.booleanTrue 
                              : brandConfig.name === 'OMG'
                                ? 'bi bi-x-circle-fill text-red-500'
                                : 'bi bi-x-circle-fill text-fuchsia-500'
                          } mr-2`} />
                          <span className={`${
                            brandConfig.name === 'OMG'
                              ? 'text-gray-800 font-sans'
                              : textStyles.body
                          }`}>
                            {formatFeatureName(key)}
                          </span>
                          </div>
                        ))}
                    </div>
                    
                    {/* Object features */}
                    {selectedModel.features?.advanced && Object.entries(selectedModel.features.advanced)
                      .filter(([_, value]) => typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value as object).length > 0)
                      .map(([key, value]) => (
                        <div key={key} className="mt-4">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">{formatFeatureName(key)}</h4>
                          <div className="pl-4">
                            {Object.entries(value as Record<string, any>).map(([subKey, subValue]) => (
                              <div key={subKey} className="flex items-center h-8">
                                <i className={`${subValue === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                                <span className={textStyles.body}>{formatFeatureName(subKey)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          
          {/* Right column: Safety Features and Aspect Ratios */}
          <div className="space-y-6">
            {/* Safety Features */}
            <div>
              <h3 className={`mb-3 ${
                brandConfig.name === 'OMG'
                  ? 'text-lg font-semibold text-gray-800 font-sans'
                  : headingStyles.card
              }`}
              style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}>
                Safety Features
              </h3>
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
                            <i className={`${
                            value === true 
                              ? iconStyles.booleanTrue 
                              : brandConfig.name === 'OMG'
                                ? 'bi bi-x-circle-fill text-red-500'
                                : 'bi bi-x-circle-fill text-fuchsia-500'
                          } mr-2`} />
                          <span className={`${
                            brandConfig.name === 'OMG'
                              ? 'text-gray-800 font-sans'
                              : textStyles.body
                          }`}>
                            {formatFeatureName(key)}
                          </span>
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
                          className={`px-3 py-1 text-xs rounded transition-colors inline-flex items-center gap-1 w-fit mt-2 ${
                            brandConfig.name === 'OMG'
                              ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 hover:text-blue-800 font-sans border border-gray-300'
                              : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 font-mono'
                          }`}
                        >
                          <i className={`bi bi-shield-check mr-1 ${
                            brandConfig.name === 'OMG' ? 'text-blue-700' : ''
                          }`} /> Usage Policy
                        </a>
                      )}
                      {selectedModel.termsOfService && (
                        <a
                          href={selectedModel.termsOfService}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1 text-xs rounded transition-colors inline-flex items-center gap-1 w-fit mt-2 ${
                            brandConfig.name === 'OMG'
                              ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 hover:text-blue-800 font-sans border border-gray-300'
                              : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 font-mono'
                          }`}
                        >
                          <i className={`bi bi-file-earmark-text mr-1 ${
                            brandConfig.name === 'OMG' ? 'text-blue-700' : ''
                          }`} /> Terms of Service
                        </a>
                      )}
                      {c2paDocsUrl && (
                        <a
                          href={c2paDocsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1 text-xs rounded transition-colors inline-flex items-center gap-1 w-fit mt-2 ${
                            brandConfig.name === 'OMG'
                              ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 hover:text-blue-800 font-sans border border-gray-300'
                              : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 font-mono'
                          }`}
                        >
                          <i className={`bi bi-patch-check-fill mr-1 ${
                            brandConfig.name === 'OMG' ? 'text-blue-700' : ''
                          }`} /> C2PA Metadata
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
                <h3 className={`mb-3 ${
                  brandConfig.name === 'OMG'
                    ? 'text-lg font-semibold text-gray-800 font-sans'
                    : headingStyles.card
                }`}
                style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}>
                  Aspect Ratios
                </h3>
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
                        
                        // Capitalize ratio label
                        const capitalizedRatio = ratio
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
                        
                        return (
                          <div key={ratio} className="flex items-center">
                            <div className={`w-16 h-10 relative mr-3 rounded border ${
                              supported 
                                ? brandConfig.name === 'OMG'
                                  ? 'border-blue-500'
                                  : 'border-cyan-400'
                                : brandConfig.name === 'OMG'
                                  ? 'border-gray-300 opacity-50'
                                  : 'border-gray-600 opacity-50'
                            }`}>
                              <div className={`absolute inset-0 rounded ${
                                brandConfig.name === 'OMG'
                                  ? 'bg-gray-100'
                                  : 'bg-gray-700'
                              } flex items-center justify-center`}>
                                <svg width="100%" height="100%" viewBox="0 0 16 10">
                                  <rect
                                    x={offsetX}
                                    y={offsetY}
                                    width={scaledWidth}
                                    height={scaledHeight}
                                    fill={
                                      supported 
                                        ? brandConfig.name === 'OMG'
                                          ? brandConfig.primaryColor
                                          : "#D946EF"
                                        : brandConfig.name === 'OMG'
                                          ? "#9CA3AF"
                                          : "#6B7280"
                                    }
                                    stroke={
                                      supported 
                                        ? brandConfig.name === 'OMG'
                                          ? brandConfig.secondaryColor
                                          : "#F5D0FE"
                                        : brandConfig.name === 'OMG'
                                          ? "#D1D5DB"
                                          : "#4B5563"
                                    }
                                    strokeWidth="0.3"
                                    rx="0.3"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <i className={`${
                                supported 
                                  ? iconStyles.booleanTrue 
                                  : brandConfig.name === 'OMG'
                                    ? 'bi bi-x-circle-fill text-red-500'
                                    : 'bi bi-x-circle-fill text-fuchsia-500'
                              } mr-2`} />
                              <span className={`text-sm font-medium ${
                                brandConfig.name === 'OMG'
                                  ? 'text-gray-800 font-sans'
                                  : textStyles.body
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

        {/* Demo videos section */}
        {selectedModel.demoVideos && Object.keys(selectedModel.demoVideos).length > 0 && (
          <>
            <h3 className={`mb-3 ${
              brandConfig.name === 'OMG'
                ? 'text-lg font-semibold text-gray-800 font-sans'
                : headingStyles.card
            }`}
            style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}>
              Demo Videos
            </h3>
            <div className="mb-8">
              <VideoCarousel 
                videos={selectedModel.demoVideos}
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
          selectedModel.modelGuide || 
          selectedModel.apiDocumentation) && (
          <>
            <h3 className={`mb-3 ${
              brandConfig.name === 'OMG'
                ? 'text-lg font-semibold text-gray-800 font-sans'
                : headingStyles.card
            }`}
            style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}>
              Resources
            </h3>
            <div className={`${containerStyles.card} mb-6`}>
              <div className="flex flex-wrap justify-center gap-3">
                {selectedModel.releasePost && (
                  <a 
                    href={selectedModel.releasePost} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans border border-gray-300'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                  >
                    <i className={`bi bi-newspaper text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-800'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}></i>
                    <span>Release Post</span>
                  </a>
                )}
                {selectedModel.releaseVideo && (
                  <a 
                    href={selectedModel.releaseVideo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans border border-gray-300'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                  >
                    <i className={`bi bi-play-btn text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-800'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}></i>
                    <span>Release Video</span>
                  </a>
                )}
                {selectedModel.systemCard && (
                  <a 
                    href={selectedModel.systemCard} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans border border-gray-300'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                  >
                    <i className={`bi bi-file-earmark-text text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-800'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}></i>
                    <span>System Card</span>
                  </a>
                )}
                {selectedModel.modelPage && (
                  <a 
                    href={selectedModel.modelPage} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans border border-gray-300'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                  >
                    <i className={`bi bi-globe2 text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-800'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}></i>
                    <span>Model Page</span>
                  </a>
                )}
                {selectedModel.modelGuide && (
                  <a 
                    href={selectedModel.modelGuide} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans border border-gray-300'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                  >
                    <i className={`bi bi-book text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-800'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}></i>
                    <span>Model Guide</span>
                  </a>
                )}
                {selectedModel.apiDocumentation && (
                  <a 
                    href={selectedModel.apiDocumentation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans border border-gray-300'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                  >
                    <i className={`bi bi-code-square text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-800'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}></i>
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

  // Render the video examples carousel (similar to how ImageModelGallery shows images at the top)
  const renderVideoExamples = () => {
    if (!selectedModel || !selectedModel.videoExamples || 
        (Array.isArray(selectedModel.videoExamples) 
          ? selectedModel.videoExamples.length === 0 
          : typeof selectedModel.videoExamples === 'object' && Object.keys(selectedModel.videoExamples).length === 0)) {
      return null;
    }

    return (
      <div className="mb-8 p-0">
        <VideoCarousel 
          videos={
            // Handle both array and object formats
            Array.isArray(selectedModel.videoExamples) 
              ? Object.fromEntries(
                  (selectedModel.videoExamples as string[]).map((url, index) => 
                    [`example_${index + 1}`, url]
                  )
                )
              : selectedModel.videoExamples as Record<string, string>
          }
          title={selectedModel.name}
          carouselId={`${selectedModel.id}-video-examples`}
          formatDemoName={(name) => {
            // For the old format (example_1, example_2, etc.), replace with Example X
            if (name.startsWith('example_')) {
              return name.replace('example_', 'Example ');
            }
            
            // For the new format (snake_case keys), convert to Title Case
            return name
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          }}
        />
      </div>
    );
  };

  // Guard: no models 
  if (!models || models.length === 0) return null;

  return (
    <>
      {models.length > 1 && renderModelTabs()}
      {selectedModel && selectedModel.videoExamples && 
       (Array.isArray(selectedModel.videoExamples) 
         ? selectedModel.videoExamples.length > 0 
         : typeof selectedModel.videoExamples === 'object' && Object.keys(selectedModel.videoExamples).length > 0) && 
       renderVideoExamples()}
      {renderModelDetails()}
    </>
  );
};

export default VideoModelGallery;