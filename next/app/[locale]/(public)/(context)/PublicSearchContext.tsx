"use client";

import { ConsoleLogger } from '@/lib/logging/Console.logger';

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
    ReactNode
} from 'react';
import {
    useSearchParams,
    usePathname
} from 'next/navigation';
import {
    searchCards,
    getCardsWithFilters
} from '@/app/[locale]/(public)/cards/PublicCardsService';
import { getCategoryFilters }
    from '@/app/[locale]/(public)/categories/PublicCategoriesService';

// Define types
interface MapParams {
    zoom: number;
    boundingBox: {
        northEast: { lat: number; lng: number };
        southWest: { lat: number; lng: number };
    };
    precision: number;
}

interface UserFilters {
    price: { min: number | null; max: number | null };
    categories: number[];
    [key: string]: any;
}

interface SearchParams {
    searchText: string;
    sort: string;
    mapParams: MapParams | null;
}

interface SearchState {
    cards: any[];
    buckets: any[];
    loading: boolean;
    error: string | null;
    total: number;
    categoryFacets: any[];
    filterFacets: any[];
    facetsFetched: boolean;
}

interface InitialProps {
    mode?: 'simple' | 'map';
    categoryId?: string | null;
    workspaceId?: string | null;
    includeFacets?: boolean;
    pagination?: number;
    useAdvancedFilters?: boolean;
    mapParams?: MapParams | null;
    [key: string]: any;
}

interface PublicSearchContextType {
    cards: any[];
    buckets: any[];
    loading: boolean;
    error: string | null;
    total: number;
    categoryFacets: any[];
    filterFacets: any[];
    userFilters: UserFilters;
    searchParams: SearchParams;
    initialProps: InitialProps;
    updateSearchText: (searchText: string) => void;
    updateSort: (sort: string) => void;
    updateUserFilters: (newFilters: UserFilters) => void;
    applyFilters: () => void;
    clearFilters: () => void;
    triggerInitialSearch: () => void;
    updateInitialProps: (newProps: Partial<InitialProps>) => void;
    updateMapParams: (zoom: number, boundingBox: any) => void;
}

const PublicSearchContext = createContext<PublicSearchContextType | null>(null);

interface PublicSearchProviderProps {
    children: ReactNode;
    initialProps?: InitialProps;
}

