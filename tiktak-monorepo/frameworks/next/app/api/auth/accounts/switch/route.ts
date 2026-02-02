import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq, and } from '@/db';
import { accounts, actionLogs } from '@/db/schema';
import { signAccessToken, signRefreshToken } from '@/lib/auth/AuthTokensManager';
import { getUserData } from '@/lib/auth/AuthDataRepository';
import { CookieManager } from '@/lib/auth/CookieManager';
import type { ApiRouteHandler } from '@/types';

export const POST: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params, db, log }: ApiHandlerContext) => {
  try {
    const { accountId } = await request.json();

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const currentAccountId = authData?.account?.id;
    const currentUserId = authData?.user?.id;

    if (!currentUserId || !currentAccountId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the target account belongs to the current user and is not suspended
    const [targetAccount] = await db
      .select({
        id: accounts.id,
        user_id: accounts.userId,
        is_personal: accounts.isPersonal,
        role: accounts.role,
        suspended: accounts.suspended,
      })
      .from(accounts)
      .where(and(
        eq(accounts.id, accountId),
        eq(accounts.userId, currentUserId)
      ))
      .limit(1);

    if (!targetAccount) {
      return NextResponse.json(
        { error: 'Account not found or access denied' },
        { status: 404 }
      );
    }

    if (targetAccount.suspended) {
      return NextResponse.json(
        { error: 'Account is suspended' },
        { status: 403 }
      );
    }

    // Log the account switch action
    try {
      await db
        .insert(actionLogs)
        .values({
          action: 'account_switch',
          createdBy: currentAccountId,
          resourceType: 'account',
          resourceId: accountId
        });
    } catch (logError) {
      log?.error('Failed to log account switch', logError as Error);
      // Continue with the switch even if logging fails
    }

    // Get fresh auth data for the target account
    const authDataResult = await getUserData({
      type: 'account_id',
      accountId: accountId
    });

    // Check if the result has an error
    if (!authDataResult || authDataResult.error || !authDataResult.user || !authDataResult.account) {
      return NextResponse.json(
        { error: authDataResult?.error || 'Failed to get auth data for target account' },
        { status: 500 }
      );
    }

    // Generate new tokens for the target account with minimal payload
    const { token: accessToken } = await signAccessToken({
      userId: authDataResult.user.id,
      accountId: authDataResult.account.id,
      sessionId: 'account-switch-session',
      role: authDataResult.account.role || 'basic_role',
      suspended: authDataResult.account.suspended || false,
      emailVerified: authDataResult.user.emailIsVerified || false,
      phoneVerified: authDataResult.user.phoneIsVerified || false,
      isPersonal: authDataResult.account.isPersonal || true,
      email: authDataResult.user.email,
      name: authDataResult.user.name
    });

    const { token: refreshToken } = await signRefreshToken({
      sessionId: 'account-switch-session',
      userId: authDataResult.user.id,
      accountId: authDataResult.account.id,
      tokenId: `rt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    });

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Failed to generate authentication tokens' },
        { status: 500 }
      );
    }

    // Create response with target account data
    let authCookiesResponse = NextResponse.json({
      user: authDataResult.user,
      account: authDataResult.account,
      success: true
    }, { status: 200 });

    const { authCookiesResponse: newAuthCookiesResponse } = CookieManager.setAuthCookies({
      response: authCookiesResponse,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    });

    return newAuthCookiesResponse;
  } catch (error) {
    log?.error('Error in switch-account endpoint', error as Error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});