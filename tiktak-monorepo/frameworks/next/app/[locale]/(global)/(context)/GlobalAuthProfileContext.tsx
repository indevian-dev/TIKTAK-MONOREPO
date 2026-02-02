"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode
} from 'react';
import { apiFetchHelper }
    from '@/lib/helpers/apiCallForSpaHelper';
import * as jose from 'jose';

// Extend Window interface for global token refresh
declare global {
    interface Window {
        __globalForceTokenRefresh?: () => Promise<boolean>;
    }
}

import type { User, Account } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
// API response types for global auth profile
export interface GlobalAuthUserApiResponse {
    id: string;
    email: string;
    name?: string;
    avatar?: string; // Profile avatar
    emailIsVerified?: boolean;
    phoneIsVerified?: boolean;
    [key: string]: any; // Allow additional fields
}

interface GlobalAuthProfileApiResponse {
    id: number;
    name?: string;
    avatar?: string | null;
    avatarUrl?: string | null;
    email?: string;
    mode?: string;
    accountType?: string;
    role?: string;
    suspended?: boolean;
    storeId?: number | null;
    storeName?: string | null;
    userId?: string; // Add missing userId property
    isPersonal?: boolean; // Add missing isPersonal property
    [key: string]: any; // Allow additional fields
}

interface Session {
    [key: string]: any;
}

type ModeType = 'personal' | 'store';

// Define Account Profile type for context
interface AccountProfile {
    id: number;
    name?: string;
    avatar?: string | null;
    mode?: string;
    accountType?: string;
    role?: string;
    suspended?: boolean;
    isPersonal?: boolean;
    storeId?: number | null;
    storeName?: string | null;
    [key: string]: any;
}

interface GlobalAuthProfileContextType {
    profile: GlobalAuthProfileApiResponse | null;
    accounts: AccountProfile[];
    currentAccount: AccountProfile | null;
    user: GlobalAuthUserApiResponse | null;
    permissions: string[];
    session: Session | null;
    mode: ModeType;
    loading: boolean;
    error: any;
    getInitials: (name?: string) => string;
    switchAccount: (accountId: number) => Promise<void>;
    switchMode: (newMode: ModeType) => void;
    refreshProfile: () => void;
    clearProfile: () => void;
    updateProfileFromLogin: (loginData: any) => void;
    forceRefresh: () => Promise<void>;
    forceTokenRefresh: () => Promise<boolean>;
    fetchAccountsList: (forceRefresh?: boolean) => Promise<void>;
    isTokenRefreshDone: boolean;
    lastRefreshCheck: number;
    tokenRefreshFailed: boolean;
    isReady: boolean;
    isAuthenticated: boolean;
    isPersonalMode: boolean;
    isStoreMode: boolean;
    hasMultipleAccounts: boolean;
    personalAccounts: AccountProfile[];
    storeAccounts: AccountProfile[];
}

const GlobalAuthProfileContext = createContext<GlobalAuthProfileContextType | null>(null);

interface GlobalAuthProfileProviderProps {
    children: ReactNode;
}

