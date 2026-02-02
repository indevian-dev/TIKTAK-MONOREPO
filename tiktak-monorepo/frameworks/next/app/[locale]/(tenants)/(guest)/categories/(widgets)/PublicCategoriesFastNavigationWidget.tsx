'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';
import { useGlobalCategoryContext } from '@/app/[locale]/(global)/(context)/GlobalCategoryContext';

import { Category } from '@/app/[locale]/(tenants)/(guest)/categories/PublicCategoriesService';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
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
          const rootCategories = categoriesHierarchy.filter(cat => cat.parentId === null);
          
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
    <section className="max-w-7xl m-auto px-4 my-4 md:my-6 lg:my-8">
      <div className='grid grid-rows-2 grid-flow-col gap-3 overflow-x-scroll py-2 pb-4 text-sm'>
        <Link key={'map'} href={`/map`} passHref className={`col-span-6 lg:col-span-8 px-2 pt-2 pb-10 rounded flex items-center  relative bg-brandPrimary text-brandPrimaryLightText`} >
          <span className="absolute top-2 font-semibold line-clamp-2">Map</span>
        </Link>
        {categories && categories.length > 0 && categories.map((category) => {
          return (
            <Link key={category.id} href={`/categories/${category.slug}-${category.id}`} passHref className={`col-span-12 px-2 pt-2 pb-4 rounded flex items-start  relative overflow-hidden ${category.type === 'digital' ? 'bg-brandPrimaryDarkBg/10 text-dark' : 'bg-brandPrimary/5 text-dark'}`} >
              {category.icon ? (
                <img src={`https://s3.tebi.io/tiktak/categories/${category.id}/${category.icon}`} alt={category.title} className="h-2/3 lg:h-2/3 absolute bottom-0 right-0 opacity-100" />
              ) : (
                <div className="h-12 w-12  flex items-center justify-center absolute bottom-0 right-0">
                </div>
              )}
              <span className='absolute w-full h-full top-0 bottom-0 left-0 right-0'></span>
              <span className="font-semibold line-clamp-3 w-full">{category.title}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}