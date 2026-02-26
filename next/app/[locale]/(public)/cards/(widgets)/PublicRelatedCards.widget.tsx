'use client'

import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';
import { PublicSectionTitleTile } from '@/app/[locale]/(public)/(tiles)/PublicSectionTitle.tile';
import { PublicCardsListWidget } from '@/app/[locale]/(public)/cards/(widgets)/PublicCardsList.widget';
import { useEffect, useState } from 'react';
import { searchCards } from '@/app/[locale]/(public)/cards/PublicCardsService';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { Section } from '@/app/primitives/Section.primitive';

interface PublicRelatedCardsWidgetProps {
    categoryId: string | null;
}

export function PublicRelatedCardsWidget({ categoryId }: PublicRelatedCardsWidgetProps) {
    const [relatedCards, setRelatedCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRelatedCards = async () => {
            if (!categoryId) return;

            setLoading(true);
            try {
                const response = await searchCards({
                    categoryId: categoryId as any,
                    pagination: 6 // Limit related cards to 6 items
                });

                if (response.error) {
                    ConsoleLogger.error('Error fetching related cards:', response.error);
                    setRelatedCards([]);
                } else {
                    setRelatedCards(response.cards || []);
                }
            } catch (error) {
                ConsoleLogger.error('Error fetching related cards:', error);
                setRelatedCards([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedCards();
    }, [categoryId]);

    const { t } = loadClientSideCoLocatedTranslations('PublicRelatedCardsWidget');

    // Don't render if no category ID or no related cards found
    if (!categoryId || (!loading && relatedCards.length === 0)) {
        return null;
    }

    return (
        <Section variant='centered'>
            <PublicSectionTitleTile sectionTitle={t('related_cards')} />
            <div className='w-full'>
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <PublicCardsListWidget cards={relatedCards} />
                )}
            </div>
        </Section>
    );
}