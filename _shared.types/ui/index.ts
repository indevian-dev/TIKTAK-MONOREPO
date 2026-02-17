/**
 * UI Types - Central Export
 * All UI component types organized by category
 */

// ═══════════════════════════════════════════════════════════════
// BASE TYPES (To EXTEND)
// ═══════════════════════════════════════════════════════════════

export type {
  BaseModalProps,
  BaseFormProps,
  BaseCardProps,
  BaseTableProps,
  TableColumn,
  BaseListProps,
} from './base';

// ═══════════════════════════════════════════════════════════════
// CONTRACTS (To USE)
// ═══════════════════════════════════════════════════════════════

export {
  FormModes,
  ButtonVariants,
  StatusVariants,
} from './contracts';

export type {
  SelectOption,
  FormMode,
  ButtonVariant,
  ButtonSize,
  StatusVariant,
  StatusBadgeSize,
} from './contracts';

// ═══════════════════════════════════════════════════════════════
// UTILITIES (Type Helpers)
// ═══════════════════════════════════════════════════════════════

export type {
  FormState,
  FormField,
  FormErrors,
  FormTouched,
  FormValues,
  TableState,
  TableSort,
  TableSelection,
  FilterState,
  FilterOption,
  DateRangeFilter,
  PriceRangeFilter,
} from './utilities';

// ═══════════════════════════════════════════════════════════════
// NAVIGATION (Layout / Global Widgets)
// ═══════════════════════════════════════════════════════════════

export type {
  NavLink,
  NavGroup,
  NavBranding,
  MenuDisplayMode,
  DomainNavConfig,
  GlobalNavigationProps,
} from './navigation';

