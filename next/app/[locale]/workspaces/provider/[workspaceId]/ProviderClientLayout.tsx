'use client'

import { useState, useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { GlobalHeaderWidget } from '@/app/[locale]/(global)/(widgets)/GlobalHeader.widget';
import { GlobalFullNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFullNavigation.widget';
import { GlobalFastNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFastNavigation.widget';
import {
  PiHouseLine,
  PiPlusCircle,
  PiListBullets,
  PiUserCircle,
  PiEnvelopeSimple,
  PiStorefront,
  PiHeart,
  PiBell,
  PiStorefrontDuotone
} from 'react-icons/pi';
import type { DomainNavConfig } from '@tiktak/shared/types/ui/Navigation.types';
import { MainPrimitive } from '@/app/primitives/Main.primitive';
import { ContainerPrimitive } from '@/app/primitives/Container.primitive';
import { SectionPrimitive } from '@/app/primitives/Section.primitive';

const getProviderNavConfig = (workspaceId: string): DomainNavConfig => ({
  domain: 'provider',
  logoSrc: '/logoblack.svg',
  label: `Provider [${workspaceId}]`,
  fastNavLinks: [],
  menuGroups: [
    {
      label: 'Main',
      items: [
        { href: '/', icon: PiHouseLine, label: 'return_to_website' }
      ]
    },
    {
      label: 'Cards',
      items: [
        { href: `/workspaces/provider/${workspaceId}/cards/create`, icon: PiPlusCircle, label: 'card_create' },
        { href: `/workspaces/provider/${workspaceId}/cards`, icon: PiListBullets, label: 'cards' }
      ]
    },
    {
      label: 'Account',
      items: [
        { href: `/workspaces/provider/${workspaceId}/accounts/me`, icon: PiUserCircle, label: 'account' },
        { href: `/workspaces/provider/${workspaceId}/favorites`, icon: PiHeart, label: 'liked_cards' },
        { href: `/workspaces/provider/${workspaceId}/conversations`, icon: PiEnvelopeSimple, label: 'conversations' },
        { href: `/workspaces/provider/${workspaceId}/invitations`, icon: PiPlusCircle, label: 'invitations' },
        { href: `/workspaces/provider/${workspaceId}/notifications`, icon: PiBell, label: 'notifications' }
      ]
    },
    {
      label: 'Store',
      items: [
        { href: `/workspaces/provider/${workspaceId}/stores`, icon: PiStorefront, label: 'stores' },
        { href: `/workspaces/provider/${workspaceId}/stores/applications/create`, icon: PiStorefrontDuotone, label: 'create_store' }
      ]
    },
    {
      label: 'Adds',
      items: [
        { href: `/workspaces/provider/${workspaceId}/adds`, icon: PiListBullets, label: 'adds' },
        { href: `/workspaces/provider/${workspaceId}/adds/create`, icon: PiPlusCircle, label: 'adds_create' }
      ]
    }
  ],
  menuDisplayMode: { desktop: 'sidebar', mobile: 'mobile-modal' }
});

export function ProviderClientLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const workspaceId = params?.workspaceId as string;

  const navConfig = useMemo(
    () => getProviderNavConfig(workspaceId),
    [workspaceId]
  );

  const navProps = {
    navConfig,
    isMenuOpen,
    setIsMenuOpen,
    workspaceId,
    currentPath: pathname
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <GlobalHeaderWidget {...navProps}>
        <GlobalFastNavigationWidget {...navProps} />
      </GlobalHeaderWidget>

      <MainPrimitive variant="app">
        <ContainerPrimitive variant="centered">
          <aside className="hidden lg:flex shrink-0 sticky top-[70px] min-h-[calc(100vh-70px)] overflow-hidden w-64 flex-col">
            <GlobalFullNavigationWidget {...navProps} />
          </aside>
          <SectionPrimitive>
            {children}
          </SectionPrimitive>
        </ContainerPrimitive>
      </MainPrimitive>

      {/* Mobile modal navigation (handled internally by the widget) */}
      <GlobalFullNavigationWidget {...navProps} />
    </div>
  );
}
