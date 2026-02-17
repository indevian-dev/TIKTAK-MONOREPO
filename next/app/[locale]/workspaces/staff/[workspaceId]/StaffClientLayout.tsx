'use client'

import { useState, useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { GlobalHeaderWidget } from '@/app/[locale]/(global)/(widgets)/GlobalHeaderWidget';
import { GlobalFullNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFullNavigationWidget';
import { GlobalFastNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFastNavigationWidget';
import type { AuthData } from '@/types';
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
import type { DomainNavConfig } from '@tiktak/shared/types';

const getStaffNavConfig = (workspaceId: string): DomainNavConfig => ({
  menuGroups: [
    {
      label: 'Platform',
      items: [
        { href: `/workspaces/staff/${workspaceId}`, icon: PiHouse, label: 'Provider', permission: 'CONSOLE_ACCESS' },
        { href: `/workspaces/staff/${workspaceId}/adds`, icon: PiNotebook, label: 'Adds', permission: 'CONSOLE_ADDS_READ' },
        { href: `/workspaces/staff/${workspaceId}/blogs`, icon: PiArticle, label: 'Blogs', permission: 'CONSOLE_BLOGS_READ' },
      ]
    },
    {
      label: 'Management',
      items: [
        { href: `/workspaces/staff/${workspaceId}/leads`, icon: PiUsers, label: 'Leads', permission: 'CONSOLE_LEADS_READ' },
        { href: `/workspaces/staff/${workspaceId}/support`, icon: PiUsers, label: 'Support', permission: 'CONSOLE_SUPPORT_READ' },
      ]
    },
    {
      label: 'Catalog',
      items: [
        { href: `/workspaces/staff/${workspaceId}/categories`, icon: PiTagSimple, label: 'Categories', permission: 'CONSOLE_CATEGORY_READ' },
        { href: `/workspaces/staff/${workspaceId}/cards`, icon: PiPackage, label: 'Cards', permission: 'CONSOLE_CARD_READ' },
        { href: `/workspaces/staff/${workspaceId}/open-search`, icon: PiAcorn, label: 'Search Service', permission: 'CONSOLE_OPENSEARCH_READ' },
        { href: `/workspaces/staff/${workspaceId}/mail`, icon: PiEnvelope, label: 'Mail Service', permission: 'CONSOLE_MAIL_READ' },
      ]
    },
    {
      label: 'Access Management',
      items: [
        { href: `/workspaces/staff/${workspaceId}/stores`, icon: PiStorefront, label: 'Stores', permission: 'CONSOLE_STORE_READ' },
        { href: `/workspaces/staff/${workspaceId}/stores/applications`, icon: PiStorefrontFill, label: 'Store Applications', permission: 'CONSOLE_STORE_APPLICATION_READ' },
      ]
    },
    {
      label: 'Users',
      items: [
        { href: `/workspaces/staff/${workspaceId}/roles`, icon: PiGrainsFill, label: 'Roles', permission: 'CONSOLE_ROLE_READ' },
        { href: `/workspaces/staff/${workspaceId}/users`, icon: PiUsersFill, label: 'Users', permission: 'CONSOLE_USER_READ' },
      ]
    },
    {
      label: 'Pages',
      items: [
        { href: `/workspaces/staff/${workspaceId}/pages/faq`, icon: PiFile, label: 'Faq', permission: 'CONSOLE_DOCS_UPDATE' },
        { href: `/workspaces/staff/${workspaceId}/pages/terms`, icon: PiFile, label: 'Terms', permission: 'CONSOLE_DOCS_UPDATE' },
        { href: `/workspaces/staff/${workspaceId}/pages/privacy`, icon: PiFile, label: 'Privacy', permission: 'CONSOLE_DOCS_UPDATE' },
        { href: `/workspaces/staff/${workspaceId}/pages/about`, icon: PiFile, label: 'About', permission: 'CONSOLE_DOCS_UPDATE' },
        { href: `/workspaces/staff/${workspaceId}/pages/rules`, icon: PiFile, label: 'Rules', permission: 'CONSOLE_DOCS_UPDATE' },
      ]
    }
  ],
  menuDisplayMode: 'sidebar'
});

export function StaffClientLayout({
  children,
  authData
}: {
  children: React.ReactNode;
  authData?: AuthData | null;
}) {
  const params = useParams();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const workspaceId = params?.workspaceId as string;

  const navConfig = useMemo(() => {
    const config = getStaffNavConfig(workspaceId);
    return {
      ...config,
      branding: {
        logo: '/logo-w.svg',
        showLabel: true,
        label: `Staff [${workspaceId}]`
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalHeaderWidget {...navProps}>
        <GlobalFastNavigationWidget {...navProps} />
      </GlobalHeaderWidget>

      <div className="flex-1 max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:p-6 mb-16 lg:mb-0">
        <aside className="lg:w-64 flex-shrink-0">
          <GlobalFullNavigationWidget {...navProps} />
        </aside>

        <main className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-4 lg:p-8 overflow-hidden">
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
