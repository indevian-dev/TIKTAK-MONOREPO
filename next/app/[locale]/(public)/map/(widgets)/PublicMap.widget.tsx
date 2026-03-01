"use client";

import { PublicCardsFiltersWidget }
    from '@/app/[locale]/(public)/filters/(widgets)/PublicCardsFilters.widget';
import { PublicCardsSearchWidget }
    from '@/app/[locale]/(public)/filters/(widgets)/PublicCardsSearch.widget';
import { PublicCardsSortWidget }
    from '@/app/[locale]/(public)/filters/(widgets)/PublicCardsSort.widget';
import { PublicSectionTitleTile }
    from '@/app/[locale]/(public)/(tiles)/PublicSectionTitle.tile';
import { PublicMapboxWidthCardsWidget }
    from '@/app/[locale]/(public)/map/(widgets)/PublicMapboxWidthCards.widget';
import { loadClientSideCoLocatedTranslations }
    from '@/i18n/i18nClientSide';
import { SectionPrimitive } from '@/app/primitives/Section.primitive';
export function PublicMapWidget() {
    const { t } = loadClientSideCoLocatedTranslations('PublicMapWidget');

    return (
        <SectionPrimitive variant="full">
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
        </SectionPrimitive>
    );
};
