"use client";

import React, { useCallback, useEffect, useState } from "react";

// -----------------------------------------------------------------------------
// Main audio carousel component -------------------------------------------------
// -----------------------------------------------------------------------------
interface AudioCarouselProps {
  audioUrls: string[]; // Array of audio embed URLs
  title: string;
  carouselId?: string; // Unique ID for this carousel instance
}

const AudioCarousel: React.FC<AudioCarouselProps> = ({ 
  audioUrls, 
  title,
  carouselId = 'default'
}) => {
  // ----- state ---------------------------------------------------------------
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [showFocusRing, setShowFocusRing] = useState(false);
  
  // ----- derived values ------------------------------------------------------
  const hasMultipleAudios = audioUrls.length > 1;
  const currentAudioUrl = audioUrls[currentAudioIndex] || "";
  
  // ----- audio navigation ----------------------------------------------------
  const nextAudio = useCallback(() => {
    if (!hasMultipleAudios) return;
    setCurrentAudioIndex((i) => (i + 1) % audioUrls.length);
  }, [hasMultipleAudios, audioUrls.length]);

  const prevAudio = useCallback(() => {
    if (!hasMultipleAudios) return;
    setCurrentAudioIndex((i) =>
      i === 0 ? audioUrls.length - 1 : i - 1,
    );
  }, [hasMultipleAudios, audioUrls.length]);

  // keyboard arrows - only respond when carousel has focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!hasMultipleAudios || !hasFocus) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        setIsKeyboardNav(true);
        setShowFocusRing(true); // Show focus ring when using keyboard
        e.key === "ArrowRight" ? nextAudio() : prevAudio();
        setTimeout(() => setIsKeyboardNav(false), 300);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hasMultipleAudios, nextAudio, prevAudio, hasFocus]);

  // Extract song ID from Suno embed URL
  const getSongId = (url: string): string => {
    const match = url.match(/\/embed\/([a-f0-9-]+)/);
    return match ? match[1] : "";
  };

  // If there are no audios to display
  if (audioUrls.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-lg text-gray-400">No audio examples available</p>
      </div>
    );
  }

  return (
    <div className="relative p-0 m-0">
      <div className="relative min-h-[300px] bg-gray-900 rounded-lg overflow-hidden group py-3 px-0 m-0">
        <div className="flex items-center justify-center z-0 w-full h-full">
          {/* Embed the current audio */}
          <div className="w-full max-w-3xl aspect-[3/1] mx-4">
            <iframe 
              src={currentAudioUrl}
              title={`${title} - Audio example ${currentAudioIndex + 1}`}
              className="w-full h-full border-0 rounded-xl"
              allow="autoplay"
              loading="lazy"
            >
              <a href={currentAudioUrl.replace('/embed/', '/song/')}>Listen on Suno</a>
            </iframe>
          </div>
        </div>

        {/* nav arrows */}
        {hasMultipleAudios && (
          <>
            <button
              aria-label="Previous audio"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-800 p-2 rounded-full z-20"
              onClick={prevAudio}
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              aria-label="Next audio"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-800 p-2 rounded-full z-20"
              onClick={nextAudio}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </>
        )}

        {/* counter */}
        {hasMultipleAudios && (
          <div className="absolute bottom-3 right-3 bg-black/70 px-4 py-1.5 rounded-full text-white text-sm font-mono z-20">
            {currentAudioIndex + 1} / {audioUrls.length}
          </div>
        )}
      </div>

      {/* thumbnails for audio navigation */}
      {audioUrls.length > 1 && (
        <div 
          className="mt-2 overflow-x-auto scrollbar-hide outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          onMouseEnter={() => setHasFocus(true)}
          onMouseLeave={() => {
            setHasFocus(false);
            setShowFocusRing(false);
          }}
          onFocus={() => {
            setHasFocus(true);
            if (isKeyboardNav) {
              setShowFocusRing(true);
            }
          }}
          onBlur={() => {
            setHasFocus(false);
            setShowFocusRing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Tab' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              setShowFocusRing(true);
            }
          }}
          tabIndex={0}
        >
          <div
            className="flex gap-2 py-1 max-w-full justify-center"
            id={`audio-thumbnail-container-${carouselId}`}
          >
            {audioUrls.map((url, idx) => {
              const songId = getSongId(url);
              
              return (
                <button
                  key={idx}
                  id={`audio-thumbnail-${carouselId}-${idx}`}
                  onClick={() => {
                    setCurrentAudioIndex(idx);
                    setHasFocus(true);
                  }}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-28 h-16 rounded overflow-hidden cursor-pointer group focus:outline-none ${
                    idx === currentAudioIndex
                      ? "bg-cyan-900/90 text-cyan-400 ring-2 ring-cyan-400"
                      : "bg-gray-700 hover:bg-gray-600 focus-visible:ring-1 focus-visible:ring-fuchsia-500 text-cyan-400"
                  }`}
                  aria-label={`Play audio example ${idx + 1}`}
                >
                  <i className={`bi bi-music-note-beamed text-xl ${
                    idx === currentAudioIndex 
                      ? "text-cyan-400" 
                      : "text-fuchsia-500 group-hover:text-cyan-400"
                  }`}></i>
                  <div className="text-center px-1 pb-1 font-mono" style={{ fontSize: "0.7rem" }}>
                    Track {idx + 1}
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

export default AudioCarousel;