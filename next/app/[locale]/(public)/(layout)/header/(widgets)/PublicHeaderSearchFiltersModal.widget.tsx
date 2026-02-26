'use client';

import {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  PiXLight,
  PiMagnifyingGlassLight,
  PiFunnelLight,
  PiSortAscendingLight
} from "react-icons/pi";
import { usePublicSearchContext }
  from '@/app/[locale]/(public)/(context)/PublicSearchContext';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';

export function PublicHeaderSearchFiltersModalWidget({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = loadClientSideCoLocatedTranslations('PublicHeaderSearchFiltersModalWidget');

  const {
    userFilters,
    searchParams,
    updateSearchText,
    updateUserFilters,
    updateSort,
    applyFilters,
    clearFilters
  } = usePublicSearchContext();

  // Local state for form inputs
  const [localSearchText, setLocalSearchText] = useState('');
  const [localSort, setLocalSort] = useState('newest');
  const [localPriceMin, setLocalPriceMin] = useState<string>('');
  const [localPriceMax, setLocalPriceMax] = useState<string>('');

  // Sync local state with context on open
  useEffect(() => {
    if (isOpen) {
      setLocalSearchText(searchParams.searchText || '');
      setLocalSort(searchParams.sort || 'newest');
      setLocalPriceMin(userFilters.price?.min?.toString() || '');
      setLocalPriceMax(userFilters.price?.max?.toString() || '');
    }
  }, [isOpen, searchParams, userFilters]);

  // Sort options
  const sortOptions = [
    { value: 'newest', label: t('newest_first'), icon: '🕐' },
    { value: 'price_low', label: t('price_low_high'), icon: '💰' },
    { value: 'price_high', label: t('price_high_low'), icon: '💎' },
    { value: 'rating_high', label: t('highest_rated'), icon: '⭐' },
    { value: 'random', label: t('random'), icon: '🎲' }
  ];

  const handleApply = useCallback(() => {
    // Update search text
    updateSearchText(localSearchText);

    // Update sort
    updateSort(localSort);

    // Update price filters
    updateUserFilters({
      ...userFilters,
      price: {
        min: localPriceMin ? parseFloat(localPriceMin) : null,
        max: localPriceMax ? parseFloat(localPriceMax) : null
      }
    });

    // Apply filters and close
    applyFilters();
    onClose();
  }, [
    localSearchText,
    localSort,
    localPriceMin,
    localPriceMax,
    userFilters,
    updateSearchText,
    updateSort,
    updateUserFilters,
    applyFilters,
    onClose
  ]);

  const handleClear = useCallback(() => {
    setLocalSearchText('');
    setLocalSort('newest');
    setLocalPriceMin('');
    setLocalPriceMax('');
    clearFilters();
  }, [clearFilters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleApply();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-start justify-center z-[200] backdrop-blur-sm pt-4 px-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-light">
          <div className="flex items-center gap-2">
            <PiMagnifyingGlassLight className="text-xl text-app-bright-purple" />
            <PiFunnelLight className="text-xl text-app-bright-purple" />
            <PiSortAscendingLight className="text-xl text-app-bright-purple" />
            <h3 className="text-lg font-bold text-gray-900 ml-2">
              {t('search_and_filters')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-app-bright-purple/10 rounded-full transition-colors"
            aria-label={t('close')}
          >
            <PiXLight className="text-2xl text-gray-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Search Input */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-900">
              {t('search')}
            </label>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={localSearchText}
                  onChange={(e) => setLocalSearchText(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full px-4 py-3 pr-12 border border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
                <PiMagnifyingGlassLight className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-semilight" />
              </div>
            </form>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-900">
              {t('sort_by')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLocalSort(option.value)}
                  className={`
                    flex items-center gap-2 px-3 py-2 text-sm font-medium
                    rounded-lg border transition-all duration-200
                    ${localSort === option.value
                      ? 'bg-app-bright-purple text-white border-brand'
                      : 'bg-white text-gray-900 border-light hover:bg-app-bright-purple/10 hover:border-semilight'
                    }
                  `}
                >
                  <span>{option.icon}</span>
                  <span className="truncate">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-900">
              {t('price_range')}
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={localPriceMin}
                  onChange={(e) => setLocalPriceMin(e.target.value)}
                  placeholder={t('min')}
                  className="w-full px-3 py-2 border border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
              <span className="text-semilight">—</span>
              <div className="flex-1">
                <input
                  type="number"
                  value={localPriceMax}
                  onChange={(e) => setLocalPriceMax(e.target.value)}
                  placeholder={t('max')}
                  className="w-full px-3 py-2 border border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-light bg-app-bright-purple/10/30">
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 px-4 py-3 bg-gray-900 hover:bg-gray-900/80 text-white font-medium rounded-lg transition-colors"
          >
            {t('clear_all')}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 px-4 py-3 bg-app-bright-purple hover:bg-app-bright-purple/80 text-white font-medium rounded-lg transition-colors"
          >
            {t('apply')}
          </button>
        </div>
      </div>
    </div>
  );
}

