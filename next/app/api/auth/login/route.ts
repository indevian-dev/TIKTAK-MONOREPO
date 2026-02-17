import { NextResponse } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import { CookieAuthenticator } from '@/lib/middleware/authenticators/CookieAuthenticator';

/**
 * POST /api/auth/login
 * Handles user authentication and session creation
 */
export const POST = unifiedApiHandler(async (request, { module, log }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password are required'
      }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for') || '0.0.0.0';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const result = await module.auth.login({
      email,
      password,
      ip,
      userAgent
    });

    if (!result.success) {
      return NextResponse.json(result, { status: result.status });
    }

    // Create success response
    const response = NextResponse.json(result, { status: 200 });

    // Set auth cookies
    const { authCookiesResponse } = CookieAuthenticator.setAuthCookies({
      response,
      data: {
        session: result.data.session,
        expireAt: result.data.expireAt
      }
    });

    return authCookiesResponse;

  } catch (error: any) {
    log.error('[Auth Login API] Unexpected error:', error);
    return NextResponse.json({
      error: 'Internal server error occurred'
    }, { status: 500 });
  }
});
