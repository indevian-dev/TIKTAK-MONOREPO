'use client';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import {
    useEffect,
    useState,
    useCallback,
    useRef
} from 'react';
import { toast }
    from 'react-toastify';
import { apiFetchHelper }
    from '@/lib/helpers/apiCallForSpaHelper';
import { uploadFile }
    from '@/lib/helpers/fileUploadHelper';
import {
    uploadFileMultipart,
    shouldUseMultipart
} from '@/lib/helpers/multipartUploadHelper';
import { loadClientSideCoLocatedTranslations }
    from '@/i18n/i18nClientSide';

interface ProviderVideoEditWidgetProps {
    cardStoragePrefix: string;
    onVideoChange?: (data: { video: string | null; deleteVideo: boolean }) => void;
    onPendingChanges?: (hasPendingChanges: boolean) => void;
    existingVideo?: string | null;
}

export function ProviderVideoEditWidget({ 
    cardStoragePrefix, 
    onVideoChange, 
    onPendingChanges, 
    existingVideo = null 
}: ProviderVideoEditWidgetProps) {
    const { t } = loadClientSideCoLocatedTranslations('ProviderVideoEditWidget');
    const [video, setVideo] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [markedForDeletion, setMarkedForDeletion] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const initializedRef = useRef(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    ConsoleLogger.log('cardStoragePrefix', cardStoragePrefix);
    ConsoleLogger.log('existingVideo', existingVideo);
    ConsoleLogger.log('video', video);
    ConsoleLogger.log('markedForDeletion', markedForDeletion);

    // Notify parent about pending changes
    const notifyPendingChanges = useCallback((hasPendingChanges: boolean) => {
        setHasChanges(hasPendingChanges);
        if (onPendingChanges) {
            onPendingChanges(hasPendingChanges);
        }
    }, [onPendingChanges]);

    // Memoize onVideoChange to prevent unnecessary re-renders
    const handleVideoChange = useCallback((newVideo: string | null, deleted = false) => {
        if (onVideoChange) {
            onVideoChange({
                video: newVideo,
                deleteVideo: deleted
            });
        }
    }, [onVideoChange]);

    // Initialize with existing video - only once
    useEffect(() => {
        if (initializedRef.current) return;

        if (existingVideo) {
            ConsoleLogger.log('Setting video from existingVideo:', existingVideo);
            setVideo(existingVideo);
            handleVideoChange(existingVideo, false);
        } else {
            ConsoleLogger.log('No existing video');
            setVideo(null);
            handleVideoChange(null, false);
        }

        initializedRef.current = true;
    }, []); // Empty dependency array - only run once

    // Update video when existingVideo prop changes (but not on initial render)
    useEffect(() => {
        if (!initializedRef.current) return;

        if (existingVideo !== video) {
            ConsoleLogger.log('Updating video due to prop change:', existingVideo);
            setVideo(existingVideo);
            setMarkedForDeletion(false);
            handleVideoChange(existingVideo, false);
            notifyPendingChanges(false);
        }
    }, [existingVideo, video, handleVideoChange, notifyPendingChanges]);

    const validateVideoFile = (file: File) => {
        // Check file type
        if (!file.type.startsWith('video/')) {
            toast.error(t('invalid_file'));
            return false;
        }

        // Check file size (200MB max)
        const maxSize = 250 * 1024 * 1024; // 250MB in bytes
        if (file.size > maxSize) {
            toast.error(t('file_too_large'));
            return false;
        }

        return true;
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        ConsoleLogger.log('📁 Selected video file:', selectedFile);

        if (!selectedFile) {
            toast.error(t('select_file_first'));
            return;
        }

        // Validate file
        if (!validateVideoFile(selectedFile)) {
            event.target.value = '';
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            ConsoleLogger.log('🚀 Starting video upload process');

            let videoFileName;

            // Use multipart upload for large files (>50MB)
            if (shouldUseMultipart(selectedFile)) {
                ConsoleLogger.log('📦 Using multipart upload for large file');
                videoFileName = await uploadFileMultipart({
                    file: selectedFile,
                    storagePrefix: cardStoragePrefix,
                    onProgress: setProgress,
                    fetchHelper: apiFetchHelper,
                });
            } else {
                // Standard upload for smaller files
                ConsoleLogger.log('🔗 Getting presigned URL...');
                const signedUrlData = await apiFetchHelper({
                    method: 'POST',
                    url: `/api/provider/cards/media/video/${cardStoragePrefix}/upload`,
                });

                ConsoleLogger.log('✅ Presigned URL response:', signedUrlData);

                if (!signedUrlData.data?.uploadURL || !signedUrlData.data?.fileName) {
                    throw new Error('Invalid presigned URL response');
                }

                ConsoleLogger.log('⬆️ Starting S3 upload...');
                await uploadFile({
                    file: selectedFile,
                    fileName: signedUrlData.data.fileName,
                    presignedUrl: signedUrlData.data.uploadURL,
                    setProgress
                });

                videoFileName = signedUrlData.data.fileName;
            }

            ConsoleLogger.log('✅ Upload completed:', videoFileName);

            // Update local state with the new video
            setVideo(videoFileName);

            // Call the callback with updated video
            handleVideoChange(videoFileName, false);
            notifyPendingChanges(true);

            toast.success(t('upload_success'));

        } catch (error) {
            ConsoleLogger.error('💥 Upload error:', error);
            const errorMessage = error instanceof Error ? error.message : t('upload_error');
            toast.error(errorMessage);
        } finally {
            setUploading(false);
            // Reset file input
            event.target.value = '';
            ConsoleLogger.log('🔄 Upload process completed');
        }
    };

    const handleVideoMarkForDeletion = () => {
        ConsoleLogger.log('🗑️ Toggling video deletion mark');

        const newMarkedForDeletion = !markedForDeletion;
        setMarkedForDeletion(newMarkedForDeletion);

        if (newMarkedForDeletion) {
            toast.info(t('marked_for_deletion_info'));
        } else {
            toast.info(t('unmarked_for_deletion'));
        }

        // Call the callback with deletion status
        handleVideoChange(video, newMarkedForDeletion);
        notifyPendingChanges(true);
    };

    // Helper function to get the full video URL
    const getVideoUrl = (videoName: string | null): string | undefined => {
        if (!videoName) return undefined;
        const fileName = typeof videoName === 'string' ? videoName : videoName;
        const fullUrl = `${Bun.env.NEXT_PUBLIC_S3_PREFIX}/cards/${cardStoragePrefix}/video/tmp/${fileName}`;
        ConsoleLogger.log('🔗 Constructed video URL:', fullUrl);
        return fullUrl;
    };

    return (
        <div className="w-full mb-6 border border-gray-300 rounded-md p-4">
            <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="video">
                {t('card_video')}
                {hasChanges && (
                    <span className="ml-2 text-orange-600 text-xs">
                        ({t('unsaved_changes')})
                    </span>
                )}
            </label>

            {/* Debug info */}
            {Bun.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                    <p><strong>Storage Prefix:</strong> {cardStoragePrefix}</p>
                    <p><strong>S3 Prefix:</strong> {Bun.env.NEXT_PUBLIC_S3_PREFIX}</p>
                    <p><strong>Video:</strong> {video || 'None'}</p>
                    <p><strong>Marked for Deletion:</strong> {markedForDeletion.toString()}</p>
                    <p><strong>Has Changes:</strong> {hasChanges.toString()}</p>
                </div>
            )}

            {/* Show video status */}
            {video && (
                <p className="text-sm text-gray-600 mb-2">
                    {t('current_video')}: {video}
                    {markedForDeletion && (
                        <span className="ml-2 text-red-600">
                            ({t('marked_for_deletion')})
                        </span>
                    )}
                </p>
            )}

            {/* Upload button - only show if no video or video is marked for deletion */}
            {(!video || markedForDeletion) && (
                <>
                    <button type="button"
                        className="mb-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold border border-gray-300 rounded-md p-2 transition-colors"
                        onClick={() => document.getElementById('videoInput')?.click()}
                        disabled={uploading}
                    >
                        {video && markedForDeletion ? t('replace_video') : t('add_video')}
                    </button>

                    <input
                        id="videoInput"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        hidden
                    />
                </>
            )}

            {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                    <p className="text-sm text-gray-600 mt-1">{t('uploading')} {Math.round(progress)}%</p>
                </div>
            )}

            {/* Video preview */}
            {video && (
                <div className="relative group">
                    <div className={`relative w-full bg-black rounded-lg overflow-hidden ${markedForDeletion ? 'opacity-50' : ''}`}>
                        <video
                            ref={videoRef}
                            className="w-full max-h-96 object-contain"
                            controls
                            src={getVideoUrl(video)}
                            onError={() => {
                                ConsoleLogger.error('❌ Video failed to load:', getVideoUrl(video));
                                toast.error(t('preview_error'));
                            }}
                            onLoadedMetadata={() => ConsoleLogger.log('✅ Video loaded successfully')}
                        >
                            {t('browser_not_supported')}
                        </video>

                        {/* Delete/Restore button */}
                        <button
                            type="button"
                            className={`absolute top-2 right-2 px-3 py-1 rounded-md font-semibold transition-all ${markedForDeletion
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                }`}
                            onClick={handleVideoMarkForDeletion}
                            title={markedForDeletion ? t('restore_video') : t('mark_for_deletion')}
                        >
                            {markedForDeletion ? t('restore') : t('delete')}
                        </button>

                        {/* Deletion overlay */}
                        {markedForDeletion && (
                            <div className="absolute inset-0 bg-red-500 bg-opacity-40 flex items-center justify-center backdrop-blur-sm pointer-events-none">
                                <span className="text-white text-lg font-bold bg-red-600 px-4 py-2 rounded shadow-lg">
                                    {t('marked_for_deletion')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Video info */}
                    <div className="mt-2 text-sm text-gray-600">
                        <p className="font-semibold">{t('video_requirements')}:</p>
                        <ul className="list-disc list-inside text-xs mt-1">
                            <li>{t('max_file_size')}</li>
                            <li>{t('recommended_duration')}</li>
                            <li>{t('premium_transcoding')}</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!video && !uploading && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 font-semibold">{t('no_video_yet')}</p>
                    <p className="text-sm">{t('click_to_upload')}</p>
                    <p className="text-xs mt-1">{t('file_formats')}</p>
                </div>
            )}
        </div>
    );
}

