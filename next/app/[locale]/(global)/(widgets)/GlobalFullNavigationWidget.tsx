'use client';

import React from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import type { GlobalNavigationProps, NavGroup, NavLink } from '@tiktak/shared/types';
import { PiSignOutBold, PiCaretDownBold, PiCaretRightBold } from 'react-icons/pi';
import { useState } from 'react';

export function GlobalFullNavigationWidget({
    navConfig,
    isMenuOpen,
    setIsMenuOpen,
    workspaceId,
    currentPath,
}: GlobalNavigationProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            setIsMenuOpen(false);
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const NavItem = ({ item }: { item: NavLink }) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
            <li className="mb-1">
                <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                            ? 'bg-brandPrimary text-white shadow-lg shadow-brandPrimary/20'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-brandPrimary'
                        }`}
                >
                    <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-brandPrimary'}`} />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                        <span className={`ml-auto inline-block py-0.5 px-2 text-xs font-semibold rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {item.badge}
                        </span>
                    )}
                </Link>
            </li>
        );
    };

    const Group = ({ group }: { group: NavGroup }) => {
        const [isOpen, setIsOpen] = useState(group.defaultOpen ?? true);

        return (
            <div className="mb-6">
                {group.label && (
                    <button
                        onClick={() => group.collapsible && setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between px-4 py-2 text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2 truncate"
                    >
                        <span>{group.label}</span>
                        {group.collapsible && (
                            isOpen ? <PiCaretDownBold /> : <PiCaretRightBold />
                        )}
                    </button>
                )}
                {isOpen && (
                    <ul className="space-y-1">
                        {group.items.map((item, idx) => (
                            <NavItem key={idx} item={item} />
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    const menuGroups = Array.isArray(navConfig.menuGroups)
        ? navConfig.menuGroups
        : Object.values(navConfig.menuGroups);

    const content = (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 scrollbar-hide overflow-y-auto">
            <div className="flex-1 py-6 px-3">
                {menuGroups.map((group, idx) => (
                    <Group key={idx} group={group} />
                ))}
            </div>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200"
                >
                    <PiSignOutBold className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );

    const displayMode = navConfig.menuDisplayMode;
    const isMobileModal = typeof displayMode === 'object'
        ? displayMode.mobile === 'modal' || (displayMode.mobile as any) === 'mobile-modal'
        : displayMode === 'modal';

    // Mobile navigation overlay
    if (isMobileModal) {
        return (
            <div
                className={`fixed inset-0 z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ease-in-out lg:hidden`}
            >
                <div className="relative flex flex-col w-full max-w-xs h-full">
                    {content}
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-4 -right-12 p-2 text-white bg-black/20 rounded-full hover:bg-black/40 lg:hidden"
                    >
                        <span className="sr-only">Close sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div
                    className="fixed inset-0 bg-black/50 -z-10"
                    onClick={() => setIsMenuOpen(false)}
                />
            </div>
        );
    }

    // Sidebar navigation
    return (
        <div className={`hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16`}>
            {content}
        </div>
    );
}
