import { NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { ApiRouteHandler } from '@/types';
import { count } from 'drizzle-orm';
import { eq, desc } from '@/db';
import { accountsNotifications } from '@/db/schema';

export const GET: ApiRouteHandler = withApiHandler(async (request, { db, log }) => {
  // Note: db is automatically ownership-filtered because verifyOwnership: true in config
  // All queries automatically filter by tenant_access_key - no manual checking needed!

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1') || 1;
  const limit = parseInt(searchParams.get('limit') || '20') || 20;
  const offset = (page - 1) * limit;

  try {
    // Get notifications with pagination
    // Auto-filtered by tenant_access_key
    const notifications = await db
      .select({
        id: accountsNotifications.id,
        name: accountsNotifications.name,
        body: accountsNotifications.body,
        markAsRead: accountsNotifications.markAsRead,
        createdAt: accountsNotifications.createdAt,
        updatedAt: accountsNotifications.updatedAt,
      })
      .from(accountsNotifications)
      .orderBy(desc(accountsNotifications.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count (auto-filtered)
    const [totalCount] = await db
      .select({ count: count() })
      .from(accountsNotifications);

    // Get unread count (auto-filtered)
    const [unreadCount] = await db
      .select({ count: count() })
      .from(accountsNotifications)
      .where(eq(accountsNotifications.markAsRead, false));

    const total = totalCount.count;
    const unreadTotal = unreadCount.count;

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      unread_count: unreadTotal
    });
  } catch (error) {
    log?.error('Error fetching notifications', error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
})
