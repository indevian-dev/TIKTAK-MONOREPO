"use client";

import {
    useState,
    useEffect,
    useRef,
    useCallback
} from 'react';
import { SelectPrimitive } from '@/app/primitives/Select.primitive';
import { useGlobalCategoryContext } from '@/app/[locale]/(global)/(context)/GlobalCategoryContext';
import { usePublicSearchContext } from '@/app/[locale]/(public)/(context)/PublicSearchContext';
import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';
import type { Category } from '@/app/[locale]/(public)/categories/PublicCategoriesService';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { lt } from '@/lib/utils/Localized.util';
interface CategoryStat {
    category_id: string;
    public_cards_count: number;
}

interface PublicCardsFiltersWidgetProps {
    withCategoriesStats?: boolean;
    categoriesStats?: CategoryStat[];
    showCategoryFilters?: boolean;
    className?: string;
}

interface CardOption {
    id: number;
    title: string;
    type: 'STATIC' | 'DYNAMIC';
    category_filter_options?: Array<{ id: number; title: string }>;
}

export function PublicCardsFiltersWidget({
    withCategoriesStats = false,
    categoriesStats = [],
    showCategoryFilters = true,
    className = ''
}: PublicCardsFiltersWidgetProps) {
    const { t } = loadClientSideCoLocatedTranslations('PublicCardsFiltersWidget');
    const [selectedCategoryPath, setSelectedCategoryPath] = useState<number[]>([]);
    const [categoryLevels, setCategoryLevels] = useState<Category[][]>([]);
    const [cardOptions, setCardOptions] = useState<CardOption[]>([]);

    const {
        userFilters,
        updateUserFilters,
        applyFilters,
        clearFilters,
        filterFacets,
        categoryFacets,
        initialProps
    } = usePublicSearchContext();

    // Get categories from context
    const {
        categoriesHierarchy,
        loading: categoriesLoading,
        getSubCategories,
        getCategoryFilters
    } = useGlobalCategoryContext();

    // Refs for stable tracking
    const isInitialized = useRef(false);
    const categoriesStatsRef = useRef<CategoryStat[]>([]);

    // Update refs when props change
    useEffect(() => {
        categoriesStatsRef.current = categoriesStats;
    }, [categoriesStats]);

    // Sync selected filters with search context or legacy props
    useEffect(() => {
        if (userFilters.categories) {
            setSelectedCategoryPath(userFilters.categories);
        }
    }, [userFilters.categories]);

    // Initialize component when hierarchy and props are ready
    useEffect(() => {
        if (categoriesLoading || categoriesHierarchy.length === 0) return;

        const initializeComponent = () => {

            // Filter categories based on available categories or stats
            let filteredCategories = [];

            if (categoryFacets.length > 0) {
                // Use dynamic faceted categories from current search results (highest priority)
                const availableCategoryIds = new Set(categoryFacets.map(cat => cat.id));
                filteredCategories = categoriesHierarchy.filter(cat =>
                    availableCategoryIds.has(cat.id)
                );
            } else if (withCategoriesStats && categoriesStatsRef.current.length > 0) {
                // Fall back to stats: show categories that have cards in this category page
                const validCategoryIds = new Set(
                    categoriesStatsRef.current
                        .filter(cat => cat.public_cards_count > 0)
                        .map(cat => cat.category_id)
                );
                filteredCategories = categoriesHierarchy.filter(cat =>
                    validCategoryIds.has(String(cat.id))
                );
            } else {
                // Default: show all parent categories when no filtering applied
                filteredCategories = categoriesHierarchy;
            }

            setCategoryLevels(filteredCategories.length > 0 ? [filteredCategories] : []);

            // Mark as initialized after everything is set up
            setTimeout(() => {
                isInitialized.current = true;
            }, 200);
        };

        initializeComponent();
    }, [categoriesHierarchy.length, categoriesLoading, withCategoriesStats, categoryFacets]);

    // Use filterFacets from search context, or fetch filters for initial/selected categories
    useEffect(() => {
        const fetchFiltersIfNeeded = async () => {
            // First priority: Use filterFacets from search context if available
            if (filterFacets && filterFacets.length > 0) {
                setCardOptions(filterFacets);
                return;
            }

            // Second priority: Fetch filters for selected user categories
            if (userFilters.categories && userFilters.categories.length > 0) {
                try {
                    const { filters, error } = await getCategoryFilters(userFilters.categories.map(String));
                    if (!error && filters.length > 0) {
                        setCardOptions(filters);
                        return;
                    }
                } catch (error) {
                    ConsoleLogger.error('Error fetching filters for selected categories:', error);
                }
            }

            // Third priority: Fetch filters for initial category if available
            if (initialProps.categoryId) {
                try {
                    const { filters, error } = await getCategoryFilters([String(initialProps.categoryId)]);
                    if (!error && filters.length > 0) {
                        setCardOptions(filters);
                        return;
                    }
                } catch (error) {
                    ConsoleLogger.error('Error fetching filters for initial category:', error);
                }
            }

            // Fallback: No filters available
            setCardOptions([]);
        };

        fetchFiltersIfNeeded();
    }, [filterFacets, userFilters.categories, initialProps.categoryId, getCategoryFilters]);

    const handleCategoryChange = useCallback(async (categoryId: number | string, level: number) => {
        let newPath;

        if (!categoryId) {
            // Clear selection from this level onwards
            newPath = selectedCategoryPath.slice(0, level);
        } else {
            const numericCategoryId = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
            newPath = [...selectedCategoryPath.slice(0, level), numericCategoryId];

            // Fetch subcategories if needed
            try {
                const { categories: subCategories, error } = await getSubCategories(String(numericCategoryId));

                if (!error && subCategories.length > 0) {
                    // Filter subcategories based on the same logic as parent categories
                    let filteredSubCategories = subCategories;

                    if (withCategoriesStats) {
                        // When using stats, ONLY show subcategories that have cards
                        if (categoriesStatsRef.current.length > 0) {
                            const validCategoryIds = new Set(
                                categoriesStatsRef.current
                                    .filter(cat => cat.public_cards_count > 0)
                                    .map(cat => cat.category_id)
                            );
                            filteredSubCategories = subCategories.filter(cat =>
                                validCategoryIds.has(String(cat.id))
                            );
                        } else {
                            // No stats available, don't show any subcategories
                            filteredSubCategories = [];
                        }
                    }

                    if (filteredSubCategories.length > 0) {
                        const newLevels = [
                            ...categoryLevels.slice(0, level + 1),
                            filteredSubCategories
                        ];
                        setCategoryLevels(newLevels);
                    } else {
                        // No valid subcategories, keep current levels up to this point
                        setCategoryLevels(categoryLevels.slice(0, level + 1));
                    }
                } else {
                    // No subcategories, keep current levels up to this point
                    setCategoryLevels(categoryLevels.slice(0, level + 1));
                }
            } catch (error) {
                // Error fetching subcategories - silently fail
            }
        }

        // Update local state and context
        setSelectedCategoryPath(newPath);
        updateUserFilters({
            ...userFilters,
            categories: newPath
        });
    }, [selectedCategoryPath, categoryLevels, withCategoriesStats, getSubCategories, userFilters, updateUserFilters]);

    const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = value === '' ? null : parseFloat(value);

        updateUserFilters({
            ...userFilters,
            price: {
                ...userFilters.price,
                [name === 'minPrice' ? 'min' : 'max']: numericValue
            }
        });
    }, [userFilters, updateUserFilters]);

    const handleFilterChange = useCallback((filterId: number, value: string | string[] | undefined) => {
        // Convert string values to numbers for storage
        const numericValue = value
            ? (Array.isArray(value) ? value.map(v => parseInt(v, 10)) : [parseInt(value, 10)])
            : undefined;

        updateUserFilters({
            ...userFilters,
            [filterId]: numericValue
        });
    }, [userFilters, updateUserFilters]);

    const handleDynamicFilterChange = useCallback((filterId: number, type: 'min' | 'max', value: string) => {
        const numericValue = value === '' ? null : parseFloat(value);

        updateUserFilters({
            ...userFilters,
            [filterId]: {
                ...userFilters[filterId],
                [type]: numericValue
            }
        });
    }, [userFilters, updateUserFilters]);

    const handleClearFilters = useCallback(() => {
        // Reset local UI state
        setSelectedCategoryPath([]);

        // Reset category levels to initial state (first level only)
        if (categoriesHierarchy.length > 0) {
            let filteredCategories = [];

            if (categoryFacets.length > 0) {
                // Use dynamic faceted categories from current search results (highest priority)
                const availableCategoryIds = new Set(categoryFacets.map(cat => cat.id));
                filteredCategories = categoriesHierarchy.filter(cat =>
                    availableCategoryIds.has(cat.id)
                );
            } else if (withCategoriesStats && categoriesStatsRef.current.length > 0) {
                // Fall back to stats: show categories that have cards in this category page
                const validCategoryIds = new Set(
                    categoriesStatsRef.current
                        .filter(cat => cat.public_cards_count > 0)
                        .map(cat => cat.category_id)
                );
                filteredCategories = categoriesHierarchy.filter(cat =>
                    validCategoryIds.has(cat.id)
                );
            } else {
                // Default: show all parent categories
                filteredCategories = categoriesHierarchy;
            }

            setCategoryLevels(filteredCategories.length > 0 ? [filteredCategories] : []);
        }

        // Clear filters in search context
        clearFilters();
    }, [categoriesHierarchy, withCategoriesStats, categoryFacets, clearFilters]);

    const handleApplyFilters = useCallback(() => {
        // Apply filters in search context
        applyFilters();
    }, [applyFilters]);

    const renderCategorySelectors = (): React.ReactElement[] => {
        // If category filters are disabled, return empty array
        if (!showCategoryFilters) {
            return [];
        }

        const selectors: React.ReactElement[] = [];

        categoryLevels.forEach((levelCategories, originalLevel) => {
            // Only process levels that have categories
            if (!levelCategories || levelCategories.length === 0) {
                return;
            }

            const selectedValue = selectedCategoryPath[originalLevel] || '';
            const levelLabel = originalLevel === 0 ? t('category') : `${t('subcategory')} ${originalLevel}`;

            const categoryOptions = levelCategories.map(category => {
                let countText = '';

                if (withCategoriesStats) {
                    const statsCategory = categoriesStatsRef.current.find(stat => stat.category_id === category.id);
                    countText = statsCategory ? ` (${statsCategory.public_cards_count})` : '';
                } else {
                    const facetCategory = categoryFacets.find(facet => facet.id === category.id);
                    countText = facetCategory ? ` (${facetCategory.count})` : '';
                }

                return {
                    label: `${lt(category.title)}${countText}`,
                    value: String(category.id)
                };
            });

            selectors.push(
                <div key={`category-level-${originalLevel}`} className="col-span-12 w-full">
                    <div className="rounded space-y-2 w-full">
                        <div className="font-bold w-full">{levelLabel}</div>
                        <SelectPrimitive
                            options={[
                                { label: `${t('select')} ${levelLabel}`, value: '' },
                                ...categoryOptions
                            ]}
                            onChange={(value) => handleCategoryChange(value, originalLevel)}
                            value={typeof selectedValue === 'number' ? String(selectedValue) : selectedValue}
                            placeholder={`${t('select')} ${levelLabel}`}
                            isMulti={false}
                        />
                    </div>
                </div>
            );
        });

        return selectors;
    };

    return (
        <div className={`filter-section ${className} flex flex-col gap-4 mb-6 w-full text-gray-900 text-md items-start`}>
            {/* Category Selection */}
            {renderCategorySelectors()}

            {/* Dynamic Category Filters */}
            {cardOptions.map((cardOption) => (
                <div key={cardOption.id} className="col-span-12 flex items-stretch w-full">
                    <div className="rounded space-y-2 w-full">
                        <div className="font-bold w-full">{cardOption.title}</div>
                        {cardOption.type === 'DYNAMIC' ? (
                            <div className="flex items-center space-x-2 w-full">
                                <input
                                    type="number"
                                    placeholder={t('min')}
                                    aria-label={`${t('min')} ${cardOption.title}`}
                                    className="form-input px-2 py-1 rounded border border-light w-full"
                                    value={userFilters[cardOption.id]?.min || ''}
                                    onChange={(e) => handleDynamicFilterChange(cardOption.id, 'min', e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder={t('max')}
                                    aria-label={`${t('max')} ${cardOption.title}`}
                                    className="form-input px-2 py-1 rounded border border-light w-full"
                                    value={userFilters[cardOption.id]?.max || ''}
                                    onChange={(e) => handleDynamicFilterChange(cardOption.id, 'max', e.target.value)}
                                />
                            </div>
                        ) : (
                            <div>
                                <SelectPrimitive
                                    options={(cardOption.category_filter_options || []).map(option => ({
                                        label: option.title,
                                        value: String(option.id)
                                    }))}
                                    onChange={(value) => handleFilterChange(cardOption.id, value)}
                                    value={(userFilters[cardOption.id] || []).map((v: number) => String(v))}
                                    isMulti={true}
                                />
                                <span className="text-xs text-gray-500">{t('multiple_selection')}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Price Filter Section */}
            <div className="col-span-12 flex items-stretch w-full">
                <div className="rounded space-y-2 w-full">
                    <div className="font-bold w-full">{t('price_range')}</div>
                    <div className="price-filter w-full flex gap-2 ">
                        <input
                            type="number"
                            id="minPrice"
                            name="minPrice"
                            value={userFilters.price?.min || ''}
                            onChange={handlePriceChange}
                            placeholder={t('min_price')}
                            className='w-full rounded border border-light p-2'
                        />
                        <input
                            type="number"
                            id="maxPrice"
                            name="maxPrice"
                            value={userFilters.price?.max || ''}
                            onChange={handlePriceChange}
                            placeholder={t('max_price')}
                            className='w-full rounded border border-light p-2'
                        />
                    </div>
                </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="col-span-12 flex items-center justify-between gap-4 w-full mt-4">
                <button
                    type="button"
                    onClick={handleClearFilters}
                    className="flex-1 px-4 py-2 bg-gray-900 hover:bg-gray-900/80 text-white font-medium rounded-lg transition-colors duration-200 border border-dark"
                >
                    {t('clear')}
                </button>
                <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="flex-1 px-4 py-2 bg-app-bright-purple hover:bg-app-bright-purple/80 text-white font-medium rounded-lg transition-colors duration-200 border border-brand"
                >
                    {t('apply')}
                </button>
            </div>
        </div>
    );
};
