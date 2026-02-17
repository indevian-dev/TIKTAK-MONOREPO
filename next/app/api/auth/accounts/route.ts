import { withApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types/next';
import { NextResponse } from 'next/server';
import { eq, and, desc } from 'drizzle-orm';
import { accounts, users } from '@/lib/database/schema';
import type { ApiRouteHandler } from '@/types/next';

export const GET: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params, db, log }: ApiHandlerContext) => {
  try {
    // Handle unauthenticated users - return null data instead of 401
    if (!authData?.user || !authData?.account) {
      return NextResponse.json({
        authenticated: false,
        accounts: null,
        currentAccount: null,
        user: null
      });
    }

    const userId = authData.user.id;
    const accountId = authData.account.id;

    // Fetch all accounts for this user
    const accountsList = await db
      .select()
      .from(accounts)
      .where(and(
        eq(accounts.userId, userId),
        eq(accounts.suspended, false)
      ))
      .orderBy(desc(accounts.isPersonal));

    // Find current account from the fetched accounts
    const currentAccount = accountsList?.find(account => Number(account.id) === accountId);

    if (!currentAccount) {
      return NextResponse.json(
        { error: 'Current account not found or not accessible' },
        { status: 404 }
      );
    }

    // Fetch user details including verification statuses
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return NextResponse.json({
      authenticated: true,
      accounts: accountsList || [],
      currentAccount,
      user
    });
  } catch (error) {
    log?.error('Error in accounts endpoint', error as Error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});