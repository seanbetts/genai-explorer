"use client";

import React, { useState, useEffect } from "react";
import AudioCarousel from "../shared/AudioCarousel";
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
    textToMusic: "Text‑To‑Music",
    textToVoice: "Text‑To‑Voice",
    audioToMusic: "Audio‑To‑Music",
    customLyrics: "Custom Lyrics",
    seperateVocals: "Separate Vocals",
    generativeExtend: "Generative Extend",
    trainCustomModels: "Train Custom Models",
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
interface AudioModelGalleryProps {
  models: Model[];
  /** Company ID for paths to audio files */
  companyId: string;
}

const AudioModelGallery: React.FC<AudioModelGalleryProps> = ({ models, companyId }) => {
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
            <h3 className={`mb-3 text-lg font-semibold ${
              brandConfig.name === 'OMG'
                ? 'font-sans'
                : 'font-mono'
            }`}
            style={{ color: brandConfig.primaryColor }}>
              Model Features
            </h3>
            <div className={`min-h-[30.7rem] h-auto ${
              brandConfig.name === 'OMG'
                ? 'bg-white rounded-lg border border-gray-300 p-5'
                : containerStyles.card
            }`}>
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
                                  ? brandConfig.name === 'OMG'
                                    ? 'bi bi-check-circle-fill text-lg text-blue-500'
                                    : iconStyles.booleanTrue 
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
                      {/* Handle durations specially on a single line */}
                      {selectedModel.features.generation?.durations && 
                       Array.isArray(selectedModel.features.generation.durations) && 
                       selectedModel.features.generation.durations.length > 0 && (
                        <div className="mt-4 mb-4 flex flex-row justify-between space-x-2">
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
                                    ? 'bg-gray-200 border border-gray-300 font-sans'
                                    : 'bg-gray-700 text-cyan-400 font-mono'
                                }`}
                                style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
                                  {typeof value === 'number' 
                                    ? value === 9999
                                      ? "Unlimited"
                                      : value < 60 
                                        ? `${value} secs` 
                                        : value % 60 === 0
                                          ? `${Math.floor(value / 60)} mins`
                                          : `${Math.floor(value / 60)} mins ${value % 60} secs` 
                                    : value}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Handle other array features (like styles) */}
                      {Object.entries(selectedModel.features.generation || {})
                        .filter(([key, value]) => 
                          Array.isArray(value) && 
                          value.length > 0 && 
                          key !== 'durations'
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
                                    ? 'bg-gray-200 border border-gray-300 font-sans'
                                    : 'bg-gray-700 text-cyan-400 font-mono'
                                }`}
                                style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
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
                                  ? brandConfig.name === 'OMG'
                                    ? 'bi bi-check-circle-fill text-lg text-blue-500'
                                    : iconStyles.booleanTrue 
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
                                      ? brandConfig.name === 'OMG'
                                        ? 'bi bi-check-circle-fill text-lg text-blue-500'
                                        : iconStyles.booleanTrue 
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
                                  ? brandConfig.name === 'OMG'
                                    ? 'bi bi-check-circle-fill text-lg text-blue-500'
                                    : iconStyles.booleanTrue 
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
                              ? brandConfig.name === 'OMG'
                                ? 'bi bi-check-circle-fill text-lg text-blue-500'
                                : iconStyles.booleanTrue 
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
                      
                      {/* Advanced Features */}
                      {selectedModel.features?.advanced && Object.entries(selectedModel.features.advanced)
                        .filter(([_, value]) => typeof value === 'boolean')
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center h-8">
                            <i className={`${
                              value === true 
                                ? brandConfig.name === 'OMG'
                                  ? 'bi bi-check-circle-fill text-lg text-blue-500'
                                  : iconStyles.booleanTrue 
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
                                    ? brandConfig.name === 'OMG'
                                      ? 'bi bi-check-circle-fill text-lg text-blue-500'
                                      : iconStyles.booleanTrue 
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
                ) : null}
              </div>
            </div>
          </div>
          
          {/* Right column: Safety Features and Other Features */}
          <div className="space-y-6">
            {/* Safety Features */}
            <div>
              <h3 className={`mb-3 text-lg font-semibold ${
                brandConfig.name === 'OMG'
                  ? 'font-sans'
                  : 'font-mono'
              }`}
              style={{ color: brandConfig.primaryColor }}>
                Safety Features
              </h3>
              { (Object.keys(selectedModel.safety ?? {}).length > 0 ||
                  selectedModel.termsOfService ||
                  selectedModel.usagePolicy ||
                  selectedModel.commerciallySafe !== undefined) ? (
              <div className={`min-h-[12rem] h-auto ${
                brandConfig.name === 'OMG'
                  ? 'bg-white rounded-lg border border-gray-300 p-5'
                  : containerStyles.card
              }`}>
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
                                ? brandConfig.name === 'OMG'
                                  ? 'bi bi-check-circle-fill text-lg text-blue-500'
                                  : iconStyles.booleanTrue 
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
                          <i className={`${
                            ipRespectEnabled 
                              ? brandConfig.name === 'OMG'
                                ? 'bi bi-check-circle-fill text-lg text-blue-500'
                                : iconStyles.booleanTrue 
                              : brandConfig.name === 'OMG'
                                ? 'bi bi-x-circle-fill text-red-500'
                                : 'bi bi-x-circle-fill text-fuchsia-500'
                          } mr-3`} />
                          <span className={`${
                            brandConfig.name === 'OMG'
                              ? 'text-gray-800 font-sans'
                              : textStyles.body
                          }`}>IP Respect</span>
                        </div>
                      )}
                      {selectedModel.commerciallySafe !== undefined && (
                        <div className="flex items-center h-8">
                          <i className={`${
                            selectedModel.commerciallySafe 
                              ? brandConfig.name === 'OMG'
                                ? 'bi bi-check-circle-fill text-lg text-blue-500'
                                : iconStyles.booleanTrue 
                              : brandConfig.name === 'OMG'
                                ? 'bi bi-x-circle-fill text-red-500'
                                : 'bi bi-x-circle-fill text-fuchsia-500'
                          } mr-3`} />
                          <span className={`${
                            brandConfig.name === 'OMG'
                              ? 'text-gray-800 font-sans'
                              : textStyles.body
                          }`}>{selectedModel.commerciallySafe ? 'Commercially safe' : 'Not commercially safe'}</span>
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
              <div className={`min-h-[12rem] h-auto flex items-center justify-center ${
                brandConfig.name === 'OMG'
                  ? 'bg-white rounded-lg border border-gray-300 p-5'
                  : containerStyles.card
              }`}>
                  <p className={`${
                    brandConfig.name === 'OMG'
                      ? 'text-gray-600 font-sans'
                      : textStyles.body
                  }`}>No safety features</p>
                </div>
              )}
            </div>
            
            {/* Voice Features - only show if there's relevant voice data with non-empty arrays */}
            {selectedModel.features?.other && 
             Object.keys(selectedModel.features.other).length > 0 && 
             ((Array.isArray(selectedModel.features.other.voices) && selectedModel.features.other.voices.length > 0) || 
              (Array.isArray(selectedModel.features.other.voiceFeatures) && selectedModel.features.other.voiceFeatures.length > 0) || 
              (Array.isArray(selectedModel.features.other.languages) && selectedModel.features.other.languages.length > 0)) && (
              <div>
                <h3 className={`mb-3 text-lg font-semibold ${
                  brandConfig.name === 'OMG'
                    ? 'font-sans'
                    : 'font-mono'
                }`}
                style={{ color: brandConfig.primaryColor }}>
                  Voice Features
                </h3>
                <div className={`min-h-[12rem] h-auto ${
                  brandConfig.name === 'OMG'
                    ? 'bg-white rounded-lg border border-gray-300 p-5'
                    : containerStyles.card
                }`}>
                  <div className="space-y-4">
                    {/* Arrays of values like voices, languages, etc. */}
                    {Object.entries(selectedModel.features.other).map(([key, values]) => {
                      // Special handling for languages - show only 5 with a count
                      if (key === 'languages' && Array.isArray(values) && values.length > 5) {
                        const displayLanguages = values.slice(0, 5);
                        const remainingCount = values.length - 5;
                        
                        return (
                          <div key={key} className="mb-4">
                            <h4 className={`text-sm font-semibold mb-2 ${
                              brandConfig.name === 'OMG'
                                ? 'text-blue-600 font-sans'
                                : 'text-cyan-400 font-mono'
                            }`}
                            style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
                              {formatFeatureName(key)}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {displayLanguages.map((value, index) => (
                                <span key={index} className={`px-2 py-1 text-xs rounded ${
                                  brandConfig.name === 'OMG'
                                    ? 'bg-gray-200 border border-gray-300 font-sans'
                                    : 'bg-gray-700 text-cyan-400 font-mono'
                                }`}
                                style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
                                  {value}
                                </span>
                              ))}
                              <div className="inline-block relative">
                                <span 
                                  className={`px-2 py-1 text-xs rounded cursor-help transition-colors peer ${
                                    brandConfig.name === 'OMG'
                                      ? 'bg-gray-200 border border-gray-300 hover:bg-gray-300 font-sans'
                                      : 'bg-gray-700 text-cyan-400 hover:bg-gray-600 font-mono'
                                  }`}
                                  style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                                  title={values.slice(5).join(', ')}
                                >
                                  +{remainingCount} more
                                </span>
                                <div className={`absolute left-0 bottom-full mb-2 w-80 p-3 rounded shadow-lg opacity-0 invisible peer-hover:visible peer-hover:opacity-100 hover:opacity-100 hover:visible z-50 transition-all duration-300 delay-75 hover:delay-[1000ms] ${
                                  brandConfig.name === 'OMG'
                                    ? 'bg-white border border-gray-300'
                                    : 'bg-gray-800 border border-gray-700'
                                }`}>
                                  <div className={`absolute -bottom-2 left-3 w-4 h-4 ${
                                    brandConfig.name === 'OMG'
                                      ? 'bg-white border-r border-b border-gray-300'
                                      : 'bg-gray-800 border-r border-b border-gray-700'
                                  } transform rotate-45`}></div>
                                  <h5 className={`text-xs font-semibold mb-2 ${
                                    brandConfig.name === 'OMG'
                                      ? 'text-blue-600 font-sans'
                                      : 'text-fuchsia-500 font-mono'
                                  }`}
                                  style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}>
                                    Additional Languages
                                  </h5>
                                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                                    {values.slice(5).map((value, index) => (
                                      <span key={index} className={`px-2 py-1 text-xs rounded ${
                                        brandConfig.name === 'OMG'
                                          ? 'bg-gray-200 border border-gray-300 font-sans'
                                          : 'bg-gray-700 text-cyan-400 font-mono'
                                      }`}
                                      style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
                                        {value}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      // Standard rendering for other arrays
                      return (
                        <div key={key} className="mb-4">
                          <h4 className={`text-sm font-semibold mb-2 ${
                            brandConfig.name === 'OMG'
                              ? 'text-blue-600 font-sans'
                              : 'text-cyan-400 font-mono'
                          }`}
                          style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
                            {formatFeatureName(key)}
                          </h4>
                          {Array.isArray(values) && values.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {values.map((value, index) => (
                                <span key={index} className={`px-2 py-1 text-xs rounded ${
                                  brandConfig.name === 'OMG'
                                    ? 'bg-gray-200 border border-gray-300 font-sans'
                                    : 'bg-gray-700 text-cyan-400 font-mono'
                                }`}
                                style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>
                                  {value}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* Handle non-array values if needed */}
                          {!Array.isArray(values) && typeof values === 'object' && (
                            <div className="pl-4">
                              {Object.entries(values as Record<string, any>).map(([subKey, subValue]) => (
                                <div key={subKey} className="flex items-center h-8">
                                  <i className={`${
                                    subValue === true 
                                      ? brandConfig.name === 'OMG'
                                        ? 'bi bi-check-circle-fill text-lg text-blue-500'
                                        : iconStyles.booleanTrue 
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
                          )}
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
            <h3 className={`mb-3 text-lg font-semibold ${
              brandConfig.name === 'OMG'
                ? 'font-sans'
                : 'font-mono'
            }`}
            style={{ color: brandConfig.primaryColor }}>
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
            <h3 className={`mb-3 text-lg font-semibold ${
              brandConfig.name === 'OMG'
                ? 'font-sans'
                : 'font-mono'
            }`}
            style={{ color: brandConfig.primaryColor }}>
              Resources
            </h3>
            <div className={`mb-6 ${
              brandConfig.name === 'OMG'
                ? 'bg-white rounded-lg border border-gray-300 p-5'
                : containerStyles.card
            }`}>
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

  // Render the audio examples carousel
  const renderAudioExamples = () => {
    // Only proceed if we have a selected model
    if (!selectedModel || selectedModel.category !== 'audio') {
      return null;
    }
    
    // Check if model has audio examples
    if (!selectedModel.audioExamples) {
      return null;
    }
    
    const audioExamples = selectedModel.audioExamples as any;
    
    // Process audio files and embeds from the data structure
    const processedAudio: Record<string, string> = {};
    
    // Handle file array (convert to full paths)
    if (audioExamples.files && Array.isArray(audioExamples.files)) {
      audioExamples.files.forEach((filename: string) => {
        // Create display name by formatting the filename
        const displayName = filename
          .replace(/\.mp3$/, '')
          .replace(/[-_]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        // Build full path based on company
        processedAudio[displayName] = `/audio/${companyId}/${filename}`;
      });
    }
    
    // Add embeds if available
    if (audioExamples.embeds && typeof audioExamples.embeds === 'object') {
      Object.entries(audioExamples.embeds).forEach(([key, url]) => {
        // Format the key name
        const displayName = key
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        processedAudio[displayName] = url as string;
      });
    }
    
    // Only render if we have processed audio to display
    if (Object.keys(processedAudio).length === 0) {
      return null;
    }
    
    return (
      <div className="mb-8 p-0">
        <AudioCarousel 
          audio={processedAudio}
          title={selectedModel.name}
          carouselId={`${selectedModel.id}-audio-examples`}
          formatTrackName={(name) => name} // Names are already formatted
        />
      </div>
    );
  };

  // Guard: no models 
  if (!models || models.length === 0) return null;

  return (
    <>
      {models.length > 1 && renderModelTabs()}
      {renderAudioExamples()}
      {renderModelDetails()}
    </>
  );
};

export default AudioModelGallery;