/**
 * Table State Types
 * Type helpers for table state management
 */

// ═══════════════════════════════════════════════════════════════
// TABLE STATE
// ═══════════════════════════════════════════════════════════════

export interface TableState<T = any> {
  data: T[];
  loading: boolean;
  error?: string;
  selectedRows: (string | number)[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
  total: number;
}

// ═══════════════════════════════════════════════════════════════
// TABLE SORT
// ═══════════════════════════════════════════════════════════════

export interface TableSort {
  column: string;
  direction: 'asc' | 'desc';
}

// ═══════════════════════════════════════════════════════════════
// TABLE SELECTION
// ═══════════════════════════════════════════════════════════════

export interface TableSelection {
  selectedRows: (string | number)[];
  allSelected: boolean;
  indeterminate: boolean;
}

