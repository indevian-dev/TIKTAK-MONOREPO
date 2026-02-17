/**
 * Select Option Types
 * Shared contract for select/dropdown options across all domains
 * Use this for any select/dropdown components
 * 
 * @example
 * ```typescript
 * const categories: SelectOption<number>[] = [
 *   { value: 1, label: 'Electronics' },
 *   { value: 2, label: 'Fashion', disabled: true }
 * ];
 * ```
 */

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: React.ReactNode;
  description?: string;
  metadata?: Record<string, any>;
}

