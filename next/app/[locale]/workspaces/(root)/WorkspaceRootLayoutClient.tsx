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
import { GlobalHeaderWidget } from '@/app/[locale]/(global)/(widgets)/GlobalHeader.widget';
import { GlobalFastNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFastNavigation.widget';
import { GlobalFullNavigationWidget } from '@/app/[locale]/(global)/(widgets)/GlobalFullNavigation.widget';
import type { DomainNavConfig } from '@tiktak/shared/types/ui/Navigation.types';
import { SectionPrimitive } from '@/app/primitives/Section.primitive';
import { MainPrimitive } from '@/app/primitives/Main.primitive';
import { ContainerPrimitive } from '@/app/primitives/Container.primitive';

interface WorkspaceRootLayoutClientProps {
    children: ReactNode;
}

export function WorkspaceRootLayoutClient({ children }: WorkspaceRootLayoutClientProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navConfig: DomainNavConfig = {
        domain: 'workspaces',
        logoSrc: '/logo.svg',
        label: 'tiktak.ai',
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
            mobile: 'mobile-modal'
        }
    };

    return (
        <>
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

            <MainPrimitive variant="app">
                <ContainerPrimitive variant="centered">
                    <aside className="hidden lg:flex shrink-0 sticky top-[70px] min-h-[calc(100vh-70px)] overflow-hidden w-64 flex-col">
                        <GlobalFullNavigationWidget
                            navConfig={navConfig}
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                        />
                    </aside>
                    <SectionPrimitive>
                        {children}
                    </SectionPrimitive>
                </ContainerPrimitive>
            </MainPrimitive>
        </>
    );
}
