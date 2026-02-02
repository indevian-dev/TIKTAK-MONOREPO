/**
 * Base Form Types
 * Base interface for form components - EXTEND THIS in your forms
 * 
 * @example
 * ```typescript
 * interface ProductFormProps extends BaseFormProps<Product.CreateInput> {
 *   categories: SelectOption<number>[];
 * }
 * ```
 */

export interface BaseFormProps<TData = any> {
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<TData>;
  onSubmit: (data: TData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

