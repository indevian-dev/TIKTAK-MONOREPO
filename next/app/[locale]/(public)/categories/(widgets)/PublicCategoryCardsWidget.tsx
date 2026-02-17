'use client'

import { loadClientSideCoLocatedTranslations }
    from '@/i18n/i18nClientSide';
import { PublicSectionTitleTile }
    from '@/app/[locale]/(public)/(tiles)/PublicSectionTitleTile';
import { PublicCardsListWidget }
    from '@/app/[locale]/(public)/cards/(widgets)/PublicCardsListWidget';
import { PublicCardsSearchWidget }
    from '@/app/[locale]/(public)/filters/(widgets)/PublicCardsSearchWidget';
import { PublicCardsSortWidget }
    from '@/app/[locale]/(public)/filters/(widgets)/PublicCardsSortWidget';
import { PublicCardsFiltersWidget }
    from '@/app/[locale]/(public)/filters/(widgets)/PublicCardsFiltersWidget';
import { usePublicSearchContext }
    from '@/app/[locale]/(public)/(context)/PublicSearchContext';

interface CategoryWithStats {
    id: number;
    title?: string;
    categories_cards_stats?: Record<string, number>;
}

interface PublicCategoryCardsWidgetProps {
    category: CategoryWithStats | null;
}

export function PublicCategoryCardsWidget({ category }: PublicCategoryCardsWidgetProps) {
    const { t } = loadClientSideCoLocatedTranslations('PublicCategoryCardsWidget');
    const { cards, loading, error } = usePublicSearchContext();
    
    // Convert Record<string, number> to CategoryStat[]
    const categoriesStats = category?.categories_cards_stats
        ? Object.entries(category.categories_cards_stats).map(([category_id, public_cards_count]) => ({
            category_id: parseInt(category_id),
            public_cards_count
          }))
        : undefined;

    if (!category?.id) {
        return null;
    }

    return (
        <section className='w-full my-8 md:my-12 lg:my-16 max-w-screen-xl px-4 mx-auto'>
            <PublicSectionTitleTile sectionTitle={t('cards')} />

            <div>
                <div className='w-full grid grid-cols-12 gap-4 gap-y-6 my-4'>
                    <PublicCardsSearchWidget
                        placeholder="Search for cards..."
                        className="col-span-10"
                    />
                    <PublicCardsSortWidget
                        defaultSort="newest"
                        showSortLabel={true}
                        className="col-span-2"
                    />
                </div>
                <div className='w-full grid grid-cols-12 gap-4 gap-y-6'>
                    <PublicCardsFiltersWidget
                        withCategoriesStats={true}
                        categoriesStats={categoriesStats}
                        showCategoryFilters={false}
                        className="col-span-3"
                    />

                    {/* Cards column shows loading state */}
                    <div className="col-span-9">
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
                            <PublicCardsListWidget cards={cards} className="col-span-9" />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
