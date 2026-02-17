'use client';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

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
import { apiCallForSpaHelper }
    from '@/lib/helpers/apiCallForSpaHelper';
import { useGlobalAuthProfileContext }
    from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import GlobalFavoritesLimitsModalWidget
    from '@/app/[locale]/(global)/(widgets)/GlobalFavoritesLimitsModalWidget';

interface GlobalFavoriteCardsContextType {
    favoriteIds: Set<number>;
    isFavorite: (cardId: number | string) => boolean;
    isToggleLoading: (cardId: number | string) => boolean;
    toggleFavorite: (cardId: number | string) => Promise<boolean>;
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
    const { accountId, loading: authLoading } = useGlobalAuthProfileContext();

    // Core state - use a single object to reduce re-renders
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
    const [toggleLoadingIds, setToggleLoadingIds] = useState<Set<number>>(new Set());
    const [showLimitModal, setShowLimitModal] = useState(false);

    // Use refs for values that shouldn't trigger re-renders
    const isFetchingRef = useRef(false);
    const accountIdRef = useRef<number | null>(null);

    // Get localStorage key for current user
    const getStorageKey = useCallback((accountId: number | null) => {
        return accountId ? `tiktak_favorites_${accountId}` : null;
    }, []);

    // Load favorite IDs from localStorage
    const loadFromStorage = useCallback((accountId: number): Set<number> | null => {
        try {
            const key = getStorageKey(accountId);
            if (!key) return null;

            const stored = localStorage.getItem(key);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Date.now() - parsed.timestamp < STORAGE_CACHE_DURATION) {
                    return new Set<number>(parsed.ids || []);
                }
            }
        } catch (error) {
            ConsoleLogger.warn('Error loading favorites from storage:', error);
        }
        return null;
    }, [getStorageKey]);

    // Save favorite IDs to localStorage
    const saveToStorage = useCallback((accountId: number, ids: Set<number>) => {
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
    const fetchFavorites = useCallback(async (accountId: number) => {
        if (isFetchingRef.current || !accountId) return;
        isFetchingRef.current = true;

        try {
            const response = await apiCallForSpaHelper({
                method: 'GET',
                url: `/api/provider/favorites?page=1&limit=${MAX_FAVORITES}`,
                params: {},
                body: {}
            });

            if (response.status === 200 && response.data?.favorites) {
                // API returns array of card IDs directly as integers
                const ids: Set<number> = new Set(response.data.favorites.map((id: number | string) => typeof id === 'string' ? parseInt(id, 10) : id));
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
    const isFavorite = useCallback((cardId: number | string) => {
        return favoriteIds.has(typeof cardId === 'string' ? parseInt(cardId, 10) : cardId);
    }, [favoriteIds]);

    // Check if card is being toggled
    const isToggleLoading = useCallback((cardId: number | string) => {
        return toggleLoadingIds.has(typeof cardId === 'string' ? parseInt(cardId, 10) : cardId);
    }, [toggleLoadingIds]);

    // Toggle favorite
    const toggleFavorite = useCallback(async (cardId: number | string) => {
        const cardIdInt = typeof cardId === 'string' ? parseInt(cardId, 10) : cardId;

        // Set loading state
        setToggleLoadingIds(prev => new Set([...prev, cardIdInt]));

        try {
            const isCurrentlyFavorite = favoriteIds.has(cardIdInt);

            if (isCurrentlyFavorite) {
                // Remove from favorites
                const response = await apiCallForSpaHelper({
                    method: 'DELETE',
                    url: `/api/provider/favorites/delete/${cardId}`,
                    params: {},
                    body: {}
                });

                if (response.status === 200) {
                    setFavoriteIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(cardIdInt);
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
                const response = await apiCallForSpaHelper({
                    method: 'POST',
                    url: `/api/provider/favorites/create/${cardId}`,
                    params: {},
                    body: {}
                });

                if (response.status === 201) {
                    setFavoriteIds(prev => {
                        const newSet = new Set([...prev, cardIdInt]);
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
                    setFavoriteIds(prev => new Set([...prev, cardIdInt]));
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
                newSet.delete(cardIdInt);
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
