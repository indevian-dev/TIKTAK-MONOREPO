"use client";

import {
    useState,
    useEffect,
    useRef,
    useCallback
} from 'react';
import { MdFilterList } from "react-icons/md";
import { GlobalSelectWidget } from '@/app/[locale]/(global)/(widgets)/GlobalSelect.widget';
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

interface CardOption {
    id: number | string;
    title: string;
    type: 'DYNAMIC' | 'STATIC';
    category_filter_options?: Array<{ id: number; title: string }>;
}

interface QuickSortButtonProps {
    sortValue: string;
    icon: string;
    label: string;
}

interface PublicCardsFiltersModalWidgetProps {
    withCategoriesStats?: boolean;
    categoriesStats?: CategoryStat[];
    showCategoryFilters?: boolean;
    className?: string;
}

export function PublicCardsFiltersModalWidget({
    withCategoriesStats = false,
    categoriesStats = [],
    showCategoryFilters = true,
    className = ''
}: PublicCardsFiltersModalWidgetProps) {
    const { t } = loadClientSideCoLocatedTranslations('PublicCardsFiltersModalWidget');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategoryPath, setSelectedCategoryPath] = useState<number[]>([]);
    const [categoryLevels, setCategoryLevels] = useState<Category[][]>([]);
    const [selectedSort, setSelectedSort] = useState('newest');
    const [cardOptions, setCardOptions] = useState<CardOption[]>([]);

    const {
        userFilters,
        updateUserFilters,
        applyFilters,
        clearFilters,
        filterFacets,
        categoryFacets,
        initialProps,
        updateSort,
        searchParams
    } = usePublicSearchContext();

    // Get categories from context
    const {
        categoriesHierarchy,
        loading: categoriesLoading,
        getSubCategories,
        getCategoryFilters
    } = useGlobalCategoryContext();

    // Sort options with proper labels and values
    const sortOptions = [
        { value: 'newest', label: t('newest_first') },
        { value: 'oldest', label: t('oldest_first') },
        { value: 'price_low', label: t('price_low_high') },
        { value: 'price_high', label: t('price_high_low') },
        { value: 'title_asc', label: t('title_a_z') },
        { value: 'title_desc', label: t('title_z_a') },
        { value: 'rating_high', label: t('highest_rated') },
        { value: 'rating_low', label: t('lowest_rated') },
        { value: 'random', label: t('random') },
        { value: 'featured', label: t('featured') }
    ];

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

    // Sync local sort state with search context
    useEffect(() => {
        setSelectedSort(searchParams.sort || 'newest');
    }, [searchParams.sort]);

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
                    const { filters, error } = await getCategoryFilters([initialProps.categoryId]);
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

    const handleCategoryChange = useCallback(async (categoryId: string | number, level: number) => {
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

    const handleFilterChange = useCallback((filterId: string | number, value: string[] | string | undefined) => {
        // Convert string values to numbers for storage
        const numericValue = value
            ? (Array.isArray(value) ? value.map(v => parseInt(v, 10)) : [parseInt(value, 10)])
            : undefined;

        updateUserFilters({
            ...userFilters,
            [filterId]: numericValue
        });
    }, [userFilters, updateUserFilters]);

    const handleDynamicFilterChange = useCallback((filterId: string | number, type: 'min' | 'max', value: string) => {
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
        setSelectedSort('newest');

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
                    validCategoryIds.has(String(cat.id))
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
        setIsModalOpen(false);
    }, [applyFilters]);

    // Handle sort change
    const handleSortChange = useCallback((value: string) => {
        setSelectedSort(value);
        updateSort(value);
    }, [updateSort]);

    // Reset sort to default
    const handleResetSort = useCallback(() => {
        const defaultSort = 'newest';
        setSelectedSort(defaultSort);
        updateSort(defaultSort);
    }, [updateSort]);

    // Get selected filters for display
    const getSelectedFilters = () => {
        const selected = [];

        // Categories
        if (selectedCategoryPath.length > 0) {
            selectedCategoryPath.forEach((categoryId, index) => {
                const levelCategories = categoryLevels[index];
                const category = levelCategories?.find(cat => String(cat.id) === String(categoryId));
                if (category) {
                    selected.push({
                        id: `category_${index}`,
                        type: 'category',
                        label: lt(category.title),
                        level: index,
                        value: categoryId
                    });
                }
            });
        }

        // Price filters
        if (userFilters.price?.min !== null && userFilters.price?.min !== undefined) {
            selected.push({
                id: 'price_min',
                type: 'price',
                label: `${t('min_price')}: ${userFilters.price.min}`,
                value: userFilters.price.min
            });
        }
        if (userFilters.price?.max !== null && userFilters.price?.max !== undefined) {
            selected.push({
                id: 'price_max',
                type: 'price',
                label: `${t('max_price')}: ${userFilters.price.max}`,
                value: userFilters.price.max
            });
        }

        // Dynamic filters
        cardOptions.forEach(option => {
            if (option.type === 'DYNAMIC') {
                if (userFilters[option.id]?.min !== null && userFilters[option.id]?.min !== undefined) {
                    selected.push({
                        id: `${option.id}_min`,
                        type: 'dynamic',
                        label: `${option.title} ${t('min')}: ${userFilters[option.id].min}`,
                        filterId: option.id,
                        value: userFilters[option.id].min,
                        filterType: 'min'
                    });
                }
                if (userFilters[option.id]?.max !== null && userFilters[option.id]?.max !== undefined) {
                    selected.push({
                        id: `${option.id}_max`,
                        type: 'dynamic',
                        label: `${option.title} ${t('max')}: ${userFilters[option.id].max}`,
                        filterId: option.id,
                        value: userFilters[option.id].max,
                        filterType: 'max'
                    });
                }
            } else {
                if (userFilters[option.id] && Array.isArray(userFilters[option.id]) && userFilters[option.id].length > 0) {
                    userFilters[option.id].forEach((valueId: number) => {
                        const optionItem = option.category_filter_options?.find(opt => opt.id === valueId);
                        if (optionItem) {
                            selected.push({
                                id: `${option.id}_${valueId}`,
                                type: 'static',
                                label: `${option.title}: ${optionItem.title}`,
                                filterId: option.id,
                                value: valueId
                            });
                        }
                    });
                }
            }
        });

        return selected;
    };

    const removeSelectedFilter = (filter: { id: string; type: string; level?: number; filterId?: string | number; filterType?: string; value?: number }) => {
        if (filter.type === 'category') {
            const newPath = selectedCategoryPath.slice(0, filter.level);
            setSelectedCategoryPath(newPath);
            updateUserFilters({
                ...userFilters,
                categories: newPath
            });
        } else if (filter.type === 'price') {
            updateUserFilters({
                ...userFilters,
                price: {
                    ...userFilters.price,
                    [filter.id === 'price_min' ? 'min' : 'max']: null
                }
            });
        } else if (filter.type === 'dynamic' && filter.filterId !== undefined && filter.filterType) {
            updateUserFilters({
                ...userFilters,
                [filter.filterId]: {
                    ...userFilters[filter.filterId],
                    [filter.filterType]: null
                }
            });
        } else if (filter.type === 'static' && filter.filterId !== undefined) {
            const currentValues = userFilters[filter.filterId] || [];
            const newValues = currentValues.filter((val: number) => val !== filter.value);
            updateUserFilters({
                ...userFilters,
                [filter.filterId]: newValues.length > 0 ? newValues : undefined
            });
        }
    };

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
                        <GlobalSelectWidget
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

    const selectedFilters = getSelectedFilters();

    // Quick sort buttons for common options
    const QuickSortButton = ({ sortValue, icon, label }: QuickSortButtonProps) => {
        const isActive = selectedSort === sortValue;
        return (
            <button
                onClick={() => handleSortChange(sortValue)}
                className={`
                    flex items-center gap-2 px-3 py-2  text-sm font-medium
                    transition-all duration-200 border
                    ${isActive
                        ? 'bg-app-bright-purple text-white border-brand shadow-sm'
                        : 'bg-white text-gray-900 border-light hover:bg-app-bright-purple/10 hover:border-semilight'
                    }
                `}
                aria-label={`Sort by ${label}`}
            >
                {icon && <span className="text-base">{icon}</span>}
                <span>{label}</span>
            </button>
        );
    };

    return (
        <>
            {/* Filter Button */}
            <div className={`flex justify-start w-full h-full ${className}`}>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={`
                        flex items-center transition-all duration-200 bg-white text-gray-900  w-full justify-center
                    `}
                    aria-label="Open filters"
                >
                    <MdFilterList className="text-lg" />
                    {selectedFilters.length > 0 ? `(${selectedFilters.length})` : ''}
                </button>
            </div>

            {/* Filters Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-app-bright-purple/10 bg-opacity-70 flex items-center justify-center z-100 bg-blure backdrop-blur-sm">
                    <div className="bg-white/80 rounded-lg w-full mx-3 md:mx-6 lg:mx-12 xl:mx-16 max-w-7xl min-w-[80hv] max-h-[80vh] overflow-hidden bg-opacity-50 ">
                        <div className="flex flex-col h-full max-h-[80vh]">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-3 border-b bg-white">
                                <h3 className="text-xl font-bold text-gray-900">{t('filters')}</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-5xl font-balck text-app-bright-purple"
                                    aria-label="Close modal"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="grid grid-cols-12 gap-6 h-full">
                                    {/* Column 1: Selected Filters */}
                                    <div className="space-y-4 col-span-12">
                                        <h4 className="font-bold text-lg text-gray-900 border-b pb-2">{t('selected_filters')}</h4>
                                        <div className="max-h-32 overflow-x-auto">
                                            {selectedFilters.length === 0 ? (
                                                <p className="text-gray-500 text-sm">{t('no_filters_selected')}</p>
                                            ) : (
                                                <div className="flex flex-wrap gap-2 pb-2">
                                                    {selectedFilters.map(filter => (
                                                        <div key={filter.id} className="flex items-center bg-app-bright-purple/10 rounded-full px-3 py-1 whitespace-nowrap border">
                                                            <span className="text-sm text-gray-900">{filter.label}</span>
                                                            <button
                                                                onClick={() => removeSelectedFilter(filter)}
                                                                className="text-red-500 hover:text-red-700 text-sm font-bold ml-2"
                                                                aria-label={`Remove ${filter.label}`}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Column 2: Static Filters */}
                                    <div className="space-y-4 col-span-12 md:col-span-4">
                                        <h4 className="font-bold text-lg text-gray-900 border-b pb-2">{t('categories')}</h4>
                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            {renderCategorySelectors()}
                                        </div>
                                    </div>

                                    {/* Column 3: Price & Dynamic Filters */}
                                    <div className="space-y-4 col-span-12 md:col-span-4">
                                        <h4 className="font-bold text-lg text-gray-900 border-b pb-2">{t('price_filters')}</h4>
                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            {/* Price Filter Section */}
                                            <div className="space-y-2">
                                                <div className="font-semibold">{t('price_range')}</div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        placeholder={t('min')}
                                                        aria-label={`${t('min')} ${t('price')}`}
                                                        className="form-input px-2 py-1 rounded border border-light w-full"
                                                        value={userFilters.price?.min || ''}
                                                        onChange={handlePriceChange}
                                                        name="minPrice"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder={t('max')}
                                                        aria-label={`${t('max')} ${t('price')}`}
                                                        className="form-input px-2 py-1 rounded border border-light w-full"
                                                        value={userFilters.price?.max || ''}
                                                        onChange={handlePriceChange}
                                                        name="maxPrice"
                                                    />
                                                </div>
                                            </div>

                                            {/* Dynamic Category Filters */}
                                            {cardOptions.map((cardOption) => (
                                                <div key={cardOption.id} className="space-y-2">
                                                    <div className="font-semibold">{cardOption.title}</div>
                                                    {cardOption.type === 'DYNAMIC' ? (
                                                        <div className="flex items-center space-x-2">
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
                                                            <GlobalSelectWidget
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
                                            ))}
                                        </div>
                                    </div>

                                    {/* Column 4: Sort Options */}
                                    <div className="space-y-4 col-span-12 md:col-span-4">
                                        <h4 className="font-bold text-lg text-gray-900 border-b pb-2">{t('sort_options')}</h4>
                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            {/* Main Sort Dropdown */}
                                            <div className="space-y-2">
                                                <div className="font-semibold">{t('select_sort_option')}</div>
                                                <GlobalSelectWidget
                                                    options={sortOptions}
                                                    onChange={handleSortChange}
                                                    value={selectedSort}
                                                    placeholder={t('select_sorting_option')}
                                                    isMulti={false}
                                                />
                                            </div>

                                            {/* Quick Sort Buttons */}
                                            <div className="space-y-2">
                                                <div className="font-semibold">{t('quick_sort')}</div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <QuickSortButton
                                                        sortValue="newest"
                                                        icon="🕐"
                                                        label={t('latest')}
                                                    />
                                                    <QuickSortButton
                                                        sortValue="price_low"
                                                        icon="💰"
                                                        label={t('low_price')}
                                                    />
                                                    <QuickSortButton
                                                        sortValue="rating_high"
                                                        icon="⭐"
                                                        label={t('top_rated')}
                                                    />
                                                    <QuickSortButton
                                                        sortValue="random"
                                                        icon="🎲"
                                                        label={t('random')}
                                                    />
                                                </div>
                                            </div>

                                            {/* Sort Direction Toggle for supported sorts */}
                                            {(selectedSort.includes('price') || selectedSort.includes('title') || selectedSort.includes('rating')) && (
                                                <div className="space-y-2">
                                                    <div className="font-semibold">{t('sort_direction')}</div>
                                                    <button
                                                        onClick={() => {
                                                            const isAsc = selectedSort.includes('_low') || selectedSort.includes('_asc');
                                                            const baseSort = selectedSort.split('_')[0];
                                                            const newDirection = isAsc ?
                                                                (baseSort === 'price' ? '_high' : '_desc') :
                                                                (baseSort === 'price' ? '_low' : '_asc');
                                                            handleSortChange(baseSort + newDirection);
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-app-bright-purple/10 hover:bg-semilight rounded-md text-sm font-medium transition-colors duration-200 w-full"
                                                    >
                                                        <span className="text-lg">
                                                            {selectedSort.includes('_low') || selectedSort.includes('_asc') ? '↑' : '↓'}
                                                        </span>
                                                        <span>{t('reverse_order')}</span>
                                                    </button>
                                                </div>
                                            )}

                                            {/* Reset Sort Button */}
                                            {selectedSort !== 'newest' && (
                                                <div className="pt-2 border-t">
                                                    <button
                                                        onClick={handleResetSort}
                                                        className="w-full px-4 py-2 text-sm font-medium text-app-bright-purple border border-brand rounded-md hover:bg-app-bright-purple hover:text-white transition-colors duration-200"
                                                    >
                                                        {t('reset_to_default')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex gap-3 justify-end p-3 border-t bg-white pl-12">
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="px-6 py-2 bg-gray-900 hover:bg-gray-900/80 text-white font-medium rounded-lg transition-colors duration-200 border border-dark"
                                >
                                    {t('clear_all')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApplyFilters}
                                    className="px-6 py-2 bg-app-bright-purple hover:bg-app-bright-purple/80 text-white font-medium rounded-lg transition-colors duration-200 border border-brand"
                                >
                                    {t('apply_filters')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
