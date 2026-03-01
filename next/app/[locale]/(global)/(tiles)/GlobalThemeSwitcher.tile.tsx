'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { PiSunBold, PiMoonBold } from 'react-icons/pi';

/**
 * Theme switcher — full-width segmented control with Light | Dark options.
 * Persisted via next-themes (localStorage).
 */
export function GlobalThemeSwitcherTile() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch — only render after mount
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="h-12 w-full rounded-app bg-black/5 dark:bg-white/5 animate-pulse" />
        );
    }

    const activeTheme = theme === 'system' ? resolvedTheme : theme;

    return (
        <div className="w-full flex rounded-app border border-black/8 dark:border-white/10 bg-black/5 dark:bg-white/5 p-1 gap-1">
            <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-[calc(1.5rem-4px)] px-4 py-2.5 text-sm font-bold transition-all duration-200 ${activeTheme === 'light'
                        ? 'bg-white dark:bg-white text-app-dark-purple shadow-sm'
                        : 'text-app-dark-purple/50 dark:text-white/50 hover:text-app-dark-purple dark:hover:text-white'
                    }`}
                aria-label="Switch to light theme"
            >
                <PiSunBold size={16} />
                <span>Light</span>
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-[calc(1.5rem-4px)] px-4 py-2.5 text-sm font-bold transition-all duration-200 ${activeTheme === 'dark'
                        ? 'bg-app-dark-purple text-white shadow-sm'
                        : 'text-app-dark-purple/50 dark:text-white/50 hover:text-app-dark-purple dark:hover:text-white'
                    }`}
                aria-label="Switch to dark theme"
            >
                <PiMoonBold size={16} />
                <span>Dark</span>
            </button>
        </div>
    );
}
