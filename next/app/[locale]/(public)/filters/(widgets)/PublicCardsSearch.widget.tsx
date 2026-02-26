"use client";

import { useState, useEffect } from 'react';
import { usePublicSearchContext } from '@/app/[locale]/(public)/(context)/PublicSearchContext';
import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';
import { PiMagnifyingGlassLight } from "react-icons/pi";

interface PublicCardsSearchWidgetProps {
    placeholder?: string;
    className?: string;
}

export function PublicCardsSearchWidget({
    placeholder,
    className = "",
}: PublicCardsSearchWidgetProps) {
    const { t } = loadClientSideCoLocatedTranslations('PublicCardsSearchWidget');
    const searchPlaceholder = placeholder || t('search_cards');
    const { updateSearchText, searchParams } = usePublicSearchContext();
    const [localSearchText, setLocalSearchText] = useState(searchParams.searchText || '');

    // Sync local state with search context
    useEffect(() => {
        setLocalSearchText(searchParams.searchText || '');
    }, [searchParams.searchText]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchText(value);
        updateSearchText(value);
    };

    // Handle search form submission
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSearchText(localSearchText);
    };

    // Clear search
    const handleClearSearch = () => {
        setLocalSearchText('');
        updateSearchText('');
    };


    return (
        <div className={`cards-search-widget w-full ${className} bg-white`}>
            <form onSubmit={handleSearchSubmit} className="">
                <div className="relative w-full">
                    {/* Search Input */}
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={localSearchText}
                            onChange={handleSearchChange}
                            placeholder={searchPlaceholder}
                            className="w-full px-4 py-3 pr-20  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        />

                        {/* Clear Button */}
                        {localSearchText && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                aria-label={t('clear_search')}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}

                        {/* Beautiful Search Button */}
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-linear-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg hover:from-primary-dark hover:to-primary-darker shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 hover:scale-105 active:scale-95"
                            aria-label={t('search')}
                        >
                            <PiMagnifyingGlassLight className="w-5 h-5 text-app-bright-purple" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
