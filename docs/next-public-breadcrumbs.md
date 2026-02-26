# PublicBreadCrumbs Tile

Renders a horizontal breadcrumb trail showing the category hierarchy path for a card or category page.

## Location
`app/[locale]/(public)/(tiles)/PublicBreadCrumbs.tile.tsx`

## Props

| Prop | Type | Description |
|------|------|-------------|
| `categories` | `Category[]` | Full ancestor path from root → leaf. Must include `parentId` for hierarchy building. |

## How It Works

1. Receives an array of `Category` objects
2. `buildLinearHierarchy()` sorts them into a parent→child chain by following `parentId` links
3. Renders each category as an icon + localized link, separated by `/` dividers

## Dark Mode

Fully supports light/dark mode via Tailwind `dark:` variants:

| Element | Light | Dark |
|---------|-------|------|
| Text | `text-gray-900/50` | `dark:text-gray-400` |
| Text hover | `hover:text-gray-900` | `dark:hover:text-white` |
| Divider `/` | `text-gray-400` | `dark:text-gray-600` |
| Icon | default | `dark:invert dark:brightness-200` |

## Usage

```tsx
import { PublicBreadCrumbsTile } from '@/app/[locale]/(public)/(tiles)/PublicBreadCrumbs.tile';

// Build the ancestor path (root → leaf) for the card's first category
const categories = buildAncestorPath(categoriesHierarchy, card.categories[0]);

<PublicBreadCrumbsTile categories={categories} />
```

### Building the Category Path

The component expects the **full ancestor chain**, not just leaf categories. Use a helper like:

```tsx
const buildAncestorPath = (hierarchy: Category[], leafId: string): Category[] => {
  const flatMap = new Map<string, Category>();
  const flatten = (cats: Category[], parentId: string | null) => {
    for (const cat of cats) {
      flatMap.set(cat.id, { ...cat, parentId });
      if (cat.children?.length) flatten(cat.children, cat.id);
    }
  };
  flatten(hierarchy, null);

  const path: Category[] = [];
  let current = flatMap.get(leafId);
  while (current) {
    path.unshift(current);
    current = current.parentId ? flatMap.get(current.parentId) : undefined;
  }
  return path;
};
```

## Output Example

```
🖥️ Elektronika / 📱 Telefonlar / 📲 Mobil telefonlar
```

Each item links to its category page via `/{slug}-{id}c`.
