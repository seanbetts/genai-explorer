'use client';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getValidImageUrl } from '../utils/imageUtils';
import ImageWithFallback from './ImageWithFallback';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

const ImagePopover: React.FC<Props> = ({ isOpen, onClose, imageSrc, imageAlt }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

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
        className="relative cursor-zoom-out border border-gray-400 rounded p-3"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 'calc(100vw - 240px)', // Further reduced max width
          maxHeight: 'calc(100vh - 240px)', // Further reduced max height
          backgroundColor: 'rgba(0, 0, 0, 1)', // Darker background within the border
        }}
      >
        <div className="p-4 w-full h-full relative">
          <ImageWithFallback 
            src={getValidImageUrl(imageSrc)} 
            alt={imageAlt}
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 z-20 p-2 bg-black/60 hover:bg-black/80 text-fuchsia-500 hover:text-fuchsia-400 rounded-full transition-colors cursor-pointer border border-fuchsia-500 w-10 h-10 flex items-center justify-center"
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