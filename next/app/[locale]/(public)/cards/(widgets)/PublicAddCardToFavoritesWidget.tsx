'use client';

import { memo, useCallback } from 'react';
import { useGlobalFavoriteCardsContext } from '@/app/[locale]/(global)/(context)/GlobalFavoriteCardsContext';
import {
    PiHeartStraightFill,
    PiHeartStraightLight
} from 'react-icons/pi';

interface PublicAddCardToFavoritesWidgetProps {
    cardId: number;
    className?: string;
}

export const PublicAddCardToFavoritesWidget = memo(function PublicAddCardToFavoritesWidget({ cardId, className = "absolute top-2 right-2" }: PublicAddCardToFavoritesWidgetProps) {
    const { favoriteIds, toggleFavorite, isToggleLoading } = useGlobalFavoriteCardsContext();

    const handleToggleFavorite = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!cardId) return;
        await toggleFavorite(cardId);
    }, [cardId, toggleFavorite]);

    const isFavorite = favoriteIds.has(cardId);
    const isLoading = isToggleLoading(cardId);

    return (
        <button
            className={`heart-icon ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleToggleFavorite}
            disabled={isLoading}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
            {isLoading ? (
                <div className="w-6 h-6 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                isFavorite ? <PiHeartStraightFill className='text-brandPrimary text-2xl' /> : <PiHeartStraightLight className='text-dark text-2xl drop-shadow-sm drop-shadow-white' />
            )}
        </button>
    );
});

PublicAddCardToFavoritesWidget.displayName = 'PublicAddCardToFavoritesWidget';
