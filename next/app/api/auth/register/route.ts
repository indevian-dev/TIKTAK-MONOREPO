import { NextResponse } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import { CookieAuthenticator } from '@/lib/middleware/authenticators/CookieAuthenticator';

/**
 * POST /api/auth/register
 * Handles user registration and initial session
 */
export const POST = unifiedApiHandler(async (request, { module, log }) => {
  try {
    const body = await request.json();
    const { name, email, phone, password, confirmPassword } = body;

    const ip = request.headers.get('x-forwarded-for') || '0.0.0.0';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const result = await module.auth.register({
      firstName: name,
      email,
      phone,
      password,
      confirmPassword,
      ip,
      userAgent
    });

    if (!result.success) {
      return NextResponse.json(result, { status: result.status });
    }

    // Create success response
    const response = NextResponse.json(result, { status: 201 });

    // Set auth cookies for the initial session
    if (result.data?.session) {
      CookieAuthenticator.setAuthCookies({
        response,
        data: {
          session: result.data.session.id,
          expireAt: result.data.session.expires_at
        }
      });
    }

    return response;

  } catch (error: any) {
    log.error('[Auth Register API] Unexpected error:', error);
    return NextResponse.json({
      error: 'Internal server error occurred'
    }, { status: 500 });
  }
});
