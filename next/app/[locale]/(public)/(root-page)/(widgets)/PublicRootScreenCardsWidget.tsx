'use client'

import {
  useState,
  useEffect
} from 'react';
import { useLocale } from 'next-intl';
import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';
import { PublicSectionTitleTile } from '@/app/[locale]/(public)/(tiles)/PublicSectionTitleTile';
import { PublicCardsListWidget } from '@/app/[locale]/(public)/cards/(widgets)/PublicCardsListWidget';
import { apiCallForSpaHelper } from '@/lib/helpers/apiCallForSpaHelper';

import type { Card } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
// API response type for public root screen cards (featured cards)
// Use the same type as regular public cards for compatibility
interface PublicRootScreenCardApiResponse extends Card.PublicAccess {
  created_at: Date; // API uses snake_case
  cover?: string;
  storage_prefix?: string;
  [key: string]: any; // Allow additional API fields
}

export function PublicRootScreenCardsWidget() {

  const { t } = loadClientSideCoLocatedTranslations('PublicRootScreenCardsWidget');
  const [cardsList, setCardsList] = useState<PublicRootScreenCardApiResponse[]>([]);
  const locale = useLocale();

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await apiCallForSpaHelper({ method: "GET", url: `/api/cards/featured` });
        if (response.status !== 200) throw new Error('Network response was not ok');

        // Handle OpenSearch response structure
        const cardsData = response.data.cards;

        setCardsList(cardsData);
        ConsoleLogger.log('Processed cards:', cardsData);
      } catch (error) {
        const err = error as Error;
        ConsoleLogger.error('Error fetching Cards:', err.message);
      }
    }

    fetchCards();
  }, [locale]);

  return (
    <section className='relative w-full my-4 md:my-6 lg:my-8'>
      <div className='container m-auto max-w-7xl px-4 py-5'>
        <PublicSectionTitleTile sectionTitle={t('cards')} />
        <div className='w-full '>
          <PublicCardsListWidget cards={cardsList as any} className='' />
        </div>
      </div>
    </section>
  );
}