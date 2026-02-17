/**
 * Filter Types
 * Type helpers for filtering and search functionality
 */

// ═══════════════════════════════════════════════════════════════
// FILTER STATE
// ═══════════════════════════════════════════════════════════════

export interface FilterState<T = any> {
  filters: T;
  activeFilters: string[];
  isFiltering: boolean;
}

// ═══════════════════════════════════════════════════════════════
// FILTER OPTION
// ═══════════════════════════════════════════════════════════════

export interface FilterOption<T = any> {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'boolean' | 'text';
  options?: Array<{ value: T; label: string }>;
  value?: T;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

// ═══════════════════════════════════════════════════════════════
// DATE RANGE
// ═══════════════════════════════════════════════════════════════

export interface DateRangeFilter {
  from?: Date | string;
  to?: Date | string;
}

// ═══════════════════════════════════════════════════════════════
// PRICE RANGE
// ═══════════════════════════════════════════════════════════════

export interface PriceRangeFilter {
  min?: number;
  max?: number;
  currency?: string;
}

