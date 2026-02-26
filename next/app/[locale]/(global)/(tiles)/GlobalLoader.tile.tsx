
"use client";

import React from 'react';

interface GlobalLoaderTileProps {
  /**
   * If true, renders as a fixed full-page overlay with backdrop blur.
   * If false (default), renders as a block element centered in its container.
   */
  fullPage?: boolean;
  /**
   * Optional message to display under the spinner
   */
  message?: string;
  /**
   * Optional progress percentage (0-100)
   */
  progress?: number;
  /**
   * Whether to show the progress bar
   */
  showProgress?: boolean;
}

/**
 * Global Loader Tile
 * A premium, consistent loading indicator used across the application.
 */
export function GlobalLoaderTile({
  fullPage = false,
  message,
  progress = 0,
  showProgress = false
}: GlobalLoaderTileProps) {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-5 w-full max-w-sm mx-auto">
      <div className="relative">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-app-full bg-app-bright-green/20 blur-xl animate-pulse" />

        {/* Main animated spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-3 border-black/10 dark:border-white/10 rounded-app-full" />
          <div className="absolute inset-0 border-3 border-transparent border-t-app-bright-green border-r-app-bright-green/40 rounded-app-full animate-spin" />
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-app-bright-green rounded-app-full shadow-[0_0_8px_theme(colors.app-bright-green/0.5)]" />
      </div>

      <div className="text-center space-y-2.5 w-full">
        {message && (
          <p className="text-xs font-semibold text-app-dark-blue/50 dark:text-white/50 animate-pulse tracking-wider uppercase">
            {message}
          </p>
        )}

        {showProgress && (
          <div className="space-y-1.5 w-full">
            <div className="w-full bg-black/5 dark:bg-white/10 rounded-app-full h-1.5 overflow-hidden">
              <div
                className="bg-app-bright-green h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] font-bold text-app-bright-green/70 tabular-nums">
              {progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 dark:bg-app-dark-blue/60 backdrop-blur-xl transition-all duration-500 animate-in fade-in">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12 w-full animate-in fade-in duration-500">
      {loaderContent}
    </div>
  );
}