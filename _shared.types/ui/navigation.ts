/**
 * Navigation Types
 * Used by global layout widgets (Header, FastNav, FullNav)
 */

// ─── Primitives ──────────────────────────────────────────────

/** Generic icon component type (compatible with react-icons / any React icon lib) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconComponent = (props: any) => any;

/** A single navigation link */
export interface NavLink {
    href: string;
    icon: IconComponent;
    label: string;
    badge?: string | number;
    permission?: string;
}

/** A labelled group of navigation links */
export interface NavGroup {
    label: string;
    items: NavLink[];
    collapsible?: boolean;
    defaultOpen?: boolean;
}

// ─── Config ──────────────────────────────────────────────────

/** Branding options shown in the header */
export interface NavBranding {
    logo?: string;
    showLabel?: boolean;
    label?: string;
}

/** How the menu renders on each breakpoint */
export type MenuDisplayMode =
    | 'sidebar'
    | 'dropdown'
    | 'modal'
    | { desktop: 'sidebar' | 'dropdown'; mobile: 'modal' | 'mobile-modal' };

/**
 * Domain-level navigation configuration.
 * Each layout (public, provider, staff, workspace-root) builds one of these
 * and passes it through to the Global*Widget components.
 */
export interface DomainNavConfig {
    domain?: string;
    logoSrc?: string;
    label?: string;
    subtitle?: string;
    branding?: NavBranding;
    fastNavLinks?: NavLink[];
    menuGroups: NavGroup[];
    menuDisplayMode: MenuDisplayMode;
}

// ─── Props ───────────────────────────────────────────────────

/** Shared props consumed by GlobalHeaderWidget / GlobalFastNavigationWidget / GlobalFullNavigationWidget */
export interface GlobalNavigationProps {
    navConfig: DomainNavConfig;
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    workspaceId?: string;
    currentPath?: string | null;
}
