
'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { DomainNavConfig, MenuGroup, NavItem } from '@tiktak/shared/types/ui/Navigation.types';
import { GlobalProfileWidget } from '@/app/[locale]/(global)/(widgets)/GlobalProfile.widget';
import { GlobalLangSwitcherTile } from '@/app/[locale]/(global)/(tiles)/GlobalLangSwitcher.tile';
import { GlobalThemeSwitcherTile } from '@/app/[locale]/(global)/(tiles)/GlobalThemeSwitcher.tile';
import { useGlobalAuthProfileContext } from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import { PiSignOutBold } from 'react-icons/pi';
import { FiArrowRight } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { Block } from '@/app/primitives/Block.primitive';
import { Section } from '@/app/primitives/Section.primitive';

interface GlobalFullNavigationWidgetProps {
    navConfig: DomainNavConfig;
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
    [key: string]: unknown; // allow extra spread props (workspaceId, currentPath, etc.)
}

interface MenuItemProps {
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    disabled?: boolean;
    onClick: () => void;
}

/**
 * Global Full Navigation Widget
 *
 * Desktop: renders inline (sidebar for auth, dropdown for public)
 * Mobile: renders via portal to body for proper fixed positioning
 *         (escapes parent containment like aside.hidden.lg:flex)
 */
export function GlobalFullNavigationWidget({
    navConfig,
    isMenuOpen,
    setIsMenuOpen
}: GlobalFullNavigationWidgetProps) {
    const t = useTranslations('GlobalFullNavigationWidget');
    const router = useRouter();
    const { clearProfile, userId } = useGlobalAuthProfileContext();
    const { menuGroups, domain } = navConfig;

    const isPublicDomain = domain === 'public';
    const isAuthenticated = !!userId;

    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => { setHasMounted(true); }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Close menu on route change
    useEffect(() => {
        const handleRouteChange = () => setIsMenuOpen(false);
        return () => {
            handleRouteChange();
        };
    }, [setIsMenuOpen]);

    // Prevent body scroll when menu is open (mobile only)
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            clearProfile();
            router.push('/');
        } catch (error) {
            ConsoleLogger.error('Logout failed:', error);
        }
    };

    const MenuItem: React.FC<MenuItemProps> = ({ href, icon: Icon, label, disabled, onClick }) => (
        <li className="text-left w-full">
            {disabled ? (
                <span
                    className="text-sm flex items-center gap-2.5 rounded-app px-3 py-2.5 text-app-dark-blue/30 dark:text-white/30 cursor-not-allowed"
                    aria-disabled="true"
                >
                    <Icon className="text-lg shrink-0 text-app-dark-blue/20 dark:text-white/20" />
                    {t(label)}
                </span>
            ) : (
                <Link
                    href={href}
                    className="text-sm flex items-center gap-2.5 rounded-app py-2.5 font-medium
            text-app-dark-blue dark:text-white/80
            hover:bg-black/5 dark:hover:bg-white/10
            hover:text-app-dark-blue dark:hover:text-white
            active:scale-[.98] transition-all duration-150"
                    onClick={onClick}
                >
                    <Icon className="text-lg shrink-0 text-app-bright-green" />
                    {t(label)}
                </Link>
            )}
        </li>
    );

    const renderMenuContent = () => (
        <>
            {/* Profile tile for authenticated domains */}
            <li className="text-left w-full">
                {isAuthenticated && (
                    <GlobalProfileWidget />
                )}
                <div className="flex flex-col gap-3">
                    <GlobalLangSwitcherTile />
                    <GlobalThemeSwitcherTile />
                </div>
            </li>

            {/* Menu groups */}
            {(menuGroups as MenuGroup[]).map((group: MenuGroup, index: number) => (
                <li
                    key={index}
                    className="text-left w-full my-8"
                >
                    {/* Group header */}
                    <div className="w-full text-xs flex items-center font-black uppercase tracking-widest
              text-app-dark-blue dark:text-app-bright-green
               pb-1">
                        {group.icon && <group.icon className="text-sm" />}
                        {t(group.label)}
                    </div>
                    <ul className=" space-y-0.5">
                        {group.items.map((item: NavItem, index: number) => (
                            <MenuItem
                                key={index}
                                {...item}
                                onClick={() => setIsMenuOpen(false)}
                            />
                        ))}
                    </ul>
                </li>
            ))}

            {/* Logout button for authenticated domains */}
            {domain !== 'public' && (
                <li className="text-left w-full">
                    <button
                        className="w-full inline-flex items-center justify-center gap-2 font-semibold
              text-app-dark-blue dark:text-white rounded-app-full
              bg-app-bright-green/90 hover:bg-app-bright-green
              dark:bg-app-bright-green/80 dark:hover:bg-app-bright-green
              px-4 py-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                        onClick={handleLogout}
                    >
                        <PiSignOutBold className="text-base" />
                        {t('logout')}
                        <FiArrowRight className="text-sm" />
                    </button>
                </li>
            )}
        </>
    );

    // ─── Mobile modal (portaled to body) ───
    const mobileModal = hasMounted && createPortal(
        <div
            className={`lg:hidden fixed inset-0 z-50 bg-white/80 dark:bg-app-dark-blue/80 backdrop-blur-xl ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-300 overflow-y-auto`}
        >
            {/* Close button */}
            <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 z-50 p-2 rounded-app-full bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200"
                aria-label="Close menu"
            >
                <IoClose className="text-2xl text-app-dark-blue dark:text-white" />
            </button>

            <div className="px-4 pt-20 pb-8">
                <Block>
                    <ul className="flex-col justify-center items-center space-y-3">
                        {renderMenuContent()}
                    </ul>
                </Block>
            </div>
        </div>,
        document.body
    );

    // ─── PUBLIC DOMAIN ───
    if (isPublicDomain) {
        return (
            <>
                {/* Desktop dropdown */}
                {isMenuOpen && (
                    <div className="hidden lg:block overflow-x-hidden overflow-y-scroll transform transition duration-500 ease-in-out top-[70px] right-0 left-0 text-app-dark-blue dark:text-white h-full bg-white/10 dark:bg-app-dark-blue/50 backdrop-blur-xl z-[11] fixed">
                        <div className="w-full h-12 bg-transparent"></div>
                        <Section variant="centered">
                            <Block>
                                <ul className="pt-6 pb-6 text-app-dark-blue dark:text-white max-w-7xl mx-auto  bg-transparent gap-8 flex flex-row">
                                    {renderMenuContent()}
                                </ul>
                            </Block>
                        </Section>
                    </div>
                )}

                {/* Mobile modal (portaled) */}
                {mobileModal}
            </>
        );
    }

    // ─── AUTHENTICATED DOMAINS ───
    return (
        <>
            {/* Desktop sidebar (renders inline in aside) */}
            <div
                className={`hidden lg:block ${isMenuOpen ? 'translate-x-0 opacity-100' : 'lg:translate-x-0 lg:opacity-100'
                    } transition-all duration-500`}
            >
                <Block>
                    <ul className="flex-col justify-center items-center space-y-4">
                        {renderMenuContent()}
                    </ul>
                </Block>
            </div>

            {/* Mobile modal (portaled to body — escapes aside containment) */}
            {mobileModal}
        </>
    );
}
