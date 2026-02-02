'use client';

import { Link }
  from '@/i18n/routing';
import { NavData } from '@/app/[locale]/(tenants)/(guest)/(context)/PublicHeaderNavContext';
import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';
import { generateSlug }
  from '@/lib/utils/slugify';

import {
  PiArrowLeftLight,
  PiShareNetworkLight,
  PiTagLight,
} from "react-icons/pi";

export function PublicHeaderNavCard({ navData }: { navData: NavData }) {
  const { t } = loadClientSideCoLocatedTranslations('PublicHeaderNavCard');
  
  // Generate slug on-the-fly from category title
  const categorySlug = generateSlug(navData.category?.title || 'category');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: navData?.title || 'Check out this card',
          url: window.location.href,
        });
      } catch (err) {
        ConsoleLogger.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-1 text-dark hover:text-gray-600 focus:outline-none bg-brandPrimaryLightBg rounded-md p-2"
      >
        <PiArrowLeftLight className='text-dark text-3xl' />
        <span className='hidden sm:flex no-wrap flex-nowrap whitespace-nowrap font-bold text-dark text-md'>
          {t('back')}
        </span>
      </button>

      {/* Category Link */}
      {navData?.category && (
        <Link
          href={`/categories/${categorySlug}-${navData.category.id}`}
          className="inline-flex items-center gap-1 text-dark hover:text-gray-600 bg-brandPrimaryLightBg/50 rounded-md px-2 py-1"
        >
          <PiTagLight className='text-dark text-xl' />
          <span className='no-wrap flex flex-nowrap whitespace-nowrap text-dark text-sm truncate max-w-[120px] sm:max-w-[200px]'>
            {navData.category.title}
          </span>
        </Link>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1 text-dark hover:text-gray-600 focus:outline-none bg-brandPrimaryLightBg rounded-md p-2"
      >
        <PiShareNetworkLight className='text-dark text-2xl' />
        <span className='hidden sm:flex no-wrap flex-nowrap whitespace-nowrap font-bold text-dark text-sm'>
          {t('share')}
        </span>
      </button>
    </div>
  );
}

