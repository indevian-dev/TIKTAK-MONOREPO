/**
 * Status Badge Types
 * Standard status badge variants for displaying entity states
 */

export type StatusVariant = 
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'default'
  | 'pending'
  | 'processing'
  | 'active'
  | 'inactive';

export type StatusBadgeSize = 'sm' | 'md' | 'lg';

export const StatusVariants = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  DEFAULT: 'default',
  PENDING: 'pending',
  PROCESSING: 'processing',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

