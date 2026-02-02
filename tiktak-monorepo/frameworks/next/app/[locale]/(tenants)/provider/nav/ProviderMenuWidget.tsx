"use client";

import {
    Link,
    useRouter
}
    from '@/i18n/routing';
import { loadClientSideCoLocatedTranslations }
    from '@/i18n/i18nClientSide';
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
    PiStorefrontDuotone
} from 'react-icons/pi';
import { IconType } from 'react-icons';
import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
import { GlobalProfileSwitcherWidget }
    from '@/app/[locale]/(global)/(widgets)/GlobalProfileSwitcherWidget';
import { useGlobalAuthProfileContext }
    from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';

interface ProviderMenuWidgetProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
}

interface MenuItemProps {
    href: string;
    icon: IconType;
    label: string;
    disabled?: boolean;
}

export function ProviderMenuWidget({ isMenuOpen, setIsMenuOpen }: ProviderMenuWidgetProps) {
    const router = useRouter();
    const { t, loading } = loadClientSideCoLocatedTranslations('DashboardMenu');
    const { clearProfile } = useGlobalAuthProfileContext();

    const menuGroups = {
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
                { href: '/provider/favorites', icon: PiHeart, label: t('liked_cards') },
                { href: '/provider/conversations', icon: PiEnvelopeSimple, label: t('conversations') },
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
        },
        adds: {
            label: 'Adds',
            items: [
                { href: '/provider/adds', icon: PiListBullets, label: t('adds'), disabled: true },
                { href: '/provider/adds/create', icon: PiPlusCircle, label: t('adds_create'), disabled: true }
            ]
        }
    };

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
                <Link href={href} className="text-lg flex items-center text-dark rounded-md hover:text-brandPrimary">
                    <Icon className="mr-2 text-dark text-xl" />
                    {label}
                </Link>
            )}
        </li>
    );

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            clearProfile(); // Clear profile data on logout
            router.push('/');
        } catch (error) {
            ConsoleLogger.error('Logout failed:', error);
        }
    };

    return (
        <div className={`absolute md:static p-4 md:p-0 bg-white md:bg-transparent top-0 left-0 right-0 w-full ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-1/2 md:translate-x-0 opacity-0 md:opacity-100'} transition-all duration-500`}>
            <ul className="flex-col justify-center items-center">
                {/* Profile Switcher */}
                <GlobalProfileSwitcherWidget />

                {Object.entries(menuGroups).map(([key, group]) => (
                    <li key={key} className="text-left w-full mb-4 bg-brandPrimaryLightBg rounded-md p-4">
                        <button className="w-full text-xs flex items-center font-black text-dark/40">
                            {group.label}
                        </button>
                        <ul className='py-2'>
                            {group.items.map((item, index) => (
                                <MenuItem key={index} {...item} />
                            ))}
                        </ul>
                    </li>
                ))}
                <li className="text-left w-full mb-4 bg-brandPrimaryLightBg rounded-md p-4">
                    <button className="w-full text-lg flex items-center font-black text-dark/40 bg-danger text-white rounded-md p-2" onClick={handleLogout}>
                        <PiSignOutBold className='mr-2 text-white text-xl' />{t('logout')}
                    </button>
                </li>
            </ul>
        </div>
    );
}
