import { NextResponse } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';

/**
 * GET /api/workspaces/provider/[workspaceId]/accounts/me
 * Retrieves current account info within provider workspace
 */
export const GET = unifiedApiHandler(async (request, { module, params, log }) => {
  try {
    const workspaceId = params?.workspaceId as string;
    const result = await module.account.getMyAccount(workspaceId);

    if (!result) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    log.error('[Provider Account Me API] Error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
});
