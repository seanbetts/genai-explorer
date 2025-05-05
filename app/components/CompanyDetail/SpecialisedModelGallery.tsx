"use client";

import React, { useEffect, useState } from "react";
import VideoCarousel from "../shared/VideoCarousel";
import FeatureGrid from "./FeatureGrid";
import { Model, Feature } from "../types";
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
  /** Company features to display */
  features?: Feature[];
}

const SpecialisedModelGallery: React.FC<SpecialisedModelGalleryProps> = ({ models, companyId, features = [] }) => {
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
          className={`py-2 px-4 font-medium text-sm focus:outline-none focus-visible:outline-none ${
            brandConfig.name === 'OMG'
              ? 'font-sans'
              : 'font-mono'
          } ${
            selectedModelId === model.id
              ? brandConfig.name === 'OMG'
                ? 'border-blue-600 text-blue-600'
                : 'border-cyan-400 text-cyan-400'
              : brandConfig.name === 'OMG'
                ? 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-400'
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
          }`}
          style={{
            borderBottomWidth: '2px',
            borderBottomColor: selectedModelId === model.id && brandConfig.name === 'OMG' 
              ? brandConfig.secondaryColor 
              : 'transparent'
          }}
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
          <h2 className={`text-2xl font-semibold mt-2 tracking-tight ${
            brandConfig.name === 'OMG'
              ? 'text-gray-900 font-sans'
              : 'text-fuchsia-500 font-mono'
          }`}
          style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}>
            {selectedModel.name}
          </h2>
          {selectedModel.releaseDate && (
            <div className={`flex items-center text-sm mt-4 ${
              brandConfig.name === 'OMG'
                ? 'text-gray-600 font-sans'
                : 'text-gray-400 font-mono'
            }`}>
              <i className={`bi bi-calendar-event mr-2 ${
                brandConfig.name === 'OMG'
                  ? 'text-blue-600'
                  : 'text-fuchsia-500'
              }`}
              style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}} />
              <span>
                Released: {new Date(selectedModel.releaseDate).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          )}
        </div>

        <p className={`${textStyles.body} mb-8`}>{selectedModel.about || selectedModel.description}</p>
        
        {/* Features section */}
        {features && features.length > 0 && (
          <>
            <h3 className={`mb-3 ${
              brandConfig.name === 'OMG'
                ? 'font-sans text-lg'
                : 'font-mono text-lg'
            }`}
            style={{ color: brandConfig.primaryColor }}>Product Features</h3>
            <div className="mb-8">
              <FeatureGrid features={features} />
            </div>
          </>
        )}
        
        {/* Demo videos section */}
        {selectedModel.demoVideos && Object.keys(selectedModel.demoVideos).length > 0 && (
          <>
            <h3 className={`mb-3 ${
              brandConfig.name === 'OMG'
                ? 'font-sans text-lg'
                : 'font-mono text-lg'
            }`}
            style={{ color: brandConfig.primaryColor }}>Demo Videos</h3>
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
          selectedModel.modelGuide ||
          selectedModel.apiDocumentation ||
          selectedModel.licenceLink ||
          selectedModel.termsOfService ||
          selectedModel.usagePolicy) && (
          <>
            <h3 className={`mb-3 ${
              brandConfig.name === 'OMG'
                ? 'font-sans text-lg'
                : 'font-mono text-lg'
            }`}
            style={{ color: brandConfig.primaryColor }}>Resources</h3>
            <div className={`${containerStyles.card} mb-6`}>
              <div className="flex flex-wrap justify-center gap-3">
                {selectedModel.releasePost && (
                  <a 
                    href={selectedModel.releasePost} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-newspaper text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-500'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
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
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-play-btn text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-500'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
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
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-file-earmark-text text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-500'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
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
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-globe2 text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-500'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
                    <span>Model Page</span>
                  </a>
                )}
                {selectedModel.apiDocumentation && (
                  <a 
                    href={selectedModel.apiDocumentation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-code-square text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-500'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
                    <span>API Documentation</span>
                  </a>
                )}
                {selectedModel.licenceLink && (
                  <a 
                    href={selectedModel.licenceLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-shield-check text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-500'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
                    <span>License</span>
                  </a>
                )}
                {selectedModel.huggingFace && (
                  <a 
                    href={selectedModel.huggingFace} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <span className={`text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-500'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}>🤗</span>
                    <span>Hugging Face</span>
                  </a>
                )}
                {selectedModel.termsOfService && (
                  <a 
                    href={selectedModel.termsOfService} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-file-earmark-text text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-500'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
                    <span>Terms of Service</span>
                  </a>
                )}
                {selectedModel.usagePolicy && (
                  <a 
                    href={selectedModel.usagePolicy} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-shield-check text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-500'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
                    <span>Usage Policy</span>
                  </a>
                )}
                {selectedModel.modelGuide && (
                  <a 
                    href={selectedModel.modelGuide} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-3 text-sm rounded transition-colors flex flex-col items-center justify-center gap-2 group w-[200px] h-[90px] ${
                      brandConfig.name === 'OMG'
                        ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 font-sans'
                        : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 font-mono'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}
                  >
                    <i className={`bi bi-book text-xl ${
                      brandConfig.name === 'OMG'
                        ? 'text-blue-700 group-hover:text-blue-500'
                        : 'text-fuchsia-500 group-hover:text-cyan-400'
                    }`}
                    style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}></i>
                    <span>Model Guide</span>
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