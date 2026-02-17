/**
 * Base Card Types
 * Base interface for card components - EXTEND THIS in your cards
 * 
 * @example
 * ```typescript
 * interface ProductCardProps extends BaseCardProps {
 *   product: Product.Public;
 *   onAddToCart: () => void;
 * }
 * ```
 */

export interface BaseCardProps {
  variant?: 'outlined' | 'elevated' | 'filled';
  clickable?: boolean;
  hoverable?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

