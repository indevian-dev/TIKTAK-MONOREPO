'use client';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import {
    useEffect,
    useState,
    useCallback,
    useRef
} from 'react';
import Image
    from 'next/image';
import { toast }
    from 'react-toastify';
import { apiCallForSpaHelper } from '@/lib/helpers/apiCallForSpaHelper';
import { uploadFile }
    from '@/lib/helpers/fileUploadHelper';

interface ProviderImagesEditWidgetProps {
    cardStoragePrefix: string;
    onImagesChange?: (data: { images: string[], deletedImages: string[] }) => void;
    onPendingChanges?: (hasPending: boolean) => void;
    existingImages?: string[];
    cardId?: string | number;
}

export function ProviderImagesEditWidget({ 
    cardStoragePrefix, 
    onImagesChange, 
    onPendingChanges, 
    existingImages = []
}: ProviderImagesEditWidgetProps) {
    const [images, setImages] = useState<string[]>([]);
    const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(new Set());
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const initializedRef = useRef(false);
    const [hasChanges, setHasChanges] = useState(false);

    ConsoleLogger.log('cardStoragePrefix', cardStoragePrefix);
    ConsoleLogger.log('existingImages', existingImages);
    ConsoleLogger.log('images', images);
    ConsoleLogger.log('markedForDeletion', Array.from(markedForDeletion));

    // Notify parent about pending changes
    const notifyPendingChanges = useCallback((hasPendingChanges: boolean) => {
        setHasChanges(hasPendingChanges);
        if (onPendingChanges) {
            onPendingChanges(hasPendingChanges);
        }
    }, [onPendingChanges]);

    // Memoize onImagesChange to prevent unnecessary re-renders
    const handleImagesChange = useCallback((newImages: string[], deletedImages: Set<string> | string[] = []) => {
        if (onImagesChange) {
            onImagesChange({
                images: newImages,
                deletedImages: deletedImages instanceof Set ? Array.from(deletedImages) : deletedImages
            });
        }
    }, [onImagesChange]);

    // Initialize with existing images from API data - only once
    useEffect(() => {
        // Prevent multiple initializations
        if (initializedRef.current) return;

        if (existingImages && Array.isArray(existingImages) && existingImages.length > 0) {
            ConsoleLogger.log('Setting images from existingImages:', existingImages);
            setImages(existingImages);
            handleImagesChange(existingImages, []);
        } else {
            // No existing images, start with empty array
            ConsoleLogger.log('No existing images, setting empty array');
            setImages([]);
            if (existingImages.length === 0) {
                handleImagesChange([], []);
            }
        }

        initializedRef.current = true;
    }, []); // Empty dependency array - only run once

    // Update images when existingImages prop changes (but not on initial render)
    useEffect(() => {
        if (!initializedRef.current) return; // Skip initial render

        if (existingImages && Array.isArray(existingImages)) {
            // Only update if the arrays are actually different
            const existingImagesStr = JSON.stringify(existingImages);
            const currentImagesStr = JSON.stringify(images);

            if (existingImagesStr !== currentImagesStr) {
                ConsoleLogger.log('Updating images due to prop change:', existingImages);
                setImages(existingImages);
                setMarkedForDeletion(new Set()); // Reset deletion marks
                handleImagesChange(existingImages, []);
                notifyPendingChanges(false);
            }
        }
    }, [existingImages, images, handleImagesChange, notifyPendingChanges]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        ConsoleLogger.log('📁 Selected files:', selectedFiles);
        if (!selectedFiles || selectedFiles.length === 0) {
            toast.error('Please select files first.');
            return;
        }

        setUploading(true);
        setProgress(0);

        // Track individual file progress
        const fileProgressMap: Record<number, number> = {};
        for (let i = 0; i < selectedFiles.length; i++) {
            fileProgressMap[i] = 0;
        }

        try {
            const uploadedFileNames = [];
            ConsoleLogger.log('🚀 Starting upload process for', selectedFiles.length, 'files');

            // Process files one by one
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                if (!file) continue;
                ConsoleLogger.log(`📤 Processing file ${i + 1}/${selectedFiles.length}:`, file.name);

                try {
                    // Get presigned URL for this file
                    ConsoleLogger.log('🔗 Getting presigned URL...');
                    const signedUrlData = await apiCallForSpaHelper({
                        method: 'POST',
                        url: `/api/provider/cards/media/images/${cardStoragePrefix}/upload`,
                        body: {}
                    });

                    ConsoleLogger.log('✅ Presigned URL response:', signedUrlData);

                    if (!signedUrlData.data?.uploadURL || !signedUrlData.data?.fileName) {
                        throw new Error('Invalid presigned URL response');
                    }

                    // Upload file to S3 using the utility function
                    ConsoleLogger.log('⬆️ Starting S3 upload...');
                    const uploadResult = await uploadFile({
                        file: file,
                        fileName: signedUrlData.data.fileName,
                        presignedUrl: signedUrlData.data.uploadURL,
                        setProgress: (progress: number) => {
                            // Update progress for this specific file
                            fileProgressMap[i] = progress;

                            // Calculate overall progress (average of all files)
                            const totalProgress = Object.values(fileProgressMap).reduce((sum: number, val: number) => sum + val, 0) / selectedFiles.length;
                            setProgress(totalProgress);
                        }
                    });

                    ConsoleLogger.log('✅ Upload completed, result:', uploadResult);

                    // Add the file name to our list of uploaded files
                    uploadedFileNames.push(signedUrlData.data.fileName);
                    ConsoleLogger.log(`✅ Added to uploaded files: ${signedUrlData.data.fileName}`);
                    ConsoleLogger.log('📊 Current uploadedFileNames:', uploadedFileNames);

                } catch (fileError) {
                    ConsoleLogger.error(`❌ Error uploading file ${file.name}:`, fileError);
                    const errorMessage = fileError instanceof Error ? fileError.message : 'Unknown error';
                    toast.error(`Failed to upload ${file.name}: ${errorMessage}`);
                    // Continue with next file instead of stopping entire process
                    continue;
                }
            }

            ConsoleLogger.log('🎉 All files processed. Final uploadedFileNames:', uploadedFileNames);

            if (uploadedFileNames.length === 0) {
                toast.error('No files were uploaded successfully');
                return;
            }

            // Update local state with the new images (append to existing)
            ConsoleLogger.log('📝 Current images before update:', images);
            const newImages = [...images, ...uploadedFileNames];
            ConsoleLogger.log('📝 New images array:', newImages);

            setImages(newImages);

            // Call the callback with updated images list
            handleImagesChange(newImages, markedForDeletion);
            notifyPendingChanges(true);

            toast.success(`${uploadedFileNames.length} image(s) uploaded successfully`);

        } catch (error) {
            ConsoleLogger.error('💥 Upload error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error uploading images';
            toast.error(errorMessage);
        } finally {
            setUploading(false);
            // Reset file input
            event.target.value = '';
            ConsoleLogger.log('🔄 Upload process completed, uploading set to false');
        }
    };

    const handleImageMarkForDeletion = (imageToMark: string) => {
        ConsoleLogger.log('🗑️ Marking image for deletion:', imageToMark);

        const newMarkedForDeletion = new Set(markedForDeletion);

        if (newMarkedForDeletion.has(imageToMark)) {
            // Unmark for deletion
            newMarkedForDeletion.delete(imageToMark);
            toast.info('Image unmarked for deletion');
        } else {
            // Mark for deletion
            newMarkedForDeletion.add(imageToMark);
            toast.info('Image marked for deletion - save to apply changes');
        }

        setMarkedForDeletion(newMarkedForDeletion);

        // Keep all images in the list, don't filter out marked ones
        // Call the callback with all images and deletion list
        handleImagesChange(images, newMarkedForDeletion);
        notifyPendingChanges(true);
    };

    const handleImageReorder = async (direction: 'up' | 'down', index: number) => {
        const updatedImages = [...images];
        if (direction === 'up' && index > 0 && updatedImages[index] && updatedImages[index - 1]) {
            [updatedImages[index - 1], updatedImages[index]] = [updatedImages[index]!, updatedImages[index - 1]!];
        } else if (direction === 'down' && index < updatedImages.length - 1 && updatedImages[index] && updatedImages[index + 1]) {
            [updatedImages[index + 1], updatedImages[index]] = [updatedImages[index]!, updatedImages[index + 1]!];
        }

        setImages(updatedImages);

        // Call onImagesChange callback with updated images
        handleImagesChange(updatedImages, markedForDeletion);
        notifyPendingChanges(true);
    };

    // Helper function to get the full image URL
    const getImageUrl = (imageName: string | { file_name?: string }) => {
        // Handle both string filename and object with file_name property
        const fileName = typeof imageName === 'string' ? imageName : (imageName as any)?.file_name || imageName;
        const fullUrl = `${Bun.env.NEXT_PUBLIC_S3_PREFIX}/cards/${cardStoragePrefix}/${fileName}`;
        ConsoleLogger.log('🔗 Constructed image URL:', fullUrl);
        return fullUrl;
    };

    // Helper function to get image name for operations
    const getImageName = (imageName: string | { file_name?: string }) => {
        return typeof imageName === 'string' ? imageName : (imageName as any)?.file_name || imageName;
    };

    return (
        <div className="w-full mb-6 border border-gray-300 rounded-md p-4">
            <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="images">
                Card Images
                {hasChanges && (
                    <span className="ml-2 text-orange-600 text-xs">
                        (Unsaved changes)
                    </span>
                )}
            </label>

            {/* Debug info */}
            {Bun.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                    <p><strong>Storage Prefix:</strong> {cardStoragePrefix}</p>
                    <p><strong>S3 Prefix:</strong> {Bun.env.NEXT_PUBLIC_S3_PREFIX}</p>
                    <p><strong>Images Count:</strong> {images.length}</p>
                    <p><strong>Marked for Deletion:</strong> {Array.from(markedForDeletion).join(', ')}</p>
                    <p><strong>Has Changes:</strong> {hasChanges.toString()}</p>
                </div>
            )}

            {/* Show existing images count */}
            {images && images.length > 0 && (
                <p className="text-sm text-gray-600 mb-2">
                    Current images: {images.length}
                    {markedForDeletion.size > 0 && (
                        <span className="ml-2 text-red-600">
                            ({markedForDeletion.size} marked for deletion)
                        </span>
                    )}
                </p>
            )}

            <button type="button"
                className="mb-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold border border-gray-300 rounded-md p-2 transition-colors"
                onClick={() => document.getElementById('imageInput')?.click()}
                disabled={uploading}
            >
                Add Images
            </button>

            <input
                id="imageInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                hidden
            />

            {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                    <p className="text-sm text-gray-600 mt-1">Uploading... {Math.round(progress)}%</p>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images && images.length > 0 && images.map((image, index) => {
                    const imageUrl = getImageUrl(image);
                    const imageName = getImageName(image);
                    const isMarkedForDeletion = markedForDeletion.has(imageName);

                    return (
                        <div key={`${imageName}-${index}`} className={`relative group`}>
                            <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={imageUrl}
                                    alt={`Card image ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className={`transition-transform group-hover:scale-105 ${isMarkedForDeletion ? 'blur-sm' : ''}`}
                                    onError={(e) => {
                                        ConsoleLogger.error('❌ Image failed to load:', imageUrl);
                                        ConsoleLogger.error('Original image data:', image);
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                    onLoad={() => ConsoleLogger.log('✅ Image loaded successfully:', imageUrl)}
                                />

                                {/* Delete/Restore button */}
                                <button
                                    type="button"
                                    className={`absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isMarkedForDeletion
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-red-500 hover:bg-red-600 text-white'
                                        }`}
                                    onClick={() => handleImageMarkForDeletion(imageName)}
                                    title={isMarkedForDeletion ? "Restore image" : "Mark for deletion"}
                                >
                                    {isMarkedForDeletion ? (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    ) : (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </button>

                                {/* Move up button - hide for marked items */}
                                {!isMarkedForDeletion && index > 0 && (
                                    <button
                                        type="button"
                                        className="absolute bottom-1 left-1 bg-gray-500 hover:bg-gray-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        onClick={() => handleImageReorder('up', index)}
                                        title="Move up"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </button>
                                )}

                                {/* Move down button - hide for marked items */}
                                {!isMarkedForDeletion && index < images.length - 1 && (
                                    <button
                                        type="button"
                                        className="absolute bottom-1 right-1 bg-gray-500 hover:bg-gray-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        onClick={() => handleImageReorder('down', index)}
                                        title="Move down"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                )}

                                {/* Deletion overlay */}
                                {isMarkedForDeletion && (
                                    <div className="absolute inset-0 bg-red-500 bg-opacity-40 flex items-center justify-center backdrop-blur-[1px]">
                                        <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded shadow-lg">
                                            Must be deleted
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Image index indicator */}
                            <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                                {index + 1}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty state with placeholder */}
            {(!images || images.length === 0) && !uploading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={`placeholder-${index}`} className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <svg className="mx-auto h-8 w-8 mb-1" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="text-xs">No image</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}