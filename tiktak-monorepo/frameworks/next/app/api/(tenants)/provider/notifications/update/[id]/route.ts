import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import {
  eq,
  and
} from '@/db';
import { accountsNotifications } from '@/db/schema';
import { requireIntParam } from '@/lib/utils/paramsHelper';

export const PATCH = withApiHandler(async (request: NextRequest, { authData, params, db }: ApiHandlerContext) => {
  try {
    if (!authData || !authData.account) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }
    const id = requireIntParam(resolvedParams.id, 'Notification ID');
    const { mark_as_read } = await request.json();

    const accountId = authData.account.id;

    // Update notification
    const result = await db.transaction(async (tx: DbTransaction) => {
      // First check if notification belongs to the authenticated user
      const notification = await tx
        .select({
          id: accountsNotifications.id,
          accountId: accountsNotifications.accountId
        })
        .from(accountsNotifications)
        .where(
          and(
            eq(accountsNotifications.id, id),
            eq(accountsNotifications.accountId, accountId)
          )
        )
        .limit(1);

      if (!notification || notification.length === 0) {
        throw new Error('Notification not found or access denied');
      }

      // Update the notification
      const [updatedNotification] = await tx
        .update(accountsNotifications)
        .set({
          markAsRead: mark_as_read,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(accountsNotifications.id, id),
            eq(accountsNotifications.accountId, accountId)
          )
        )
        .returning();

      return updatedNotification;
    });

    return NextResponse.json({
      success: true,
      notification: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage || 'Internal server error' },
      { status: 500 }
    );
  }
})