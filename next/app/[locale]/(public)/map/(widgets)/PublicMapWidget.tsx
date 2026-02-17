"use client";

import { PublicCardsFiltersWidget }
    from '@/app/[locale]/(public)/filters/(widgets)/PublicCardsFiltersWidget';
import { PublicCardsSearchWidget }
    from '@/app/[locale]/(public)/filters/(widgets)/PublicCardsSearchWidget';
import { PublicCardsSortWidget }
    from '@/app/[locale]/(public)/filters/(widgets)/PublicCardsSortWidget';
import { PublicSectionTitleTile }
    from '@/app/[locale]/(public)/(tiles)/PublicSectionTitleTile';
import { PublicMapboxWidthCardsWidget }
    from '@/app/[locale]/(public)/map/(widgets)/PublicMapboxWidthCardsWidget';
import { loadClientSideCoLocatedTranslations }
    from '@/i18n/i18nClientSide';
export function PublicMapWidget() {
    const { t } = loadClientSideCoLocatedTranslations('PublicMapWidget');

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
                        categoriesStats={[]}
                        showCategoryFilters={false}
                        className="col-span-3"
                    />

                    <div className="col-span-9">
                        <PublicMapboxWidthCardsWidget className="col-span-9" />
                    </div>
                </div>
            </div>
        </section>
    );
};
