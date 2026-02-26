"use client";

import { useEffect } from 'react';
import { usePublicSearchContext } from '@/app/[locale]/(public)/(context)/PublicSearchContext';
import { PublicCardsWithFiltersWidget } from '@/app/[locale]/(public)/cards/(widgets)/PublicCardsWithFilters.widget';
import { usePublicHeaderNavContext } from '@/app/[locale]/(public)/(context)/PublicHeaderNavContext';
import { useGlobalCategoryContext } from '@/app/[locale]/(global)/(context)/GlobalCategoryContext';
import { Category } from '@/app/[locale]/(public)/categories/PublicCategoriesService';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { lt } from '@/lib/utils/Localized.util';
import { Section } from '@/app/primitives/Section.primitive';
interface PublicSingleCategoryWidgetProps {
    category: Category;
}

export function PublicSingleCategoryWidget({ category }: PublicSingleCategoryWidgetProps) {
    const { updateInitialProps, triggerInitialSearch, total } = usePublicSearchContext();
    const { setHeaderNav, resetHeaderNav } = usePublicHeaderNavContext();
    const { categoriesHierarchy } = useGlobalCategoryContext();

    // Find parent category
    const findParentCategory = (categories: Category[], targetId: string, parent: Category | null = null): Category | null | undefined => {
        for (const cat of categories) {
            if (cat.id === targetId) return parent;
            if (cat.children && cat.children.length > 0) {
                const found = findParentCategory(cat.children, targetId, cat);
                if (found !== undefined) return found;
            }
        }
        return undefined;
    };

    // Set header nav for category page
    useEffect(() => {
        if (category) {
            const parentCategory = findParentCategory(categoriesHierarchy, category.id);

            setHeaderNav({
                pageType: 'category',
                navData: {
                    category: {
                        id: category.id,
                        title: category.title,
                        slug: category.slug || ''
                    },
                    parentCategory: parentCategory
                        ? { id: parentCategory.id, title: parentCategory.title, slug: parentCategory.slug || '' }
                        : null,
                    count: total
                }
            });
        }
        return () => resetHeaderNav();
    }, [category, categoriesHierarchy, total, setHeaderNav, resetHeaderNav]);

    // Configure search context for this category
    useEffect(() => {
        ConsoleLogger.log('📂 Configuring search context for category:', category.id);

        // Set initial props (persistent, never cleared)
        updateInitialProps({
            categoryId: category.id,
            includeFacets: true,
            pagination: 50,
            useAdvancedFilters: false
        });

        // Small delay to allow config to settle, then trigger search
        const timeoutId = setTimeout(() => {
            triggerInitialSearch();
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [category.id]); // Only depend on category.id to prevent unnecessary re-runs

    return (
        <PublicCardsWithFiltersWidget showTitle={false} showResultsCount={true} />
    );
}
