'use client'

import Image from "next/image";
import { useState } from "react";
import { GlobalVideoPlayerModalWidget } from "@/app/[locale]/(global)/(widgets)/GlobalVideoPlayerModalWidget";

import type { Card } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
// API response type for public card gallery (compatible with Card.PublicAccess)
interface PublicCardGalleryApiResponse extends Omit<Card.PublicAccess, 'images'> {
    images?: string[] | string; // API supports both array and string formats
    cover?: string; // Cover image filename
    storage_prefix?: string; // Storage prefix for media files
    [key: string]: any; // Allow other card properties
}

interface MediaItem {
    type: 'image' | 'video';
    filename: string;
}

interface PublicCardGalleryWidgetProps {
    card: PublicCardGalleryApiResponse;
}

export function PublicCardGalleryWidget({ card }: PublicCardGalleryWidgetProps) {
    const [currentImage, setCurrentImage] = useState(0);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const handleImageChange = (index: number) => {
        setCurrentImage(index);
    };

    const handleVideoClick = () => {
        setShowVideoModal(true);
    };

    // Parse images array if it's a string
    const parsedImages: string[] = Array.isArray(card.images)
        ? card.images
        : (typeof card.images === 'string' ? JSON.parse(card.images) : []);

    ConsoleLogger.log(parsedImages);

    // Create separate arrays for video and images
    const hasVideo = Boolean(card.video && card.video.url && card.video.url.trim() !== '');
    const imageItems: MediaItem[] = parsedImages.map((filename: string) => ({ type: 'image', filename }));

    // Create a combined array with video first if it exists
    const mediaArray = imageItems;

    const storagePrefix = card.storage_prefix || '';

    return (
        <div className="w-full md:w-1/ sticky">

            <div className="w-full sticky">
                <div className='w-full aspect-4/3 relative'>
                    {mediaArray.length > 0 && storagePrefix && mediaArray[currentImage] ? (
                        <Image
                            src={`${Bun.env.NEXT_PUBLIC_S3_PREFIX}/cards/${storagePrefix}/${mediaArray[currentImage].filename}`}
                            alt={card.title || 'Card'}
                            fill
                            className="rounded w-full object-cover"
                        />
                    ) : (
                        <Image
                            src={`${Bun.env.NEXT_PUBLIC_S3_PREFIX}/pg.webp`}
                            alt={card.title || 'Card'}
                            fill
                            className="rounded w-full object-cover"
                        />
                    )}

                </div>
                <div className="flex space-x-2 mt-2 overflow-x-auto">

                    <button onClick={handleVideoClick} className="min-w-[100px]  min-h-[100px] relative text-center text-red-500 bg-black/50 p-2 flex items-center justify-center">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>

                    {mediaArray.map((mediaItem, index) => (
                        <button
                            key={index}
                            onClick={() => handleImageChange(index)}
                            className={`min-w-[100px] min-h-[100px] relative ${currentImage === index ? 'ring-2 ring-blue-500' : ''}`}
                        >
                            <Image
                                src={`${Bun.env.NEXT_PUBLIC_S3_PREFIX}/cards/${storagePrefix}/${mediaItem.filename}`}
                                alt={`Thumbnail ${index}`}
                                width={100}
                                height={100}
                                className="rounded aspect-square w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Video Modal */}
            <GlobalVideoPlayerModalWidget
                isOpen={showVideoModal && hasVideo}
                onClose={() => setShowVideoModal(false)}
                storagePrefix={storagePrefix}
                videoFileName={card.video?.url || undefined}
                poster={card.cover ? `${Bun.env.NEXT_PUBLIC_S3_PREFIX}/cards/${storagePrefix}/${card.cover}` : null}
                title={card.title || 'Card video'}
            />
        </div>
    );
};