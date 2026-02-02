/**
 * Form Mode Types
 * Standard form modes used across the application
 */

export type FormMode = 'create' | 'edit' | 'view' | 'clone';

export const FormModes = {
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view',
  CLONE: 'clone',
} as const;

