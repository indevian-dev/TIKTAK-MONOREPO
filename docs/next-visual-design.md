# Next.js Visual Design System

## 1. Overview
The frontend aesthetic is built on a **Premium, Mobile-First** design system leveraging **Tailwind CSS**. 
The core visual language relies heavily on "Glassmorphism", rich dynamic gradients (`bg-brand`, `bg-gradient-to-br`), and high-contrast dark modes (`bg-slate-950`).

## 2. Directories & Configuration
- **Global CSS Variables:** `next/app/[locale]/globals.css` (or `index.css`). This file handles the `:root` and `.dark` CSS variable injections.
- **Tailwind Config:** `next/tailwind.config.ts`. Defines theme extensions, deeply nested semantic colors, and custom animations (e.g., `animate-spin`, custom keyframes).

## 3. Architecture & Patterns

### The Variable Abstraction
Avoid hardcoding raw Tailwind color utility values (like `bg-blue-500`) for primary brand elements. Instead, utilize semantic variables mapped in the Tailwind config:
- `bg-brand-primary`: The main accent color.
- `bg-surface-glass`: Translucent surfaces supporting backdrop blurs.
- `text-foreground`, `text-muted-foreground`: Standardized text contrasts.

### "Widgetization" (Smart UI Components)
Complex UI is built as **Widgets**—self-contained components that encapsulate their own structural markup, state, and often context connections (e.g., `DomainEntityProgressWidget.tsx`).
- Elements inside `(widgets)` folders are not full pages. They are modular tiles easily dropped into grids.

## 4. Agent Rules (Do's and Don'ts)
- **ALWAYS** use strictly Tailwind utility classes. Do not create isolated `.css` or `.module.css` files unless absolutely required for complex third-party library overrides.
- **ALWAYS** implement "Micro-Animations". Enhance interactive elements with `hover:scale-105 active:scale-95 transition-all duration-200` to make the UI feel alive and responsive.
- **DO NOT** hardcode hex colors (`#FF5733`) natively in TSX files (`style={{ color: '#FF5733' }}`). Rely on Tailwind's arbitrary values `text-[#FF5733]` only if a semantic variable does not exist.
- **DO** rely heavily on `backdrop-blur-md` and `bg-white/10` to maintain the Glassmorphism aesthetic on modals and floating topbars.
- **DO** verify responsiveness by default. Ensure layouts utilize `flex-col md:flex-row` or CSS grids to gracefully handle narrow mobile viewports.
