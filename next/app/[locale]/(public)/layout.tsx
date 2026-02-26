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
  PiQuestion
} from 'react-icons/pi';
import type { DomainNavConfig } from '@tiktak/shared/types/ui/Navigation.types';
import { Main } from '@/app/primitives/Main.primitive';
import { Container } from '@/app/primitives/Container.primitive';

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
        { href: '/pages/faq', icon: PiQuestion, label: 'faq' },
        { href: '/pages/about', icon: PiQuestion, label: 'about' },
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

          <Main variant="default">
            <Container variant="full">
              {children}
            </Container>
          </Main>

          <PublicFooterWidget />
          {/* Full Navigation (Dropdown on desktop, Modal on mobile) */}
          <GlobalFullNavigationWidget {...navProps} />
        </PublicSearchProvider>
      </PublicHeaderNavProvider>
    </>
  )
}
