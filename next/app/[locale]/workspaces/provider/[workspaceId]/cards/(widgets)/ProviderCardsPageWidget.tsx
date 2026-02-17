'use client'

import {
  useState,
  useEffect
} from 'react';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';
import { Link }
  from '@/i18n/routing';
import { ProviderCardsListWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderCardsListWidget';

export function ProviderCardsPageWidget() {
  const [loading, setLoading] = useState(true);
  const { t } = loadClientSideCoLocatedTranslations('ProviderCardsPage');

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('my_cards')}</h1>
        <Link
          href="/provider/cards/create"
          className="bg-brandPrimary text-white px-4 py-2 rounded-primary hover:bg-brandPrimary/80"
        >
          {t('create_card')}
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
        </div>
      ) : (
        <ProviderCardsListWidget />
      )}
    </div>
  );
}

