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
          className="inline-flex items-center gap-1 text-dark hover:text-gray-600 focus:text-gray-600 focus:outline-none bg-brandPrimaryLightBg rounded-md p-2"
          onClick={toggleCatalogue}
        >
          <PiSquaresFourLight className='text-dark text-3xl' />
          <span className='no-wrap flex flex-nowrap whitespace-nowrap font-bold text-dark text-md'>
            {t('catalogue')}
          </span>
        </button>
      ) : (
        <button
          className="inline-flex items-center gap-1 text-dark hover:text-gray-600 focus:text-gray-600 focus:outline-none bg-brandPrimaryLightBg rounded-md p-2"
          onClick={toggleCatalogue}
        >
          <PiXCircleLight className='text-dark text-3xl' />
          <span className='no-wrap flex flex-nowrap whitespace-nowrap font-bold text-dark text-md'>
            {t('catalogue')}
          </span>
        </button>
      )}
    </div>
  );
}

