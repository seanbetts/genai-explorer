"use client";

import React, { useState } from "react";
import AudioCarousel from "../shared/AudioCarousel";
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
  /** Company ID for dynamic audio discovery */
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

        {/* Combined features grid: product, safety, and aspect ratios */}
        {/* Added extra bottom margin to separate from other sections */}
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
                        {/* Boolean features */}
                        {Object.entries(selectedModel.features.generation)
                          .filter(([key, value]) => typeof value === 'boolean')
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center h-8">
                              <i className={`${value === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                              <span className={textStyles.body}>{formatFeatureName(key)}</span>
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
                            <h5 className="text-xs font-medium text-gray-300 mb-2">Durations</h5>
                            <div className="flex flex-wrap gap-2">
                              {(selectedModel.features.generation.durations as Array<string | number>).map((value, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded">
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
                          .filter(([_, value]) => typeof value === 'boolean')
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center h-8">
                              <i className={`${value === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                              <span className={textStyles.body}>{formatFeatureName(key)}</span>
                            </div>
                          ))}
                      </div>
                      
                      {/* Object features */}
                      {Object.entries(selectedModel.features.editing)
                        .filter(([_, value]) => typeof value === 'object' && value !== null && !Array.isArray(value))
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
                {(selectedModel.features?.advanced && Object.keys(selectedModel.features.advanced).length > 0) ||
                 (selectedModel.apiEndpoints?.available !== undefined) ? (
                  <div className="mb-2">
                    <h4 className="text-sm font-semibold text-cyan-400 mb-2">Advanced</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {/* API Endpoint Availability */}
                      {selectedModel.apiEndpoints?.available !== undefined && (
                        <div className="flex items-center h-8">
                          <i className={`${selectedModel.apiEndpoints.available === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                          <span className={textStyles.body}>API Available</span>
                        </div>
                      )}
                      
                      {/* Advanced Features */}
                      {selectedModel.features?.advanced && Object.entries(selectedModel.features.advanced)
                        .filter(([_, value]) => typeof value === 'boolean')
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center h-8">
                            <i className={`${value === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                            <span className={textStyles.body}>{formatFeatureName(key)}</span>
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
          
          {/* Right column: Safety Features and Other Features */}
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
                          <i className="bi bi-patch-check-fill mr-1" /> C2PA Metadata
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
            
            {/* Voice Features - only show if there's relevant voice data with non-empty arrays */}
            {selectedModel.features?.other && 
             Object.keys(selectedModel.features.other).length > 0 && 
             ((Array.isArray(selectedModel.features.other.voices) && selectedModel.features.other.voices.length > 0) || 
              (Array.isArray(selectedModel.features.other.voiceFeatures) && selectedModel.features.other.voiceFeatures.length > 0) || 
              (Array.isArray(selectedModel.features.other.languages) && selectedModel.features.other.languages.length > 0)) && (
              <div>
                <h3 className={`${headingStyles.card} mb-3`}>Voice Features</h3>
                <div className={`${containerStyles.card} min-h-[12rem] h-auto`}>
                  <div className="space-y-4">
                    {/* Arrays of values like voices, languages, etc. */}
                    {Object.entries(selectedModel.features.other).map(([key, values]) => {
                      // Special handling for languages - show only 5 with a count
                      if (key === 'languages' && Array.isArray(values) && values.length > 5) {
                        const displayLanguages = values.slice(0, 5);
                        const remainingCount = values.length - 5;
                        
                        return (
                          <div key={key} className="mb-4">
                            <h4 className="text-sm font-semibold text-cyan-400 mb-2">{formatFeatureName(key)}</h4>
                            <div className="flex flex-wrap gap-2">
                              {displayLanguages.map((value, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded">
                                  {value}
                                </span>
                              ))}
                              <div className="inline-block relative">
                                <span 
                                  className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded cursor-help hover:bg-gray-600 transition-colors peer"
                                  title={values.slice(5).join(', ')}
                                >
                                  +{remainingCount} more
                                </span>
                                <div className="absolute left-0 bottom-full mb-2 w-80 bg-gray-800 p-3 rounded shadow-lg border border-gray-700 opacity-0 invisible peer-hover:visible peer-hover:opacity-100 hover:opacity-100 hover:visible z-50 transition-all duration-300 delay-75 hover:delay-[1000ms]">
                                  <div className="absolute -bottom-2 left-3 w-4 h-4 bg-gray-800 border-r border-b border-gray-700 transform rotate-45"></div>
                                  <h5 className="text-xs font-semibold text-fuchsia-500 mb-2">Additional Languages</h5>
                                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                                    {values.slice(5).map((value, index) => (
                                      <span key={index} className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded">
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
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">{formatFeatureName(key)}</h4>
                          {Array.isArray(values) && values.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {values.map((value, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded">
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
                                  <i className={`${subValue === true ? iconStyles.booleanTrue : 'bi bi-x-circle-fill text-fuchsia-500'} mr-2`} />
                                  <span className={textStyles.body}>{formatFeatureName(subKey)}</span>
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
            <h3 className={`${headingStyles.card} mb-3`}>Demo Videos</h3>
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
                {selectedModel.modelGuide && (
                  <a 
                    href={selectedModel.modelGuide} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]"
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
                    className="px-3 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-400 text-sm font-mono rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px]"
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

  // Render the audio examples carousel
  const renderAudioExamples = () => {
    // Check if the model has audio examples defined in the data
    const hasAudioExamplesInData = !!(selectedModel && selectedModel.audioExamples && 
        (Array.isArray(selectedModel.audioExamples) 
          ? selectedModel.audioExamples.length > 0 
          : typeof selectedModel.audioExamples === 'object' && Object.keys(selectedModel.audioExamples).length > 0));
    
    // For local audio files, check if the model has voice options that we can create audio links for
    const hasVoiceOptions = !!(selectedModel?.features?.other?.voices && 
                           Array.isArray(selectedModel.features.other.voices) && 
                           selectedModel.features.other.voices.length > 0);
    
    // If no audio examples are available from either source, return null
    if (!hasAudioExamplesInData && !hasVoiceOptions) {
      return null;
    }
    
    // If we have audio examples in the data, use those first
    if (hasAudioExamplesInData) {
      return (
        <div className="mb-8 p-0">
          <AudioCarousel 
            audio={selectedModel!.audioExamples as (Record<string, string> | string[])}
            title={selectedModel!.name}
            carouselId={`${selectedModel!.id}-audio-examples`}
            formatTrackName={(name) => {
              // Format snake_case or camelCase to Title Case with each word capitalized
              return name
                .replace(/_/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .replace(/\.\.\.$/, '...'); // Keep ellipses as is
            }}
          />
        </div>
      );
    }
    
    // Otherwise, create audio links from voice files in the public/audio folder
    const voiceAudioExamples: Record<string, string> = {};
    
    // Safely access and iterate over voices array
    const voices = selectedModel?.features?.other?.voices;
    if (Array.isArray(voices)) {
      voices.forEach((voice: string) => {
        // Check if the voice name is a string
        if (typeof voice === 'string') {
          // Create a link to the local audio file based on company ID and voice name
          voiceAudioExamples[voice] = `/audio/${companyId}/${voice.toLowerCase()}.mp3`;
        }
      });
    }
    
    // If we have voice audio examples, render the carousel
    if (Object.keys(voiceAudioExamples).length > 0) {
      return (
        <div className="mb-8 p-0">
          <h3 className={`${headingStyles.card} mb-3`}>Voice Samples</h3>
          <AudioCarousel 
            audio={voiceAudioExamples}
            title={selectedModel!.name}
            carouselId={`${selectedModel!.id}-voice-samples`}
            formatTrackName={(name) => {
              // Capitalize the voice name
              return name.charAt(0).toUpperCase() + name.slice(1);
            }}
          />
        </div>
      );
    }
    
    return null;
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