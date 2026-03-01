// Base Form Props

export interface BaseFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

// Form Mode

export type FormMode = 'create' | 'edit' | 'view';
