'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import type { GlobalNavigationProps, NavLink } from '@tiktak/shared/types';
import { PiListBold, PiHouseBold, PiMagnifyingGlassBold, PiPlusCircleBold, PiUserCircleBold } from 'react-icons/pi';
import { GlobalNotificationBadgeTile } from '@/app/[locale]/(global)/(tiles)/GlobalNotificationBadgeTile';

export function GlobalFastNavigationWidget({
    navConfig,
    isMenuOpen,
    setIsMenuOpen,
    workspaceId
}: GlobalNavigationProps) {
    const pathname = usePathname();

    const bottomNavItems: NavLink[] = navConfig.fastNavLinks?.length ? navConfig.fastNavLinks : [
        { href: '/', icon: PiHouseBold, label: 'Home' },
        { href: '/cards', icon: PiMagnifyingGlassBold, label: 'Cards' },
        { href: '/create', icon: PiPlusCircleBold, label: 'Create' },
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

                {/* Mobile Notifications Badge */}
                <div className="flex flex-col items-center justify-center w-full h-full relative">
                    <GlobalNotificationBadgeTile dropdownPosition="up" className="!static" />
                    <span className="text-[10px] font-bold uppercase tracking-tight text-gray-400 mt-1">Inbox</span>
                </div>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${isMenuOpen ? 'text-brandPrimary' : 'text-gray-400'
                        }`}
                >
                    <PiListBold size={22} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Menu</span>
                </button>
            </nav>

            {/* Desktop Quick Actions */}
            <div className="hidden lg:flex items-center gap-4">
                <GlobalNotificationBadgeTile dropdownPosition="down" />

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
