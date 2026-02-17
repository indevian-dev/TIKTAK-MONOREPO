'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GlobalNavigationProps } from '@tiktak/shared/types';
import { PiListBold, PiXBold } from 'react-icons/pi';

export function GlobalHeaderWidget({
    navConfig,
    isMenuOpen,
    setIsMenuOpen,
    workspaceId
}: GlobalNavigationProps) {
    const branding = navConfig.branding || {
        logo: '/logo-b.svg',
        showLabel: true,
        label: workspaceId ? `Workspace: ${workspaceId}` : 'TikTak'
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
                    >
                        {isMenuOpen ? <PiXBold size={24} /> : <PiListBold size={24} />}
                    </button>

                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative h-8 w-32">
                            <Image
                                src={branding.logo || '/logo-b.svg'}
                                alt="TikTak Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        {branding.showLabel && (
                            <span className="hidden sm:inline-block text-sm font-bold text-gray-900 border-l border-gray-200 pl-3">
                                {branding.label}
                            </span>
                        )}
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {/* Slot for profile switcher or notifications if needed */}
                    <div id="header-actions" className="flex items-center gap-2">
                        {/* Dynamic content can be injected here via portal or similar if needed, 
                 but for ahora we keep it simple */}
                    </div>
                </div>
            </div>
        </header>
    );
}
