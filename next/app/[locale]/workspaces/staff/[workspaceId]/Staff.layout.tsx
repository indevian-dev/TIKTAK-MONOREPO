'use client'

import { useState, useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { GlobalHeaderWidget } from '@/app/[locale]/(global)/(widgets)/GlobalHeader.widget';
import { GlobalFullNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFullNavigation.widget';
import { GlobalFastNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFastNavigation.widget';

import {
  PiTagSimple,
  PiNotebook,
  PiUsers,
  PiPackage,
  PiFile,
  PiArticle,
  PiAcorn,
  PiStorefront,
  PiEnvelope,
  PiUsersFill,
  PiGrainsFill,
  PiStorefrontFill,
  PiHouse
} from 'react-icons/pi';
import type { DomainNavConfig } from '@tiktak/shared/types/ui/Navigation.types';
import { Main } from '@/app/primitives/Main.primitive';
import { Container } from '@/app/primitives/Container.primitive';
import { Section } from '@/app/primitives/Section.primitive';

const getStaffNavConfig = (workspaceId: string): DomainNavConfig => ({
  domain: 'staff',
  logoSrc: '/logowhite.svg',
  label: `Staff [${workspaceId}]`,
  fastNavLinks: [],
  menuGroups: [
    {
      label: 'Platform',
      items: [
        { href: `/workspaces/staff/${workspaceId}`, icon: PiHouse, label: 'Provider' },
        { href: `/workspaces/staff/${workspaceId}/adds`, icon: PiNotebook, label: 'Adds' },
        { href: `/workspaces/staff/${workspaceId}/blogs`, icon: PiArticle, label: 'Blogs' },
      ]
    },
    {
      label: 'Management',
      items: [
        { href: `/workspaces/staff/${workspaceId}/leads`, icon: PiUsers, label: 'Leads' },
        { href: `/workspaces/staff/${workspaceId}/support`, icon: PiUsers, label: 'Support' },
      ]
    },
    {
      label: 'Catalog',
      items: [
        { href: `/workspaces/staff/${workspaceId}/categories`, icon: PiTagSimple, label: 'Categories' },
        { href: `/workspaces/staff/${workspaceId}/cards`, icon: PiPackage, label: 'Cards' },
        { href: `/workspaces/staff/${workspaceId}/open-search`, icon: PiAcorn, label: 'Search Service' },
        { href: `/workspaces/staff/${workspaceId}/mail`, icon: PiEnvelope, label: 'Mail Service' },
      ]
    },
    {
      label: 'Access Management',
      items: [
        { href: `/workspaces/staff/${workspaceId}/stores`, icon: PiStorefront, label: 'Stores' },
        { href: `/workspaces/staff/${workspaceId}/stores/applications`, icon: PiStorefrontFill, label: 'Store Applications' },
      ]
    },
    {
      label: 'Users',
      items: [
        { href: `/workspaces/staff/${workspaceId}/roles`, icon: PiGrainsFill, label: 'Roles' },
        { href: `/workspaces/staff/${workspaceId}/users`, icon: PiUsersFill, label: 'Users' },
      ]
    },
    {
      label: 'Pages',
      items: [
        { href: `/workspaces/staff/${workspaceId}/pages/faq`, icon: PiFile, label: 'Faq' },
        { href: `/workspaces/staff/${workspaceId}/pages/terms`, icon: PiFile, label: 'Terms' },
        { href: `/workspaces/staff/${workspaceId}/pages/privacy`, icon: PiFile, label: 'Privacy' },
        { href: `/workspaces/staff/${workspaceId}/pages/about`, icon: PiFile, label: 'About' },
        { href: `/workspaces/staff/${workspaceId}/pages/rules`, icon: PiFile, label: 'Rules' },
      ]
    }
  ],
  menuDisplayMode: { desktop: 'sidebar', mobile: 'mobile-modal' }
});

export function StaffClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const workspaceId = params?.workspaceId as string;

  const navConfig = useMemo(
    () => getStaffNavConfig(workspaceId),
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <GlobalHeaderWidget {...navProps}>
        <GlobalFastNavigationWidget {...navProps} />
      </GlobalHeaderWidget>

      <Main variant="app">
        <Container variant="centered">
          <aside className="hidden lg:flex shrink-0 sticky top-[70px] min-h-[calc(100vh-70px)] overflow-hidden w-64 flex-col">
            <GlobalFullNavigationWidget {...navProps} />
          </aside>
          <Section>
            {children}
          </Section>
        </Container>
      </Main>

      {/* Mobile modal navigation (handled internally by the widget) */}
      <GlobalFullNavigationWidget {...navProps} />
    </div>
  );
}
