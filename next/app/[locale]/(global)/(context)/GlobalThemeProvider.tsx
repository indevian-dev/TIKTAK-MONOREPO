'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

/**
 * Wraps next-themes ThemeProvider with class-based dark mode.
 * Place high in the component tree (inside locale layout).
 */
export function GlobalThemeProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
        >
            {children}
        </ThemeProvider>
    );
}
