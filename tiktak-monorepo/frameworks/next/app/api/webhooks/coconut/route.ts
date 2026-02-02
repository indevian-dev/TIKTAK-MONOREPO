import { NextResponse } from 'next/server';
import { eq } from '@/db';
import {
  actionLogs,
  cards,
  accounts,
  accountsNotifications
} from '@/db/schema';
import type { NextRequest } from 'next/server';
import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { ApiHandlerContext, ApiRouteHandler } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
/**
 * Coconut Webhook Handler
 * Receives notifications when video transcoding jobs complete
 *
 * Coconut sends POST requests with job status updates
 */
export const POST: ApiRouteHandler = withApiHandler(async (req: NextRequest, { db }: ApiHandlerContext) => {
  try {
    const body = await req.json();

    ConsoleLogger.log('Coconut webhook received:', JSON.stringify(body, null, 2));

    const {
      id: jobId,
      status,
      metadata,
      outputs,
      progress,
      error
    } = body;

    // Extract metadata
    const storagePrefix = metadata?.storage_prefix;
    const fileName = metadata?.file_name;

    // Log the webhook event
    if (storagePrefix) {
      try {
        // Get card ID first
        const cardResult = await db
          .select({ id: cards.id })
          .from(cards)
          .where(eq(cards.storagePrefix, storagePrefix))
          .limit(1);

        if (cardResult && cardResult.length > 0) {
          await db
            .insert(actionLogs)
            .values({
              action: `coconut_transcode_${status}`,
              resourceType: 'cards',
              resourceId: cardResult[0].id,
              createdBy: null
            });
        }
      } catch (logError) {
        // Don't fail the webhook if logging fails
      }
    }

    // Handle different job statuses
    switch (status) {
      case 'completed':
        ConsoleLogger.log(`Transcoding completed for ${storagePrefix}/${fileName}`);
        ConsoleLogger.log('Output files:', outputs);

        // Optionally: Update card status or send notification
        if (storagePrefix) {
          try {
            // Get card details for notification
            const cardResult = await db
              .select({
                id: cards.id,
                title: cards.title,
                accountId: cards.accountId
              })
              .from(cards)
              .where(eq(cards.storagePrefix, storagePrefix))
              .limit(1);

            if (cardResult && cardResult.length > 0 && cardResult[0].accountId) {
              // Create notification for card owner
              await db
                .insert(accountsNotifications)
                .values({
                  name: 'Video Processing Complete',
                  body: 'Your video has been processed and is now available in multiple quality options.',
                  markAsRead: false,
                  accountId: cardResult[0].accountId
                });
            }
          } catch (notificationError) {
            // Silently fail notification - don't break webhook
            ConsoleLogger.warn('Failed to create notification:', notificationError);
          }
        }
        break;

      case 'processing':
        ConsoleLogger.log(`Transcoding in progress: ${progress}% for ${storagePrefix}/${fileName}`);
        break;

      case 'failed':
      case 'error':
        // Notify user of failure
        if (storagePrefix) {
          try {
            const cardResult = await db
              .select({
                id: cards.id,
                accountId: cards.accountId
              })
              .from(cards)
              .where(eq(cards.storagePrefix, storagePrefix))
              .limit(1);

            if (cardResult && cardResult.length > 0 && cardResult[0].accountId) {
              await db
                .insert(accountsNotifications)
                .values({
                  name: 'Video Processing Failed',
                  body: 'There was an issue processing your video. Please try uploading again or contact support.',
                  markAsRead: false,
                  accountId: cardResult[0].accountId
                });
            }
          } catch (notificationError) {
            // Silently fail notification - don't break webhook
            ConsoleLogger.warn('Failed to create notification:', notificationError);
          }
        }
        break;

      default:
        ConsoleLogger.log(`Unknown status received: ${status}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    }, { status: 200 });

  } catch (error) {
    // Return 200 to prevent Coconut from retrying
    // Log the error but don't fail the webhook
    return NextResponse.json({
      success: false,
      error: 'Error processing webhook',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 });
  }
});

// Handle GET requests (for webhook verification if needed)
export const GET: ApiRouteHandler = withApiHandler(async (req: NextRequest) => {
  return NextResponse.json({
    message: 'Coconut webhook endpoint is active'
  }, { status: 200 });
});