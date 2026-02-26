'use client';

import { ConsoleLogger } from '@/lib/logging/Console.logger';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
    ReactNode
} from 'react';
import { toast }
    from 'react-toastify';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { useGlobalAuthProfileContext }
    from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import GlobalFavoritesLimitsModalWidget
    from '@/app/[locale]/(global)/(widgets)/GlobalFavoritesLimitsModal.widget';

interface GlobalFavoriteCardsContextType {
    favoriteIds: Set<string>;
    isFavorite: (cardId: string) => boolean;
    isToggleLoading: (cardId: string) => boolean;
    toggleFavorite: (cardId: string) => Promise<boolean>;
    refreshFavorites: () => void;
    showLimitModal: boolean;
    setShowLimitModal: (show: boolean) => void;
    maxFavorites: number;
}

const GlobalFavoriteCardsContext = createContext<GlobalFavoriteCardsContextType>({
    favoriteIds: new Set(),
    isFavorite: () => false,
    isToggleLoading: () => false,
    toggleFavorite: async () => false,
    refreshFavorites: () => { },
    showLimitModal: false,
    setShowLimitModal: () => { },
    maxFavorites: 200
});

export const useGlobalFavoriteCardsContext = () => {
    const context = useContext(GlobalFavoriteCardsContext);
    return context;
};

