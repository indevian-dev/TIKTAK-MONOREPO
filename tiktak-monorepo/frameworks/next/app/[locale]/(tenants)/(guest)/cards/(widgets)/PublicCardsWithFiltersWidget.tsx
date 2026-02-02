'use client'

import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';
import { PublicSectionTitleTile } from '@/app/[locale]/(tenants)/(guest)/(tiles)/PublicSectionTitleTile';
import { PublicCardsListWidget } from '@/app/[locale]/(tenants)/(guest)/cards/(widgets)/PublicCardsListWidget';
import { usePublicSearchContext } from '@/app/[locale]/(tenants)/(guest)/(context)/PublicSearchContext';

interface PublicCardsWithFiltersWidgetProps {
    title?: string | null;
    showTitle?: boolean;
    showResultsCount?: boolean;
    className?: string;
    cardsListCols?: string;
}

export function PublicCardsWithFiltersWidget({
    title = null,
    showTitle = true,
    showResultsCount = false,
    className = "",
    cardsListCols = "col-span-12",
}: PublicCardsWithFiltersWidgetProps) {
    const { t } = loadClientSideCoLocatedTranslations('PublcCardsWithFiltersWidget');

    // Use SearchContext for all search state management
    const {
        cards,
        loading,
        error,
    } = usePublicSearchContext();

    const sectionTitle = title || t('cards');
    const displayTitle = showResultsCount ? `${sectionTitle} (${cards.length})` : sectionTitle;

    return (
        <section className={`w-full max-w-screen-xl px-4 mx-auto ${className}`}>
            {showTitle && <PublicSectionTitleTile sectionTitle={displayTitle} />}

            {/* Search and Sort - always visible */}
            <div className='max-w-7xl mx-auto' >
                <div className='w-full grid grid-cols-12 gap-4 gap-y-6'>
                    {/* Filters Modal Button */}
                    {/* Only cards column shows loading state */}
                    <div className={cardsListCols}>
                        {error ? (
                            <div className='text-center py-12'>
                                <p className='text-red-500'>{error}</p>
                            </div>
                        ) : loading ? (
                            <div className='flex justify-center items-center py-12'>
                                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-brand'></div>
                                <span className='ml-3 text-gray-600'>{t('loading')}...</span>
                            </div>
                        ) : cards.length === 0 ? (
                            <div className='text-center py-12'>
                                <p className='text-gray-500'>{t('no_cards_found')}</p>
                            </div>
                        ) : (
                            <PublicCardsListWidget cards={cards} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
