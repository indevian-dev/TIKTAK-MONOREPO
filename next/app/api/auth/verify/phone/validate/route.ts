import { NextResponse } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';

/**
 * POST /api/auth/verify/phone/validate
 * Validates phone verification code
 */
export const POST = unifiedApiHandler(async (request, { module, auth, log }) => {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!otp) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
    }

    const result = await module.auth.verifyCode({
      accountId: auth.accountId,
      code: otp,
      operation: 'verification',
      phone: phone
    });

    return NextResponse.json(result, { status: result.status });

  } catch (error: any) {
    log.error('[Auth Verify Phone API] Unexpected error:', error);
    return NextResponse.json({
      error: 'Internal server error occurred'
    }, { status: 500 });
  }
});
