"use client";

import { ConsoleLogger } from '@/lib/logging/Console.logger';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode
} from 'react';
import {
    getCategoriesHierarchy,
    getSubCategories,
    getCategoryFilters,
    type Category,
} from '@/app/[locale]/(public)/categories/PublicCategoriesService';

// Define types for the data structures
// Using any for complex objects to match existing loose typing, 
// but defining the structure where known.
// type Category = any;
type Filter = any;

interface GlobalCategoryContextType {
    categoriesHierarchy: Category[];
    loading: boolean;
    error: string | null;
    getSubCategories: (categoryId: string) => Promise<{ categories: Category[]; error?: string | null }>;
    getCategoryFilters: (categoryIds: string | string[]) => Promise<{ filters: Filter[]; error?: string | null }>;
    refreshCategories: () => void;
}

const GlobalCategoryContext = createContext<GlobalCategoryContextType | null>(null);

export function GlobalCategoryProvider({ children }: { children: ReactNode }) {
    const [categoriesHierarchy, setCategoriesHierarchy] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories hierarchy on mount
    useEffect(() => {
        let mounted = true;

        const fetchCategoriesHierarchy = async () => {
            try {
                setLoading(true);
                setError(null);
                const { hierarchy, error: fetchError } = await getCategoriesHierarchy();

                if (!fetchError && mounted) {
                    setCategoriesHierarchy(hierarchy || []);
                } else if (fetchError) {
                    setError(fetchError);
                }
            } catch (error: unknown) {
                ConsoleLogger.error('Error fetching categories:', error);
                if (mounted) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
                    setError(errorMessage);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchCategoriesHierarchy();

        return () => {
            mounted = false;
        };
    }, []);

    // Memoized function to get subcategories
    const getSubCategoriesFromContext = useCallback(async (categoryId: string) => {
        try {
            const result = await getSubCategories(categoryId);
            return result;
        } catch (error: unknown) {
            ConsoleLogger.error('Error fetching subcategories:', error);
            return { categories: [], error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }, []);

    // Memoized function to get category filters
    const getCategoryFiltersFromContext = useCallback(async (categoryIds: string | string[]) => {
        try {
            const result = await getCategoryFilters(categoryIds);
            return result;
        } catch (error: unknown) {
            ConsoleLogger.error('Error fetching category filters:', error);
            return { filters: [], error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }, []);

    const value: GlobalCategoryContextType = {
        categoriesHierarchy,
        loading,
        error,
        getSubCategories: getSubCategoriesFromContext,
        getCategoryFilters: getCategoryFiltersFromContext,
        refreshCategories: () => {
            // Force re-fetch categories
            setCategoriesHierarchy([]);
            setLoading(true);
            setError(null);
        }
    };

    return (
        <GlobalCategoryContext.Provider value={value}>
            {children}
        </GlobalCategoryContext.Provider>
    );
}

export function useGlobalCategoryContext() {
    const context = useContext(GlobalCategoryContext);
    if (!context) {
        throw new Error('useGlobalCategoryContext must be used within an GlobalCategoryProvider');
    }
    return context;
}
