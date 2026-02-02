import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { cards, actionLogs, eq } from '@/db';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { requireIntParam } from '@/lib/utils/paramsHelper';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const PUT = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
    if (!authData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate and parse cardId
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
        return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }
    const cardId = requireIntParam(resolvedParams.id, 'Card ID');

    if (!authData?.account) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const accountId = authData.account.id;
    const mode = 'store'; // Default to store mode for provider endpoints

    // Check if authentication failed

    try {
        const body = await req.json();
        const {
            title,
            body: cardBody,
            price,
            location,
            categories,
            filters_options,
            new_images,
            deleting_images = [], // Images to delete
            video,
            cover_image,
            is_active,
            storage_prefix
        } = body;

        const result = await db.transaction(async (tx: DbTransaction) => {
            // First verify the card belongs to the authenticated user
            const whereCondition = eq(cards.accountId, accountId);

            const [currentCard] = await tx
                .select()
                .from(cards)
                .where(eq(cards.id, cardId));

            if (!currentCard) {
                throw new Error('Card not found or access denied');
            }

            // Check ownership
            if (mode === 'store' && currentCard.storeId !== null) {
                throw new Error('Card not found or access denied');
            }

            const cardStoragePrefix = currentCard.storagePrefix;

            // Handle S3 image deletions if any are marked for deletion
            let currentImages = (currentCard.images as any) || [];

            if (deleting_images && deleting_images.length > 0) {
                ConsoleLogger.log('🗑️ Processing image deletions:', deleting_images);

                try {
                    const s3Client = new S3Client({
                        region: Bun.env.AWS_REGION || 'global',
                        endpoint: Bun.env.AWS_S3_ENDPOINT,
                        credentials: {
                            accessKeyId: Bun.env.AWS_S3_ACCESS_KEY_ID!,
                            secretAccessKey: Bun.env.AWS_S3_SECRET_ACCESS_KEY!,
                        },
                    });

                    // Delete images from S3
                    for (const imageToDelete of deleting_images) {
                        try {
                            const deleteParams = {
                                Bucket: Bun.env.AWS_S3_BUCKET_NAME,
                                Key: `cards/${cardStoragePrefix}/${imageToDelete}`,
                            };

                            ConsoleLogger.log('🗑️ Deleting from S3:', deleteParams);
                            const deleteCommand = new DeleteObjectCommand(deleteParams);
                            await s3Client.send(deleteCommand);
                            ConsoleLogger.log('✅ Successfully deleted from S3:', imageToDelete);
                        } catch (deleteError) {
                            // Continue with other deletions even if one fails
                        }
                    }

                    // Remove deleted images from current images array
                    currentImages = currentImages.filter((img: any) => {
                        const imageName = typeof img === 'string' ? img : img?.file_name || img;
                        return !deleting_images.includes(imageName);
                    });

                    ConsoleLogger.log('📊 Filtered images:', currentImages);

                } catch (s3Error) {
                    // Don't fail the entire operation for S3 errors
                }
            }

            // Prepare update fields for cards table - updating directly
            const updateData: any = {
                updatedAt: new Date(),
                isApproved: false // Requires re-approval
            };

            // Apply updates only for defined fields
            if (title !== undefined) updateData.title = title;
            if (cardBody !== undefined) updateData.body = cardBody;
            if (price !== undefined) updateData.price = parseFloat(price) || 0;
            if (location !== undefined) updateData.location = location;
            if (video !== undefined) updateData.video = video;
            if (cover_image !== undefined) updateData.cover = cover_image;

            // Handle images
            if (new_images !== undefined) {
                // Filter out deleted images
                if (deleting_images && deleting_images.length > 0) {
                    const filteredImages = new_images.filter((img: any) => {
                        const imageName = typeof img === 'string' ? img : img?.file_name || img;
                        return !deleting_images.includes(imageName);
                    });
                    updateData.images = filteredImages;
                } else {
                    updateData.images = new_images;
                }
            } else if (deleting_images && deleting_images.length > 0) {
                // Use current images (after deletion filtering)
                updateData.images = currentImages;
            }

            // Handle categories and options
            if (categories !== undefined) {
                updateData.categories = Array.isArray(categories) ? categories : [];
            }

            if (filters_options !== undefined) {
                updateData.filtersOptions = Array.isArray(filters_options) ? filters_options : [];
            }

            // Update the cards table directly
            const [updatedCard] = await tx
                .update(cards)
                .set(updateData)
                .where(eq(cards.id, cardId))
                .returning();

            if (!updatedCard) {
                throw new Error('Failed to update card');
            }

            // Log the action
            // Log image deletions if any
            if (deleting_images && deleting_images.length > 0) {
                }

            return {
                card: updatedCard,
                deletedImages: deleting_images,
                cardId: cardId
            };
        });

        return NextResponse.json({
            message: 'Card updated and submitted for re-approval',
            card: result.card,
            deletedImagesCount: result.deletedImages.length,
            cardId: result.cardId
        }, { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: errorMessage || 'Failed to update card'
        }, { status: 500 });
    }
})