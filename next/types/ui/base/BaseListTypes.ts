/**
 * Base List Types
 * Base interface for list components - EXTEND THIS in your lists
 * 
 * @example
 * ```typescript
 * interface NotificationsListProps extends BaseListProps<Notification> {
 *   onMarkAsRead: (id: number) => void;
 * }
 * ```
 */

export interface BaseListProps<T = any> {
  items: T[];
  loading?: boolean;
  empty?: React.ReactNode;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  dividers?: boolean;
  dense?: boolean;
}

