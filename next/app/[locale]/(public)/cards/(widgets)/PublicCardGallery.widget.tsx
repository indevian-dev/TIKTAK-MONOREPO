'use client'

import { useState } from "react";
import { GlobalVideoPlayerModalWidget } from "@/app/[locale]/(global)/(widgets)/GlobalVideoPlayerModal.widget";
import { GlobalImageWidget } from "@/app/[locale]/(global)/(widgets)/GlobalImage.widget";

interface PublicCardGalleryWidgetProps {
    card: {
        id?: string;
        title?: string | null;
        images?: string[] | string | null;
        cover?: string | null;
        video?: { url: string } | null;
        workspaceId?: string | null;
        [key: string]: any;
    };
}

export function PublicCardGalleryWidget({ card }: PublicCardGalleryWidgetProps) {
    const [currentImage, setCurrentImage] = useState(0);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const parsedImages: string[] = Array.isArray(card.images)
        ? card.images
        : (typeof card.images === 'string' ? JSON.parse(card.images) : []);

    const videoUrl = card.video?.url ?? null;
    const hasVideo = Boolean(videoUrl);
    const s3 = process.env.NEXT_PUBLIC_S3_PREFIX;
    const basePath = `${s3}/cards/${card.workspaceId}/${card.id}`;

    const getImageUrl = (filename: string) =>
        filename.startsWith('http') ? filename : `${basePath}/${filename}`;

    const hasImages = parsedImages.length > 0;

    return (
        <div className="w-full">
            {/* Main Image */}
            <div className="w-full aspect-4/3 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <GlobalImageWidget
                    src={hasImages && parsedImages[currentImage] ? getImageUrl(parsedImages[currentImage]) : null}
                    alt={card.title || 'Card'}
                    fill
                    className="rounded-lg object-cover"
                />
            </div>

            {/* Thumbnails */}
            {(hasImages || hasVideo) && (
                <div className="flex space-x-2 mt-3 overflow-x-auto pb-2">
                    {/* Video thumbnail */}
                    {hasVideo && (
                        <button
                            onClick={() => setShowVideoModal(true)}
                            className="min-w-[80px] min-h-[80px] text-red-500 bg-black/80 rounded-lg flex items-center justify-center shrink-0 hover:bg-black/70 transition-colors"
                        >
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                    )}
                    {parsedImages.map((filename, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            className={`min-w-[80px] min-h-[80px] rounded-lg overflow-hidden shrink-0 ${currentImage === index ? 'ring-2 ring-brand' : 'ring-1 ring-gray-200 dark:ring-gray-700'}`}
                        >
                            <GlobalImageWidget
                                src={getImageUrl(filename)}
                                alt={`Thumbnail ${index}`}
                                className="w-[80px] h-[80px] rounded-lg object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Video Modal */}
            <GlobalVideoPlayerModalWidget
                isOpen={showVideoModal && hasVideo}
                onClose={() => setShowVideoModal(false)}
                videoFileName={videoUrl || undefined}
                poster={card.cover ? `${basePath}/${card.cover}` : null}
                title={card.title || 'Card video'}
            />
        </div>
    );
}