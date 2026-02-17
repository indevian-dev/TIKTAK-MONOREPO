/**
 * Base Table Types
 * Base interface for table components - EXTEND THIS in your tables
 * 
 * @example
 * ```typescript
 * interface OrdersTableProps extends BaseTableProps<Order> {
 *   onViewDetails: (order: Order) => void;
 * }
 * ```
 */

export interface BaseTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  sortable?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
}

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

