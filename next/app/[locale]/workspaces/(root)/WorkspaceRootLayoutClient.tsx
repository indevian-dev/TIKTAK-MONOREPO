'use client';

import React, { useState, ReactNode } from 'react';
import {
    PiHouseLine,
    PiStackLight,
    PiMagnifyingGlassLight,
    PiCrownBold
} from 'react-icons/pi';
import { LuUser } from 'react-icons/lu';

// Layout Components
import { GlobalHeaderWidget } from '@/app/[locale]/(global)/(widgets)/GlobalHeaderWidget';
import { GlobalFastNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFastNavigationWidget';
import { GlobalFullNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFullNavigationWidget';
import type { DomainNavConfig } from '@tiktak/shared/types';

interface WorkspaceRootLayoutClientProps {
    children: ReactNode;
}

export function WorkspaceRootLayoutClient({ children }: WorkspaceRootLayoutClientProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navConfig: DomainNavConfig = {
        domain: 'workspaces',
        logoSrc: '/logo.svg',
        label: 'stuwin.ai',
        subtitle: 'Workspace Selection',
        fastNavLinks: [],
        menuGroups: [
            {
                label: 'main',
                items: [
                    { href: '/', icon: PiHouseLine, label: 'return_home' },
                    { href: '/workspaces', icon: PiStackLight, label: 'my_workspaces' },
                    { href: '/workspaces/billing', icon: PiCrownBold, label: 'billing' },
                    { href: '/workspaces/profile', icon: LuUser, label: 'profile' }
                ]
            },
            {
                label: 'discover',
                items: [
                    { href: '/workspaces/discover', icon: PiMagnifyingGlassLight, label: 'find_organizations' }
                ]
            }
        ],
        menuDisplayMode: {
            desktop: 'sidebar',
            mobile: 'modal'
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <GlobalHeaderWidget
                navConfig={navConfig}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
            >
                <GlobalFastNavigationWidget
                    navConfig={navConfig}
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                />
            </GlobalHeaderWidget>

            <div className="flex-1 max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:p-6 mb-16 lg:mb-0">
                <aside className="lg:w-64 flex-shrink-0">
                    <GlobalFullNavigationWidget
                        navConfig={navConfig}
                        isMenuOpen={isMenuOpen}
                        setIsMenuOpen={setIsMenuOpen}
                    />
                </aside>

                <main className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-4 lg:p-8 overflow-hidden">
                    {children}
                </main>
            </div>

            <GlobalFastNavigationWidget
                navConfig={navConfig}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
            />

            {/* Mobile Modal Navigation */}
            <GlobalFullNavigationWidget
                navConfig={navConfig}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                currentPath="/workspaces"
            />
        </div>
    );
}
