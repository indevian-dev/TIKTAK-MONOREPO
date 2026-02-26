'use client'

import {
  useState,
  useEffect
} from 'react';
import { useLocale } from 'next-intl';
import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';
import { PublicSectionTitleTile } from '@/app/[locale]/(public)/(tiles)/PublicSectionTitle.tile';
import { PublicCardsListWidget } from '@/app/[locale]/(public)/cards/(widgets)/PublicCardsList.widget';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';

import type { Card } from '@tiktak/shared/types/domain/Card.types';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { Section } from '@/app/primitives/Section.primitive';

export function PublicRootScreenCardsWidget() {

  const { t } = loadClientSideCoLocatedTranslations('PublicRootScreenCardsWidget');
  const [cardsList, setCardsList] = useState<Card.PublicAccess[]>([]);
  const locale = useLocale();

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await apiCall({ method: "GET", url: `/api/cards/featured` });
        if (response.status !== 200) throw new Error('Network response was not ok');

        // Handle search response structure
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
    <Section variant="centered">
      <PublicSectionTitleTile sectionTitle={t('cards')} />
      <PublicCardsListWidget cards={cardsList as any} className='' />
    </Section>
  );
}