'use client';

import { useState, useRef, useCallback, useEffect, ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiMinimize } from 'react-icons/fi';
import { BiCog } from 'react-icons/bi';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
interface VideoPlayerRef {
  getInternalPlayer: () => HTMLVideoElement;
  seekTo: (fraction: number) => void;
}

interface GlobalVideoPlayerWidgetProps {
  storagePrefix?: string;
  videoFileName?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  poster?: string;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: SyntheticEvent<HTMLVideoElement, Event>) => void;
}

export function GlobalVideoPlayerWidget({
  storagePrefix,
  videoFileName,
  autoPlay = false,
  controls = true,
  muted = false,
  poster,
  className = '',
  onPlay = () => {},
  onPause = () => {},
  onEnded = () => {},
  onError = () => {},
}: GlobalVideoPlayerWidgetProps) {
  const playerRef = useRef<VideoPlayerRef | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(muted ? 0 : 0.8);
  const [mutedState, setMutedState] = useState(muted);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(autoPlay);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('720');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Available qualities
  const qualities = [
    { label: '1080p', value: '1080' },
    { label: '720p', value: '720' },
    { label: '480p', value: '480' },
  ];

  // Construct video URL based on quality
  const getVideoUrl = (quality: string) => {
    if (!storagePrefix || !videoFileName) return null;

    // Fallback S3 prefix if environment variable is not set
    const s3Prefix = Bun.env.NEXT_PUBLIC_S3_PREFIX || 'https://tiktak.s3.tebi.io';

    // Construct URL for specific quality using the pattern: cards/storagePrefix/video/public/quality/filename
    return `${s3Prefix}/cards/${storagePrefix}/video/public/${quality}/${videoFileName}`;
  };

  const videoUrl = getVideoUrl(currentQuality);

  // Production-ready: Remove debug logging for production
  useEffect(() => {
    if (Bun.env.NODE_ENV === 'development') {
      ConsoleLogger.log('VideoPlayer Debug:', {
        storagePrefix,
        videoFileName,
        currentQuality,
        videoUrl,
        videoUrlValid: !!videoUrl,
        s3Prefix: Bun.env.NEXT_PUBLIC_S3_PREFIX || 'undefined (using fallback)',
        fallbackUsed: !Bun.env.NEXT_PUBLIC_S3_PREFIX
      });
    }
  }, [storagePrefix, videoFileName, currentQuality, videoUrl]);

  // Debug video URL accessibility (development only)
  useEffect(() => {
    if (Bun.env.NODE_ENV === 'development' && videoUrl) {
      fetch(videoUrl, { method: 'HEAD' })
        .then(response => {
          ConsoleLogger.log('Video URL accessibility test:', {
            url: videoUrl,
            status: response.status,
            ok: response.ok,
            contentType: response.headers.get('content-type'),
            contentLength: response.headers.get('content-length')
          });
        })
        .catch(error => {
          ConsoleLogger.error('Video URL not accessible:', { url: videoUrl, error: error.message });
        });
    }
  }, [videoUrl]);

  // Handle play/pause
  const handlePlayPause = useCallback(async () => {
    if (Bun.env.NODE_ENV === 'development') {
      ConsoleLogger.log('Play/Pause clicked, current state:', isPlaying);
    }

    const videoElement = playerRef.current?.getInternalPlayer();
    if (!videoElement) {
      if (Bun.env.NODE_ENV === 'development') {
        ConsoleLogger.error('No video element available');
      }
      return;
    }

    try {
      if (isPlaying) {
        // User is pausing - disable autoplay
        setShouldAutoplay(false);
        videoElement.pause();
      } else {
        // User is playing - allow autoplay for future cases
        await videoElement.play();
      }
    } catch (error) {
      if (Bun.env.NODE_ENV === 'development') {
        ConsoleLogger.error('Video play/pause error:', error);
      }
      handlePlayError(error);
    }
  }, [isPlaying]);

  // Update shouldAutoplay when autoPlay prop changes
  useEffect(() => {
    setShouldAutoplay(autoPlay);
    setAutoplayAttempted(false); // Reset autoplay attempt when autoPlay changes
  }, [autoPlay]);

  // Handle autoplay from modal - only attempt once
  useEffect(() => {
    if (shouldAutoplay && isVideoReady && !isPlaying && !isLoading && !autoplayAttempted) {
      if (Bun.env.NODE_ENV === 'development') {
        ConsoleLogger.log('Auto-playing video due to shouldAutoplay flag');
      }

      const videoElement = playerRef.current?.getInternalPlayer();
      if (videoElement) {
        setAutoplayAttempted(true); // Mark as attempted
        videoElement.play().catch((error) => {
          if (Bun.env.NODE_ENV === 'development') {
            ConsoleLogger.error('Autoplay failed:', error);
          }
          handlePlayError(error);
        });
      }
    }
  }, [shouldAutoplay, isVideoReady, isPlaying, isLoading, autoplayAttempted]);

  // Handle volume change
  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && mutedState) {
      setMutedState(false);
    }
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    setMutedState(prev => !prev);
  };

  // Handle seek
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    const videoElement = playerRef.current?.getInternalPlayer();
    if (videoElement && videoElement.duration) {
      const seekTime = parseFloat((e.target as HTMLInputElement).value) * videoElement.duration;
      videoElement.currentTime = seekTime;
    }
  };

  // Handle play/pause errors gracefully
  const handlePlayError = (error: unknown) => {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
      // Ignore AbortError as it's expected when switching videos or interrupting play
      if (Bun.env.NODE_ENV === 'development') {
        ConsoleLogger.log('Play request was interrupted (expected during quality change or component updates)');
      }
      return;
    }
    if (Bun.env.NODE_ENV === 'development') {
      ConsoleLogger.error('Play error:', error);
    }
  };


  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle quality change
  const handleQualityChange = (quality: string) => {
    // Temporarily pause to prevent conflicts during URL change
    setIsPlaying(false);

    setCurrentQuality(quality);
    setShowQualityMenu(false);

    // Video will automatically reload with new quality URL
    // Note: Current playback position will be lost during quality change
  };

  // Format time
  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');

    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  if (!videoUrl) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center h-64`}>
        <div className="text-center text-gray-500">
          <p className="mb-2">Video not available</p>
          <p className="text-xs">
            {!storagePrefix && 'Missing storage prefix'}
            {!videoFileName && 'Missing video filename'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${className} relative bg-black rounded-lg overflow-hidden group`}
    >
      {/* Video Player */}
      <div className="relative aspect-video">

        {/* Use HTML5 video element directly */}
        <video
          ref={(videoElement) => {
            if (videoElement && !playerRef.current) {
              playerRef.current = {
                getInternalPlayer: () => videoElement,
                seekTo: (fraction: number) => {
                  if (videoElement.duration) {
                    videoElement.currentTime = fraction * videoElement.duration;
                  }
                }
              };
              if (Bun.env.NODE_ENV === 'development') {
                ConsoleLogger.log('HTML5 Video element attached');
              }
            }
          }}
          src={videoUrl}
          poster={poster || undefined}
          controls={false}
          muted={mutedState}
          autoPlay={false} // Don't auto-play to avoid browser restrictions
          loop={false} // Don't repeat video after completion
          preload="auto"
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          onLoadStart={() => {
            setIsLoading(true);
          }}
          onLoadedData={() => {
            setIsLoading(false);
            setIsVideoReady(true);
          }}
          onPlay={() => {
            setIsPlaying(true);
            onPlay();
          }}
          onPause={() => {
            setIsPlaying(false);
            onPause();
          }}
          onEnded={() => {
            setIsPlaying(false);
            onEnded();
          }}
          onError={(e) => {
            if (Bun.env.NODE_ENV === 'development') {
              ConsoleLogger.error('HTML5 Video error:', e);
            }
            setError('Failed to load video');
            setIsLoading(false);
            onError(e);
          }}
          onTimeUpdate={(e) => {
            const video = e.target as HTMLVideoElement;
            if (!seeking && video.duration) {
              const playedFraction = video.currentTime / video.duration;
              setPlayed(playedFraction);
            }
          }}
          onLoadedMetadata={(e) => {
            const video = e.target as HTMLVideoElement;
            setDuration(video.duration);
          }}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* Ready to Play Indicator */}
        {isVideoReady && !isPlaying && !isLoading && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
            Ready to play
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-lg mb-2">⚠️</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Play/Pause Overlay */}
        {!isPlaying && isVideoReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-100 transition-opacity duration-300">
            <button
              onClick={handlePlayPause}
              className="bg-brandPrimary hover:bg-brandPrimary/80 text-white rounded-full p-6 transition-colors shadow-lg"
            >
              <FiPlay size={32} />
            </button>
          </div>
        )}

        {/* Hover Play Button */}
        {isPlaying && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handlePlayPause}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-colors"
            >
              <FiPause size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      {controls && (
        <div className="bg-linear-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-white mt-1">
              <span>{formatTime(duration * played)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-brandPrimary transition-colors"
              >
                {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
              </button>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMuteToggle}
                  className="text-white hover:text-brandPrimary transition-colors"
                >
                  {mutedState || volume === 0 ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={mutedState ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Time Display */}
              <div className="text-white text-sm">
                {formatTime(duration * played)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Quality Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="text-white hover:text-brandPrimary transition-colors flex items-center space-x-1"
                >
                  <BiCog size={18} />
                  <span className="text-sm">{currentQuality}p</span>
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-full mb-2 right-0 bg-black/90 rounded-lg p-2 min-w-20">
                    {qualities.map((quality) => (
                      <button
                        key={quality.value}
                        onClick={() => handleQualityChange(quality.value)}
                        className={`block w-full text-left px-3 py-1 text-sm rounded hover:bg-brandPrimary/20 transition-colors ${
                          currentQuality === quality.value ? 'text-brandPrimary' : 'text-white'
                        }`}
                      >
                        {quality.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreenToggle}
                className="text-white hover:text-brandPrimary transition-colors"
              >
                {isFullscreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
