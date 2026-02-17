'use client';

import { ReactNode, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { GlobalHeaderWidget } from '@/app/[locale]/(global)/(widgets)/GlobalHeaderWidget';
import { GlobalFastNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFastNavigationWidget';
import { GlobalFullNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFullNavigationWidget';
import { PublicFooterWidget } from '@/app/[locale]/(public)/(layout)/footer/(widgets)/PublicFooterWidget';
import { PublicSearchProvider } from '@/app/[locale]/(public)/(context)/PublicSearchContext';
import { PublicHeaderNavProvider } from '@/app/[locale]/(public)/(context)/PublicHeaderNavContext';
import {
  PiHouseLine,
  PiStorefront,
  PiIdentificationCard,
  PiArticle,
  PiQuestion
} from 'react-icons/pi';
import type { DomainNavConfig } from '@tiktak/shared/types';

const getPublicNavConfig = (): DomainNavConfig => ({
  menuGroups: [
    {
      label: 'Explore',
      items: [
        { href: '/', icon: PiHouseLine, label: 'home' },
        { href: '/cards', icon: PiIdentificationCard, label: 'cards' },
        { href: '/stores', icon: PiStorefront, label: 'stores' },
        { href: '/blogs', icon: PiArticle, label: 'blogs' },
      ]
    },
    {
      label: 'Support',
      items: [
        { href: '/pages/faq', icon: PiQuestion, label: 'faq' },
        { href: '/pages/about', icon: PiQuestion, label: 'about' },
      ]
    }
  ],
  menuDisplayMode: 'dropdown'
});

export default function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMapPage = pathname?.includes('/map');

  const navConfig = useMemo(() => getPublicNavConfig(), []);

  const navProps = {
    navConfig,
    isMenuOpen,
    setIsMenuOpen,
    currentPath: pathname
  };

  return (
    <>
      <PublicHeaderNavProvider>
        <PublicSearchProvider initialProps={{
          includeFacets: true,
          pagination: 50,
          useAdvancedFilters: true,
          mode: isMapPage ? 'map' : 'simple'
        }}>
          <GlobalHeaderWidget {...navProps}>
            <GlobalFastNavigationWidget {...navProps} />
          </GlobalHeaderWidget>

          <main className='text-dark min-h-screen'>
            {children}
          </main>

          <PublicFooterWidget />

          <GlobalFastNavigationWidget {...navProps} />

          {/* Mobile Modal Navigation */}
          <GlobalFullNavigationWidget
            {...navProps}
            navConfig={{ ...navConfig, menuDisplayMode: 'modal' }}
          />
        </PublicSearchProvider>
      </PublicHeaderNavProvider>
    </>
  )
}
