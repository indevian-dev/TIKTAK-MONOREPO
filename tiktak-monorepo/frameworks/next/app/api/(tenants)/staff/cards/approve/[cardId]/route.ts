import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { eq } from '@/db';
import { cards, cardsPublished, accounts, users, accountsNotifications, actionLogs } from '@/db';
import { syncCard } from '@/lib/utils/syncCardToOpenSearchUtility';
import { sendMail } from '@/lib/clients/mailServiceClient';
import {
  generateCardApprovalEmail,
  generateCardRejectionEmail
} from '@/lib/signals/mail/mailGenerator';
import { submitTranscodingJob } from '@/lib/tools/coconutTranscodeTool';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const PUT = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
  const { cardId } = await params as { cardId: string };

  if (!authData?.account?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const accountId = authData.account.id;

  // Parse the request body
  const body = await req.json();
  const {
    approved = false,
    reasons = [], // ['image', 'video', 'title', 'price', 'category', 'description']
    reasonText = ''
  } = body;

  try {
    // Use a transaction to handle all operations
    const result = await db.transaction(async (tx: DbTransaction) => {
      // First check if card exists and get owner information
      const cardResult = await tx
        .select({
          id: cards.id,
          createdAt: cards.createdAt,
          title: cards.title,
          isApproved: cards.isApproved,
          price: cards.price,
          body: cards.body,
          storeId: cards.storeId,
          accountId: cards.accountId,
          storagePrefix: cards.storagePrefix,
          location: cards.location,
          images: cards.images,
          cover: cards.cover,
          video: cards.video,
          updatedAt: cards.updatedAt,
          filtersOptions: cards.filtersOptions,
          categories: cards.categories,
          ownerName: users.name,
          ownerLastName: users.lastName,
          ownerEmail: users.email,
        })
        .from(cards)
        .leftJoin(accounts, eq(cards.accountId, accounts.id))
        .leftJoin(users, eq(accounts.userId, users.id))
        .where(eq(cards.id, parseInt(cardId)))
        .limit(1);

      if (!cardResult || cardResult.length === 0) {
        throw new Error('Card not found');
      }

      const card = cardResult[0];

      let finalCard;
      let publishedCard;

      if (approved) {
        // APPROVE: Copy/update data to cards_published table

        // Check if cards_published entry already exists
        const existingPublished = await tx
          .select({ id: cardsPublished.id })
          .from(cardsPublished)
          .where(eq(cardsPublished.cardId, parseInt(cardId)))
          .limit(1);

        if (existingPublished && existingPublished.length > 0) {
          // UPDATE existing published card (slug not stored, generated on-the-fly)
          const updatedPublished = await tx
            .update(cardsPublished)
            .set({
              title: card.title,
              body: card.body,
              price: card.price,
              location: card.location,
              images: card.images,
              video: card.video,
              cover: card.cover,
              categories: card.categories,
              filtersOptions: card.filtersOptions,
              storagePrefix: card.storagePrefix,
              isActive: true,
              updatedAt: new Date(),
            })
            .where(eq(cardsPublished.cardId, parseInt(cardId)))
            .returning();

          publishedCard = updatedPublished[0];
        } else {
          // INSERT new published card (slug not stored, generated on-the-fly)
          const insertedPublished = await tx
            .insert(cardsPublished)
            .values({
              cardId: parseInt(cardId),
              title: card.title,
              body: card.body,
              price: card.price,
              location: card.location,
              images: card.images,
              video: card.video,
              cover: card.cover,
              categories: card.categories,
              filtersOptions: card.filtersOptions,
              storagePrefix: card.storagePrefix,
              accountId: card.accountId,
              storeId: card.storeId,
              isActive: true,
              createdAt: card.createdAt,
              updatedAt: new Date(),
            })
            .returning();

          publishedCard = insertedPublished[0];
        }

        // Update the cards table to mark as approved
        const updatedCard = await tx
          .update(cards)
          .set({
            isApproved: true,
            updatedAt: new Date(),
          })
          .where(eq(cards.id, parseInt(cardId)))
          .returning();

        finalCard = updatedCard[0];

        // Sync with OpenSearch using the published card ID
        await syncCard(publishedCard.id, publishedCard);

        // Create approval notification
        await tx.insert(accountsNotifications).values({
          name: 'Card Approved',
          body: 'Your card has been approved and is now visible to the public',
          markAsRead: false,
          accountId: card.accountId,
        });

        // Send approval email
        if (card.ownerEmail) {
          const emailContent = generateCardApprovalEmail({
            username: card.ownerName ? `${card.ownerName} ${card.ownerLastName || ''}`.trim() : 'Card Owner',
            cardTitle: finalCard.title || 'Your Card',
            cardId: String(finalCard.id)
          });

          await sendMail({
            to: card.ownerEmail,
            subject: 'Card Approved - TikTak',
            html: emailContent.html
          });
        }
      } else {
        // REJECT: Set is_approved to false in cards table
        const rejectedCard = await tx
          .update(cards)
          .set({
            isApproved: false,
            updatedAt: new Date(),
          })
          .where(eq(cards.id, parseInt(cardId)))
          .returning();

        finalCard = rejectedCard[0];

        // Format reasons for notification
        const reasonsList = (reasons && Array.isArray(reasons)) ? reasons.join(', ') : '';
        const rejectMessage = reasonText
          ? `Your card submission was rejected. Issues with: ${reasonsList}. ${reasonText}`
          : `Your card submission was rejected. Issues with: ${reasonsList}`;

        // Create rejection notification
        await tx.insert(accountsNotifications).values({
          name: 'Card Submission Rejected',
          body: rejectMessage,
          markAsRead: false,
          accountId: card.accountId,
        });

        // Send rejection email
        if (card.ownerEmail) {
          const emailContent = generateCardRejectionEmail({
            username: card.ownerName ? `${card.ownerName} ${card.ownerLastName || ''}`.trim() : 'Card Owner',
            cardTitle: card.title || 'Your Card',
            cardId: String(card.id),
            reasons: reasons || [],
            reasonText: reasonText || ''
          });

          await sendMail({
            to: card.ownerEmail,
            subject: 'Card Submission Rejected - TikTak',
            html: emailContent.html
          });
        }

        publishedCard = null;
      }

      // Log the action
      return {
        card: finalCard,
        publishedCard,
        cardId: parseInt(cardId),
        approved,
        reasons: approved ? null : reasons,
        reasonText: approved ? null : reasonText,
        originalCard: card
      };
    });

    // After successful approval, check if video transcoding should be triggered
    if (result.approved && result.publishedCard && result.publishedCard.video && result.publishedCard.storagePrefix) {
      const publishedCard = result.publishedCard;
      const originalCard = result.originalCard;

      // Check if card is premium (has future premium_until date)
      const isPremium = publishedCard.premiumUntil && new Date(publishedCard.premiumUntil) > new Date();

      // Check if account has store (account is a store user)
      const hasStore = originalCard.storeId !== null && originalCard.storeId !== undefined;

      // Trigger transcoding if premium or has store
      if (isPremium || hasStore) {
        ConsoleLogger.log(`Triggering video transcoding for card ${result.cardId} (premium: ${isPremium}, store account: ${hasStore}, store_id: ${originalCard.storeId})`);

        try {
          const transcodingResult = await submitTranscodingJob(
            publishedCard.storagePrefix || '',
            publishedCard.video || ''
          );

          ConsoleLogger.log('Transcoding job submitted:', transcodingResult);

          // Log transcoding initiation
          } catch (transcodingError) {
          // Don't fail the approval if transcoding fails
          // Just log the error and continue
        }
      } else {
        ConsoleLogger.log(`Skipping video transcoding for card ${result.cardId} (not premium and account does not have store)`);
      }
    } else if (result.approved && result.publishedCard && !result.publishedCard.video) {
      ConsoleLogger.log(`No video to transcode for card ${result.cardId}`);
    }

    return NextResponse.json({
      message: `Card ${result.approved ? 'approved' : 'rejected'} successfully`,
      data: result
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to process card approval'
    }, { status: 500 });
  }
})
