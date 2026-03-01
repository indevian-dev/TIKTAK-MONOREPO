'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';
import { useGlobalCategoryContext } from '@/app/[locale]/(global)/(context)/GlobalCategoryContext';

import { Category } from '@/app/[locale]/(public)/categories/PublicCategoriesService';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { lt } from '@/lib/utils/Localized.util';
import { SectionPrimitive } from '@/app/primitives/Section.primitive';
interface PublicCategoriesFastNavigationWidgetProps {
  category?: Category | null;
}

export function PublicCategoriesFastNavigationWidget({ category }: PublicCategoriesFastNavigationWidgetProps) {

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  loadClientSideCoLocatedTranslations('PublicCategoriesFastNavigationWidget');
  const { categoriesHierarchy, loading: contextLoading, getSubCategories } = useGlobalCategoryContext();


  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);

        if (category && category.id) {
          // If category prop is provided, get its subcategories
          const result = await getSubCategories(category.id);
          if (!result.error) {
            // Slugs are auto-generated, so all categories have slugs
            setCategories(result.categories || []);
          } else {
            ConsoleLogger.error('Error fetching subcategories:', result.error);
            setCategories([]);
          }
        } else {
          // If no category prop, use root/parent categories from context
          // Root categories have parentId === null (no parent)
          // Slugs are auto-generated, so no need to filter by slug
          const rootCategories = categoriesHierarchy.filter(cat => cat.parentId == null);

          ConsoleLogger.log('🔍 Widget: Total hierarchy:', categoriesHierarchy.length);
          ConsoleLogger.log('✅ Widget: Parent categories:', rootCategories.length);

          setCategories(rootCategories);
        }
      } catch (error) {
        ConsoleLogger.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    if (!contextLoading) {
      loadCategories();
    }
  }, [category, categoriesHierarchy, contextLoading, getSubCategories]);

  if (loading) {
    return <div className="flex justify-center items-center h-full  p-8"><div className="loader h-8 w-8"></div></div>;
  }

  if (!categories || categories.length === 0) {
    return null; // Don't render anything if conditions aren't met
  }

  return (
    <SectionPrimitive variant="centered">
      <div className='grid grid-rows-2 grid-flow-col gap-3 overflow-x-scroll py-2 pb-4 text-sm scrollbar-app'>
        <Link key={'map'} href={`/map`} passHref className={`col-span-10 px-2 pt-2 pb-10 rounded-app flex items-center  relative bg-app-bright-purple text-white`} >
          <span className="absolute top-2 font-semibold line-clamp-2">Map</span>
        </Link>
        {categories && categories.length > 0 && categories.map((category) => {
          return (
            <Link key={category.id} href={`/categories/${category.slug}-${category.id}`} passHref className={`col-span-14 px-2 pt-4 pb-8 rounded-app flex items-start relative overflow-hidden ${category.type === 'digital' ? 'bg-gray-900/10 dark:bg-gray-700/30 text-gray-900 dark:text-gray-100' : 'bg-app-dark-purple/10 dark:bg-white/5 text-gray-900 dark:text-gray-100'}`} >
              <span className='absolute w-full h-full top-0 bottom-0 left-0 right-0 z-3'></span>
              <span className="font-semibold line-clamp-3 w-2/3 pl-2 z-3">{lt(category.title)}</span>
              <img src={`/categories/${category.id}/icon.svg`} alt={lt(category.title)} className="h-1/2 absolute bottom-3 right-3 opacity-100 z-0" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </Link>
          );
        })}
      </div>
    </SectionPrimitive>
  );
}