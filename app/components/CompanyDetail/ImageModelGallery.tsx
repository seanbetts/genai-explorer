'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Model } from '../types';
import { textStyles, headingStyles } from '../utils/theme';
import { containerStyles, buttonStyles, iconStyles } from '../utils/layout';
import { getValidImageUrl, PLACEHOLDER_IMAGE } from '../utils/imageUtils';

// Component to handle image loading with fallback
const ImageWithFallback = ({ src, alt, ...props }: {
  src: string;
  alt: string;
  [key: string]: any;
}) => {
  const [imgError, setImgError] = useState(false);
  
  // Ensure the src prop is updated when it changes
  // This is key to making sure the image updates when navigating
  return (
    <Image
      {...props}
      src={imgError ? PLACEHOLDER_IMAGE : src}
      alt={alt}
      quality={imgError ? 100 : 85} // Higher quality for placeholder
      unoptimized={imgError} // Skip optimization for placeholder
      onError={() => {
        setImgError(true);
      }}
    />
  );
};

// Special component just for handling thumbnail scrolling
// This component has a single responsibility: scroll the active thumbnail into view
const ThumbnailScroller = ({ activeIndex, isKeyboardNav = false }: { 
  activeIndex: number;
  isKeyboardNav?: boolean;
}) => {
  // Use layout effect (runs synchronously after DOM updates, before browser paint)
  React.useLayoutEffect(() => {
    // Function to scroll the thumbnail into view
    const scrollThumbnail = () => {
      const activeThumb = document.getElementById(`thumbnail-${activeIndex}`);
      
      if (activeThumb) {
        // Directly use the browser's scrollIntoView API
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    };

    // Call immediately
    scrollThumbnail();
    
    // For keyboard navigation, we add an additional delayed call
    // This addresses timing issues that can occur with keyboard events
    if (isKeyboardNav) {
      // Add a small delay for keyboard navigation to ensure DOM is fully updated
      const timeoutId = setTimeout(scrollThumbnail, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [activeIndex, isKeyboardNav]); // Run when active index or keyboard nav flag changes
  
  // This component doesn't render anything
  return null;
};

interface ImageModelGalleryProps {
  models: Model[];
}

const ImageModelGallery: React.FC<ImageModelGalleryProps> = ({ models }) => {
  // State to track the currently selected model
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id || '');
  // State to track the current image index for the carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // State to track if the navigation was keyboard-driven
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);
  
  // Get the currently selected model
  const selectedModel = models.find(model => model.id === selectedModelId) || models[0];

  // Select the first model by default if none selected
  React.useEffect(() => {
    if (!selectedModelId && models.length > 0) {
      setSelectedModelId(models[0].id);
    }
  }, [models, selectedModelId]);
  
  // Handle model tab selection
  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setCurrentImageIndex(0); // Reset image index when switching models
  };

  // Navigation for image carousel using useCallback for stability
  const nextImage = React.useCallback(() => {
    if (selectedModel?.exampleImages && selectedModel.exampleImages.length > 0) {
      const nextIndex = (currentImageIndex + 1) % selectedModel.exampleImages.length;
      console.log(`Moving to next image: ${nextIndex}`);
      setCurrentImageIndex(nextIndex);
    }
  }, [selectedModel, currentImageIndex, setCurrentImageIndex]);

  const prevImage = React.useCallback(() => {
    if (selectedModel?.exampleImages && selectedModel.exampleImages.length > 0) {
      const prevIndex = (currentImageIndex - 1 + selectedModel.exampleImages.length) % selectedModel.exampleImages.length;
      console.log(`Moving to previous image: ${prevIndex}`);
      setCurrentImageIndex(prevIndex);
    }
  }, [selectedModel, currentImageIndex, setCurrentImageIndex]);
  
  // Add keyboard navigation for image gallery - placed after function definitions
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedModel?.exampleImages && selectedModel.exampleImages.length > 1) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          // Set the keyboard navigation flag before changing the image
          setIsKeyboardNav(true);
          
          if (e.key === 'ArrowRight') {
            nextImage();
          } else {
            prevImage();
          }
          
          // Reset the flag after a short delay
          setTimeout(() => {
            setIsKeyboardNav(false);
          }, 200);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedModel, nextImage, prevImage, setIsKeyboardNav]); // Include setIsKeyboardNav in dependencies
  
  // We've removed the thumbnail scrolling effect in favor of the ThumbnailScroller component
  // This gives us better separation of concerns and more reliable execution

  // Function to render model selection tabs
  const renderModelTabs = () => {
    return (
      <div className="flex mb-6 overflow-x-auto scrollbar-hide pb-2">
        {models.map(model => (
          <button
            key={model.id}
            className={`py-2 px-4 font-medium font-mono text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap mr-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              selectedModelId === model.id
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
            }`}
            onClick={() => handleModelSelect(model.id)}
          >
            {model.name}
          </button>
        ))}
      </div>
    );
  };

  // Function to render model details section
  const renderModelDetails = () => {
    if (!selectedModel) return null;

    return (
      <div className="mb-8">
        <h2 className={headingStyles.section}>{selectedModel.name}</h2>
        <p className={`${textStyles.body} mb-4`}>{selectedModel.about}</p>
        
        {/* Model capabilities section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`${containerStyles.card} h-full`}>
            <h3 className={headingStyles.card}>Capabilities</h3>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {selectedModel.features && Object.entries(selectedModel.features)
                .filter(([_, value]) => value === true)
                .map(([key]) => (
                  <div key={key} className="flex items-center">
                    <i className={`${iconStyles.booleanTrue} mr-2`}></i>
                    <span className={textStyles.body}>{formatFeatureName(key)}</span>
                  </div>
                ))
              }
            </div>
          </div>

          <div className={`${containerStyles.card} h-full`}>
            <h3 className={headingStyles.card}>Resources</h3>
            <div className="flex flex-col items-start gap-2 mt-4">
              {selectedModel.modelPage && (
                <a 
                  href={selectedModel.modelPage} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1"
                >
                  <i className="bi bi-globe2"></i> Model Page
                </a>
              )}
              {selectedModel.releasePost && (
                <a 
                  href={selectedModel.releasePost} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1"
                >
                  <i className="bi bi-newspaper"></i> Release Post
                </a>
              )}
              {selectedModel.releaseVideo && (
                <a 
                  href={selectedModel.releaseVideo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1"
                >
                  <i className="bi bi-play-btn"></i> Release Video
                </a>
              )}
              {selectedModel.systemCard && (
                <a 
                  href={selectedModel.systemCard} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1"
                >
                  <i className="bi bi-file-earmark-text"></i> System Card
                </a>
              )}
              {selectedModel.modelGuide && (
                <a 
                  href={selectedModel.modelGuide} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1"
                >
                  <i className="bi bi-book"></i> Model Guide
                </a>
              )}
              {selectedModel.apiDocumentation && (
                <a 
                  href={selectedModel.apiDocumentation} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-xs font-mono rounded transition-colors inline-flex items-center gap-1"
                >
                  <i className="bi bi-code-square"></i> API Documentation
                </a>
              )}
            </div>
          </div>
        </div>

        {/* API endpoints section */}
        {selectedModel.apiEndpoints && Object.keys(selectedModel.apiEndpoints).length > 0 && (
          <div className={`${containerStyles.card} mb-6`}>
            <h3 className={headingStyles.card}>API Endpoints</h3>
            <div className="mt-4">
              {Object.entries(selectedModel.apiEndpoints).map(([endpoint, data]) => (
                <div key={endpoint} className="mb-4">
                  <h4 className={`${textStyles.accent} mb-2`}>{formatEndpointName(endpoint)}</h4>
                  
                  {data.options && (
                    <div className="pl-4 border-l-2 border-fuchsia-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {data.options.inputFormats && (
                          <div>
                            <span className={`${textStyles.label} block mb-1`}>Input Formats:</span>
                            <div className="flex flex-wrap gap-1">
                              {data.options.inputFormats.map(format => (
                                <span key={format} className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded">
                                  {format}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {data.options.outputFormats && (
                          <div>
                            <span className={`${textStyles.label} block mb-1`}>Output Formats:</span>
                            <div className="flex flex-wrap gap-1">
                              {data.options.outputFormats.map(format => (
                                <span key={format} className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded">
                                  {format}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {data.options.outputSize && (
                          <div>
                            <span className={`${textStyles.label} block mb-1`}>Output Sizes:</span>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(data.options.outputSize) ? 
                                data.options.outputSize.map(size => (
                                  <span key={size} className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded">
                                    {size}
                                  </span>
                                )) : 
                                <span className="px-2 py-0.5 bg-gray-700 text-xs font-mono rounded">
                                  {data.options.outputSize}
                                </span>
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Demo videos section */}
        {selectedModel.demoVideos && Object.keys(selectedModel.demoVideos).length > 0 && (
          <div className={`${containerStyles.card} mb-6`}>
            <h3 className={headingStyles.card}>Demo Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {Object.entries(selectedModel.demoVideos).map(([key, url]) => (
                <a 
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 text-sm font-mono rounded transition-colors"
                >
                  <i className="bi bi-play-circle"></i> {formatDemoName(key)}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Function to render the image gallery
  const renderImageGallery = () => {
    if (!selectedModel || !selectedModel.exampleImages || selectedModel.exampleImages.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg border border-gray-700">
          <p className={textStyles.bodyLarge}>No example images available</p>
        </div>
      );
    }

    // Debug log
    console.log(`Rendering image ${currentImageIndex} of ${selectedModel.exampleImages.length} images`);
    console.log(`Current image path: ${selectedModel.exampleImages[currentImageIndex]}`);

    // Current image to display
    const currentImage = selectedModel.exampleImages[currentImageIndex];
    const hasMultipleImages = selectedModel.exampleImages.length > 1;

    return (
      <div className="relative">
        <div className="relative h-[500px] bg-gray-900 rounded-lg overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <ImageWithFallback
              key={`image-${selectedModel.id}-${currentImageIndex}`} // Key forces re-render when image changes
              src={getValidImageUrl(currentImage)}
              alt={`Example image ${currentImageIndex + 1} from ${selectedModel.name}`}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
              priority={currentImageIndex < 3} // Prioritize loading the first few images
            />
          </div>
          
          {/* Navigation arrows - only show if multiple images */}
          {hasMultipleImages && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  prevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-90 hover:opacity-100 transition-opacity group-hover:opacity-100 focus:outline-none z-20"
                aria-label="Previous image"
              >
                <i className="bi bi-chevron-left text-2xl"></i>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-90 hover:opacity-100 transition-opacity group-hover:opacity-100 focus:outline-none z-20"
                aria-label="Next image"
              >
                <i className="bi bi-chevron-right text-2xl"></i>
              </button>
            </>
          )}
          
          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 right-3 bg-black/70 px-4 py-1.5 rounded-full text-white text-sm font-mono z-10">
              {currentImageIndex + 1} / {selectedModel.exampleImages.length}
            </div>
          )}
        </div>
        
        {/* Thumbnail gallery for quick navigation */}
        {selectedModel.exampleImages.length > 4 && (
          <div className="mt-4 overflow-x-auto scrollbar-hide">
            <div 
              className="flex gap-2 py-2 max-w-full" 
              style={{ scrollbarWidth: 'none' }}
              id="thumbnail-container"
            >
              {/* Add the thumbnail scroller component - it handles scrolling separately */}
              <ThumbnailScroller 
                activeIndex={currentImageIndex}
                isKeyboardNav={isKeyboardNav} 
              />
              
              {selectedModel.exampleImages.map((image, index) => (
                <button 
                  key={index}
                  id={`thumbnail-${index}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 relative w-16 h-16 rounded overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-cyan-400' : 'opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <ImageWithFallback
                    key={`thumb-${selectedModel.id}-${index}`}
                    src={getValidImageUrl(image)}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper functions to format labels
  const formatFeatureName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  const formatEndpointName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  const formatDemoName = (key: string): string => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Return null if no models available
  if (!models || models.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Model selection tabs if more than one model */}
      {models.length > 1 && renderModelTabs()}
      
      {/* Image gallery at the top */}
      <div className="mb-8">
        {renderImageGallery()}
      </div>
      
      {/* Model details below the gallery */}
      <div>
        {renderModelDetails()}
      </div>
    </div>
  );
};

export default ImageModelGallery;