'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import type { DomainNavConfig } from '@tiktak/shared/types/ui/Navigation.types';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Container } from '@/app/primitives/Container.primitive';
import { GlobalLogoTile } from '../(tiles)/GlobalLogo.tile';

interface GlobalHeaderWidgetProps {
    navConfig: DomainNavConfig;
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    workspaceId?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export function GlobalHeaderWidget({
    navConfig,
    isMenuOpen,
    setIsMenuOpen,
    workspaceId,
    children
}: GlobalHeaderWidgetProps) {
    return (
        <header className="sticky top-0 z-40 w-full bg-white dark:bg-app-dark-purple border-b border-gray-100 dark:border-white/10 transition-colors duration-300">
            <Container variant="nav">
                <GlobalLogoTile width={130} height={60} className="translate-y-1" href="/" />
                {/* Right-side actions (FastNav injected as children) */}
                {children && (
                    <div className="flex items-center gap-3">
                        {children}
                    </div>
                )}
            </Container>
        </header>
    );
}
