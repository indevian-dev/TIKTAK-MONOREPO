import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind classes safely using `clsx` and `tailwind-merge`.
 * This prevents style conflicts when overriding classes in UI components.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
