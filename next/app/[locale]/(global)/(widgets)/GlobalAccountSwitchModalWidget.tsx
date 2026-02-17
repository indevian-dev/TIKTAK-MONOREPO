"use client";

import {
    useEffect,
    useState,
    useRef
} from 'react';
import { createPortal }
    from 'react-dom';
import { useGlobalAuthProfileContext }
    from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import { apiCallForSpaHelper } from '@/lib/helpers/apiCallForSpaHelper';
import { loadClientSideCoLocatedTranslations }
    from '@/i18n/i18nClientSide';
import {
    PiX,
    PiUserCircle,
    PiStorefront,
    PiCheck,
    PiSpinner
} from 'react-icons/pi';
import type { GlobalAuthUserApiResponse } from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';

interface Account {
    id: number;
    is_personal: boolean;
    stores?: Array<{
        title?: string;
        logo?: string;
    }>;
    role?: string;
    [key: string]: any;
}

import type { User } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
// API response type for global account switch user data
interface GlobalAccountSwitchUserApiResponse {
    id: string;
    email: string;
    name?: string;
    last_name?: string; // API includes separate last name
    avatar_base64?: string; // API includes base64 encoded avatar
    [key: string]: any; // Allow additional fields
}

interface GlobalAccountSwitchModalWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GlobalAccountSwitchModalWidget({ isOpen, onClose }: GlobalAccountSwitchModalWidgetProps) {
    const {
        currentAccount,
        user,
        switchAccount,
        loading,
        getInitials,
        forceRefresh
    } = useGlobalAuthProfileContext();

    const { t } = loadClientSideCoLocatedTranslations('GlobalAccountSwitchModalWidget');
    const [localAccounts, setLocalAccounts] = useState<Account[]>([]);
    const [localUser, setLocalUser] = useState<GlobalAuthUserApiResponse | null>(user);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const hasFetchedRef = useRef(false);

    // Fetch accounts directly for the modal
    const fetchAccountsForModal = async () => {
        if (isRefreshing) return;

        setIsRefreshing(true);
        try {
            const response = await apiCallForSpaHelper({
                method: 'GET',
                url: '/api/auth/accounts'
            });

            if (response.data) {
                const { accounts: fetchedAccounts, user: userData } = response.data;
                setLocalAccounts(fetchedAccounts || []);
                setLocalUser(userData || user);
                return { success: true };
            }
        } catch (error: any) {
            ConsoleLogger.error('Error fetching accounts:', error);
            return { success: false, error: error.message };
        } finally {
            setIsRefreshing(false);
        }
    };

    // Fetch accounts only once when modal opens
    useEffect(() => {
        if (isOpen && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchAccountsForModal();
        }

        if (!isOpen) {
            hasFetchedRef.current = false;
        }
    }, [isOpen]);

    const handleManualRefresh = async () => {
        hasFetchedRef.current = false;
        await fetchAccountsForModal();
        hasFetchedRef.current = true;
    };

    if (!isOpen) return null;
    if (typeof window === 'undefined') return null;

    const handleAccountSwitch = async (accountId: number) => {
        if (accountId === currentAccount?.id) {
            onClose();
            return;
        }

        try {
            await switchAccount(accountId);
            onClose();
            setTimeout(() => {
                forceRefresh();
            }, 500);
        } catch (error) {
            ConsoleLogger.error("Switch account failed", error);
        }
    };

    const AccountItem = ({ account }: { account: Account }) => {
        const isPersonal = account.is_personal;
        const store = account.stores?.[0];
        const name = isPersonal
            ? `${localUser?.name || ''} ${localUser?.last_name || ''}`.trim() || localUser?.email
            : store?.title || t('store');
        const avatar = isPersonal ? localUser?.avatar_base64 : store?.logo;
        const isCurrent = account.id === currentAccount?.id;

        return (
            <button
                onClick={() => handleAccountSwitch(account.id)}
                disabled={loading}
                className={`w-full flex items-center justify-between p-4 rounded-md transition-all ${isCurrent
                        ? 'bg-brandPrimary/10 border border-brand/30'
                        : 'bg-white hover:bg-brandPrimaryLightBg border border-transparent hover:border-brand/20'
                    } ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="flex items-center space-x-3">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={name}
                            className="w-10 h-10 rounded-full object-cover border border-brand/20"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-brandPrimary text-white flex items-center justify-center font-bold text-sm border border-brand/20">
                            {getInitials(name)}
                        </div>
                    )}

                    <div className="text-left">
                        <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-dark text-sm">{name}</h4>
                            {isPersonal ? (
                                <PiUserCircle className="text-brandPrimary" size={16} />
                            ) : (
                                <PiStorefront className="text-brandPrimary" size={16} />
                            )}
                        </div>
                        <p className="text-xs text-dark/60">
                            {isPersonal ? t('personal_account') : t('store_account')} • {account.role}
                        </p>
                    </div>
                </div>

                {isCurrent && (
                    <div className="flex items-center text-brandPrimary">
                        <PiCheck size={20} />
                    </div>
                )}
            </button>
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-primary shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-light">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-lg font-semibold text-dark">{t('switch_account')}</h2>
                        {isRefreshing && (
                            <PiSpinner className="animate-spin text-brandPrimary" size={16} />
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                            className="p-1 text-dark/60 hover:text-brandPrimary transition-colors disabled:opacity-50"
                            title={t('refresh_accounts')}
                        >
                            <PiSpinner className={`${isRefreshing ? 'animate-spin' : ''}`} size={16} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1 text-dark/60 hover:text-brandPrimary transition-colors"
                        >
                            <PiX size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-brand/20 scrollbar-track-transparent">
                    {localAccounts.length === 0 && !isRefreshing ? (
                        <div className="text-center py-8 text-dark/60">
                            <PiUserCircle size={48} className="mx-auto mb-3 opacity-30" />
                            <p>{t('no_accounts')}</p>
                        </div>
                    ) : (
                        localAccounts.map(account => (
                            <AccountItem key={account.id} account={account} />
                        ))
                    )}

                    {isRefreshing && localAccounts.length === 0 && (
                        <div className="text-center py-8 text-dark/60">
                            <PiSpinner className="animate-spin mx-auto mb-3 opacity-30" size={48} />
                            <p>{t('loading_accounts')}</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-light bg-brandPrimaryLightBg/50">
                    <p className="text-xs text-dark/60 text-center">
                        {t('switching_info')}
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}
