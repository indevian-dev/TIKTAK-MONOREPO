import { useState, useEffect } from 'react';
import { GlobalVideoPlayerWidget } from './GlobalVideoPlayerWidget';
import { FiX } from 'react-icons/fi';

interface GlobalVideoPlayerModalWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    storagePrefix?: string;
    videoFileName?: string;
    poster?: string | null;
    title?: string;
}

// Video Modal Component
export function GlobalVideoPlayerModalWidget({
    isOpen,
    onClose,
    storagePrefix,
    videoFileName,
    poster = null,
    title = 'Video'
  }: GlobalVideoPlayerModalWidgetProps) {
    const [, setIsVideoReady] = useState(false);
  
    const [forcePlay, setForcePlay] = useState(false);
  
    useEffect(() => {
      if (isOpen) {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        setIsVideoReady(false);
        // Force play when modal opens
        setForcePlay(true);
      } else {
        // Restore body scroll when modal is closed
        document.body.style.overflow = 'unset';
        setForcePlay(false);
      }
  
      // Cleanup on unmount
      return () => {
        document.body.style.overflow = 'unset';
        setForcePlay(false);
      };
    }, [isOpen]);
  
    // Close modal on escape key
    useEffect(() => {
      const handleEscape = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };
  
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-75"
          onClick={onClose}
        />
  
        {/* Modal Content */}
        <div className="relative w-full max-w-4xl mx-4 bg-black rounded-lg overflow-hidden shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            aria-label="Close video modal"
          >
            <FiX size={24} />
          </button>
  
          {/* Title */}
          {title && (
            <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded">
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
          )}
  
          {/* Video Player */}
          <div className="relative">
            <GlobalVideoPlayerWidget
              storagePrefix={storagePrefix}
              videoFileName={videoFileName}
              autoPlay={forcePlay}
              controls={true}
              muted={false}
              poster={poster || undefined}
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  }