export function GlobalAuthProfileProvider({ children }: GlobalAuthProfileProviderProps) {
    const [profile, setProfile] = useState<GlobalAuthProfileApiResponse | null>(null);
    const [accounts, setAccounts] = useState<AccountProfile[]>([]);
    const [currentAccount, setCurrentAccount] = useState<AccountProfile | null>(null);
    const [user, setUser] = useState<GlobalAuthUserApiResponse | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [session, setSession] = useState<Session | null>(null);
    const [mode, setMode] = useState<ModeType>('personal'); // 'personal' or 'store'
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    
    // Token refresh state
    const [isTokenRefreshDone, setIsTokenRefreshDone] = useState(false);
    const [lastRefreshCheck, setLastRefreshCheck] = useState(0);
    const [tokenRefreshFailed, setTokenRefreshFailed] = useState(false);

    // Token refresh logic
    useEffect(() => {
        const getCookies = () => {
            return document.cookie.split(';').reduce((acc, cookie) => {
                const parts = cookie.trim().split('=');
                if (parts.length >= 2) {
                    const key = parts[0];
                    const value = parts.slice(1).join('=');
                    if (key) acc[key] = value;
                }
                return acc;
            }, {} as Record<string, string>);
        };

        const needsRefresh = () => {
            try {
                const cookies = getCookies();
                const accessToken = cookies['accessToken'];
                const refreshToken = cookies['refreshToken'];
                
                // No tokens at all - user not logged in, skip refresh
                if (!accessToken && !refreshToken) {
                    ConsoleLogger.log('✓ No tokens found - user not logged in, skipping refresh');
                    return false;
                }

                // Has refresh token but no access token - needs refresh
                if (!accessToken && refreshToken) {
                    ConsoleLogger.log('⚠️ No access token but has refresh token - refresh needed');
                    return true;
                }

                if (!accessToken) return true; // Should not happen based on logic above, but satisfies TS

                // Has access token - check expiry
                const decoded = jose.decodeJwt(accessToken);
                if (!decoded.exp) {
                    ConsoleLogger.log('⚠️ Token has no expiry - refresh needed');
                    return true;
                }
                const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
                
                if (expiresIn < 300) {
                    ConsoleLogger.log(`⚠️ Token expires in ${expiresIn}s - refresh needed`);
                    return true;
                }

                ConsoleLogger.log(`✓ Token still valid for ${Math.floor(expiresIn / 60)} minutes`);
                return false;
            } catch (e) {
                ConsoleLogger.log('⚠️ Error checking token:', e instanceof Error ? e.message : String(e));
                // If we can't decode, only try refresh if we have a refresh token
                const cookies = getCookies();
                return !!cookies['refreshToken'];
            }
        };

        const refreshToken = async () => {
            try {
                const response = await fetch('/api/auth/refresh', { 
                    method: 'POST',
                    credentials: 'include'
                });
                
                if (response.ok) {
                    ConsoleLogger.log('✅ Token refreshed successfully');
                    return true;
                } else if (response.status === 401) {
                    ConsoleLogger.log('⚠️ Refresh token expired');
                    return false;
                } else {
                    ConsoleLogger.log(`⚠️ Token refresh failed: ${response.status}`);
                    return false;
                }
            } catch (e) {
                ConsoleLogger.log('Token refresh error:', e instanceof Error ? e.message : String(e));
                return false;
            }
        };

        const checkAndRefresh = async () => {
            ConsoleLogger.log('🔍 GlobalAuthProfileContext: Checking if token refresh needed...');
            const shouldRefresh = needsRefresh();
            ConsoleLogger.log('🔍 GlobalAuthProfileContext: needsRefresh =', shouldRefresh);
            
            if (shouldRefresh) {
                ConsoleLogger.log('🔄 GlobalAuthProfileContext: Starting token refresh...');
                const refreshSuccess = await refreshToken();
                
                if (!refreshSuccess) {
                    ConsoleLogger.log('⚠️ GlobalAuthProfileContext: Token refresh failed, marking as failed');
                    setTokenRefreshFailed(true);
                } else {
                    setTokenRefreshFailed(false);
                }
            } else {
                setTokenRefreshFailed(false);
            }
            
            ConsoleLogger.log('✅ GlobalAuthProfileContext: Token check complete, setting isTokenRefreshDone = true');
            setIsTokenRefreshDone(true);
            setLastRefreshCheck(Date.now());
        };

        // Initial check on mount
        ConsoleLogger.log('🚀 GlobalAuthProfileContext: Mounted, starting initial token check');
        checkAndRefresh();

        // Check every 5 minutes
        const interval = setInterval(() => {
            ConsoleLogger.log('⏰ GlobalAuthProfileContext: Periodic token check (5 min interval)');
            checkAndRefresh();
        }, 5 * 60 * 1000);
        
        return () => {
            ConsoleLogger.log('🛑 GlobalAuthProfileContext: Unmounting, clearing interval');
            clearInterval(interval);
        };
    }, []);

    // Load profile data from localStorage and API
    useEffect(() => {
        // Wait for token refresh before loading profile
        if (isTokenRefreshDone) {
            loadProfileData();
        }
    }, [isTokenRefreshDone]);

    // Save to localStorage when profile changes
    useEffect(() => {
        if (profile && accounts.length > 0) {
            localStorage.setItem('shagguide_profile', JSON.stringify({
                profile,
                user,
                permissions,
                session,
                mode,
                currentAccountId: currentAccount?.id,
                accounts, // Include accounts array for reconstruction
                timestamp: Date.now()
            }));
        }
    }, [profile, mode, currentAccount, user, permissions, session, accounts]);

    // New method to update profile directly from login response
    const updateProfileFromLogin = useCallback((loginData: any) => {
        try {
            const { user: userData, account: accountData, permissions: permsData, session: sessionData } = loginData;

            // Set user data
            setUser(userData);

            // Set current account
            setCurrentAccount(accountData);

            // Set permissions
            setPermissions(permsData || []);

            // Set session
            setSession(sessionData);

            // For now, set accounts array with just the current account
            // This will be expanded when fetching full accounts list
            setAccounts([accountData]);

            // Build profile object
            const profileData = buildProfileFromLoginData(accountData, userData);
            setProfile(profileData);

            // Set mode based on account type
            setMode(accountData?.is_personal ? 'personal' : 'store');

            setLoading(false);
            setError(null);

            ConsoleLogger.log('Profile updated from login data:', profileData);
        } catch (error) {
            ConsoleLogger.error('Error updating profile from login:', error);
            setError(error instanceof Error ? error.message : 'Failed to update profile');
            setLoading(false);
        }
    }, []);

    const buildProfileFromLoginData = (account: any, userData: any) => {
        if (!account || !userData) return null;

        const isPersonal = account.is_personal;

        return {
            id: account.id,
            name: isPersonal ? `${userData.name || ''} ${userData.last_name || ''}`.trim() || userData.email : 'Store Account',
            avatar: userData.avatar_base64 || null, // Keep base64 avatar if available
            avatarUrl: userData.avatar_url || null, // Keep URL avatar if available
            email: userData.email,
            mode: isPersonal ? 'personal' : 'store',
            accountType: isPersonal ? 'Personal' : 'Store',
            role: account.role,
            suspended: account.suspended,
            storeId: null, // Will be set later when full profile is loaded
            storeName: null, // Will be set later when full profile is loaded
            userId: userData.id, // Add userId from userData
            isPersonal: isPersonal // Add isPersonal flag
        };
    };

    const loadProfileData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Try to load from localStorage first
            const savedProfile = localStorage.getItem('shagguide_profile');
            ConsoleLogger.log('AuthProfileContext: Checking localStorage:', savedProfile ? 'Found' : 'Not found');

            if (savedProfile) {
                const parsed = JSON.parse(savedProfile);
                ConsoleLogger.log('AuthProfileContext: localStorage data:', parsed);
                // Check if data is fresh (less than 5 minutes old)
                if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
                    ConsoleLogger.log('AuthProfileContext: Using fresh localStorage data');
                    setProfile(parsed.profile);
                    setUser(parsed.user);
                    setPermissions(parsed.permissions || []);
                    setSession(parsed.session);
                    setMode(parsed.mode || 'personal');

                    // Try to reconstruct currentAccount from stored data
                    if (parsed.currentAccountId && parsed.accounts) {
                        const current = parsed.accounts.find((acc: any) => acc.id === parsed.currentAccountId);
                        if (current) {
                            ConsoleLogger.log('AuthProfileContext: Setting currentAccount from localStorage:', current);
                            setCurrentAccount(current);
                        }
                    }

                    setLoading(false);
                    return; // Skip API call if fresh data exists
                } else {
                    ConsoleLogger.log('AuthProfileContext: localStorage data is stale');
                }
            }

            // Fetch fresh data from API
            ConsoleLogger.log('AuthProfileContext: Fetching from API...');
            const response = await apiFetchHelper({
                method: 'GET',
                url: '/api/auth/accounts'
            });

            ConsoleLogger.log('AuthProfileContext: API response:', response);

            if (response.data) {
                const { accounts: fetchedAccounts, currentAccount: current, user: userData } = response.data;

                ConsoleLogger.log('AuthProfileContext: Setting currentAccount:', current);
                setAccounts(fetchedAccounts || []);
                setCurrentAccount(current);
                setUser(userData);

                // Build profile object
                const profileData = buildProfile(current, userData);
                setProfile(profileData);

                // Set mode based on current account
                setMode(current?.is_personal ? 'personal' : 'store');
            } else {
                ConsoleLogger.log('AuthProfileContext: No response data');
            }
        } catch (error) {
            ConsoleLogger.error('Error loading profile data:', error);
            setError(error instanceof Error ? error.message : 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const buildProfile = (account: any, userData: any): GlobalAuthProfileApiResponse | null => {
        if (!account || !userData) return null;

        const isPersonal = account.is_personal;
        const store = account.stores?.[0];

        return {
            id: account.id,
            name: isPersonal ? `${userData.name || ''} ${userData.last_name || ''}`.trim() || userData.email : store?.title || 'Store',
            avatar: isPersonal ? userData.avatar_base64 : store?.logo,
            avatarUrl: isPersonal ? userData.avatar_url : null,
            email: userData.email,
            mode: isPersonal ? 'personal' : 'store',
            accountType: isPersonal ? 'Personal' : 'Store',
            role: account.role,
            storeId: store?.id || null,
            storeName: store?.title || null,
            userId: userData.id, // Add userId from userData
            isPersonal: isPersonal // Add isPersonal flag
        };
    };

    const getInitials = (name?: string): string => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((word: string) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Enhanced switch account method with immediate updates
    const switchAccount = async (accountId: number): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiFetchHelper({
                method: 'POST',
                url: '/api/auth/accounts/switch',
                body: { accountId }
            });

            if (response.data?.success) {
                const { account: switchedAccount, user: updatedUser } = response.data;

                // Immediately update current account and user
                setCurrentAccount(switchedAccount);
                if (updatedUser) {
                    setUser(updatedUser);
                }

                // Update mode immediately
                const newMode = switchedAccount.is_personal ? 'personal' : 'store';
                setMode(newMode);

                // Find the account in our accounts list and build profile immediately
                const accountWithStoreData = accounts.find(acc => acc.id === accountId) || switchedAccount;
                const immediateProfile = buildProfile(accountWithStoreData, updatedUser || user);
                setProfile(immediateProfile);

                // Clear loading state immediately for responsive UI
                setLoading(false);

                // Force localStorage update with new data
                const updatedData = {
                    profile: immediateProfile,
                    user: updatedUser || user,
                    permissions,
                    session,
                    mode: newMode,
                    currentAccountId: accountId,
                    timestamp: Date.now()
                };
                localStorage.setItem('shagguide_profile', JSON.stringify(updatedData));

                // Background reload for complete data (stores, etc.) without affecting UI
                setTimeout(async () => {
                    try {
                        const backgroundResponse = await apiFetchHelper({
                            method: 'GET',
                            url: '/api/auth/accounts'
                        });

                        if (backgroundResponse.data) {
                            const { accounts: freshAccounts, currentAccount: freshCurrent, user: freshUser } = backgroundResponse.data;

                            // Only update if we have fresh data
                            if (freshAccounts && freshCurrent) {
                                setAccounts(freshAccounts);
                                setCurrentAccount(freshCurrent);
                                setUser(freshUser);

                                // Update profile with complete store data
                                const completeProfile = buildProfile(freshCurrent, freshUser);
                                setProfile(completeProfile);
                            }
                        }
                    } catch (bgError) {
                        ConsoleLogger.warn('Background profile refresh failed:', bgError);
                        // Don't update error state for background refresh failures
                    }
                }, 100);
            } else {
                throw new Error('Failed to switch account');
            }
        } catch (error) {
            ConsoleLogger.error('Error switching account:', error);
            setError(error instanceof Error ? error.message : 'Failed to switch account');
            setLoading(false);
            throw error;
        }
    };

    const switchMode = (newMode: ModeType): void => {
        if (newMode === mode) return;

        // Find appropriate account for the mode
        const targetAccount = accounts.find(acc =>
            newMode === 'personal' ? acc.isPersonal : !acc.isPersonal
        );

        if (targetAccount) {
            switchAccount(targetAccount.id);
        } else {
            setError(`No ${newMode} account available`);
        }
    };

    const refreshProfile = () => {
        localStorage.removeItem('shagguide_profile');
        loadProfileData();
    };

    const clearProfile = () => {
        setProfile(null);
        setAccounts([]);
        setCurrentAccount(null);
        setUser(null);
        setPermissions([]);
        setSession(null);
        setMode('personal');
        localStorage.removeItem('shagguide_profile');
    };

    // Method to force immediate re-render of all components
    const forceRefresh = useCallback(async (): Promise<void> => {
        // Clear cached data
        localStorage.removeItem('shagguide_profile');

        // Force state update to trigger re-renders
        setProfile(prev => prev ? { ...prev, _forceUpdate: Date.now() } : prev);

        // Reload data
        await loadProfileData();
    }, []);

    // Add this new method to fetch accounts specifically
    const fetchAccountsList = useCallback(async (forceRefresh = false): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // Skip cache check if forceRefresh is true
            if (!forceRefresh) {
                const savedProfile = localStorage.getItem('shagguide_profile');
                if (savedProfile) {
                    const parsed = JSON.parse(savedProfile);
                    // Check if data is fresh (less than 2 minutes old for accounts)
                    if (Date.now() - parsed.timestamp < 2 * 60 * 1000) {
                        setLoading(false);
                        return;
                    }
                }
            }

            // Fetch fresh accounts data from API
            const response = await apiFetchHelper({
                method: 'GET',
                url: '/api/auth/accounts'
            });

            if (response.data) {
                const { accounts: fetchedAccounts, currentAccount: current, user: userData } = response.data;

                setAccounts(fetchedAccounts || []);
                setCurrentAccount(current);
                setUser(userData);

                // Update profile if current account changed
                if (current) {
                    const profileData = buildProfile(current, userData);
                    setProfile(profileData);
                    setMode(current?.is_personal ? 'personal' : 'store');
                }

                setLoading(false);
            }
        } catch (error) {
            ConsoleLogger.error('Error fetching accounts list:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch accounts');
            setLoading(false);
            throw error;
        }
    }, []); // Remove dependencies to prevent re-creation

    // Force immediate token refresh (can be called by other components)
    const forceTokenRefresh = useCallback(async () => {
        ConsoleLogger.log('🔄 Force token refresh requested');
        try {
            const response = await fetch('/api/auth/refresh', { 
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                ConsoleLogger.log('✅ Force token refresh successful');
                setLastRefreshCheck(Date.now());
                // Trigger profile reload after token refresh
                setTimeout(() => {
                    loadProfileData();
                }, 100);
                return true;
            } else {
                ConsoleLogger.log('⚠️ Force token refresh failed');
                return false;
            }
        } catch (e) {
            ConsoleLogger.log('❌ Force token refresh error:', e instanceof Error ? e.message : String(e));
            return false;
        }
    }, []);

    // Expose forceTokenRefresh globally for apiCallForSpaHelper
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.__globalForceTokenRefresh = forceTokenRefresh;
        }
        return () => {
            if (typeof window !== 'undefined') {
                delete window.__globalForceTokenRefresh;
            }
        };
    }, [forceTokenRefresh]);

    const value = {
        profile,
        accounts,
        currentAccount,
        user,
        permissions,
        session,
        mode,
        loading,
        error,
        getInitials,
        switchAccount,
        switchMode,
        refreshProfile,
        clearProfile,
        updateProfileFromLogin,
        forceRefresh,
        forceTokenRefresh, // New method for forcing immediate refresh
        fetchAccountsList,
        isTokenRefreshDone,
        lastRefreshCheck,
        tokenRefreshFailed, // Indicates if initial token refresh failed
        // Safe to make API calls only if refresh done AND didn't fail
        isReady: isTokenRefreshDone && !loading && !tokenRefreshFailed,
        isAuthenticated: !!profile && !!currentAccount,
        isPersonalMode: mode === 'personal',
        isStoreMode: mode === 'store',
        hasMultipleAccounts: accounts.length > 1,
        personalAccounts: accounts.filter(acc => acc.isPersonal),
        storeAccounts: accounts.filter(acc => !acc.isPersonal)
    };

    // Determine if we should show loading screen
    // Show loading ONLY if: tokens exist but refresh check not done yet
    const shouldShowLoading = !isTokenRefreshDone && (() => {
        if (typeof window === 'undefined') return false; // Server-side, don't show loading
        
        try {
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                const parts = cookie.trim().split('=');
                if (parts.length >= 2) {
                    const key = parts[0];
                    const value = parts.slice(1).join('=');
                    if (key) acc[key] = value;
                }
                return acc;
            }, {} as Record<string, string>);
            
            // Show loading only if we have tokens that need checking/refreshing
            return !!(cookies['accessToken'] || cookies['refreshToken']);
        } catch {
            return false;
        }
    })();

    // Show loading screen while initial token refresh is in progress
    if (shouldShowLoading) {
        return (
            <GlobalAuthProfileContext.Provider value={value}>
                <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-brand/5 via-white to-surface">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
                        <p className="text-slate-600">Initializing session...</p>
                    </div>
                </div>
            </GlobalAuthProfileContext.Provider>
        );
    }

    return (
        <GlobalAuthProfileContext.Provider value={value}>
            {children}
        </GlobalAuthProfileContext.Provider>
    );
}

export function useGlobalAuthProfileContext(): GlobalAuthProfileContextType {
    const context = useContext(GlobalAuthProfileContext);
    if (!context) {
        throw new Error('useGlobalAuthProfileContext must be used within an GlobalAuthProfileProvider');
    }
    return context;
}
