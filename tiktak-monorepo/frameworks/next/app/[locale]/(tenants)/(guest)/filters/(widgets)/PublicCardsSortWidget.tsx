"use client";

import { useState, useEffect } from 'react';
import { usePublicSearchContext } from '@/app/[locale]/(tenants)/(guest)/(context)/PublicSearchContext';
import { GlobalSelectWidget } from '@/app/[locale]/(global)/(widgets)/GlobalSelectWidget';
import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';

interface PublicCardsSortWidgetProps {
    defaultSort?: string;
    className?: string;
    showSortLabel?: boolean;
}

export function PublicCardsSortWidget({
    defaultSort = 'newest',
    className = "",
}: PublicCardsSortWidgetProps) {
    const { t } = loadClientSideCoLocatedTranslations('PublicCardsSortWidget');
    const { updateSort, searchParams } = usePublicSearchContext();
    const [selectedSort, setSelectedSort] = useState(searchParams.sort || defaultSort);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Don't initialize with onSortChange on mount - let parent control initial state
    // The parent component should set the initial sort value, not the widget

    // Sync local state with search context
    useEffect(() => {
        setSelectedSort(searchParams.sort || defaultSort);
    }, [searchParams.sort, defaultSort]);

    // Handle sort change
    const handleSortChange = (value: string) => {
        setSelectedSort(value);
        updateSort(value);
    };

    // Reset sort to default
    const handleResetSort = () => {
        setSelectedSort(defaultSort);
        updateSort(defaultSort);
    };

    // Get current sort label for button display
    const getCurrentSortLabel = () => {
        const currentOption = sortOptions.find(option => option.value === selectedSort);
        return currentOption ? currentOption.label : t('sort');
    };

    // Quick sort buttons for common options
    const QuickSortButton = ({ sortValue, icon, label }: { sortValue: string; icon: string; label: string }) => {
        const isActive = selectedSort === sortValue;
        return (
            <button
                onClick={() => handleSortChange(sortValue)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium 
                    transition-all duration-200 border
                    ${isActive
                        ? 'bg-brandPrimary text-white border-brand shadow-sm'
                        : 'bg-white text-dark border-light hover:bg-brandPrimaryLightBg hover:border-semilight'
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
            {/* Sort Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className={`
                    flex items-center gap-2 px-1 py-1 rounded-md text-xs font-medium 
                    transition-all duration-200 border bg-white text-dark border-light 
                    hover:bg-brandPrimaryLightBg hover:border-semilight ${className}
                `}
                aria-label="Open sort options"
            >
                <span className="text-base">⚡</span>
                <span className="hidden sm:inline"></span>
                <span className="font-semibold">{getCurrentSortLabel()}</span>
                <span className="text-xs">▼</span>
            </button>

            {/* Sort Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="space-y-6">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-dark">{t('sort_options')}</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                                    aria-label="Close modal"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Main Sort Dropdown */}
                            <div className="space-y-3">
<label className="block text-sm font-medium text-dark">
                                {t('select_sort_option')}
                            </label>
                                <GlobalSelectWidget
                                    options={sortOptions}
                                    onChange={handleSortChange}
                                    value={selectedSort}
                                    placeholder={t('select_sorting_option')}
                                    isMulti={false}
                                />
                            </div>

                            {/* Quick Sort Buttons */}
                            <div className="space-y-3">
<label className="block text-sm font-medium text-dark">
                                {t('quick_sort')}
                            </label>
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
                                <div className="space-y-3">
<label className="block text-sm font-medium text-dark">
                                    {t('sort_direction')}
                                </label>
                                    <button
                                        onClick={() => {
                                            const isAsc = selectedSort.includes('_low') || selectedSort.includes('_asc');
                                            const baseSort = selectedSort.split('_')[0];
                                            const newDirection = isAsc ?
                                                (baseSort === 'price' ? '_high' : '_desc') :
                                                (baseSort === 'price' ? '_low' : '_asc');
                                            handleSortChange(baseSort + newDirection);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-brandPrimaryLightBg hover:bg-semilight rounded-md text-sm font-medium transition-colors duration-200"
                                    >
                                        <span className="text-lg">
                                            {selectedSort.includes('_low') || selectedSort.includes('_asc') ? '↑' : '↓'}
                                        </span>
                                        <span>{t('reverse_order')}</span>
                                    </button>
                                </div>
                            )}

                            {/* Modal Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                {selectedSort !== defaultSort && (
                                    <button
                                        onClick={handleResetSort}
                                        className="flex-1 px-4 py-2 text-sm font-medium text-brandPrimary border border-brand rounded-md hover:bg-brandPrimary hover:text-white transition-colors duration-200"
                                    >
                                        {t('reset_to_default')}
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium bg-brandPrimary text-white rounded-md hover:bg-brandPrimary/90 transition-colors duration-200"
                                >
                                    {t('apply_sort')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
