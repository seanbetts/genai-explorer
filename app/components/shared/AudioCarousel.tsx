"use client";

import React, { useCallback, useEffect, useState } from "react";
import brandConfig from "../../config/brand";

// -----------------------------------------------------------------------------
// Main audio carousel component -------------------------------------------------
// -----------------------------------------------------------------------------
interface AudioCarouselProps {
  audio: string[] | Record<string, string>; // Array of audio embed URLs or object of names to URLs
  title: string;
  carouselId?: string; // Unique ID for this carousel instance
  formatTrackName?: (name: string) => string;
}

const AudioCarousel: React.FC<AudioCarouselProps> = ({ 
  audio, 
  title,
  carouselId = 'default',
  formatTrackName = (name) => name
}) => {
  // ----- state ---------------------------------------------------------------
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [showFocusRing, setShowFocusRing] = useState(false);
  
  // ----- derived values ------------------------------------------------------
  // Handle both array and object formats
  const audioEntries = Array.isArray(audio) 
    ? audio.map((url, index) => [`Track ${index + 1}`, url])
    : Object.entries(audio);
    
  const hasMultipleAudios = audioEntries.length > 1;
  
  // Get current audio entry
  const currentEntry = audioEntries[currentAudioIndex] || ["", ""];
  const currentTrackName = currentEntry[0];
  const currentAudioUrl = currentEntry[1] || "";
  
  // ----- audio navigation ----------------------------------------------------
  const nextAudio = useCallback(() => {
    if (!hasMultipleAudios) return;
    setCurrentAudioIndex((i) => (i + 1) % audioEntries.length);
  }, [hasMultipleAudios, audioEntries.length]);

  const prevAudio = useCallback(() => {
    if (!hasMultipleAudios) return;
    setCurrentAudioIndex((i) =>
      i === 0 ? audioEntries.length - 1 : i - 1,
    );
  }, [hasMultipleAudios, audioEntries.length]);

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

  // Extract song ID from Suno embed URL or file name from local audio
  const getSongId = (url: string): string => {
    if (isLocalAudioFile(url)) {
      // For local audio files, extract the filename
      const parts = url.split('/');
      return parts[parts.length - 1].split('.')[0];
    } else {
      // For Suno embeds, extract the ID
      const match = url.match(/\/embed\/([a-f0-9-]+)/);
      return match ? match[1] : "";
    }
  };

  // If there are no audios to display
  if (audioEntries.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${brandConfig.name === 'OMG' ? 'bg-white rounded-lg border border-gray-300' : 'bg-gray-800 rounded-lg border border-gray-700'}`}>
        <p className={`text-lg ${brandConfig.name === 'OMG' ? 'text-gray-500 font-sans' : 'text-gray-400 font-mono'}`}>No audio examples available</p>
      </div>
    );
  }

  // Detect the type of audio based on URL
  const isLocalAudioFile = (url: string): boolean => {
    return url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg') || url.endsWith('.m4a');
  };

  // Determine if the current audio is a local file (MP3) or an embed URL
  const isLocalFile = isLocalAudioFile(currentAudioUrl);

  return (
    <div className="relative p-0 m-0">
      <div className={`relative min-h-[300px] ${brandConfig.name === 'OMG' ? 'bg-white border border-gray-300' : 'bg-gray-900'} rounded-lg overflow-hidden group py-6 px-0 m-0`}>
        <div className="flex items-center justify-center z-0 w-full h-full">
          {/* Render different audio players based on URL type */}
          {isLocalFile ? (
            <div className="w-full max-w-3xl flex flex-col items-center justify-center px-4 h-full">
              <div className="flex flex-col items-center justify-center h-full py-12 w-full">
                <p className={`${brandConfig.name === 'OMG' ? 'text-blue-600 font-sans' : 'text-cyan-400 font-mono'} text-sm mb-6`}>
                  {formatTrackName ? formatTrackName(currentTrackName) : currentTrackName}
                </p>
                <div className="w-full max-w-3xl flex justify-center">
                  <audio 
                    src={currentAudioUrl}
                    controls
                    className="w-full max-w-xl"
                    controlsList="nodownload"
                    autoPlay={false}
                    style={{ minWidth: '300px', width: '100%' }}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>
          ) : (
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
          )}
        </div>

        {/* nav arrows */}
        {hasMultipleAudios && (
          <>
            <button
              aria-label="Previous audio"
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                brandConfig.name === 'OMG' 
                  ? 'bg-gray-200/70 hover:bg-gray-300 text-gray-700' 
                  : 'bg-gray-800/70 hover:bg-gray-800'
              } p-2 rounded-full z-20`}
              onClick={prevAudio}
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              aria-label="Next audio"
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                brandConfig.name === 'OMG' 
                  ? 'bg-gray-200/70 hover:bg-gray-300 text-gray-700' 
                  : 'bg-gray-800/70 hover:bg-gray-800'
              } p-2 rounded-full z-20`}
              onClick={nextAudio}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </>
        )}

        {/* counter */}
        {hasMultipleAudios && (
          <div className={`absolute bottom-3 right-3 ${
            brandConfig.name === 'OMG' 
              ? 'bg-gray-200/90 text-gray-800 font-sans' 
              : 'bg-black/70 text-white font-mono'
          } px-4 py-1.5 rounded-full text-sm z-20`}>
            {currentAudioIndex + 1} / {audioEntries.length}
          </div>
        )}
      </div>

      {/* thumbnails for audio navigation */}
      {audioEntries.length > 1 && (
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
            {audioEntries.map(([name, url], idx) => {
              const songId = getSongId(url);
              const formattedName = formatTrackName(name);
              
              return (
                <button
                  key={idx}
                  id={`audio-thumbnail-${carouselId}-${idx}`}
                  onClick={() => {
                    setCurrentAudioIndex(idx);
                    setHasFocus(true);
                  }}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-32 h-16 rounded overflow-hidden cursor-pointer group focus:outline-none ${
                    idx === currentAudioIndex
                      ? brandConfig.name === 'OMG'
                        ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500 border border-gray-300"
                        : "bg-cyan-900/90 text-cyan-400 ring-2 ring-cyan-400"
                      : brandConfig.name === 'OMG'
                        ? "bg-white hover:bg-gray-100 hover:ring-1 hover:ring-blue-500/50 text-blue-600 border border-gray-300"
                        : "bg-gray-700 hover:bg-gray-600 hover:ring-1 hover:ring-fuchsia-500/50 text-cyan-400"
                  }`}
                  aria-label={`Play track "${formattedName}"`}
                >
                  <i className={`bi bi-music-note-beamed text-xl ${
                    idx === currentAudioIndex 
                      ? brandConfig.name === 'OMG'
                        ? "text-blue-600" 
                        : "text-cyan-400"
                      : brandConfig.name === 'OMG'
                        ? "text-blue-500 group-hover:text-blue-600"
                        : "text-fuchsia-500 group-hover:text-cyan-400"
                  }`}></i>
                  <div className={`text-center px-1 pb-1 ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} truncate w-full`} style={{ fontSize: "0.7rem" }}>
                    {formattedName}
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