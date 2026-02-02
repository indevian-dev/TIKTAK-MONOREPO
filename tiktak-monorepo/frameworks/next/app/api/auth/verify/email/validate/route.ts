import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and, ne } from '@/db';
import { users, accounts, otps, actionLogs } from '@/db/schema';
import { OtpType } from '@/types/resources/user/user';

import { validateOtp } from '@/lib/utils/otpHandlingUtility';
import { CookieManager }
  from '@/lib/auth/CookieManager';
import type { ApiRouteHandler, ApiHandlerContext, DbTransaction } from '@/types';

export const POST: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params, db, log }: ApiHandlerContext) => {
  try {
    // Get authenticated user ID
    if (!authData || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = authData.user.id;

    const body = await request.json();
    const { email, otp } = body || {};

    // Validate input
    if (!email || !otp) {
      return NextResponse.json({
        error: 'Email and OTP are required'
      }, { status: 400 });
    }

    // Get current user
    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        email_is_verified: users.emailIsVerified,
        name: users.name,
        account_id: accounts.id
      })
      .from(users)
      .innerJoin(accounts, and(
        eq(users.id, accounts.userId),
        eq(accounts.isPersonal, true)
      ))
      .where(eq(users.id, userId))
      .limit(1);

    if (!userResult.length) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 400 });
    }

    const user = userResult[0];

    // Check if the provided email is different from current email
    const emailChanged = user.email?.toLowerCase() !== email.trim().toLowerCase();

    // If email changed, check if new email already exists for another user
    if (emailChanged) {
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
    }

    // Validate OTP
    const isValidOtp = await validateOtp({
      userId: user.id,
      type: OtpType.EMAIL_VERIFICATION,
      otp
    });

    if (!isValidOtp) {
      return NextResponse.json({
        error: 'Invalid or expired OTP'
      }, { status: 400 });
    }

    // OTP is valid, update user email (if changed) and verification status in transaction
    await db.transaction(async (tx) => {
      // Update email and mark as verified
      const updateData: any = {
        emailIsVerified: true,
        updatedAt: new Date()
      };
      if (emailChanged) {
        updateData.email = email.trim().toLowerCase();
      }

      await tx
        .update(users)
        .set(updateData)
        .where(eq(users.id, user.id));

      // Delete the used OTP
      await tx
        .delete(otps)
        .where(and(
          eq(otps.userId, user.id),
          eq(otps.type, 'email_verification'),
          eq(otps.code, otp)
        ));

      // Log the verification action
      const action = emailChanged ? 'email_updated_and_verified' : 'email_verified';
      await tx
        .insert(actionLogs)
        .values({
          action,
          createdBy: user.account_id,
          resourceType: 'accounts',
          resourceId: user.account_id
        });
    });

    const message = emailChanged
      ? 'Email address updated and verified successfully'
      : 'Email verified successfully';

    return NextResponse.json({
      success: true,
      message,
      emailUpdated: emailChanged,
      userId: user.id
    }, { status: 200 });

  } catch (error) {
    log?.error('Email verification error', error as Error);
    return NextResponse.json({
      error: 'Failed to verify email'
    }, { status: 500 });
  }
});
