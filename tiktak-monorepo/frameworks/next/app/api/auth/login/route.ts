import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { signAccessToken, signRefreshToken } from '@/lib/auth/AuthTokensManager';
import { getUserData } from '@/lib/auth/AuthDataRepository';
import { CookieManager } from '@/lib/auth/CookieManager';
import { createUserSession } from '@/lib/auth/AuthDataRepository';

import { v4 as uuidv4 } from 'uuid';

import { NextResponse } from 'next/server';
import type { ApiRouteHandler } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const POST: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params }: ApiHandlerContext) => {
  try {
    const body = await request.json();
    const { email, password, deviceInfo } = body;

    ConsoleLogger.log(('Login attempt for:'), email);

    // Validate input
    if (!email || !password) {
      return NextResponse.json({
        formError: {
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined
        }
      }, { status: 400 });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        formError: {
          email: 'Invalid email format'
        }
      }, { status: 400 });
    }

    // Authenticate user credentials
    const {
      user: userDatabaseData,
      account: accountDatabaseData,
      error
    } = await getUserData({
      type: 'email_password',
      email: email,
      password: password
    });

    if (error || !userDatabaseData || !accountDatabaseData) {
      ConsoleLogger.log(('Authentication failed:'), error);
      return NextResponse.json({
        formError: {
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        }
      }, { status: 401 });
    }

    // Check if account is suspended
    if (accountDatabaseData.suspended) {
      ConsoleLogger.log(('Account suspended for user:'), email);
      return NextResponse.json({
        error: 'Account is suspended. Please contact support.'
      }, { status: 403 });
    }

    // Get client info
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0';

    const userAgent = deviceInfo?.userAgent ||
      request.headers.get('user-agent') ||
      'Unknown';

    // Generate unique session ID
    const sessionId = uuidv4();

    ConsoleLogger.log(('Creating session with ID:'), sessionId);

    // Create session in database
    const sessionData = {
      id: sessionId,
      ip: ip,
      user_agent: userAgent,
      timestamp: Date.now(),
      account_id: accountDatabaseData.id,
      expires_at: Date.now() + (parseInt(Bun.env.RT_TTL || '86400') * 15 * 1000) // 15 days
    };

    const { createdSession, sessionCreationError } = await createUserSession({
      user: userDatabaseData,
      session: sessionData
    });

    if (sessionCreationError || !createdSession) {
      ConsoleLogger.log(('Failed to create session for user:'), email);
      return NextResponse.json({
        error: 'Failed to create session. Please try again.'
      }, { status: 500 });
    }

    // Generate tokens with minimal payload
    const { token: generatedAccessToken, error: atError } = await signAccessToken({
      userId: userDatabaseData.id,
      accountId: accountDatabaseData.id,
      sessionId: sessionId,
      role: accountDatabaseData.role || 'basic_role',
      suspended: accountDatabaseData.suspended || false,
      emailVerified: userDatabaseData.emailIsVerified || false,
      phoneVerified: userDatabaseData.phoneIsVerified || false,
      isPersonal: accountDatabaseData.isPersonal || true,
      email: userDatabaseData.email,
      name: userDatabaseData.name
    });

    const { token: generatedRefreshToken, error: rtError } = await signRefreshToken({
      sessionId: sessionId,
      userId: userDatabaseData.id,
      accountId: accountDatabaseData.id,
      tokenId: `rt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    });

    if (atError || rtError || !generatedAccessToken || !generatedRefreshToken) {
      ConsoleLogger.log(('Token generation failed'), { atError, rtError });
      return NextResponse.json({
        error: 'Failed to generate authentication tokens.'
      }, { status: 500 });
    }

    ConsoleLogger.log(('Tokens generated successfully'));

    // Prepare response data
    const responseData = {
      user: userDatabaseData,
      account: accountDatabaseData,
      permissions: accountDatabaseData.permissions || [],
      session: {
        id: sessionId,
        expires_at: createdSession.expires_at
      }
    };

    ConsoleLogger.log(('Preparing response for user:'), email);

    // Create response
    let response = NextResponse.json(responseData, { status: 200 });

    // Set authentication cookies
    const { authCookiesResponse } = CookieManager.setAuthCookies({
      response: response,
      data: {
        accessToken: generatedAccessToken,
        refreshToken: generatedRefreshToken
      }
    });

    ConsoleLogger.log(('Login successful for user:'), email);

    return authCookiesResponse;

  } catch (error) {
    ConsoleLogger.error(('Error in login route:'), error);
    return NextResponse.json({
      error: 'Server error occurred'
    }, { status: 500 });
  }
});

