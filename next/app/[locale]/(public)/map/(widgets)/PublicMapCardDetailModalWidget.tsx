'use client';

import {
    useState,
    useEffect
} from 'react';
import Image
    from 'next/image';
import { Link }
    from '@/i18n/routing';
import { format }
    from 'date-fns';
import { az }
    from 'date-fns/locale';
import { loadClientSideCoLocatedTranslations }
    from '@/i18n/i18nClientSide';
import { generateSlug }
    from '@/lib/utils/formatting/slugify';

import type { Card } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
// API response type for public map card details (extends domain Card.PublicAccess)
interface PublicMapCardDetailApiResponse extends Omit<Card.PublicAccess, 'images'> {
    created_at: Date; // API uses snake_case
    body?: string; // API uses body instead of description
    storeId?: number | null; // API uses snake_case
    images?: string[]; // Processed images array
    tags?: string[]; // Card tags
}

interface PublicMapCardDetailModalWidgetProps {
    isOpen?: boolean;
    onClose: () => void;
    card?: Card.PublicAccess | null;
    loading?: boolean;
}

/**
 * Modal widget for displaying single card details from map
 */
export function PublicMapCardDetailModalWidget({
    isOpen = false,
    onClose,
    card = null,
    loading = false
}: PublicMapCardDetailModalWidgetProps) {
    const { t } = loadClientSideCoLocatedTranslations('PublicMapCardDetailModalWidget');
    const [imageSrc, setImageSrc] = useState('');

    // Update image source when card changes
    useEffect(() => {
        if (card) {
            setImageSrc(
                card.images && card.images.length > 0
                    ? `${Bun.env.NEXT_PUBLIC_S3_PREFIX}/cards/${card.storage_prefix}/${card.images[0]}`
                    : `${Bun.env.NEXT_PUBLIC_S3_PREFIX}/pg.webp`
            );
        }
    }, [card]);

    // Handle image loading errors
    const handleImageError = () => {
        setImageSrc(`${Bun.env.NEXT_PUBLIC_S3_PREFIX}/pg.webp`);
    };

    // Format date safely
    const getFormattedDate = () => {
        if (!card?.created_at) return '';
        
        try {
            const date = new Date(card.created_at);
            return !isNaN(date.getTime()) 
                ? format(date, 'd MMM yyyy, HH:mm', { locale: az })
                : '';
        } catch (error) {
            ConsoleLogger.error('Date formatting error:', error);
            return '';
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {loading ? (
                    <div className="p-8 flex flex-col items-center justify-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand mb-4"></div>
                        <p className="text-gray-700 font-medium">{t('loading')}</p>
                    </div>
                ) : card ? (
                    <div className="relative">
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all text-2xl leading-none"
                        >
                            ×
                        </button>

                        {/* Store badge if applicable */}
                        {card.store_id !== null && (
                            <span className="absolute top-2 left-2 z-10 bg-brandPrimaryLightBg text-dark px-2 py-1 rounded font-bold text-xs">
                                {t('store')}
                            </span>
                        )}

                        {/* Card Image */}
                        <div className="relative w-full aspect-square">
                            <Image
                                className="w-full h-full object-cover"
                                fill
                                src={imageSrc}
                                alt={card.title || 'Card'}
                                onError={handleImageError}
                                priority
                            />
                        </div>

                        {/* Card Details */}
                        <div className="p-4 space-y-2">
                            {/* Price */}
                            <div className="flex items-center">
                                <span className="text-2xl font-black text-brandPrimary">
                                    {card.price || '0'}
                                </span>
                                <span className="pl-1 text-sm font-light text-brandPrimary/50">
                                    AZN
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                                {card.title || t('no_title')}
                            </h3>

                            {/* Date */}
                            {card.created_at && (
                                <p className="text-sm text-gray-500 font-light">
                                    {getFormattedDate()}
                                </p>
                            )}

                            {/* Description preview */}
                            {card.body && (
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {card.body}
                                </p>
                            )}

                            {/* Tags */}
                            {/* {card.tags && card.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {card.tags.slice(0, 5).map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )} */}

                            {/* Action Buttons */}
                            <div className="pt-4 flex gap-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    {t('close')}
                                </button>
                                <Link
                                    href={`/cards/${generateSlug(card.title || 'card')}-${card.id}`}
                                    className="flex-1 bg-brandPrimary text-white py-2 px-4 rounded-lg hover:bg-brandPrimary/90 transition-colors font-medium text-center"
                                >
                                    {t('view_details')}
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-gray-700 mb-4">{t('no_data')}</p>
                        <button
                            onClick={onClose}
                            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            {t('close')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PublicMapCardDetailModalWidget;

