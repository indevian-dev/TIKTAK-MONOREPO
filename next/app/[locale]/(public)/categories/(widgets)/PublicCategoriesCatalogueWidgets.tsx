'use client'

import { usePublicSearchContext } from '@/app/[locale]/(public)/(context)/PublicSearchContext';
import { useEffect } from 'react';
import { PublicCardsWithFiltersWidget } from '@/app/[locale]/(public)/cards/(widgets)/PublicCardsWithFiltersWidget';
import { usePublicHeaderNavContext } from '@/app/[locale]/(public)/(context)/PublicHeaderNavContext';
import { Category } from '@/app/[locale]/(public)/categories/PublicCategoriesService';

interface PublicCategoriesCatalogueWidgetsProps {
    category: Category;
}

export function PublicCategoriesCatalogueWidgets({ category }: PublicCategoriesCatalogueWidgetsProps) {
    const { triggerInitialSearch, updateInitialProps } = usePublicSearchContext();
    const { setHeaderNav, resetHeaderNav } = usePublicHeaderNavContext();

    useEffect(() => {
        if (category?.id) {
            setHeaderNav({
                pageType: 'category',
                navData: {
                    category: {
                        id: category.id,
                        title: category.title,
                        slug: category.slug || ''
                    }
                }
            });
        }
        return () => resetHeaderNav();
    }, [category?.id, setHeaderNav, resetHeaderNav]);

    useEffect(() => {
        updateInitialProps({
            categoryId: category?.id,
            includeFacets: true,
            pagination: 50,
            useAdvancedFilters: false
        });
    }, [category?.id, updateInitialProps]);

    useEffect(() => {
        triggerInitialSearch();
    }, [triggerInitialSearch]);

    return (
        <>
            <PublicCardsWithFiltersWidget />
        </>
    );
}