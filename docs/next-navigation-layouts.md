# Next.js Navigation & Layouts

## 1. Overview
The platform leverages the **Next.js 14+ App Router** to create deeply nested, context-aware navigational structures. 

The primary design principle is separating the **Shell** (Persistent Layouts) from the **Content** (Dynamic Pages), ensuring that Navigation components do not re-render across standard route transitions.

## 2. Global Strategy
- **Client Side Transitions:** We use Next.js native `<Link>` tags imported from `next-intl` wrapper to ensure client-side rapid transitions while preserving the current locale in the URL path.
- **Dynamic Config Rendering:** Navigation links (Sidebar/Topbar menus) are not hardcoded inside React elements. They are typically fetched or determined by a Configuration Object (`DomainNavConfig`) built by helper functions (e.g., `getProviderNavConfig`) that parse active locales and translate labels on the server or top-level client context.

## 3. The `GlobalFullNavigationWidget`
The central nervous system for workspace level navigation is the `GlobalFullNavigationWidget`. 

### Key Characteristics:
- **Responsive Handling:** It intelligently pivots between a persistent Desktop Sidebar and a Mobile Drawer/Modal depending on viewport breakpoints.
- **Data Driven:** It expects a `menuGroups` object (typed as `Record<string, MenuGroup>`) which groups `NavItem` links together structurally. 
- **Permissions:** `NavItem` types enforce `permission` strings, dictating whether a user can organically see a menu item or if it is filtered out prior to render.

## 4. Agent Rules (Do's and Don'ts)
- **ALWAYS** use `next-intl/navigation` wrapped `<Link>` components instead of native HTML anchors to prevent loss of the `[locale]` URL prefix during internal platform traversal.
- **ALWAYS** declare menu configuration via typed Objects/Dictionaries (`DomainNavConfig`, `MenuGroup`, `NavItem`) before passing them to the layout widgets.
- **DO NOT** attempt to trigger full page reloads (`window.location.href`) unless performing hard resets (like logging out) or redirecting out of the monorepo ecosystem. 
- **DO** place specific widgets containing layout overrides inside `(widgets)` folders scoped tightly to their respective layout segments.
