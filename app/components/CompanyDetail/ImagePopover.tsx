'use client';

import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { getValidImageUrl, PLACEHOLDER_IMAGE } from '../utils/imageUtils';

// Component to handle image loading with fallback
const ImageWithFallback = ({ src, alt, ...props }: {
  src: string;
  alt: string;
  [key: string]: any;
}) => {
  const [imgError, setImgError] = React.useState(false);
  
  return (
    <Image
      {...props}
      src={imgError ? PLACEHOLDER_IMAGE : src}
      alt={alt}
      quality={imgError ? 100 : 100} // High quality for full-resolution view
      onError={() => setImgError(true)}
    />
  );
};

interface ImagePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

const ImagePopover: React.FC<ImagePopoverProps> = ({ 
  isOpen, 
  onClose, 
  imageSrc,
  imageAlt 
}) => {
  // Client-side only - check if document is available
  const [mounted, setMounted] = React.useState(false);
  
  // Ref for the overlay element
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Set mounted state once component mounts
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Handle escape key and prevent body scroll
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Lock body scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscapeKey);
      }
    };
  }, [isOpen, onClose]);
  
  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };
  
  // If component is not mounted or not open, don't render anything
  if (!mounted || !isOpen) return null;
  
  // Use createPortal to render at the document body level
  return createPortal(
    <div 
      className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[9999]"
      style={{ 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(2px)'
      }}
      ref={overlayRef}
      onClick={handleBackdropClick}
    >
      <div className="relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Image container */}
        <div>
          <ImageWithFallback
            src={getValidImageUrl(imageSrc)}
            alt={imageAlt}
            width={1600}
            height={1200}
            style={{
              objectFit: 'contain',
              maxHeight: 'calc(100vh - 100px)',
              maxWidth: 'calc(100vw - 100px)',
              display: 'block',
              margin: '0 auto',
            }}
            priority
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImagePopover;