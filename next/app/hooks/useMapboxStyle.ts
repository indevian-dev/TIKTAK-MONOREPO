'use client';

import { useEffect, useState } from 'react';

const DARK_STYLE = '/mapbox-style-dark.json';
const LIGHT_STYLE = '/mapbox-style-light.json';

/**
 * Returns the correct Mapbox style URL based on the current
 * color scheme (dark / light). Re-evaluates whenever the OS
 * or app theme changes.
 */
export function useMapboxStyle(): string {
    const [style, setStyle] = useState<string>(() => {
        // SSR-safe: default to dark, reconcile on client
        if (typeof window === 'undefined') return DARK_STYLE;
        const isDark = document.documentElement.classList.contains('dark')
            || window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isDark ? DARK_STYLE : LIGHT_STYLE;
    });

    useEffect(() => {
        // 1. Watch the <html> class for Tailwind dark-mode class toggling
        const htmlEl = document.documentElement;
        const classObserver = new MutationObserver(() => {
            const isDark = htmlEl.classList.contains('dark');
            setStyle(isDark ? DARK_STYLE : LIGHT_STYLE);
        });
        classObserver.observe(htmlEl, { attributes: true, attributeFilter: ['class'] });

        // 2. Also watch the OS-level prefers-color-scheme media query
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const mqHandler = (e: MediaQueryListEvent) => {
            // Only apply if no explicit dark class is set
            if (!htmlEl.classList.contains('dark')) {
                setStyle(e.matches ? DARK_STYLE : LIGHT_STYLE);
            }
        };
        mq.addEventListener('change', mqHandler);

        // Set initial value on mount (handles SSR mismatch)
        const isDark = htmlEl.classList.contains('dark') || mq.matches;
        setStyle(isDark ? DARK_STYLE : LIGHT_STYLE);

        return () => {
            classObserver.disconnect();
            mq.removeEventListener('change', mqHandler);
        };
    }, []);

    return style;
}
