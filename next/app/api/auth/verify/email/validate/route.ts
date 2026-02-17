import { NextResponse } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';

/**
 * POST /api/auth/verify/email/validate
 * Validates email verification code
 */
export const POST = unifiedApiHandler(async (request, { module, auth, log }) => {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!otp) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
    }

    const result = await module.auth.verifyCode({
      accountId: auth.accountId,
      code: otp,
      operation: 'verification',
      email: email
    });

    return NextResponse.json(result, { status: result.status });

  } catch (error: any) {
    log.error('[Auth Verify Email API] Unexpected error:', error);
    return NextResponse.json({
      error: 'Internal server error occurred'
    }, { status: 500 });
  }
});
