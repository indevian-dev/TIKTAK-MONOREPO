/**
 * Base Modal Types
 * Base interface for modal components - EXTEND THIS in your modals
 * 
 * @example
 * ```typescript
 * interface ProductModalProps extends BaseModalProps {
 *   productId: number;
 *   onSave: (product: Product) => void;
 * }
 * ```
 */

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  fullScreen?: boolean;
  preventScroll?: boolean;
}

