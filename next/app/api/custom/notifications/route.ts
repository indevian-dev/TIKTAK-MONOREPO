import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { sql } from 'drizzle-orm';

export const GET = unifiedApiHandler(async (req, { auth, db, log }) => {
    try {
        const accountId = auth.accountId;
        if (!accountId || accountId === '0') {
            return errorResponse('Authentication required', 401);
        }

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
        const offset = (page - 1) * limit;

        // Fetch notifications for this account
        const notifications = await db.execute(
            sql`SELECT id, created_at, mark_as_read, payload, workspace_id
          FROM account_notifications
          WHERE account_id = ${accountId}
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}`
        );

        // Count unread
        const unreadResult = await db.execute(
            sql`SELECT COUNT(*) as count
          FROM account_notifications
          WHERE account_id = ${accountId} AND (mark_as_read = false OR mark_as_read IS NULL)`
        );

        const rows = notifications as unknown as Record<string, unknown>[];
        const unreadRow = (unreadResult as unknown as Record<string, unknown>[])?.[0];
        const unreadCount = Number(unreadRow?.count ?? 0);

        // Map notifications — extract name/body from payload JSONB
        const mapped = rows.map((n) => {
            const payload = (n.payload || {}) as Record<string, unknown>;
            return {
                id: n.id,
                name: payload.title || payload.name || 'Notification',
                body: payload.body || payload.message || '',
                created_at: n.created_at,
                mark_as_read: n.mark_as_read ?? false,
                workspace_id: n.workspace_id,
            };
        });

        return okResponse({
            notifications: mapped,
            unread_count: unreadCount,
            page,
            limit,
        });
    } catch (error) {
        log?.error('Error fetching notifications', error as Error);
        return serverErrorResponse('Internal Server Error');
    }
});
