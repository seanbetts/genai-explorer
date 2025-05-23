'use client';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { getValidImageUrl, PLACEHOLDER_IMAGE } from '../utils/imageUtils';
import brandConfig from '../../config/brand';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

const ImagePopover: React.FC<Props> = ({ isOpen, onClose, imageSrc, imageAlt }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // lock scroll
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); };
  }, [isOpen, onClose]);
  
  // Reset loading state when opening
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen, imageSrc]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={e => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 cursor-pointer"
      style={{ padding: 120 }} // Increased padding significantly to reduce popover size
    >
      <div
        onClick={onClose}
        className={`relative cursor-zoom-out border ${brandConfig.name === 'OMG' ? 'border-gray-300' : 'border-gray-400'} rounded p-3`}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 'calc(100vw - 240px)', // Further reduced max width
          maxHeight: 'calc(100vh - 240px)', // Further reduced max height
          backgroundColor: brandConfig.name === 'OMG' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)', // Brand-specific background within the border
        }}
      >
        <div className="p-4 w-full h-full relative">
          {isLoading && (
            <div className={`absolute inset-0 z-10 ${brandConfig.name === 'OMG' ? 'bg-gray-100' : 'bg-gray-800'} flex items-center justify-center`}>
              <div className={`w-10 h-10 border-4 ${brandConfig.name === 'OMG' ? 'border-blue-500' : 'border-cyan-400'} border-t-transparent rounded-full animate-spin`}></div>
            </div>
          )}
          <Image 
            src={getValidImageUrl(imageSrc)} 
            alt={imageAlt}
            fill
            style={{ objectFit: 'contain' }}
            priority
            onError={() => setIsLoading(false)}
            onLoad={() => setIsLoading(false)}
          />
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className={`absolute top-6 right-6 z-20 p-2 ${
            brandConfig.name === 'OMG' 
              ? 'bg-gray-100/90 hover:bg-gray-200/90 text-blue-600 hover:text-blue-700 border border-blue-500' 
              : 'bg-black/60 hover:bg-black/80 text-fuchsia-500 hover:text-fuchsia-400 border border-fuchsia-500'
          } rounded-full transition-colors cursor-pointer w-10 h-10 flex items-center justify-center`}
          style={{ boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
               viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ImagePopover;