import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextRequest, NextResponse }
  from 'next/server';
import type { ApiRouteHandler, ApiHandlerContext } from '@/types';
import { eq, and, ne } from '@/db';
import { users } from '@/db/schema';
import { OtpType } from '@/types/resources/user/user';

import {
  generateOtp,
  storeOtp,
} from '@/lib/utils/otpHandlingUtility';
import { CookieManager }
  from '@/lib/auth/CookieManager';
import { generateVerificationOtpEmail }
  from '@/lib/signals/mail/mailGenerator';
import { sendMail }
  from '@/lib/clients/mailServiceClient';

export const POST: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params, db, log }: ApiHandlerContext) => {

  try {
    if (!authData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const userId = authData.user.id;

    // Parse request body to get the email
    const body = await request.json();
    const { email } = body || {};

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    // Check if email already exists for another user
    const existingUser = await db
      .select({
        id: users.id,
        email: users.email,
        email_is_verified: users.emailIsVerified
      })
      .from(users)
      .where(and(
        eq(users.email, email.trim().toLowerCase()),
        ne(users.id, userId)
      ))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({
        error: 'This email address is already registered to another account'
      }, { status: 400 });
    }

    // Get current user to check if already verified with this email
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        email_is_verified: users.emailIsVerified
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    // Check if this email is already verified for this user
    if (user.email?.toLowerCase() === email.trim().toLowerCase() && user.email_is_verified) {
      return NextResponse.json({
        alreadyVerified: true,
        message: 'This email address is already verified'
      }, { status: 200 });
    }

    // Generate OTP
    const { otpCode } = generateOtp();
    const { storedOtp, isOtpIssued } = await storeOtp({
      userId,
      otpCode,
      type: OtpType.EMAIL_VERIFICATION
    });

    // Generate email template
    const emailTemplate = generateVerificationOtpEmail({
      username: userId,
      otp: otpCode,
      expiryMinutes: 20
    });

    // Send email to the provided email address
    const result = await sendMail({
      to: email.trim(),
      subject: 'Verification Email',
      html: emailTemplate.html
    });

    if (!result.success) {
      return NextResponse.json({
        error: 'Failed to send verification email'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent',
      devCode: Bun.env.NODE_ENV === 'development' ? otpCode : undefined
    }, { status: 200 });
  } catch (error) {
    log?.error('Email verification request error', error as Error);
    return NextResponse.json({
      error: 'Failed to process verification request'
    }, { status: 500 });
  }
});