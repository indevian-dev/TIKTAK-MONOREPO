'use client';

import { useState, useCallback } from 'react';

// SVG placeholder data URI — neutral gray photo icon
const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%231a1a2e' width='400' height='300'/%3E%3Cg transform='translate(168, 118)'%3E%3Csvg width='64' height='64' fill='none' stroke='%234a4a5a' stroke-width='1.5' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'/%3E%3C/svg%3E%3C/g%3E%3C/svg%3E`;

interface GlobalImageWidgetProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'fill'> {
    /** Image source URL */
    src?: string | null;
    /** Alt text for accessibility */
    alt: string;
    /** Optional custom placeholder (URL or data URI). Defaults to built-in SVG */
    placeholder?: string;
    /** Optional aspect ratio class, e.g. "aspect-square", "aspect-4/3", "aspect-video" */
    aspectRatio?: string;
    /** If true, renders as a fill container (absolute positioned, use with relative parent) */
    fill?: boolean;
}

/**
 * Global image component with automatic error fallback.
 * Uses native <img> with lazy loading — no Next.js Image optimization needed
 * since Cloudflare Images handles CDN transformations.
 *
 * Usage:
 *   <GlobalImageWidget src={imageUrl} alt="Product" className="rounded-lg object-cover" />
 *   <GlobalImageWidget src={imageUrl} alt="Avatar" fill />
 */
export function GlobalImageWidget({
    src,
    alt,
    placeholder,
    aspectRatio,
    fill,
    className = '',
    style,
    ...rest
}: GlobalImageWidgetProps) {
    const [hasError, setHasError] = useState(false);

    const handleError = useCallback(() => {
        setHasError(true);
    }, []);

    const effectiveSrc = (!src || hasError)
        ? (placeholder || PLACEHOLDER_SVG)
        : src;

    const fillClasses = fill ? 'absolute inset-0 w-full h-full' : '';
    const aspectClass = aspectRatio || '';

    return (
        <img
            src={effectiveSrc}
            alt={alt}
            loading="lazy"
            onError={handleError}
            className={`${fillClasses} ${aspectClass} ${className}`.trim()}
            style={style}
            {...rest}
        />
    );
}

/** Re-export placeholder for use in other components */
export { PLACEHOLDER_SVG };