// Clean and performant search context with proper separation of concerns
export function PublicSearchProvider({ children, initialProps = {} }: PublicSearchProviderProps) {
    // ===== MODE DETECTION =====
    const urlSearchParams = useSearchParams();
    const pathname = usePathname();
    const urlMode = urlSearchParams.get('mode');
    // Detect map mode from URL parameter OR pathname containing '/map' OR from initialProps
    const detectedMode = urlMode === 'map' || pathname?.includes('/map') ? 'map' : 'simple';
    const mode = initialProps.mode || detectedMode;

    // ===== INITIAL PROPS (Persistent - never cleared) =====
    // These are set once and remain throughout the session
    const initialPropsRef = useRef<InitialProps>({
        categoryId: initialProps.categoryId || null,
        workspaceId: initialProps.workspaceId || null,
        includeFacets: initialProps.includeFacets ?? true,
        pagination: initialProps.pagination || 50,
        useAdvancedFilters: initialProps.useAdvancedFilters || false,
        mode: mode,
        mapParams: mode === 'map' ? {
            zoom: 6,
            boundingBox: {
                northEast: { lat: 50.0, lng: 55.0 }, // Wider bounds for initial search
                southWest: { lat: 35.0, lng: 40.0 }
            },
            precision: 2
        } : null
    });

    // ===== USER FILTERS (Changeable - cleared on Clear button) =====
    // These are filters that users can modify and apply
    const [userFilters, setUserFilters] = useState<UserFilters>({
        price: { min: null, max: null },
        categories: [], // Additional category selections beyond initial categoryId
        // Option groups will be stored as: { [groupId]: [optionIds] } or { [groupId]: { min, max } }
    });

    // ===== SEARCH PARAMS (Immediate search trigger) =====
    // These trigger search immediately when changed
    const [searchParams, setSearchParams] = useState<SearchParams>({
        searchText: '',
        sort: 'newest',
        // Map parameters (only used when mode === 'map')
        mapParams: mode === 'map' ? {
            zoom: 6,
            boundingBox: {
                northEast: { lat: 50.0, lng: 55.0 }, // Wider bounds for initial search
                southWest: { lat: 35.0, lng: 40.0 }
            },
            precision: 2
        } : null
    });

    // Ref to track current search text to avoid dependency issues
    const searchParamsRef = useRef(searchParams);
    searchParamsRef.current = searchParams;

    // ===== SEARCH RESULTS STATE =====
    const [searchState, setSearchState] = useState<SearchState>({
        cards: [],
        buckets: [],
        loading: false,
        error: null,
        total: 0,
        categoryFacets: [],
        filterFacets: [],
        facetsFetched: false
    });

    // ===== UTILITY REFS =====
    const abortControllerRef = useRef<AbortController | null>(null);
    const isSearchingRef = useRef(false);
    const lastSearchTimeRef = useRef(0);
    const searchIdRef = useRef(0); // For tracking search validity
    const previousCategoriesRef = useRef<number[]>([]); // Track previous categories to detect changes
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // ===== SEARCH FUNCTION =====
    const performSearch = useCallback(async (options: { userFilters?: UserFilters; searchParams?: SearchParams; isInitialSearch?: boolean } = {}) => {
        const {
            userFilters: overrideUserFilters,
            searchParams: overrideSearchParams
        } = options;

        if (isSearchingRef.current) return;

        isSearchingRef.current = true;
        const currentSearchId = ++searchIdRef.current;

        setSearchState(prev => ({ ...prev, loading: true, error: null }));

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            // Determine which filters to use
            const currentUserFilters = overrideUserFilters !== undefined ? overrideUserFilters : userFilters;
            const currentSearchParams = overrideSearchParams !== undefined ? overrideSearchParams : searchParams;

            // Check if categories have changed to determine if we should refetch facets
            const currentCategories = currentUserFilters.categories || [];
            const categoriesChanged = JSON.stringify(previousCategoriesRef.current) !== JSON.stringify(currentCategories);
            previousCategoriesRef.current = [...currentCategories];

            // Build search filters based on API type
            const searchFilters: any = {
                searchText: currentSearchParams.searchText,
                sort: currentSearchParams.sort,
                includeFacets: initialPropsRef.current.includeFacets && (!searchState.facetsFetched || categoriesChanged),
                mode: initialPropsRef.current.mode
            };

            // Add map parameters if in map mode
            if (initialPropsRef.current.mode === 'map' && currentSearchParams.mapParams) {
                searchFilters.zoom = currentSearchParams.mapParams.zoom;
                searchFilters.boundingBox = currentSearchParams.mapParams.boundingBox;
                searchFilters.precision = currentSearchParams.mapParams.precision;
            }

            // Always include initial props
            if (initialPropsRef.current.workspaceId) {
                searchFilters.workspaceId = initialPropsRef.current.workspaceId;
            }

            // Handle categories: user filters take precedence over initial categoryId
            if (currentUserFilters.categories && currentUserFilters.categories.length > 0) {
                searchFilters.categoryIds = currentUserFilters.categories.join(',');
            } else if (initialPropsRef.current.categoryId) {
                searchFilters.categoryId = initialPropsRef.current.categoryId;
            }

            // Map price filters
            if (currentUserFilters.price?.min || currentUserFilters.price?.max) {
                if (currentUserFilters.price.min) searchFilters.priceMin = currentUserFilters.price.min;
                if (currentUserFilters.price.max) searchFilters.priceMax = currentUserFilters.price.max;
            }

            // Map option group filters (exclude price and categories)
            Object.keys(currentUserFilters).forEach(filterId => {
                if (filterId !== 'categories' && filterId !== 'price') {
                    const filterValue = currentUserFilters[filterId];

                    // Handle DYNAMIC range filters (objects with min/max)
                    if (typeof filterValue === 'object' && filterValue.min !== undefined) {
                        if (filterValue.min) searchFilters[`${filterId}_min`] = filterValue.min;
                        if (filterValue.max) searchFilters[`${filterId}_max`] = filterValue.max;
                    }
                    // Handle multi-select filters (arrays of option IDs)
                    else if (Array.isArray(filterValue) && filterValue.length > 0) {
                        searchFilters[`${filterId}_options`] = filterValue.join(',');
                    }
                }
            });

            // Debug logging for map mode
            if (initialPropsRef.current.mode === 'map') {
                ConsoleLogger.log('🔍 Map mode search with filters:', searchFilters);
            }

            // Perform the search
            let result;
            if (initialPropsRef.current.useAdvancedFilters) {
                searchFilters.pagination = initialPropsRef.current.pagination;
                result = await getCardsWithFilters(searchFilters, initialPropsRef.current.pagination);
            } else {
                result = await searchCards(searchFilters);
            }

            // Check if this search is still valid (not cancelled)
            if (currentSearchId !== searchIdRef.current || abortControllerRef.current?.signal.aborted) {
                return;
            }

            if (result.error) {
                setSearchState(prev => ({
                    ...prev,
                    loading: false,
                    error: result.error || null,
                    cards: [],
                    buckets: [],
                    total: 0
                }));
            } else {
                // Handle different response modes
                if (result.mode === 'map') {
                    // Map mode: Store buckets instead of cards
                    setSearchState(prev => ({
                        ...prev,
                        loading: false,
                        error: null,
                        buckets: result.buckets || [],
                        cards: [], // Clear cards in map mode
                        total: result.total || 0,
                        categoryFacets: (result.facets?.categories || prev.categoryFacets || []) as any[],
                        facetsFetched: prev.facetsFetched || !!result.facets
                    }));
                } else {
                    // Simple mode: Store individual cards
                    const cards = result.cards || [];

                    // If we have cardOptionsGroups, fetch the corresponding filter definitions
                    const cardOptionsGroups = result.facets?.cardOptionsGroups || [];
                    if (Array.isArray(cardOptionsGroups) && cardOptionsGroups.length > 0 && cards.length > 0) {
                        // Get unique category IDs from the search results
                        const categoryIds = [...new Set(cards.flatMap((card: any) => card._source?.categories || []))];
                        if (categoryIds.length > 0) {
                            // Fetch filter definitions for categories found in search results
                            getCategoryFilters(categoryIds).then(({ filters, error }: any) => {
                                if (!error && filters.length > 0) {
                                    setSearchState(prev => ({
                                        ...prev,
                                        filterFacets: filters
                                    }));
                                }
                            }).catch((error: any) => {
                                ConsoleLogger.error('Error fetching filter definitions for search results:', error);
                            });
                        }
                    }

                    setSearchState(prev => ({
                        ...prev,
                        loading: false,
                        error: null,
                        cards: cards,
                        buckets: [], // Clear buckets in simple mode
                        total: result.total || 0,
                        categoryFacets: (result.facets?.categories || prev.categoryFacets || []) as any[],
                        facetsFetched: prev.facetsFetched || !!result.facets
                    }));
                }
            }
        } catch (error: any) {
            if (currentSearchId === searchIdRef.current && !abortControllerRef.current?.signal.aborted) {
                ConsoleLogger.error('Search error:', error);
                setSearchState(prev => ({
                    ...prev,
                    loading: false,
                    error: 'An error occurred while searching',
                    cards: [],
                    total: 0
                }));
            }
        } finally {
            if (currentSearchId === searchIdRef.current) {
                isSearchingRef.current = false;
            }
        }
    }, [userFilters, searchParams, searchState.facetsFetched]);

    // ===== INITIAL SEARCH =====
    const triggerInitialSearch = useCallback(() => {
        const now = Date.now();
        if (now - lastSearchTimeRef.current < 300) return; // Debounce

        lastSearchTimeRef.current = now;
        performSearch({ isInitialSearch: true });
    }, [performSearch]);

    // Update mode when pathname changes
    useEffect(() => {
        const newMode = initialProps.mode || detectedMode;
        const modeChanged = initialPropsRef.current.mode !== newMode;

        if (modeChanged) {
            initialPropsRef.current.mode = newMode;

            // If switching to map mode, initialize map params and trigger search
            if (newMode === 'map') {
                const mapParams = {
                    zoom: 6,
                    boundingBox: {
                        northEast: { lat: 50.0, lng: 55.0 },
                        southWest: { lat: 35.0, lng: 40.0 }
                    },
                    precision: 2
                };

                initialPropsRef.current.mapParams = mapParams;
                setSearchParams(prev => ({ ...prev, mapParams }));

                // Trigger initial search for map mode
                setTimeout(() => {
                    triggerInitialSearch();
                }, 100);
            } else {
                // Switching to simple mode
                initialPropsRef.current.mapParams = null;
                setSearchParams(prev => ({ ...prev, mapParams: null }));
            }
        }
    }, [mode, detectedMode, initialProps.mode, triggerInitialSearch]);

    // Initial search trigger for map mode on first mount
    useEffect(() => {
        if (initialPropsRef.current.mode === 'map') {
            // Trigger initial search for map mode to load cards within the initial bounding box
            triggerInitialSearch();
        }
    }, [triggerInitialSearch]);

    // ===== SEARCH PARAMS UPDATERS =====
    const updateSearchText = useCallback((searchText: string) => {
        const currentSort = searchParamsRef.current.sort;
        setSearchParams(prev => ({ ...prev, searchText }));

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Debounced search trigger
        searchTimeoutRef.current = setTimeout(() => {
            performSearch({
                searchParams: {
                    searchText,
                    sort: currentSort,
                    mapParams: searchParamsRef.current.mapParams
                }
            });
        }, 300);
    }, [performSearch]);

    const updateSort = useCallback((sort: string) => {
        const currentSearchText = searchParamsRef.current.searchText;
        setSearchParams(prev => ({ ...prev, sort }));
        performSearch({
            searchParams: {
                searchText: currentSearchText,
                sort,
                mapParams: searchParamsRef.current.mapParams
            }
        });
    }, [performSearch]);

    // ===== USER FILTERS UPDATERS =====
    const updateUserFilters = useCallback((newFilters: UserFilters) => {
        setUserFilters(newFilters);
        // Don't trigger search - wait for apply button
    }, []);

    // ===== APPLY FILTERS =====
    const applyFilters = useCallback(() => {
        performSearch({ userFilters });
    }, [userFilters, performSearch]);

    // ===== CLEAR FILTERS =====
    const clearFilters = useCallback(() => {
        const emptyFilters: UserFilters = {
            price: { min: null, max: null },
            categories: []
            // All option group filters will be cleared automatically
        };
        setUserFilters(emptyFilters);
        performSearch({ userFilters: emptyFilters });
    }, [performSearch]);

    // ===== UPDATE MAP PARAMS =====
    const updateMapParams = useCallback((zoom: number, boundingBox: any) => {
        if (initialPropsRef.current.mode !== 'map') return;

        const precision = Math.floor(zoom / 3); // Calculate precision based on zoom level
        const newMapParams = { zoom, boundingBox, precision };

        // Update searchParams with new map parameters
        setSearchParams(prev => ({
            ...prev,
            mapParams: newMapParams
        }));

        // Update initialPropsRef for persistence
        initialPropsRef.current = {
            ...initialPropsRef.current,
            mapParams: newMapParams
        };

        // Trigger search with updated map parameters
        performSearch({
            searchParams: {
                ...searchParamsRef.current,
                mapParams: newMapParams
            }
        });
    }, [performSearch]);

    // ===== UPDATE INITIAL PROPS =====
    const updateInitialProps = useCallback((newProps: Partial<InitialProps>) => {
        const oldProps = initialPropsRef.current;
        const newPropsCombined = { ...oldProps, ...newProps };

        // Check if categoryId or workspaceId changed (these affect search results)
        const categoryChanged = oldProps.categoryId !== newPropsCombined.categoryId;
        const workspaceChanged = oldProps.workspaceId !== newPropsCombined.workspaceId;

        initialPropsRef.current = newPropsCombined;

        // Reset facets and trigger search only if category or workspace changed
        if (categoryChanged || workspaceChanged) {
            setSearchState(prev => ({
                ...prev,
                categoryFacets: [],
                filterFacets: [],
                facetsFetched: false
            }));
        }
    }, []);

    // ===== CONTEXT VALUE =====
    const value = {
        // Search results
        cards: searchState.cards,
        buckets: searchState.buckets,
        loading: searchState.loading,
        error: searchState.error,
        total: searchState.total,
        categoryFacets: searchState.categoryFacets,
        filterFacets: searchState.filterFacets,

        // Current filter values (for UI display)
        userFilters,
        searchParams,

        // Initial props (read-only)
        initialProps: initialPropsRef.current,

        // Actions
        updateSearchText,
        updateSort,
        updateUserFilters,
        applyFilters,
        clearFilters,
        triggerInitialSearch,
        updateInitialProps,
        updateMapParams
    };

    return (
        <PublicSearchContext.Provider value={value}>
            {children}
        </PublicSearchContext.Provider>
    );
}

export function usePublicSearchContext() {
    const context = useContext(PublicSearchContext);
    if (!context) {
        throw new Error('usePublicSearchContext must be used within an PublicSearchProvider');
    }
    return context;
}
