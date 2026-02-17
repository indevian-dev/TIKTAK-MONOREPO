import { NextResponse } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';

/**
 * POST /api/auth/verify/phone/generate
 * Generates and sends phone verification code
 */
export const POST = unifiedApiHandler(async (request, { module, log }) => {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const result = await module.auth.requestVerificationCode({
      phone,
      operation: 'verification'
    });

    return NextResponse.json(result, { status: result.status });

  } catch (error: any) {
    log.error('[Auth Generate Phone OTP API] Unexpected error:', error);
    return NextResponse.json({
      error: 'Internal server error occurred'
    }, { status: 500 });
  }
});
