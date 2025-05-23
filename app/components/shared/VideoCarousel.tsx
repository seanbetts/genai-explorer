"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import brandConfig from "../../config/brand";

interface ThumbnailScrollerProps {
  activeIndex: number;
  isKeyboardNav?: boolean;
  carouselId: string;
}

const ThumbnailScroller: React.FC<ThumbnailScrollerProps> = ({
  activeIndex,
  isKeyboardNav = false,
  carouselId
}) => {
  // Define scrollToActiveThumbnail inside a different scope to use in both effects
  const scrollToActiveThumbnail = useCallback(() => {
    const el = document.getElementById(`video-thumbnail-${carouselId}-${activeIndex}`);
    const container = document.getElementById(`video-thumbnail-container-${carouselId}`);
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
  }, [activeIndex, carouselId]);

  // Use both useLayoutEffect and useEffect to ensure scrolling happens reliably
  useLayoutEffect(() => {
    scrollToActiveThumbnail();
  }, [activeIndex, isKeyboardNav, scrollToActiveThumbnail]);
  
  // Also use regular useEffect as a backup to ensure scrolling works after render
  useEffect(() => {
    scrollToActiveThumbnail();
    // Add a small delay to ensure thumbnails are fully rendered
    const timer = setTimeout(scrollToActiveThumbnail, 100);
    return () => clearTimeout(timer);
  }, [activeIndex, isKeyboardNav, scrollToActiveThumbnail]);
  
  return null;
};

