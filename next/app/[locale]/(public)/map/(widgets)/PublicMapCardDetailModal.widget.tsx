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
    from '@/lib/utils/Formatter.Slugify.util';

import type { Card } from '@tiktak/shared/types/domain/Card.types';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { BlockPrimitive } from '@/app/primitives/Block.primitive';

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
                card.images && card.images.length > 0 && card.workspaceId
                    ? `${process.env.NEXT_PUBLIC_S3_PREFIX}/cards/${card.workspaceId}/${card.id}/${card.images[0]}`
                    : `${process.env.NEXT_PUBLIC_S3_PREFIX}/pg.webp`
            );
        }
    }, [card]);

    // Handle image loading errors
    const handleImageError = () => {
        setImageSrc(`${process.env.NEXT_PUBLIC_S3_PREFIX}/pg.webp`);
    };

    // Format date safely
    const getFormattedDate = () => {
        if (!card?.createdAt) return '';

        try {
            const date = new Date(card.createdAt as string | Date);
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
        <BlockPrimitive variant="modal">
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
                        {card.workspaceId && (
                            <span className="absolute top-2 left-2 z-10 bg-app-bright-purple/10 text-gray-900 px-2 py-1 rounded font-bold text-xs">
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
                                <span className="text-2xl font-black text-app-bright-purple">
                                    {card.price || '0'}
                                </span>
                                <span className="pl-1 text-sm font-light text-app-bright-purple/50">
                                    AZN
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                                {card.title || t('no_title')}
                            </h3>

                            {/* Date */}
                            {card.createdAt && (
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
                                    className="flex-1 bg-app-bright-purple text-white py-2 px-4 rounded-lg hover:bg-app-bright-purple/90 transition-colors font-medium text-center"
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
        </BlockPrimitive>
    );
}

export default PublicMapCardDetailModalWidget;

