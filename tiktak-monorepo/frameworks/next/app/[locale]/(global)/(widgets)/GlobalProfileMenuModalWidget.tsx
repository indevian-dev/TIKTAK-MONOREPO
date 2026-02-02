'use client'

import {
    useEffect,
    useRef,
    useState,
    RefObject
} from 'react';
import {
    Link,
    useRouter
} from '@/i18n/routing';
import { loadClientSideCoLocatedTranslations }
    from '@/i18n/i18nClientSide';
import { useGlobalAuthProfileContext }
    from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import {
    PiHouseLine,
    PiPlusCircle,
    PiListBullets,
    PiUserCircle,
    PiEnvelopeSimple,
    PiStorefront,
    PiHeart,
    PiSignOutBold,
    PiBell,
    PiStorefrontDuotone,
    PiSignInLight,
    PiXLight
} from 'react-icons/pi';
import { GlobalProfileSwitcherWidget }
    from '@/app/[locale]/(global)/(widgets)/GlobalProfileSwitcherWidget';
import { IconType } from 'react-icons';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
interface GlobalProfileMenuModalWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: RefObject<HTMLButtonElement | null>;
}

export function GlobalProfileMenuModalWidget({ isOpen, onClose, anchorRef }: GlobalProfileMenuModalWidgetProps) {
    const { profile, loading, clearProfile } = useGlobalAuthProfileContext();
    const router = useRouter();
    const { t } = loadClientSideCoLocatedTranslations('GlobalProfileMenuModalWidget');
    const modalRef = useRef<HTMLDivElement>(null);
    const [modalPosition, setModalPosition] = useState<any>({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxWidth: '384px'
    });
    const [isMobile, setIsMobile] = useState(false);

    // Calculate modal position based on anchor element
    useEffect(() => {
        if (isOpen && anchorRef.current) {
            const calculatePosition = () => {
                const anchorRect = anchorRef.current!.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const modalWidth = 384; // max-w-md = 24rem = 384px
                const modalMaxHeight = viewportHeight * 0.9; // 90vh

                // Check if we're on mobile (screen width < 640px)
                const isMobileViewport = viewportWidth < 640;
                setIsMobile(isMobileViewport);

                let position = {};

                if (isMobileViewport) {
                    // Mobile: Position above the bottom navigation (which is at bottom: 0)
                    // Calculate bottom nav height based on the altHeader component
                    const bottomNavHeight = 84; // Height of the mobile bottom navigation
                    position = {
                        bottom: bottomNavHeight + 8, // 8px gap above bottom nav
                        left: 8, // 8px from left edge
                        right: 8, // 8px from right edge
                        width: 'auto',
                        maxHeight: viewportHeight - bottomNavHeight - 24, // Account for gaps
                        transform: 'none'
                    };
                } else {
                    // Desktop: Position below and to the right of avatar
                    const topPosition = anchorRect.bottom + 8; // 8px gap below avatar
                    let leftPosition = anchorRect.right - modalWidth; // Align right edge with avatar right

                    // Ensure modal doesn't go off the left edge
                    if (leftPosition < 16) {
                        leftPosition = 16;
                    }

                    // Ensure modal doesn't go off the right edge
                    if (leftPosition + modalWidth > viewportWidth - 16) {
                        leftPosition = viewportWidth - modalWidth - 16;
                    }

                    // Ensure modal doesn't go off the bottom
                    let maxHeight = modalMaxHeight;
                    if (topPosition + modalMaxHeight > viewportHeight - 16) {
                        maxHeight = viewportHeight - topPosition - 16;
                    }

                    position = {
                        top: topPosition,
                        left: leftPosition,
                        maxHeight: maxHeight,
                        width: modalWidth,
                        transform: 'none'
                    };
                }

                setModalPosition(position);
            };

            calculatePosition();
            window.addEventListener('resize', calculatePosition);
            window.addEventListener('scroll', calculatePosition);

            return () => {
                window.removeEventListener('resize', calculatePosition);
                window.removeEventListener('scroll', calculatePosition);
            };
        }
    }, [isOpen, anchorRef]);

    // Close modal on escape key or outside click
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
            // Don't prevent scrolling on mobile as modal is positioned relative to viewport
            if (window.innerWidth >= 640) {
                document.body.style.overflow = 'hidden';
            }
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            clearProfile();
            onClose();
            router.push('/');
        } catch (error) {
            ConsoleLogger.error('Logout failed:', error);
        }
    };

    const handleLinkClick = () => {
        onClose();
    };

    // Provider menu groups for logged-in users
    const providerMenuGroups = {
        main: {
            label: 'Main',
            items: [
                { href: '/', icon: PiHouseLine, label: t('return_to_website') }
            ]
        },
        cards: {
            label: 'Cards',
            items: [
                { href: '/provider/cards/create', icon: PiPlusCircle, label: t('card_create') },
                { href: '/provider/cards', icon: PiListBullets, label: t('cards') }
            ]
        },
        account: {
            label: 'Account',
            items: [
                { href: '/provider/accounts/me', icon: PiUserCircle, label: t('account') },
                { href: '/provider/liked-cards', icon: PiHeart, label: t('liked_cards'), disabled: true },
                { href: '/provider/conversations', icon: PiEnvelopeSimple, label: t('conversations'), disabled: true },
                { href: '/provider/invitations', icon: PiPlusCircle, label: t('invitations') },
                { href: '/provider/notifications', icon: PiBell, label: t('notifications') }
            ]
        },
        store: {
            label: 'Store',
            items: [
                { href: '/provider/stores', icon: PiStorefront, label: t('stores') },
                { href: '/provider/stores/applications/create', icon: PiStorefrontDuotone, label: t('create_store') }
            ]
        }
    };

    // Header menu items for both logged-in and non-logged-in users
    const headerMenuItems = [
        { id: 1, title: t('blog'), slug: 'blogs' },
        { id: 2, title: t('pricing'), slug: 'docs/pricing' },
        { id: 3, title: t('about'), slug: 'docs/about' },
    ];

    const authMenuItems = profile ? [] : [
        { id: 4, title: t('register'), slug: 'auth/register' },
        { id: 5, title: t('login'), slug: 'auth/login' },
        { id: 6, title: t('register_as_store'), slug: 'register-store' },
    ];

    const supportMenuItems = [
        { id: 7, title: t('terms_of_use'), slug: 'docs/terms' },
        { id: 8, title: t('privacy_policy'), slug: 'docs/policy' },
        { id: 9, title: t('refund_policy'), slug: 'docs/refund' },
        { id: 10, title: t('open_support_ticket'), slug: 'docs/contact' },
    ];

    interface MenuItemProps {
        href: string;
        icon: IconType;
        label: string;
        disabled?: boolean;
    }

    const MenuItem = ({ href, icon: Icon, label, disabled }: MenuItemProps) => (
        <li className="text-left w-full py-2">
            {disabled ? (
                <span
                    className="text-lg flex items-center text-gray-400 rounded-md cursor-not-allowed opacity-60"
                    aria-disabled="true"
                >
                    <Icon className="mr-2 text-gray-400 text-xl" />
                    {label}
                </span>
            ) : (
                <Link
                    href={href}
                    className="text-lg flex items-center text-dark rounded-md hover:text-brandPrimary"
                    onClick={handleLinkClick}
                >
                    <Icon className="mr-2 text-dark text-xl" />
                    {label}
                </Link>
            )}
        </li>
    );

    interface HeaderMenuItemProps {
        title: string;
        slug: string;
        id?: number;
    }

    const HeaderMenuItem = ({ title, slug }: HeaderMenuItemProps) => (
        <div className='w-full py-2'>
            <Link
                href={`/${slug}`}
                className='text-lg font-bold cursor-pointer p-2 text-dark hover:text-brandPrimary block'
                onClick={handleLinkClick}
            >
                {title}
            </Link>
        </div>
    );

    const modalStyle = {
        position: 'fixed' as const,
        ...modalPosition,
        zIndex: 50
    };

    return (
        <>
            {/* Backdrop - only show on desktop */}
            {!isMobile && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-[1000]" onClick={onClose}></div>
            )}

            <div
                ref={modalRef}
                style={modalStyle}
                className={`bg-white rounded-lg shadow-xl overflow-y-auto border border-gray-200 transition-all duration-200 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-dark">
                        {profile ? t('menu') : t('welcome')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <PiXLight className="text-xl text-dark" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : profile ? (
                        // Logged-in user content
                        <div>
                            {/* Profile Switcher */}
                            <div className="mb-6">
                                <GlobalProfileSwitcherWidget />
                            </div>

                            {/* Provider Menu Groups */}
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-dark/60 mb-3 uppercase tracking-wide">
                                    {t('provider')}
                                </h3>
                                {Object.entries(providerMenuGroups).map(([key, group]) => (
                                    <div key={key} className="mb-4 bg-brandPrimaryLightBg rounded-md p-3">
                                        <button className="w-full text-xs flex items-center font-black text-dark/40 mb-2">
                                            {group.label}
                                        </button>
                                        <ul>
                                            {group.items.map((item, index) => (
                                                <MenuItem key={index} {...item} />
                                            ))}
                                        </ul>
                                    </div>
                                ))}

                                {/* Logout Button */}
                                <div className="mb-4 rounded-md">
                                    <button
                                        className="w-full text-lg flex items-center font-bold text-white rounded-md p-2 hover:bg-red-600 transition-colors bg-brandPrimary"
                                        onClick={handleLogout}
                                    >
                                        <PiSignOutBold className='mr-2 text-white text-xl' />
                                        {t('logout')}
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px w-full bg-gray-200 my-4"></div>
                        </div>
                    ) : (
                        // Non-logged-in user content - Login CTA
                        <div className="text-center mb-6">
                            <div className="bg-brandPrimary rounded-lg p-6 mb-4">
                                <PiSignInLight className="text-white text-4xl mx-auto mb-3" />
                                <h3 className="text-white text-lg font-bold mb-2">
                                    {t('sign_in_to_your_account')}
                                </h3>
                                <p className="text-white/80 text-sm mb-4">
                                    {t('access_your_provider_and_manage_your_cards')}
                                </p>
                                <Link
                                    href="/auth/login"
                                    className="inline-block bg-white text-brandPrimary font-bold py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
                                    onClick={handleLinkClick}
                                >
                                    {t('login')}
                                </Link>
                            </div>

                            <div className="text-center">
                                <span className="text-gray-600 text-sm">{t('dont_have_an_account')}? </span>
                                <Link
                                    href="/auth/register"
                                    className="text-brandPrimary font-bold text-sm hover:underline"
                                    onClick={handleLinkClick}
                                >
                                    {t('register')}
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Header Menu Content - For all users */}
                    <div>
                        <h3 className="text-sm font-bold text-dark/60 mb-3 uppercase tracking-wide">
                            {t('explore')}
                        </h3>

                        {/* Main header menu items */}
                        <div className="mb-4">
                            {headerMenuItems.map((item) => (
                                <HeaderMenuItem key={item.id} {...item} />
                            ))}
                        </div>

                        {/* Auth menu items (only for non-logged-in users) */}
                        {authMenuItems.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-xs font-bold text-dark/40 mb-2 uppercase tracking-wide">
                                    {t('account')}
                                </h4>
                                {authMenuItems.map((item) => (
                                    <HeaderMenuItem key={item.id} {...item} />
                                ))}
                            </div>
                        )}

                        {/* Support menu items */}
                        <div className="mb-4">
                            <h4 className="text-xs font-bold text-dark/40 mb-2 uppercase tracking-wide">
                                {t('support_and_help')}
                            </h4>
                            {supportMenuItems.map((item) => (
                                <HeaderMenuItem key={item.id} {...item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
