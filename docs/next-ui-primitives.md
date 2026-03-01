# Next.js UI Primitives & CSS Flow

## 1. Overview
The UI architecture is built upon a scalable, primitive-based design system powered by **Tailwind CSS v4** and React server/client components. We utilize a strict component hierarchy to guarantee consistent layouts (max-width constraints, standard paddings, and vertical rhythm) across all pages (public, auth, and complex workspaces).

All primitive components use the `*Primitive` naming convention (e.g., `MainPrimitive`, `SectionPrimitive`) to avoid collisions with business domain entities and HTML tags.

## 2. Global CSS & Theme Tokens
The cornerstone of our styling is located in `next/app/globals.css`. It acts as the primary source of truth for base styles, custom scrollbars, and overriding themes.

- **Tailwind v4 Setup**: We use the new `@theme` directive in CSS rather than configuring a traditional `tailwind.config.ts` object for base tokens.
- **Brand Colors**: Configured under `@theme` as unified raw palettes (e.g., `--color-app-bright-purple`, `--color-app-dark-purple`). These become available as standard Tailwind utilities like `bg-app-bright-purple` or `text-app-dark-purple`.
- **Custom Scrollbars**: We provide a `.scrollbar-app` utility class to add a branded, slim scrollbar using our primary brand gradients.

## 3. UI Primitives — Layout Hierarchy

We compose layouts using a standardized flow of wrappers exported from the `next/app/primitives/` directory:

```
<MainPrimitive> → <ContainerPrimitive> → <SectionPrimitive> → <BlockPrimitive>
```

### `MainPrimitive` — `Main.primitive.tsx`
Root structural `<main>` tag for page content.

| Variant | Purpose | Key Classes |
|---------|---------|-------------|
| `default` | Public/auth pages | `min-h-screen flex flex-col pb-24` |
| `app` | Workspace dashboards | `min-h-[calc(100vh-70px)] pb-24` |

---

### `ContainerPrimitive` — `Container.primitive.tsx`
Horizontal constraint wrapper. Prevents content from stretching on ultra-wide monitors.

| Variant | Purpose | Key Classes |
|---------|---------|-------------|
| `full` | Fluid 100% width | `max-w-full` |
| `centered` | Standard page layout | `max-w-7xl px-4 md:px-6 lg:px-8 flex items-start gap-4` |
| `nav` | Header navigation | `max-w-7xl px-4 md:px-6 lg:px-8 flex items-center h-16 justify-between` |

---

### `SectionPrimitive` — `Section.primitive.tsx`
Vertical rhythm and macro-layout for data groups. Renders as `<section>`.

| Variant | Purpose | Key Classes |
|---------|---------|-------------|
| `full` | Default, full-width section | `grid grid-cols-1 gap-4 px-4 md:px-6 lg:px-8` |
| `centered` | Centered with max-width | `grid grid-cols-1 gap-4 max-w-7xl mx-auto my-4 px-4 md:px-6 lg:px-8` |

---

### `BlockPrimitive` — `Block.primitive.tsx`
Card/surface component for atomic UI patterns. Has modular sub-components.

| Variant | Purpose | Key Classes |
|---------|---------|-------------|
| `default` | Standard bordered card | `rounded-app border p-4 md:p-6 bg-black/5 dark:bg-white/5` |
| `flat` | Flush against parent | `bg-transparent bg-white dark:bg-app-dark-purple` |
| `elevated` | Elevated card (same as default) | `rounded-app border p-4 md:p-6 bg-black/5 dark:bg-white/5` |
| `modal` | Full-screen overlay + scroll lock | `fixed inset-0 z-50 h-screen overflow-y-auto overscroll-contain grid ... bg-white dark:bg-app-dark-purple` |

**Modal variant** (`"use client"` component):
- Renders a fixed full-screen overlay with solid background (no blur/glass).
- Automatically locks body scroll (`overflow: hidden`) on mount, restores on unmount.
- Usage pattern:
  ```tsx
  <BlockPrimitive variant="modal">  {/* Overlay + scroll lock */}
    <BlockPrimitive variant="default">  {/* Content card */}
      {/* Modal content */}
    </BlockPrimitive>
  </BlockPrimitive>
  ```

