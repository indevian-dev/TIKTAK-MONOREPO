import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Fragment } from 'react';
import type { Category } from '@/app/[locale]/(public)/categories/PublicCategoriesService';
import { generateSlug } from '@/lib/utils/formatting/slugify';

interface PublicBreadCrumbsTileProps {
  categories: Category[];
}

export function PublicBreadCrumbsTile({ categories }: PublicBreadCrumbsTileProps) {

  const locale = useLocale();
  // Builds a linear hierarchy from the categories array
  const buildLinearHierarchy = (cats: Category[]): Category[] => {
    const hierarchy: Category[] = [];
    let currentCategory = cats.find(category => category.parent_id === null);

    while (currentCategory) {
      hierarchy.push(currentCategory);
      // Find the next category in the hierarchy (assuming each parent has at most one child)
      const parentId = currentCategory.id;
      currentCategory = cats.find(category => category.parent_id === parentId);
    }

    return hierarchy;
  };

  // Use the function to build the linear hierarchy from categories
  const linearHierarchy = buildLinearHierarchy(categories);

  return (
    <div className="flex overflow-x-auto no-scrollbar space-x-2 items-center">
      {linearHierarchy.map((category, index) => (
        <Fragment key={category.id}>
          <div>
            {/* Render the category with a link */}
            <div className="flex items-center space-x-1 relative rounded">
              <img src={`https://s3.tebi.io/tiktak/icons/categories/${category.icon}`} alt="" className="h-4" />
              <Link href={`/${generateSlug(category.title)}-${category.id}c`} passHref locale={locale}>
                <span className="text-sm font-semibold text-dark/50 hover:underline cursor-pointer">
                  {category.title}
                </span>
              </Link>
            </div>
            {/* Render a divider for all but the last item */}
          </div>
          {index < linearHierarchy.length - 1 && <span>/</span>}
        </Fragment>
      ))}
    </div>
  );
}
