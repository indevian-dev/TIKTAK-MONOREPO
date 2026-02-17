'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { GlobalNavigationProps, NavLink } from '@tiktak/shared/types';
import { PiListBold, PiHouseBold, PiMagnifyingGlassBold, PiPlusCircleBold, PiUserCircleBold } from 'react-icons/pi';

export function GlobalFastNavigationWidget({
    navConfig,
    isMenuOpen,
    setIsMenuOpen,
    workspaceId
}: GlobalNavigationProps) {
    const pathname = usePathname();

    // On Mobile, we show the fixed bottom bar
    // On Desktop, this can be empty or show quick actions in header

    const bottomNavItems: NavLink[] = navConfig.fastNavLinks || [
        { href: '/', icon: PiHouseBold, label: 'Home' },
        { href: '/search', icon: PiMagnifyingGlassBold, label: 'Search' },
        { href: '/create', icon: PiPlusCircleBold, label: 'Create' },
        { href: '/profile', icon: PiUserCircleBold, label: 'Profile' },
    ];

    return (
        <>
            {/* Mobile Bottom Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-lg border-t border-gray-100 flex items-center justify-around px-2 lg:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
                {bottomNavItems.map((item, idx) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${isActive ? 'text-brandPrimary' : 'text-gray-400'
                                }`}
                        >
                            <Icon size={22} className={isActive ? 'animate-pulse' : ''} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                        </Link>
                    );
                })}

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${isMenuOpen ? 'text-brandPrimary' : 'text-gray-400'
                        }`}
                >
                    <PiListBold size={22} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Menu</span>
                </button>
            </nav>

            {/* Desktop Quick Actions (Optional, could be in header) */}
            <div className="hidden lg:flex items-center gap-2">
                {navConfig.fastNavLinks?.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className="p-2 text-gray-500 hover:text-brandPrimary hover:bg-brandPrimaryLightBg rounded-xl transition-all"
                            title={item.label}
                        >
                            <Icon size={20} />
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
