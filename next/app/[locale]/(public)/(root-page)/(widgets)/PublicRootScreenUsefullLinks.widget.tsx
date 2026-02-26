'use client'

import { Link } from '@/i18n/routing';
import {
  PiNewspaperLight,
  PiMapPinLight,
  PiShieldCheckLight,
} from 'react-icons/pi';
import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';
import { IconType } from 'react-icons';

interface StaticLink {
  id: number;
  slug: string;
  titleKey: string;
  icon: IconType;
}

export function PublicUsefullLinksWidget() {
  const { t } = loadClientSideCoLocatedTranslations('PublicRootScreenUsefullLinksWidget');

  const staticLinks: StaticLink[] = [
    {
      id: 1,
      slug: 'jurnal',
      titleKey: 'journal',
      icon: PiNewspaperLight
    },
    {
      id: 4,
      slug: 'map',
      titleKey: 'map',
      icon: PiMapPinLight
    },
    {
      id: 7,
      slug: 'premium-adds',
      titleKey: 'premium_adds',
      icon: PiShieldCheckLight
    },
  ];

  return (
    <section className="max-w-screen-xl m-auto px-2 py-2">
      <div className='flex gap-2 overflow-x-auto scrollbar-hide pb-4'>
        {staticLinks.map(link => (
          <Link
            key={link.id}
            href={`/${link.slug}`}
            className={`flex-shrink-0 px-2 py-2 rounded flex items-center gap-2 relative bg-app-bright-purple/10 text-gray-900 hover:bg-app-bright-purple hover:text-white transition-colors duration-200 whitespace-nowrap`}
          >
            {link.icon && <link.icon className="text-xl" />}
            <span className="font-bold">{t(link.titleKey)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}