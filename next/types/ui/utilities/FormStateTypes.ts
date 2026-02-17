/**
 * Form State Types
 * Type helpers for complex form state management
 */

// ═══════════════════════════════════════════════════════════════
// FORM STATE
// ═══════════════════════════════════════════════════════════════

export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
}

// ═══════════════════════════════════════════════════════════════
// FORM FIELD
// ═══════════════════════════════════════════════════════════════

export interface FormField<T, K extends keyof T> {
  name: K;
  value: T[K];
  error?: string;
  touched: boolean;
  onChange: (value: T[K]) => void;
  onBlur: () => void;
}

// ═══════════════════════════════════════════════════════════════
// FORM HELPERS
// ═══════════════════════════════════════════════════════════════

export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;
export type FormValues<T> = T;

