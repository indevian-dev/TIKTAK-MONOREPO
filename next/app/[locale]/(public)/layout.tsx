'use client';

import { ReactNode, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { GlobalHeaderWidget } from '@/app/[locale]/(global)/(widgets)/GlobalHeader.widget';
import { GlobalFastNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFastNavigation.widget';
import { GlobalFullNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFullNavigation.widget';
import { PublicFooterWidget } from '@/app/[locale]/(public)/(layout)/footer/(widgets)/PublicFooter.widget';
import { PublicSearchProvider } from '@/app/[locale]/(public)/(context)/PublicSearchContext';
import { PublicHeaderNavProvider } from '@/app/[locale]/(public)/(context)/PublicHeaderNavContext';
import {
  PiHouseLine,
  PiStorefront,
  PiIdentificationCard,
  PiArticle,
  PiQuestion,
  PiCurrencyDollar
} from 'react-icons/pi';
import type { DomainNavConfig } from '@tiktak/shared/types/ui/Navigation.types';
import { MainPrimitive } from '@/app/primitives/Main.primitive';
import { ContainerPrimitive } from '@/app/primitives/Container.primitive';

const getPublicNavConfig = (): DomainNavConfig => ({
  domain: 'public',
  logoSrc: '/logoblack.svg',
  label: 'TikTak',
  fastNavLinks: [],
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
        { href: '/docs/faq', icon: PiQuestion, label: 'faq' },
        { href: '/docs/about', icon: PiQuestion, label: 'about' },
        { href: '/docs/pricing', icon: PiCurrencyDollar, label: 'pricing' },
      ]
    }
  ],
  menuDisplayMode: { desktop: 'dropdown', mobile: 'mobile-modal' }
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

          <MainPrimitive variant="default">
            <ContainerPrimitive variant="full">
              {children}
            </ContainerPrimitive>
          </MainPrimitive>

          <PublicFooterWidget />
          {/* Full Navigation (Dropdown on desktop, Modal on mobile) */}
          <GlobalFullNavigationWidget {...navProps} />
        </PublicSearchProvider>
      </PublicHeaderNavProvider>
    </>
  )
}