const MAX_FAVORITES = 200;
const STORAGE_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const GlobalFavoriteCardsProvider = ({ children }: { children: ReactNode }) => {
    const { userId: accountId, loading: authLoading } = useGlobalAuthProfileContext();

    // Core state - use a single object to reduce re-renders
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [toggleLoadingIds, setToggleLoadingIds] = useState<Set<string>>(new Set());
    const [showLimitModal, setShowLimitModal] = useState(false);

    // Use refs for values that shouldn't trigger re-renders
    const isFetchingRef = useRef(false);
    const accountIdRef = useRef<string | null>(null);

    // Get localStorage key for current user
    const getStorageKey = useCallback((accountId: string | null) => {
        return accountId ? `tiktak_favorites_${accountId}` : null;
    }, []);

    // Load favorite IDs from localStorage
    const loadFromStorage = useCallback((accountId: string): Set<string> | null => {
        try {
            const key = getStorageKey(accountId);
            if (!key) return null;

            const stored = localStorage.getItem(key);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Date.now() - parsed.timestamp < STORAGE_CACHE_DURATION) {
                    return new Set<string>(parsed.ids || []);
                }
            }
        } catch (error) {
            ConsoleLogger.warn('Error loading favorites from storage:', error);
        }
        return null;
    }, [getStorageKey]);

    // Save favorite IDs to localStorage
    const saveToStorage = useCallback((accountId: string, ids: Set<string>) => {
        try {
            const key = getStorageKey(accountId);
            if (!key) return;

            const idsArray = Array.from(ids).slice(0, MAX_FAVORITES);
            localStorage.setItem(key, JSON.stringify({
                ids: idsArray,
                timestamp: Date.now()
            }));
        } catch (error) {
            ConsoleLogger.warn('Error saving favorites to storage:', error);
        }
    }, [getStorageKey]);

    // Fetch favorites from API
    const fetchFavorites = useCallback(async (accountId: string) => {
        if (isFetchingRef.current || !accountId) return;
        isFetchingRef.current = true;

        try {
            const response = await apiCall({
                method: 'GET',
                url: `/api/favorites`,
                params: {},
                body: {}
            });

            if (response.status === 200 && response.data?.favoriteIds) {
                // API returns array of card IDs (strings)
                const ids: Set<string> = new Set(response.data.favoriteIds);
                setFavoriteIds(ids);
                saveToStorage(accountId, ids);
            }
        } catch (error) {
            ConsoleLogger.error('Error fetching favorites:', error);
        } finally {
            isFetchingRef.current = false;
        }
    }, [saveToStorage]);

    // Initialize on account change - wait for auth to finish loading
    useEffect(() => {
        // Don't do anything while auth is still loading
        if (authLoading) return;

        // User is logged in - fetch favorites if account changed
        if (accountId) {
            if (accountIdRef.current !== accountId) {
                accountIdRef.current = accountId;
                // Load from cache immediately for fast UI
                const cachedIds = loadFromStorage(accountId);
                if (cachedIds) {
                    setFavoriteIds(cachedIds);
                }
                // Then fetch from server
                fetchFavorites(accountId);
            }
        } else {
            // User is not logged in - clear everything
            if (accountIdRef.current !== null) {
                accountIdRef.current = null;
                setFavoriteIds(new Set());
            }
        }
    }, [authLoading, accountId, fetchFavorites, loadFromStorage]);

    // Check if card is favorite
    const isFavorite = useCallback((cardId: string) => {
        return favoriteIds.has(cardId);
    }, [favoriteIds]);

    // Check if card is being toggled
    const isToggleLoading = useCallback((cardId: string) => {
        return toggleLoadingIds.has(cardId);
    }, [toggleLoadingIds]);

    // Toggle favorite
    const toggleFavorite = useCallback(async (cardId: string) => {
        const cardIdInt = typeof cardId === 'string' ? parseInt(cardId, 10) : cardId;

        // Set loading state
        setToggleLoadingIds(prev => new Set([...prev, cardId]));

        try {
            const isCurrentlyFavorite = favoriteIds.has(cardId);

            if (isCurrentlyFavorite) {
                // Remove from favorites
                const response = await apiCall({
                    method: 'DELETE',
                    url: `/api/favorites/${cardId}`,
                    params: {},
                    body: {}
                });

                if (response.status === 200) {
                    setFavoriteIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(cardId);
                        if (accountId) saveToStorage(accountId, newSet);
                        return newSet;
                    });
                    toast.success('Removed from favorites');
                    return true;
                } else if (response.status === 401) {
                    // Will be handled by API helper (redirect to login)
                    return false;
                } else {
                    toast.error(response.data?.error || 'Failed to remove from favorites');
                    return false;
                }
            } else {
                // Check limit before adding
                if (favoriteIds.size >= MAX_FAVORITES) {
                    setShowLimitModal(true);
                    return false;
                }

                // Add to favorites
                const response = await apiCall({
                    method: 'POST',
                    url: `/api/favorites/${cardId}`,
                    params: {},
                    body: {}
                });

                if (response.status === 201 || response.status === 200) { // Support 201 or 200 for created
                    setFavoriteIds(prev => {
                        const newSet = new Set([...prev, cardId]);
                        if (accountId) saveToStorage(accountId, newSet);
                        return newSet;
                    });
                    toast.success('Added to favorites');
                    return true;
                } else if (response.status === 401) {
                    // Will be handled by API helper (redirect to login)
                    return false;
                } else if (response.status === 409) {
                    // Already in favorites - sync state
                    setFavoriteIds(prev => new Set([...prev, cardId]));
                    toast.info('Already in favorites');
                    return true;
                } else {
                    toast.error(response.data?.error || 'Failed to add to favorites');
                    return false;
                }
            }
        } catch (error) {
            ConsoleLogger.error('Error toggling favorite:', error);
            toast.error('Something went wrong. Please try again.');
            return false;
        } finally {
            setToggleLoadingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(cardId);
                return newSet;
            });
        }
    }, [accountId, favoriteIds, saveToStorage]);

    // Refresh favorites
    const refreshFavorites = useCallback(() => {
        if (accountId) {
            isFetchingRef.current = false; // Reset flag to allow fetch
            fetchFavorites(accountId);
        }
    }, [accountId, fetchFavorites]);

    const value = useMemo(() => ({
        favoriteIds,
        isFavorite,
        isToggleLoading,
        toggleFavorite,
        refreshFavorites,
        showLimitModal,
        setShowLimitModal,
        maxFavorites: MAX_FAVORITES
    }), [
        favoriteIds,
        isFavorite,
        isToggleLoading,
        toggleFavorite,
        refreshFavorites,
        showLimitModal
    ]);

    return (
        <GlobalFavoriteCardsContext.Provider value={value}>
            {children}
            <GlobalFavoritesLimitsModalWidget
                isOpen={showLimitModal}
                onClose={() => setShowLimitModal(false)}
                maxFavorites={MAX_FAVORITES}
            />
        </GlobalFavoriteCardsContext.Provider>
    );
};
