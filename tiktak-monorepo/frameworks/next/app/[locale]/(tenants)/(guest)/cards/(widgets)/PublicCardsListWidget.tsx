'use client'

import {
    useState,
    useEffect,
    memo
} from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';
import { format } from 'date-fns';
import { az } from 'date-fns/locale';
import { GlobalVideoPlayerModalWidget } from '@/app/[locale]/(global)/(widgets)/GlobalVideoPlayerModalWidget';
import { FiPlay } from 'react-icons/fi';
import { PublicAddCardToFavoritesWidget } from '@/app/[locale]/(tenants)/(guest)/cards/(widgets)/PublicAddCardToFavoritesWidget';
import { generateSlug } from '@/lib/utils/slugify';
import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
import type { Card } from '@/types';

// API response type for public cards from OpenSearch (extends domain Card.PublicAccess)
interface PublicCardApiResponse extends Omit<Card.PublicAccess, 'images'> {
    created_at: Date; // API uses snake_case
    images?: string[];
    cover?: string;
    storage_prefix?: string;
    store_id?: number | null;
    [key: string]: unknown; // For additional OpenSearch fields
}

interface PublicCardsListWidgetProps {
    cards: PublicCardApiResponse[];
    className?: string;
}

interface PublicCardItemWidgetProps {
    card: PublicCardApiResponse;
}

// Memoized CardsList component - only re-renders when cards prop changes
export const PublicCardsListWidget = memo(function PublicCardsListWidget({ cards, className = '' }: PublicCardsListWidgetProps) {

    // Don't render anything if cards is null or empty
    if (!cards || cards.length === 0) {
        return null;
    }

    return (
        <div className={`w-full ${className} bg-white text-sm grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 `}>
            {cards.map((card, index) => (
                <PublicCardItemWidget
                    key={(card as any).id || `card-${index}`}
                    card={card}
                />
            ))}
        </div>
    );
});


// Memoized CardItem component
export const PublicCardItemWidget = memo(function PublicCardItemWidget({ card }: PublicCardItemWidgetProps) {
    const { t } = loadClientSideCoLocatedTranslations('PublicCardsListWidget');
    const [imageSrc, setImageSrc] = useState(
        card.images && card.images.length > 0
            ? `${Bun.env.NEXT_PUBLIC_S3_PREFIX}/cards/${card.storage_prefix}/${card.images[0]}`
            : `${Bun.env.NEXT_PUBLIC_S3_PREFIX}/pg.webp`
    );
    const [showVideoModal, setShowVideoModal] = useState(false);

    const hasVideo = card.video && card.video.url && card.video.url.trim() !== '';

    // Handle image loading errors by switching to a placeholder image
    const handleImageError = () => {
        setImageSrc(`${Bun.env.NEXT_PUBLIC_S3_PREFIX}/pg.webp`);
    };

    useEffect(() => {
        // Reset image source when card changes
        setImageSrc(
            card.images && card.images.length > 0
                ? `${Bun.env.NEXT_PUBLIC_S3_PREFIX}/cards/${card.storage_prefix}/${card.images[0]}`
                : `${Bun.env.NEXT_PUBLIC_S3_PREFIX}/pg.webp`
        );
    }, [card]);

    // Safe date formatting with fallback
    let formattedDateTime = '';
    try {
        if (card.created_at) {
            const date = new Date(card.created_at);
            if (!isNaN(date.getTime())) {
                formattedDateTime = format(date, 'd MMM yyyy, HH:mm', { locale: az });
            } else {
                formattedDateTime = 'Invalid date';
            }
        }
    } catch (error) {
        ConsoleLogger.error('Date formatting error:', error);
        formattedDateTime = '';
    }


    // Generate slug on-the-fly from title
    const slug = generateSlug((card as any).title || 'card');

    return (
        <>
            <Link
                className="grid col-span-1 w-full relative rounded bg-white overflow-hidden"
                href={`/cards/${slug}-${card.id}`}
                passHref
            >
                {(card.store_id !== null) ? (
                    <span className='bg-brandPrimaryLightBg text-dark px-2 py-1 rounded absolute top-2 left-2 z-[2] font-bold'>
                        {t('store')}
                    </span>
                ) : ('')}

                <div className="relative row-span-6 col-span-12 w-full justify-center items-start px-6 group-hover:border-2 aspect-square">
                    <Image
                        className='rounded w-full'
                        fill
                        style={{ objectFit: 'cover' }}
                        src={imageSrc}
                        alt={card?.title ? (card as any).title : 'Card title'}
                        onError={handleImageError}
                    />
                </div>

                {/* Video Play Button Overlay */}
                {hasVideo && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowVideoModal(true);
                        }}
                        className="absolute flex items-center justify-center opacity-100 hover:opacity-100 transition-opacity duration-300 group/video bottom-0 right-0  w-16 h-16"
                        aria-label="Play video"
                    >
                        <div className="bg-brandPrimary hover:bg-brandPrimary/80 rounded-full p-3 transition-colors shadow-lg">
                            <FiPlay size={12} className="text-white ml-1" />
                        </div>
                    </button>
                )}

                <div className="grid font-bold row-span-4 grid-rows-7 bottom-0 left-0 py-3 md:py-5 px-2 md:px-3 lg:px-4 col-span-12 justify-start items text-dark rounded-b-primary">
                    <p className='text-md lg:text-lg flex items-center font-black text-brandPrimary self-start row-span-2'>
                        {(card as any).price && (card as any).price}
                        <span className="pl-1 text-xs font-light text-brandPrimary/50">AZN</span>
                    </p>
                    <p className='text-sm lg:text-md line-clamp-2 self-start row-span-3'>{(card as any).title || t('no_title')}</p>
                    <p className='w-full text-sm font-light self-end row-span-2'>{formattedDateTime}</p>
                </div>

                <PublicAddCardToFavoritesWidget cardId={(card as any).id} />
            </Link>

            {/* Video Modal */}
            <GlobalVideoPlayerModalWidget
                isOpen={showVideoModal}
                onClose={() => setShowVideoModal(false)}
                storagePrefix={card.storage_prefix}
                videoFileName={card.video?.url}
                poster={card.cover ? `${Bun.env.NEXT_PUBLIC_S3_PREFIX}/cards/${card.storage_prefix}/${card.cover}` : null}
                title={(card as any).title || 'Card video'}
            />
        </>
    );
});


// Add display names for better debugging
PublicCardItemWidget.displayName = 'PublicCardItemWidget';
PublicCardsListWidget.displayName = 'PublicCardsListWidget';

export default PublicCardsListWidget;
