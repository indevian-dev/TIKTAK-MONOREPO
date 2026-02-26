'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { PiSunBold, PiMoonBold, PiDesktopBold } from 'react-icons/pi';

/**
 * Theme switcher toggle — cycles between light, dark, and system.
 * Persisted via next-themes (localStorage).
 */
export function GlobalThemeSwitcherTile() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch — only render after mount
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-white/5 animate-pulse" />
        );
    }

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    const icon =
        theme === 'dark' ? <PiMoonBold size={18} /> :
            theme === 'light' ? <PiSunBold size={18} /> :
                <PiDesktopBold size={18} />;

    const label =
        theme === 'dark' ? 'Dark' :
            theme === 'light' ? 'Light' :
                'System';

    return (
        <button
            onClick={cycleTheme}
            className="
                flex items-center justify-center
                h-9 w-9 rounded-full
                bg-gray-100 dark:bg-white/10
                border border-gray-200 dark:border-white/10
                text-gray-500 dark:text-gray-400
                hover:text-gray-900 dark:hover:text-white
                hover:bg-gray-200 dark:hover:bg-white/15
                transition-all duration-200
                active:scale-90
            "
            title={`Theme: ${label}`}
            aria-label={`Switch theme (current: ${label})`}
        >
            {icon}
        </button>
    );
}
