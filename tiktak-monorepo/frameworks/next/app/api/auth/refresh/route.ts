import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { AuthTokensManager, signAccessToken } from '@/lib/auth/AuthTokensManager';
import { CookieManager } from '@/lib/auth/CookieManager';
import { getUserData } from '@/lib/auth/AuthDataRepository';

import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { ApiRouteHandler } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const POST: ApiRouteHandler = withApiHandler(async (req: NextRequest) => {
  try {
    ConsoleLogger.log(('Token refresh requested'));

    // Get refresh token from cookies
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      ConsoleLogger.log(('⛔ Missing refresh token'));
      return NextResponse.json(
        { error: 'Missing refresh token', type: 'NO_TOKEN' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const tokensManager = new AuthTokensManager();
    const refreshResult = await tokensManager.verifyRefreshToken({ refreshToken });

    if (!refreshResult.valid) {
      ConsoleLogger.log((`⛔ Invalid refresh token: ${refreshResult.error}`));

      if (refreshResult.error?.includes('expired')) {
        return NextResponse.json(
          { error: 'Refresh token expired', type: 'TOKEN_EXPIRED' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'Invalid refresh token', type: 'TOKEN_INVALID' },
        { status: 401 }
      );
    }

    // Extract sessionId from refresh token payload
    const sessionId = refreshResult.payload?.sid;
    const userId = refreshResult.payload?.uid;

    if (!sessionId || !userId) {
      ConsoleLogger.log(('⛔ No sessionId or userId in refresh token'));
      return NextResponse.json(
        { error: 'Invalid refresh token payload', type: 'TOKEN_INVALID' },
        { status: 401 }
      );
    }

    // Fetch user/account data from DB using userId
    const userData = await getUserData({
      type: 'user_id',
      userId: userId
    });

    if (!userData || !userData.user || !userData.account) {
      ConsoleLogger.log(('⛔ Session/user not found in database'));
      return NextResponse.json(
        { error: 'Session not found', type: 'SESSION_INVALID' },
        { status: 401 }
      );
    }

    // Generate new access token with minimal payload
    const { token: generatedAccessToken, error: tokenGenerationError } = await signAccessToken({
      userId: userData.user.id,
      accountId: userData.account.id,
      sessionId: sessionId,
      role: userData.account.role || 'basic_role',
      suspended: userData.account.suspended || false,
      emailVerified: userData.user.emailIsVerified || false,
      phoneVerified: userData.user.phoneIsVerified || false,
      isPersonal: userData.account.isPersonal || true,
      email: userData.user.email,
      name: userData.user.name
    });

    if (tokenGenerationError || !generatedAccessToken) {
      ConsoleLogger.log(('⛔ Failed to generate new access token'), tokenGenerationError);
      return NextResponse.json(
        { error: 'Failed to generate token', type: 'SERVER_ERROR' },
        { status: 500 }
      );
    }

    ConsoleLogger.log(('✓ Token refreshed successfully'));

    // Create response with new cookie
    const response = NextResponse.json({ success: true });

    CookieManager.setAuthCookies({
      response,
      data: { accessToken: generatedAccessToken }
    });

    return response;

  } catch (error) {
    ConsoleLogger.error(('Token refresh error:'), error);
    return NextResponse.json(
      { error: 'Server error', type: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
});
