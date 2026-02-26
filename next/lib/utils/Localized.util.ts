/**
 * ═══════════════════════════════════════════════════════════════
 * Localized Text Helper
 * ═══════════════════════════════════════════════════════════════
 *
 * Extracts a display string from a JSONB localized text object.
 * Falls back through: current locale → 'az' → 'en' → 'ru' → ''
 *
 * Usage:
 *   lt(category.title)          → uses default locale 'az'
 *   lt(category.title, 'en')    → prefers English
 *   lt(category.description)    → works for any JSONB locale field
 */

type LocalizedText = { az?: string; ru?: string; en?: string } | string | null | undefined;

/**
 * Extract displayable string from a JSONB localized text object + handle legacy strings.
 */
export function lt(text: LocalizedText, locale: string = 'az'): string {
    if (!text) return '';
    if (typeof text === 'string') return text; // Legacy: already a string

    // Try requested locale first, then fallback chain
    return text[locale as keyof typeof text]
        || text.az
        || text.en
        || text.ru
        || '';
}
