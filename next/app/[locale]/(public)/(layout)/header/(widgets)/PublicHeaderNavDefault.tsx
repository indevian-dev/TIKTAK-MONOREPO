'use client';

import { Link }
  from '@/i18n/routing';
import Image
  from 'next/image';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';
import {
  PiSquaresFourLight,
  PiXCircleLight,
} from "react-icons/pi";

export function PublicHeaderNavDefault({
  catalogueVisible,
  toggleCatalogue
}: {
  catalogueVisible: boolean;
  toggleCatalogue: () => void;
}) {
  const { t } = loadClientSideCoLocatedTranslations('PublicHeaderWidget');

  return (
    <div className="flex items-center gap-2">
      {!catalogueVisible ? (
        <button
          className="inline-flex items-center gap-1 text-gray-900 hover:text-gray-600 focus:text-gray-600 focus:outline-none bg-app-bright-purple/10 rounded-md p-2"
          onClick={toggleCatalogue}
        >
          <PiSquaresFourLight className='text-gray-900 text-3xl' />
          <span className='no-wrap flex flex-nowrap whitespace-nowrap font-bold text-gray-900 text-md'>
            {t('catalogue')}
          </span>
        </button>
      ) : (
        <button
          className="inline-flex items-center gap-1 text-gray-900 hover:text-gray-600 focus:text-gray-600 focus:outline-none bg-app-bright-purple/10 rounded-md p-2"
          onClick={toggleCatalogue}
        >
          <PiXCircleLight className='text-gray-900 text-3xl' />
          <span className='no-wrap flex flex-nowrap whitespace-nowrap font-bold text-gray-900 text-md'>
            {t('catalogue')}
          </span>
        </button>
      )}
    </div>
  );
}

