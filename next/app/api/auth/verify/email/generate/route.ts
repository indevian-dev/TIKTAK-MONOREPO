import { NextResponse } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';

/**
 * POST /api/auth/verify/email/generate
 * Generates and sends email verification code
 */
export const POST = unifiedApiHandler(async (request, { module, log }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const result = await module.auth.requestVerificationCode({
      email,
      operation: 'verification'
    });

    return NextResponse.json(result, { status: result.status });

  } catch (error: any) {
    log.error('[Auth Generate Email OTP API] Unexpected error:', error);
    return NextResponse.json({
      error: 'Internal server error occurred'
    }, { status: 500 });
  }
});