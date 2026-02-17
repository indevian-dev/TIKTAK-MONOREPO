'use client';

import { useState }
  from 'react';
import { NavData } from '@/app/[locale]/(public)/(context)/PublicHeaderNavContext';
import { Link }
  from '@/i18n/routing';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';
import {
  PiArrowLeftLight,
  PiMagnifyingGlassLight,
  PiFunnelLight,
  PiSortAscendingLight,
} from "react-icons/pi";
import { PublicHeaderSearchFiltersModalWidget } from '@/app/[locale]/(public)/(layout)/header/(widgets)/PublicHeaderSearchFiltersModalWidget';
import { generateSlug }
  from '@/lib/utils/formatting/slugify';

export function PublicHeaderNavCategory({ navData, isCataloguePage }: { navData: NavData; isCataloguePage: boolean }) {
  const { t } = loadClientSideCoLocatedTranslations('PublicHeaderNavCategory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Generate slug on-the-fly from category title
  const categorySlug = generateSlug(navData.category?.title || 'category');

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-1 text-dark hover:text-gray-600 focus:outline-none bg-brandPrimaryLightBg rounded-md p-2"
      >
        <PiArrowLeftLight className='text-dark text-3xl' />
      </button>

      {!isCataloguePage ? (
        <Link href={`/categories/${categorySlug}-${navData.category.id}/catalogue`} className="text-gray-500 text-sm whitespace-nowrap" title={t('catalogue')}>
          {t('catalogue')}
        </Link>
      ) : (
        <>
          {/* Search/Filter/Sort Button */}
          < button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 text-dark hover:text-gray-600 bg-brandPrimaryLightBg rounded-md p-2"
            aria-label={t('search_filter_sort')}
          >
            <PiMagnifyingGlassLight className='text-dark text-xl' />
            <PiFunnelLight className='text-dark text-xl' />
            <PiSortAscendingLight className='text-dark text-xl' />
          </button>

          {/* Search Filters Modal */}
          <PublicHeaderSearchFiltersModalWidget
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
      {/* Spacer */}
      <div className="flex-1" />

      {/* Category Count */}
      {
        navData?.count !== undefined && (
          <span className="text-gray-500 text-sm whitespace-nowrap">
            {navData.count} {t('items')}
          </span>
        )
      }
    </div >
  );
}

