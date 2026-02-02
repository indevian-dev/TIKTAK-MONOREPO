import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextRequest, NextResponse }
  from 'next/server';
import type { ApiRouteHandler, ApiHandlerContext } from '@/types';
import {
  db,
  eq,
  and,
  ne
} from '@/db';
import { users }
  from '@/db/schema';
import { OtpType } from '@/types/resources/user/user';
import {
  generateOtp,
  storeOtp,
} from '@/lib/utils/otpHandlingUtility';
import { CookieManager }
  from '@/lib/auth/CookieManager';
import { generateVerificationOtpSms }
  from '@/lib/signals/sms/smsGenerator';
import { sendOtpSmsPlus }
  from '@/lib/clients/smsServiceClient';

export const POST: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params, db }: ApiHandlerContext) => {

  try {
    if (!authData || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = authData.user.id;

    // Parse request body to get the phone number
    const body = await request.json();
    const { phone } = body || {};

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Check if phone already exists for another user
    const existingUser = await db
      .select({
        id: users.id,
        phone: users.phone,
        phoneIsVerified: users.phoneIsVerified
      })
      .from(users)
      .where(
        and(
          eq(users.phone, phone.trim()),
          ne(users.id, userId)
        )
      )
      .limit(1);

    if (existingUser?.length > 0) {
      return NextResponse.json({
        error: 'This phone number is already registered to another account'
      }, { status: 400 });
    }

    // Get current user to check if already verified with this phone
    const userResult = await db
      .select({
        id: users.id,
        phone: users.phone,
        phoneIsVerified: users.phoneIsVerified
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userResult?.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const user = userResult[0];

    // Check if this phone is already verified for this user
    if (user.phone === phone.trim() && user.phoneIsVerified) {
      return NextResponse.json({
        alreadyVerified: true,
        message: 'This phone number is already verified'
      }, { status: 200 });
    }

    // Generate OTP
    const { otpCode } = generateOtp();
    const { storedOtp, isOtpIssued } = await storeOtp({
      userId,
      otpCode,
      type: OtpType.PHONE_VERIFICATION
    });

    // Send SMS to the provided phone number
    const result = await sendOtpSmsPlus({
      number: phone.trim(),
      otp: otpCode,
      expiryMinutes: 20
    });

    if (!result.success) {
      return NextResponse.json({
        error: 'Failed to send verification SMS'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Verification SMS sent',
      devCode: Bun.env.NODE_ENV === 'development' ? otpCode : undefined
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to process verification request'
    }, { status: 500 });
  }
});
