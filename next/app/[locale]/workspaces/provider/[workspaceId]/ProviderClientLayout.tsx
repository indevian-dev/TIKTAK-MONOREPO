'use client'

import { useState, useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { GlobalHeaderWidget } from '@/app/[locale]/(global)/(widgets)/GlobalHeaderWidget';
import { GlobalFullNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFullNavigationWidget';
import { GlobalFastNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFastNavigationWidget';
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
import type { DomainNavConfig } from '@tiktak/shared/types';

const getProviderNavConfig = (workspaceId: string): DomainNavConfig => ({
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
  menuDisplayMode: 'sidebar'
});

export function ProviderClientLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const workspaceId = params?.workspaceId as string;

  const navConfig = useMemo(() => {
    const config = getProviderNavConfig(workspaceId);
    return {
      ...config,
      branding: {
        logo: '/logo-b.svg',
        showLabel: true,
        label: `Provider [${workspaceId}]`
      }
    };
  }, [workspaceId]);

  const navProps = {
    navConfig,
    isMenuOpen,
    setIsMenuOpen,
    workspaceId,
    currentPath: pathname
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GlobalHeaderWidget {...navProps}>
        <GlobalFastNavigationWidget {...navProps} />
      </GlobalHeaderWidget>

      <div className="flex-1 max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:p-6 mb-16 lg:mb-0">
        <aside className="lg:w-64 flex-shrink-0">
          <GlobalFullNavigationWidget {...navProps} />
        </aside>

        <main className="flex-1 bg-white p-4 lg:p-0">
          {children}
        </main>
      </div>

      <GlobalFastNavigationWidget {...navProps} />

      {/* Mobile Modal Navigation */}
      <GlobalFullNavigationWidget
        {...navProps}
        navConfig={{ ...navConfig, menuDisplayMode: 'modal' }}
      />
    </div>
  );
}