// -----------------------------------------------------------------------------
// Main video carousel component ------------------------------------------------
// -----------------------------------------------------------------------------
interface VideoCarouselProps {
  videos: Record<string, string | string[]>; // Key-value pairs of video names and either URLs or [videoURL, thumbnailURL]
  title: string;
  formatDemoName: (name: string) => string;
  carouselId?: string; // Unique ID for this carousel instance
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ 
  videos, 
  title,
  formatDemoName,
  carouselId = 'default'
}) => {
  // ----- state ---------------------------------------------------------------
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);
  const [shouldCenterThumbnails, setShouldCenterThumbnails] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // ----- derived values ------------------------------------------------------
  const videoEntries = Object.entries(videos);
  const hasMultipleVideos = videoEntries.length > 1;
  
  // Get current video entry and process it
  const currentEntry = videoEntries[currentVideoIndex] || ["", ""];
  const currentVideoName = currentEntry[0];
  
  // Handle both string and array formats
  let currentVideoUrl = "";
  let currentThumbnailUrl = "";
  
  if (Array.isArray(currentEntry[1])) {
    // Format is [videoURL, thumbnailURL]
    currentVideoUrl = currentEntry[1][0] || "";
    currentThumbnailUrl = currentEntry[1][1] || "";
  } else {
    // Format is just a string URL
    currentVideoUrl = currentEntry[1] || "";
  }
  
  // ----- thumbnail layout management ----------------------------------------
  useEffect(() => {
    // Check if thumbnails should be centered or left-aligned for scrolling
    const checkThumbnailLayout = () => {
      const container = document.getElementById(`video-thumbnail-container-${carouselId}`);
      if (!container) return;
      
      // Calculate the total width of all thumbnails (28px width + 0.5rem gap per thumbnail)
      const thumbnailsTotalWidth = videoEntries.length * (112 + 8); // 112px for thumbnail width, 8px for gap
      const containerWidth = container.offsetWidth;
      
      // If thumbnails total width is less than container, they should be centered
      setShouldCenterThumbnails(thumbnailsTotalWidth < containerWidth);
    };
    
    // Check on initial load and window resize
    checkThumbnailLayout();
    window.addEventListener('resize', checkThumbnailLayout);
    
    return () => window.removeEventListener('resize', checkThumbnailLayout);
  }, [videoEntries.length, carouselId]);

  // ----- video navigation ----------------------------------------------------
  const nextVideo = useCallback(() => {
    if (!hasMultipleVideos) return;
    setCurrentVideoIndex((i) => (i + 1) % videoEntries.length);
  }, [hasMultipleVideos, videoEntries.length]);

  const prevVideo = useCallback(() => {
    if (!hasMultipleVideos) return;
    setCurrentVideoIndex((i) =>
      i === 0 ? videoEntries.length - 1 : i - 1,
    );
  }, [hasMultipleVideos, videoEntries.length]);

  // Track if the carousel has focus and if it should show focus styling
  const [hasFocus, setHasFocus] = useState(false);
  const [showFocusRing, setShowFocusRing] = useState(false);

  // keyboard arrows - only respond when carousel has focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!hasMultipleVideos || !hasFocus) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        setIsKeyboardNav(true);
        setShowFocusRing(true); // Show focus ring when using keyboard
        e.key === "ArrowRight" ? nextVideo() : prevVideo();
        setTimeout(() => setIsKeyboardNav(false), 300);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hasMultipleVideos, nextVideo, prevVideo, hasFocus]);

  // Reset video playing state when changing videos
  useEffect(() => {
    setIsVideoPlaying(false);
  }, [currentVideoIndex]);

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Create thumbnail URL from YouTube video ID
  const getYoutubeThumbnail = (url: string): string => {
    const videoId = getYoutubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
  };
  
  // Try to create a poster URL for direct video files
  const getVideoPosterUrl = (url: string, providedThumbnail?: string): string => {
    // If a thumbnail URL is explicitly provided, use it
    if (providedThumbnail) {
      return providedThumbnail;
    }
    
    // Handle YouTube videos
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return getYoutubeThumbnail(url);
    }
    
    // Try to guess a poster image by replacing the video extension with jpg or png
    const posterUrl = url.replace(/\.(mp4|webm|ogg|mov)(\?|$)/i, '.jpg$2');
    if (posterUrl !== url) return posterUrl;
    
    const posterUrlPng = url.replace(/\.(mp4|webm|ogg|mov)(\?|$)/i, '.png$2');
    if (posterUrlPng !== url) return posterUrlPng;
    
    // If we can't determine a poster, return empty string
    return '';
  };

  // If there are no videos to display
  if (videoEntries.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 ${brandConfig.name === 'OMG' ? 'bg-white rounded-lg border border-gray-300' : 'bg-gray-800 rounded-lg border border-gray-700'}`}>
        <p className={`text-lg ${brandConfig.name === 'OMG' ? 'text-gray-500 font-sans' : 'text-gray-400 font-mono'}`}>No demo videos available</p>
      </div>
    );
  }

  // Determine video type and if we can embed it
  const isYouTube = currentVideoUrl.includes('youtube.com') || currentVideoUrl.includes('youtu.be');
  const isDirectVideo = currentVideoUrl.match(/\.(mp4|webm|ogg|mov)(\?|$)/i);
  const canEmbed = isYouTube || isDirectVideo;
  
  // Get appropriate embed URL based on video type
  const youtubeEmbedUrl = isYouTube ? 
    `https://www.youtube.com/embed/${getYoutubeVideoId(currentVideoUrl)}?autoplay=0&rel=0&enablejsapi=1` : '';

  return (
    <div className="relative p-0 m-0">
      <div className={`relative min-h-[500px] ${brandConfig.name === 'OMG' ? 'bg-white border border-gray-300' : 'bg-gray-900'} rounded-lg overflow-hidden group py-3 px-0 m-0`}>
        <div className="flex items-center justify-center z-0 w-full h-full">
          {canEmbed ? (
            <div className="w-[85%] aspect-video">
              {isYouTube ? (
                <div className="relative w-full h-full">
                  <iframe
                    src={youtubeEmbedUrl}
                    title={`${title} - ${formatDemoName(currentVideoName)}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                  
                  {/* No play button overlay for YouTube videos - YouTube has its own */}
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <video 
                    src={currentVideoUrl}
                    title={`${title} - ${formatDemoName(currentVideoName)}`}
                    controls
                    preload="metadata"
                    className="w-full h-full"
                    poster={getVideoPosterUrl(currentVideoUrl, currentThumbnailUrl)}
                    playsInline
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                  >
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Large play button overlay that disappears once video starts playing */}
                  <div 
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isVideoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'}`}
                    onClick={() => {
                      const videoElement = document.querySelector('video');
                      if (videoElement) {
                        videoElement.play();
                        setIsVideoPlaying(true);
                      }
                    }}
                  >
                    <div className={`w-24 h-24 rounded-full ${
                      brandConfig.name === 'OMG' 
                        ? 'bg-blue-500/80 border-2 border-blue-700 hover:bg-blue-500/90' 
                        : 'bg-fuchsia-500/80 border-2 border-cyan-400 hover:bg-fuchsia-500/90'
                    } flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105`}>
                      <i className="bi bi-play-fill text-white text-5xl ml-2"></i>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className={`text-lg ${brandConfig.name === 'OMG' ? 'text-gray-600 font-sans' : 'text-gray-400 font-mono'}`}>External video</p>
              <a 
                href={currentVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 ${
                  brandConfig.name === 'OMG' 
                    ? 'bg-gray-100 hover:bg-gray-200 text-blue-600 hover:text-blue-700 font-sans border border-gray-300' 
                    : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500 font-mono'
                } rounded transition-colors flex items-center gap-2`}
              >
                <i className="bi bi-play-circle text-xl"></i>
                <span>Watch video</span>
              </a>
            </div>
          )}
        </div>

        {/* nav arrows */}
        {hasMultipleVideos && (
          <>
            <button
              aria-label="Previous video"
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                brandConfig.name === 'OMG' 
                  ? 'bg-gray-200/70 hover:bg-gray-300 text-gray-700' 
                  : 'bg-gray-800/70 hover:bg-gray-800'
              } p-2 rounded-full z-20`}
              onClick={prevVideo}
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              aria-label="Next video"
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                brandConfig.name === 'OMG' 
                  ? 'bg-gray-200/70 hover:bg-gray-300 text-gray-700' 
                  : 'bg-gray-800/70 hover:bg-gray-800'
              } p-2 rounded-full z-20`}
              onClick={nextVideo}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </>
        )}

        {/* counter */}
        {hasMultipleVideos && (
          <div className={`absolute bottom-3 right-3 ${
            brandConfig.name === 'OMG' 
              ? 'bg-gray-200/90 text-gray-800 font-sans' 
              : 'bg-black/70 text-white font-mono'
          } px-4 py-1.5 rounded-full text-sm z-20`}>
            {currentVideoIndex + 1} / {videoEntries.length}
          </div>
        )}
      </div>

      {/* Title now shown only in thumbnails */}

      {/* thumbnails */}
      {videoEntries.length > 1 && (
        <div 
          className={`mt-2 overflow-x-auto scrollbar-hide outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${hasFocus && showFocusRing ? brandConfig.name === 'OMG' ? 'bg-gray-100/50 rounded' : 'bg-gray-800/30 rounded' : ''}`}
          onMouseEnter={() => setHasFocus(true)}
          onMouseLeave={() => {
            setHasFocus(false);
            setShowFocusRing(false);
          }}
          onFocus={() => {
            setHasFocus(true);
            // Only show focus ring when keyboard navigating
            if (isKeyboardNav) {
              setShowFocusRing(true);
            }
          }}
          onBlur={() => {
            setHasFocus(false);
            setShowFocusRing(false);
          }}
          onKeyDown={(e) => {
            // Show focus ring on any key press
            if (e.key === 'Tab' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              setShowFocusRing(true);
            }
          }}
          tabIndex={0} // Make div focusable
        >
          <div
            className={`flex gap-2 py-1 max-w-full ${shouldCenterThumbnails ? 'justify-center' : 'justify-start'}`}
            style={{ scrollbarWidth: "none" }}
            id={`video-thumbnail-container-${carouselId}`}
          >
            <ThumbnailScroller 
              activeIndex={currentVideoIndex} 
              isKeyboardNav={isKeyboardNav} 
              carouselId={carouselId} />

            {videoEntries.map(([name, value], idx) => {
              // Process the value which may be a string URL or [videoURL, thumbnailURL] array
              let videoUrl = '';
              let providedThumbnailUrl = '';
              
              if (Array.isArray(value)) {
                videoUrl = value[0] || '';
                providedThumbnailUrl = value[1] || '';
              } else {
                videoUrl = value || '';
              }
              
              // Try to get a thumbnail URL for the video
              let thumbnailUrl = '';
              if (providedThumbnailUrl) {
                thumbnailUrl = providedThumbnailUrl;
              } else if (videoUrl.includes('youtube')) {
                thumbnailUrl = getYoutubeThumbnail(videoUrl);
              } else if (videoUrl.match(/\.(mp4|webm|ogg|mov)(\?|$)/i)) {
                thumbnailUrl = getVideoPosterUrl(videoUrl);
              }
              
              return (
                <button
                  key={idx}
                  id={`video-thumbnail-${carouselId}-${idx}`}
                  onClick={() => {
                    setCurrentVideoIndex(idx);
                    setHasFocus(true);
                  }}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-28 h-20 rounded overflow-hidden cursor-pointer group focus:outline-none ${
                    idx === currentVideoIndex
                      ? brandConfig.name === 'OMG'
                        ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500 border border-gray-300"
                        : "bg-cyan-900/90 text-cyan-400 ring-2 ring-cyan-400"
                      : brandConfig.name === 'OMG'
                        ? "bg-white hover:bg-gray-100 hover:ring-1 hover:ring-blue-500/50 text-blue-600 border border-gray-300"
                        : "bg-gray-700 hover:bg-gray-600 hover:ring-1 hover:ring-fuchsia-500/50 text-cyan-400"
                  }`}
                  aria-label={`View video ${formatDemoName(name)}`}
                >
                  <i className={`bi bi-play-circle-fill text-xl mt-2 ${
                    idx === currentVideoIndex 
                      ? brandConfig.name === 'OMG'
                        ? "text-blue-600" 
                        : "text-cyan-400"
                      : brandConfig.name === 'OMG'
                        ? "text-blue-500 group-hover:text-blue-600"
                        : "text-fuchsia-500 group-hover:text-cyan-400"
                  }`}></i>
                  <div className={`text-center px-1 pb-3 ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} line-clamp-2`} style={{ fontSize: "0.8rem" }}>
                    {formatDemoName(name)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;