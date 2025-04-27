"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { getValidImageUrl, PLACEHOLDER_IMAGE } from "../utils/imageUtils";
import ImageWithFallback from "./ImageWithFallback";

interface ThumbnailScrollerProps {
  activeIndex: number;
  isKeyboardNav?: boolean;
  isCentered?: boolean;
}
const ThumbnailScroller: React.FC<ThumbnailScrollerProps> = ({
  activeIndex,
  isKeyboardNav = false,
}) => {
  // Use both useLayoutEffect and useEffect to ensure scrolling happens reliably
  useLayoutEffect(() => {
    scrollToActiveThumbnail();
  }, [activeIndex, isKeyboardNav]);
  
  // Also use regular useEffect as a backup to ensure scrolling works after render
  useEffect(() => {
    scrollToActiveThumbnail();
    // Add a small delay to ensure thumbnails are fully rendered
    const timer = setTimeout(scrollToActiveThumbnail, 100);
    return () => clearTimeout(timer);
  }, [activeIndex, isKeyboardNav]);
  
  const scrollToActiveThumbnail = () => {
    const el = document.getElementById(`thumbnail-${activeIndex}`);
    const container = document.getElementById('thumbnail-container');
    if (!el || !container) return;
    
    // Only scroll if the container is scrollable (content wider than container)
    const thumbnailsWidth = container.scrollWidth;
    const containerWidth = container.offsetWidth;
    
    if (thumbnailsWidth <= containerWidth) {
      // No scrolling needed if all thumbnails fit in the container
      container.scrollLeft = 0;
      return;
    }
    
    // Calculate the offset needed to center the active thumbnail
    const thumbnailCenter = el.offsetLeft + el.offsetWidth / 2;
    const containerCenter = container.offsetWidth / 2;
    container.scrollLeft = thumbnailCenter - containerCenter;
  };
  
  return null;
};

// -----------------------------------------------------------------------------
// Main image carousel component ------------------------------------------------
// -----------------------------------------------------------------------------
interface ImageCarouselProps {
  images: string[];
  title: string;
  onOpenFullscreen?: (imageSrc: string) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  title,
  onOpenFullscreen 
}) => {
  // ----- state ---------------------------------------------------------------
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);
  const [shouldCenterThumbnails, setShouldCenterThumbnails] = useState(true);
  
  // ----- derived values ------------------------------------------------------
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex] ?? PLACEHOLDER_IMAGE;
  
  // ----- thumbnail layout management ----------------------------------------
  useEffect(() => {
    // Check if thumbnails should be centered or left-aligned for scrolling
    const checkThumbnailLayout = () => {
      const container = document.getElementById('thumbnail-container');
      if (!container) return;
      
      // Calculate the total width of all thumbnails (16px width + 0.25rem gap per thumbnail)
      const thumbnailsTotalWidth = images.length * (64 + 4); // 64px for thumbnail width, 4px for gap
      const containerWidth = container.offsetWidth;
      
      // If thumbnails total width is less than container, they should be centered
      setShouldCenterThumbnails(thumbnailsTotalWidth < containerWidth);
    };
    
    // Check on initial load and window resize
    checkThumbnailLayout();
    window.addEventListener('resize', checkThumbnailLayout);
    
    return () => window.removeEventListener('resize', checkThumbnailLayout);
  }, [images.length]);

  // ----- image navigation ----------------------------------------------------
  const nextImage = useCallback(() => {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((i) => (i + 1) % images.length);
  }, [hasMultipleImages, images.length]);

  const prevImage = useCallback(() => {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((i) =>
      i === 0 ? images.length - 1 : i - 1,
    );
  }, [hasMultipleImages, images.length]);

  // keyboard arrows -----------------------------------------------------------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!hasMultipleImages) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        setIsKeyboardNav(true);
        e.key === "ArrowRight" ? nextImage() : prevImage();
        setTimeout(() => setIsKeyboardNav(false), 300);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hasMultipleImages, nextImage, prevImage]);

  // If there are no images to display
  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-lg text-gray-400">No example images available</p>
      </div>
    );
  }

  return (
    <div className="relative p-0 m-0">
      <div className="relative h-[500px] bg-gray-900 rounded-lg overflow-hidden group py-4 px-0 m-0">
        <div className="absolute inset-0 flex items-center py-3 justify-center z-0">
          <div
            className="relative w-full h-full cursor-zoom-in"
            onClick={() => onOpenFullscreen && onOpenFullscreen(currentImage)}
          >
            <ImageWithFallback
              key={`image-${currentImageIndex}`}
              src={getValidImageUrl(currentImage)}
              alt={`Example image ${currentImageIndex + 1} from ${title}`}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
              priority={currentImageIndex < 3}
            />
          </div>
        </div>

        {/* nav arrows */}
        {hasMultipleImages && (
          <>
            <button
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-800 p-2 rounded-full"
              onClick={prevImage}
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-800 p-2 rounded-full"
              onClick={nextImage}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </>
        )}

        {/* counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 right-3 bg-black/70 px-4 py-1.5 rounded-full text-white text-sm font-mono z-10">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* thumbnails */}
      {images.length > 1 && (
        <div className="mt-2 overflow-x-auto scrollbar-hide">
          <div
            className={`flex gap-1 py-1 max-w-full ${shouldCenterThumbnails ? 'justify-center' : 'justify-start'}`}
            style={{ scrollbarWidth: "none" }}
            id="thumbnail-container"
          >
            <ThumbnailScroller activeIndex={currentImageIndex} isKeyboardNav={isKeyboardNav} />

            {images.map((img, idx) => (
              <button
                key={idx}
                id={`thumbnail-${idx}`}
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-shrink-0 relative w-16 h-16 rounded overflow-hidden cursor-pointer ${
                  idx === currentImageIndex
                    ? "ring-2 ring-cyan-400"
                    : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <ImageWithFallback
                  src={getValidImageUrl(img)}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;