'use client'

import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';
import { PublicSectionTitleTile } from '@/app/[locale]/(tenants)/(guest)/(tiles)/PublicSectionTitleTile';
import { PublicCardsListWidget } from '@/app/[locale]/(tenants)/(guest)/cards/(widgets)/PublicCardsListWidget';
import { useEffect, useState } from 'react';
import { searchCards } from '@/app/[locale]/(tenants)/(guest)/cards/PublicCardsService';

import type { Card } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
// API response type for public related cards (compatible with PublicCardApiResponse)
interface PublicRelatedCardApiResponse extends Omit<Card.PublicAccess, 'images'> {
    created_at: Date; // API uses snake_case
    images?: string[];
    cover?: string;
    storage_prefix?: string;
    store_id?: number | null;
    [key: string]: unknown; // For additional fields
}

interface PublicRelatedCardsWidgetProps {
    categoryId: number | null;
}

export function PublicRelatedCardsWidget({ categoryId }: PublicRelatedCardsWidgetProps) {
    const [relatedCards, setRelatedCards] = useState<PublicRelatedCardApiResponse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRelatedCards = async () => {
            if (!categoryId) return;

            setLoading(true);
            try {
                const response = await searchCards({
                    categoryId: categoryId,
                    pagination: 6 // Limit related cards to 6 items
                });

                if (response.error) {
                    ConsoleLogger.error('Error fetching related cards:', response.error);
                    setRelatedCards([]);
                } else {
                    setRelatedCards((response.cards || []) as PublicRelatedCardApiResponse[]);
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
        <section className='my-8 md:my-12 lg:my-16 max-w-screen-xl px-4 mx-auto'>
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
        </section>
    );
}