**Sub-components** (no `Primitive` suffix — already namespaced):
- `BlockHeader` — `flex flex-col space-y-1.5 p-6`
- `BlockTitle` — `font-black text-xl leading-none`
- `BlockDescription` — `text-sm text-app-dark-blue/70`
- `BlockContent` — `p-6 pt-0`
- `BlockFooter` — `flex items-center p-6 pt-0`

## 4. UI Primitives — Interactive Components

### `SelectPrimitive` — `Select.primitive.tsx`
Client-side dropdown with built-in search and multi-select.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `{ value: string\|number, label: string }[]` | required | Dropdown items |
| `value` | `string\|number\|any[]` | — | Controlled value(s) |
| `onChange` | `(value: any) => void` | required | Change handler |
| `placeholder` | `string` | `"Select..."` | Placeholder text |
| `isMulti` | `boolean` | `false` | Enable multi-select |

---

### `PaginationPrimitive` — `Pagination.primitive.tsx`
Client-side page navigation with page numbers, smart ellipsis, and prev/next.

| Prop | Type | Description |
|------|------|-------------|
| `currentPage` | `number` | Currently active page (1-indexed) |
| `totalPages` | `number` | Total number of pages |
| `onPageChange` | `(page: number) => void` | Page change callback |

**Design:** Active page uses `bg-app-bright-purple text-white`. Inactive pages use `bg-black/5 dark:bg-white/5`. Ellipsis shown for large page counts (±2 pages around current are visible). Auto-hides when `totalPages <= 1`.

---

### `ButtonPrimitive` — `Button.primitive.tsx`
Button with optional link mode (`isLink: true` renders as `<Link>`).

| Variant | Purpose |
|---------|---------|
| `default` | Primary CTA — green bg, bold shadow |
| `secondary` | Subtle bg with border, glassmorphism |
| `outline` | Transparent with border |
| `ghost` | No border, hover bg only |
| `link` | Underline on hover, green text |
| `elevated` | Glassmorphism + lift on hover |

**Link mode props**: `isLink: true`, `href: string`
**Button mode props**: `onClick`, `disabled`, `type`

---

### `BadgePrimitive` — `Badge.primitive.tsx`
Inline pill labels.

| Variant | Purpose |
|---------|---------|
| `default` | Green bg, dark text |
| `secondary` | Glassmorphism, subtle bg |
| `destructive` | Red/danger bg, white text |
| `outline` | Border only, no fill |

---

### `SectionTitlePrimitive` — `SectionTitle.primitive.tsx`
Section header with structured layout. Does **not** use the variant pattern — instead accepts props.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `ReactNode` | ✅ | Main title (rendered as `<h2>`) |
| `description` | `ReactNode` | ❌ | Subtitle text |
| `action` | `ReactNode` | ❌ | Right-side action element |
| `icon` | `ReactNode` | ❌ | Icon beside the title |

---

### `DatePickerPrimitive` — `DatePicker.primitive.tsx`
Inline dropdown calendar for date (and optional time) selection. Opens below the trigger like `SelectPrimitive` — no modals.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | ISO date: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm` |
| `onChange` | `(value: string) => void` | required | Fires with ISO string on selection |
| `placeholder` | `string` | `"Select date…"` | Placeholder text |
| `includeTime` | `boolean` | `false` | Show hour/minute selectors |
| `minDate` | `string` | — | ISO date, disables dates before |
| `maxDate` | `string` | — | ISO date, disables dates after |
| `disabled` | `boolean` | `false` | Disable the picker |

## 5. Best Practices

1. **Never use raw HTML tags for layout roots** — Always start with `<MainPrimitive>` → `<ContainerPrimitive>` → `<SectionPrimitive>`.
2. **Dark mode is built-in** — Primitives use `dark:` Tailwind variants; no extra config needed.
3. **Use variants, never inline styles** — If a new layout is needed, add a variant to the primitive's `variants` object.
4. **Primitives accept only `variant` + `children`** — No `className`, `id`, or `onClick` spread. Wrap in a parent if you need interactive behavior.
5. **No `forwardRef`** — Primitives are plain functions.
6. **No class joining** — Each variant is a complete, static class string.
7. **`*Primitive` naming convention** — All primitives export with the suffix (e.g., `BlockPrimitive`). Import directly from the file:
   ```tsx
   import { SectionPrimitive } from '@/app/primitives/Section.primitive';
   ```
