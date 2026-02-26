# Next.js UI Primitives & CSS Flow

## 1. Overview
The UI architecture is built upon a scalable, primitive-based design system powered by **Tailwind CSS v4** and React server/client components. We utilize a strict component hierarchy to guarantee consistent layouts (max-width constraints, standard paddings, and vertical rhythm) across all pages (public, auth, and complex workspaces).

## 2. Global CSS & Theme Tokens
The cornerstone of our styling is located in `next/app/globals.css`. It acts as the primary source of truth for base styles, custom scrollbars, and overriding themes.

- **Tailwind v4 Setup**: We use the new `@theme` directive in CSS rather than configuring a traditional `tailwind.config.ts` object for base tokens.
- **Brand Colors**: Configured under `@theme` as unified raw palettes (e.g., `--color-app-bright-purple`, `--color-app-dark-purple`). These become available as standard Tailwind utilities like `bg-app-bright-purple` or `text-app-dark-purple`.
- **Custom Scrollbars**: We provide a `.scrollbar-app` utility class to add a branded, slim scrollbar using our primary brand gradients.

## 3. UI Primitives Hierarchy
We compose layouts using a standardized flow of wrappers exported from the `next/app/primitives/` directory. The standard DOM hierarchy generally flows as:
`<Main> -> <Container> -> <Section> -> <Block>`

### 1. `Main` (`Main.primitive.tsx`)
The root structural tag for the page's unique content.
- **`variant="default"`**: Used for public or auth pages. Sets full width, minimum screen height, and default bottom padding.
- **`variant="app"`**: Used for workspaces/dashboards. Matches viewport height minus the fixed global header (`calc(100vh - 70px)`) to prevent unintended document scrolling when using sidebars.

### 2. `Container` (`Container.primitive.tsx`)
Responsible for horizontal constraints and maximum widths. It keeps content from stretching infinitely on ultra-wide monitors.
- **`variant="full"`**: Fluid container taking up 100% width.
- **`variant="centered"`**: Typical page layout container. It bounds content to `max-w-7xl` with standardized horizontal padding (`px-4 md:px-6 lg:px-8`).
- **`variant="nav"`**: Dedicated container for standardizing header navigation layouts.

### 3. `Section` (`Section.primitive.tsx`)
Responsible for vertical rhythm and structural macro-layout of varying data groups. Inside a Container, you define Sections for "Above the fold", "Features", "Footer", etc.
- Uses `grid grid-cols-1 gap-4` to handle spacing of child elements out of the box.
- **`variant="centered"`**: Provides an auto-centering margin alongside the standard padding rhythm.

### 4. `Block` (`Block.primitive.tsx`)
The foundational card/surface component for rendering atomic UI patterns or enclosing widgets. Formerly named `Card`, it was renamed to `Block` to prevent naming collisions with business domain entities (like a Payment Card or Loyalty Card).
- **`variant="default"|"elevated"`**: Creates a standard bordered container with padding, background, border radius, and deep dark-mode support via glassmorphism colors (`bg-black/5 dark:bg-white/5`).
- **`variant="flat"`**: Strips backgrounds to remain flush against parent surfaces.
- Contains modular sub-components for header, title, description, content, and footer sections (`<BlockHeader>`, `<BlockContent>`, etc.).

## 4. Best Practices
1. **Never use raw HTML tags for layout roots**: Always begin your page structures with `<Main>` and wrap internal structures with `<Container>` and `<Section>`.
2. **Propagate Dark Mode natively**: Primitives are already pre-configured to adapt to our Next-Themes implementation using `dark:` Tailwind variants. Avoid manually reinventing background switching logic on custom wrappers.
3. **Use Variants**: Do not pass inline styles or arbitrary margin/padding values to core layout primitives. If a new structural layout is needed, add a specific variant directly to the primitive's definition dictionary (`variantStyles`).
