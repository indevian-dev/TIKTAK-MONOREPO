import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from '@/db';
import { accounts, users, stores } from '@/db/schema';
import type { ApiRouteHandler, ApiHandlerContext } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params, db, log }: ApiHandlerContext) => {
  try {
    // Get authenticated account ID from cookie
    const accountId = authData?.account?.id;

    if (!accountId) {
      return NextResponse.json({
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Get account details with user and store information
    const [accountData] = await db
      .select({
        id: accounts.id,
        user_id: accounts.userId,
        is_personal: accounts.isPersonal,
        role: accounts.role,
        email: users.email,
        first_name: users.name,
        last_name: users.lastName,
        phone: users.phone,
        avatar: users.avatarUrl,
        store_title: stores.title,
        store_logo: stores.logo,
      })
      .from(accounts)
      .leftJoin(users, eq(accounts.userId, users.id))
      .where(and(
        eq(accounts.id, accountId),
        eq(accounts.isDeleted, false)
      ))
      .limit(1);

    if (!accountData) {
      return NextResponse.json({
        error: 'Account not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: accountData
    });
  } catch (error) {
    log?.error('Error fetching account', error as Error);
    return NextResponse.json({
      error: 'Failed to fetch account'
    }, { status: 500 });
  }
});
