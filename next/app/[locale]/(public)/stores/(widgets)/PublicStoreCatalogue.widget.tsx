'use client'

import { useEffect }
    from 'react';
import { usePublicSearchContext }
    from '@/app/[locale]/(public)/(context)/PublicSearchContext';
import { usePublicHeaderNavContext } from '@/app/[locale]/(public)/(context)/PublicHeaderNavContext';
import { PublicCardsWithFiltersWidget } from '@/app/[locale]/(public)/cards/(widgets)/PublicCardsWithFilters.widget';

// API response type for public store data
interface PublicStoreApiResponse {
    id: string;
    name?: string;
    logo?: string;
    phone?: string;
}

interface PublicStoreCatalogueWidgetProps {
    store: PublicStoreApiResponse | null;
}

export function PublicStoreCatalogueWidget({ store }: PublicStoreCatalogueWidgetProps) {
    const {
        cards,
        loading,
    } = usePublicSearchContext();


    const { triggerInitialSearch, updateInitialProps } = usePublicSearchContext();
    const { setHeaderNav, resetHeaderNav } = usePublicHeaderNavContext();

    useEffect(() => {
        if (store?.id) {
            setHeaderNav({
                pageType: 'store',
                navData: {
                    store: {
                        id: store.id,
                        name: store.name || 'Store',
                        logo: store.logo,
                        phone: store.phone
                    }
                }
            });
        }
        return () => resetHeaderNav();
    }, [store?.id, setHeaderNav, resetHeaderNav]);

    useEffect(() => {
        updateInitialProps({
            workspaceId: store?.id ? String(store.id) : null,
            includeFacets: true,
            pagination: 50,
            useAdvancedFilters: false
        });
    }, [store?.id, updateInitialProps]);

    useEffect(() => {
        triggerInitialSearch();
    }, [triggerInitialSearch]);

    if (!loading && cards.length === 0) {
        return null;
    }

    return (
        <>
            <PublicCardsWithFiltersWidget
                showTitle={false}
                showResultsCount={true}
            />
        </>
    );
};

